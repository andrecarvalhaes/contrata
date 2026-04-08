import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase/client";
import type { Enums, Tables, TablesInsert, TablesUpdate } from "@/lib/supabase/types";
import { useMyFornecedor } from "./onboarding";

export type Anuncio = Tables<"fornecedor_anuncios">;
export type AnuncioInsert = TablesInsert<"fornecedor_anuncios">;
export type AnuncioUpdate = TablesUpdate<"fornecedor_anuncios">;
export type AnuncioStatus = Enums<"anuncio_status">;
export type PrecoModalidade = Enums<"preco_modalidade">;

export const STATUS_LABEL: Record<AnuncioStatus, string> = {
  rascunho: "Rascunho",
  ativo: "Ativo",
  pausado: "Pausado",
  encerrado: "Encerrado",
};

export const MODALIDADE_LABEL: Record<PrecoModalidade, string> = {
  fixo: "Preço fixo",
  a_partir_de: "A partir de",
  sob_consulta: "Sob consulta",
};

export interface AnuncioListItem {
  id: string;
  titulo: string;
  resumo: string | null;
  status: AnuncioStatus;
  categoria_nome: string | null;
  categoria_slug: string | null;
  preco_modalidade: PrecoModalidade;
  preco_centavos: number | null;
  fotos: string[];
  views: number;
  cliques: number;
  updated_at: string;
}

/**
 * Lista todos os anúncios do fornecedor autenticado (de rascunhos a encerrados).
 */
export function useMeusAnuncios() {
  const { data: my } = useMyFornecedor();
  const fornecedorId = my?.fornecedor?.id ?? null;
  return useQuery<AnuncioListItem[]>({
    queryKey: ["meus-anuncios", fornecedorId],
    enabled: !!fornecedorId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("fornecedor_anuncios")
        .select(
          `
          id, titulo, resumo, status, preco_modalidade, preco_centavos,
          fotos, views, cliques, updated_at,
          categoria:categorias_servico ( nome, slug )
          `
        )
        .eq("fornecedor_id", fornecedorId!)
        .order("updated_at", { ascending: false });
      if (error) throw new Error(error.message);
      return (data ?? []).map((a: any): AnuncioListItem => ({
        id: a.id,
        titulo: a.titulo,
        resumo: a.resumo,
        status: a.status,
        preco_modalidade: a.preco_modalidade,
        preco_centavos: a.preco_centavos,
        fotos: a.fotos ?? [],
        views: a.views ?? 0,
        cliques: a.cliques ?? 0,
        updated_at: a.updated_at,
        categoria_nome: a.categoria?.nome ?? null,
        categoria_slug: a.categoria?.slug ?? null,
      }));
    },
  });
}

/**
 * Carrega um anúncio específico por id (somente do fornecedor atual, via RLS).
 */
export function useAnuncio(id: string | null | undefined) {
  return useQuery<Anuncio | null>({
    queryKey: ["anuncio", id],
    enabled: !!id,
    queryFn: async () => {
      if (!id) return null;
      const { data, error } = await supabase
        .from("fornecedor_anuncios")
        .select("*")
        .eq("id", id)
        .maybeSingle();
      if (error) throw new Error(error.message);
      return data;
    },
  });
}

export interface UpsertAnuncioInput {
  id?: string;
  categoria_id: string;
  servico_id?: string | null;
  titulo: string;
  resumo?: string | null;
  descricao: string;
  preco_modalidade: PrecoModalidade;
  preco_centavos?: number | null;
  unidade_preco?: string | null;
  cidades_atendidas?: string[] | null;
  raio_atendimento_km?: number | null;
}

/**
 * Cria um novo anúncio em rascunho. O fornecedor_id vem do usuário autenticado.
 */
export function useCriarAnuncio() {
  const { data: my } = useMyFornecedor();
  const fornecedorId = my?.fornecedor?.id ?? null;
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: UpsertAnuncioInput) => {
      if (!fornecedorId) throw new Error("Fornecedor não identificado.");
      const payload: AnuncioInsert = {
        fornecedor_id: fornecedorId,
        categoria_id: input.categoria_id,
        servico_id: input.servico_id ?? null,
        titulo: input.titulo,
        resumo: input.resumo ?? null,
        descricao: input.descricao,
        preco_modalidade: input.preco_modalidade,
        preco_centavos: input.preco_centavos ?? null,
        unidade_preco: input.unidade_preco ?? null,
        cidades_atendidas: input.cidades_atendidas ?? null,
        raio_atendimento_km: input.raio_atendimento_km ?? null,
        status: "rascunho",
      };
      const { data, error } = await supabase
        .from("fornecedor_anuncios")
        .insert(payload)
        .select()
        .single();
      if (error) throw new Error(error.message);
      return data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["meus-anuncios"] });
    },
  });
}

/**
 * Atualiza um anúncio existente (campos editáveis pelo fornecedor).
 */
export function useAtualizarAnuncio() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: UpsertAnuncioInput & { id: string }) => {
      const payload: AnuncioUpdate = {
        categoria_id: input.categoria_id,
        servico_id: input.servico_id ?? null,
        titulo: input.titulo,
        resumo: input.resumo ?? null,
        descricao: input.descricao,
        preco_modalidade: input.preco_modalidade,
        preco_centavos: input.preco_centavos ?? null,
        unidade_preco: input.unidade_preco ?? null,
        cidades_atendidas: input.cidades_atendidas ?? null,
        raio_atendimento_km: input.raio_atendimento_km ?? null,
      };
      const { data, error } = await supabase
        .from("fornecedor_anuncios")
        .update(payload)
        .eq("id", input.id)
        .select()
        .single();
      if (error) throw new Error(error.message);
      return data;
    },
    onSuccess: (_, vars) => {
      qc.invalidateQueries({ queryKey: ["meus-anuncios"] });
      qc.invalidateQueries({ queryKey: ["anuncio", vars.id] });
    },
  });
}

/**
 * Altera o status do anúncio, ajustando timestamps correlatos.
 */
export function useAlterarStatusAnuncio() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: { id: string; status: AnuncioStatus }) => {
      const update: AnuncioUpdate = { status: input.status };
      if (input.status === "ativo") {
        update.ativo_desde = new Date().toISOString();
        update.pausado_em = null;
      } else if (input.status === "pausado") {
        update.pausado_em = new Date().toISOString();
      }
      const { error } = await supabase
        .from("fornecedor_anuncios")
        .update(update)
        .eq("id", input.id);
      if (error) throw new Error(error.message);
    },
    onSuccess: (_, vars) => {
      qc.invalidateQueries({ queryKey: ["meus-anuncios"] });
      qc.invalidateQueries({ queryKey: ["anuncio", vars.id] });
    },
  });
}

/**
 * Remove permanentemente um anúncio (somente quando está em rascunho ou encerrado).
 */
export function useRemoverAnuncio() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("fornecedor_anuncios")
        .delete()
        .eq("id", id);
      if (error) throw new Error(error.message);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["meus-anuncios"] });
    },
  });
}

/**
 * Helper: formata um preço em centavos para exibição.
 */
export function formatarPrecoAnuncio(a: Pick<Anuncio, "preco_modalidade" | "preco_centavos" | "unidade_preco">) {
  if (a.preco_modalidade === "sob_consulta") return "Sob consulta";
  if (!a.preco_centavos) return MODALIDADE_LABEL[a.preco_modalidade];
  const reais = (a.preco_centavos / 100).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
  const prefixo = a.preco_modalidade === "a_partir_de" ? "A partir de " : "";
  const unidade = a.unidade_preco ? ` ${a.unidade_preco}` : "";
  return `${prefixo}${reais}${unidade}`;
}
