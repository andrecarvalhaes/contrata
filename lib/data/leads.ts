import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase/client";
import type { Enums, Tables, TablesInsert, TablesUpdate } from "@/lib/supabase/types";
import { useMyFornecedor } from "./onboarding";

export type Lead = Tables<"leads">;
export type LeadInsert = TablesInsert<"leads">;
export type LeadUpdate = TablesUpdate<"leads">;
export type LeadEstagio = Enums<"lead_estagio">;
export type LeadOrigem = Enums<"lead_origem">;

export const ESTAGIOS_FUNIL: LeadEstagio[] = [
  "novo",
  "contatado",
  "negociando",
  "proposta_enviada",
  "ganho",
  "perdido",
];

export const ESTAGIO_LABEL: Record<LeadEstagio, string> = {
  novo: "Novo",
  contatado: "Contatado",
  negociando: "Negociando",
  proposta_enviada: "Proposta enviada",
  ganho: "Ganho",
  perdido: "Perdido",
};

export const ESTAGIO_COR: Record<LeadEstagio, string> = {
  novo: "bg-blue-100 text-blue-700 border-blue-200",
  contatado: "bg-indigo-100 text-indigo-700 border-indigo-200",
  negociando: "bg-amber-100 text-amber-700 border-amber-200",
  proposta_enviada: "bg-purple/10 text-purple border-purple/20",
  ganho: "bg-green-100 text-green-700 border-green-200",
  perdido: "bg-red-100 text-red-700 border-red-200",
};

export const ORIGEM_LABEL: Record<LeadOrigem, string> = {
  sos: "SOS Conekta",
  anuncio: "Anúncio",
  perfil: "Perfil público",
  manual: "Cadastrado à mão",
};

/**
 * Lista todos os leads do fornecedor logado. Traz também o nome do
 * anúncio e o do posto quando aplicável, para exibição na lista.
 */
export interface LeadListItem {
  id: string;
  titulo: string;
  estagio: LeadEstagio;
  origem: LeadOrigem;
  nome_contato: string | null;
  empresa: string | null;
  cidade: string | null;
  estado: string | null;
  telefone: string | null;
  email: string | null;
  valor_estimado_centavos: number | null;
  anuncio_titulo: string | null;
  posto_nome: string | null;
  created_at: string;
  updated_at: string;
}

export function useMeusLeads() {
  const { data: my } = useMyFornecedor();
  const fornecedorId = my?.fornecedor?.id ?? null;
  return useQuery<LeadListItem[]>({
    queryKey: ["meus-leads", fornecedorId],
    enabled: !!fornecedorId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("leads")
        .select(
          `
          id, titulo, estagio, origem, nome_contato, empresa,
          cidade, estado, telefone, email, valor_estimado_centavos,
          created_at, updated_at,
          anuncio:fornecedor_anuncios ( titulo ),
          posto:postos ( razao_social, nome_fantasia )
          `
        )
        .eq("fornecedor_id", fornecedorId!)
        .order("created_at", { ascending: false });
      if (error) throw new Error(error.message);
      return (data ?? []).map((l: any): LeadListItem => ({
        id: l.id,
        titulo: l.titulo,
        estagio: l.estagio,
        origem: l.origem,
        nome_contato: l.nome_contato,
        empresa: l.empresa,
        cidade: l.cidade,
        estado: l.estado,
        telefone: l.telefone,
        email: l.email,
        valor_estimado_centavos: l.valor_estimado_centavos,
        anuncio_titulo: l.anuncio?.titulo ?? null,
        posto_nome:
          l.posto?.nome_fantasia || l.posto?.razao_social || null,
        created_at: l.created_at,
        updated_at: l.updated_at,
      }));
    },
  });
}

/**
 * Cria um lead manual (origem='manual') — usado quando o fornecedor quer
 * registrar um contato que chegou por fora da plataforma.
 */
export interface CriarLeadManualInput {
  titulo: string;
  nome_contato?: string;
  empresa?: string;
  telefone?: string;
  email?: string;
  cidade?: string;
  estado?: string;
  mensagem?: string;
  valor_estimado_centavos?: number | null;
}

export function useCriarLeadManual() {
  const { data: my } = useMyFornecedor();
  const fornecedorId = my?.fornecedor?.id ?? null;
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: CriarLeadManualInput) => {
      if (!fornecedorId) throw new Error("Fornecedor não identificado.");
      const { data, error } = await supabase
        .from("leads")
        .insert({
          fornecedor_id: fornecedorId,
          origem: "manual",
          estagio: "novo",
          titulo: input.titulo,
          nome_contato: input.nome_contato || null,
          empresa: input.empresa || null,
          telefone: input.telefone || null,
          email: input.email || null,
          cidade: input.cidade || null,
          estado: input.estado ? input.estado.toUpperCase() : null,
          mensagem: input.mensagem || null,
          valor_estimado_centavos: input.valor_estimado_centavos ?? null,
        })
        .select()
        .single();
      if (error) throw new Error(error.message);
      return data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["meus-leads"] });
    },
  });
}

/**
 * Move um lead entre estágios do funil, ajustando timestamps correlatos.
 */
export function useMoverLead() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: {
      id: string;
      estagio: LeadEstagio;
      motivo_perda?: string;
    }) => {
      const update: LeadUpdate = { estagio: input.estagio };
      const now = new Date().toISOString();

      if (input.estagio === "contatado") {
        update.contatado_em = now;
      } else if (input.estagio === "ganho") {
        update.ganho_em = now;
        update.motivo_perda = null;
      } else if (input.estagio === "perdido") {
        update.perdido_em = now;
        update.motivo_perda = input.motivo_perda ?? null;
      }

      const { error } = await supabase
        .from("leads")
        .update(update)
        .eq("id", input.id);
      if (error) throw new Error(error.message);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["meus-leads"] });
    },
  });
}

/**
 * Remove um lead permanentemente.
 */
export function useRemoverLead() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("leads").delete().eq("id", id);
      if (error) throw new Error(error.message);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["meus-leads"] });
    },
  });
}

// ─── Detalhe do lead ─────────────────────────────────────────────────────────

export interface LeadDetalhe {
  id: string;
  titulo: string;
  estagio: LeadEstagio;
  origem: LeadOrigem;
  mensagem: string | null;
  valor_estimado_centavos: number | null;
  motivo_perda: string | null;
  nome_contato: string | null;
  empresa: string | null;
  telefone: string | null;
  email: string | null;
  cidade: string | null;
  estado: string | null;
  created_at: string;
  contatado_em: string | null;
  ganho_em: string | null;
  perdido_em: string | null;
  anuncio_id: string | null;
  anuncio_titulo: string | null;
  posto_id: string | null;
  posto_nome: string | null;
  posto_cidade: string | null;
  posto_estado: string | null;
  posto_endereco: string | null;
  posto_cnpj: string | null;
  posto_telefone: string | null;
}

export function useLeadDetalhe(id: string | null) {
  return useQuery<LeadDetalhe>({
    queryKey: ["lead-detalhe", id],
    enabled: !!id,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("leads")
        .select(
          `
          id, titulo, estagio, origem, mensagem, valor_estimado_centavos,
          motivo_perda, nome_contato, empresa, telefone, email,
          cidade, estado, created_at, contatado_em, ganho_em, perdido_em,
          anuncio_id,
          anuncio:fornecedor_anuncios ( titulo ),
          posto_id,
          posto:postos ( razao_social, nome_fantasia, cidade, estado, endereco, cnpj, telefone )
          `
        )
        .eq("id", id!)
        .single();
      if (error) throw new Error(error.message);
      const l = data as any;
      return {
        id: l.id,
        titulo: l.titulo,
        estagio: l.estagio,
        origem: l.origem,
        mensagem: l.mensagem,
        valor_estimado_centavos: l.valor_estimado_centavos,
        motivo_perda: l.motivo_perda,
        nome_contato: l.nome_contato,
        empresa: l.empresa,
        telefone: l.telefone,
        email: l.email,
        cidade: l.cidade,
        estado: l.estado,
        created_at: l.created_at,
        contatado_em: l.contatado_em,
        ganho_em: l.ganho_em,
        perdido_em: l.perdido_em,
        anuncio_id: l.anuncio_id,
        anuncio_titulo: l.anuncio?.titulo ?? null,
        posto_id: l.posto_id,
        posto_nome: l.posto?.nome_fantasia || l.posto?.razao_social || null,
        posto_cidade: l.posto?.cidade ?? null,
        posto_estado: l.posto?.estado ?? null,
        posto_endereco: l.posto?.endereco ?? null,
        posto_cnpj: l.posto?.cnpj ?? null,
        posto_telefone: l.posto?.telefone ?? null,
      };
    },
  });
}

/**
 * Helper: formata valor em centavos pra reais.
 */
export function formatarValor(centavos: number | null | undefined) {
  if (!centavos) return null;
  return (centavos / 100).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}
