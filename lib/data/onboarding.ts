import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase/client";
import type { Enums, Tables } from "@/lib/supabase/types";
import { useAuthContext } from "@/components/providers/AuthProvider";

export type Fornecedor = Tables<"fornecedores">;
export type FornecedorDocumento = Tables<"fornecedor_documentos">;
export type OnboardingStatus = Enums<"onboarding_status">;
export type DocumentoTipo = Enums<"documento_tipo">;
export type DocumentoStatus = Enums<"documento_status">;

/**
 * Catálogo de documentos obrigatórios no onboarding do fornecedor.
 * A ordem aqui é usada para renderização na tela de envio.
 */
export const DOCUMENTOS_OBRIGATORIOS: Array<{
  tipo: DocumentoTipo;
  label: string;
  descricao: string;
}> = [
  {
    tipo: "cnpj_cartao",
    label: "Cartão CNPJ",
    descricao: "Comprovante de inscrição emitido pela Receita Federal.",
  },
  {
    tipo: "contrato_social",
    label: "Contrato Social",
    descricao: "Última alteração consolidada do contrato social ou estatuto.",
  },
  {
    tipo: "alvara_funcionamento",
    label: "Alvará de funcionamento",
    descricao: "Licença municipal válida de funcionamento.",
  },
  {
    tipo: "comprovante_endereco",
    label: "Comprovante de endereço",
    descricao: "Conta de luz, água ou telefone em nome da empresa (últimos 90 dias).",
  },
  {
    tipo: "rg_responsavel",
    label: "RG do responsável legal",
    descricao: "Documento de identidade do sócio administrador.",
  },
];

export const DOCUMENTOS_OPCIONAIS: Array<{
  tipo: DocumentoTipo;
  label: string;
  descricao: string;
}> = [
  {
    tipo: "certificado_tecnico",
    label: "Certificados técnicos",
    descricao: "Certificações profissionais ou cursos relevantes da equipe.",
  },
];

export interface MyFornecedor {
  fornecedor: Fornecedor | null;
  status: OnboardingStatus | "sem_cadastro";
}

/**
 * Carrega o perfil de fornecedor do usuário autenticado junto com o status
 * de onboarding. Retorna `sem_cadastro` quando o usuário é fornecedor mas
 * ainda não tem linha em `public.fornecedores`.
 */
export function useMyFornecedor() {
  const { profile } = useAuthContext();
  return useQuery<MyFornecedor>({
    queryKey: ["my-fornecedor", profile?.id],
    enabled: !!profile && profile.role === "fornecedor",
    queryFn: async () => {
      const { data, error } = await supabase
        .from("fornecedores")
        .select("*")
        .eq("user_id", profile!.id)
        .maybeSingle();
      if (error) throw new Error(error.message);
      if (!data) return { fornecedor: null, status: "sem_cadastro" };
      return { fornecedor: data, status: data.status_onboarding };
    },
  });
}

/**
 * Lista documentos do fornecedor atual.
 */
export function useMeusDocumentos(fornecedorId: string | null | undefined) {
  return useQuery<FornecedorDocumento[]>({
    queryKey: ["meus-documentos", fornecedorId],
    enabled: !!fornecedorId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("fornecedor_documentos")
        .select("*")
        .eq("fornecedor_id", fornecedorId!)
        .order("created_at", { ascending: true });
      if (error) throw new Error(error.message);
      return data ?? [];
    },
  });
}

/**
 * Faz upload de um arquivo no bucket privado `fornecedor-documentos` e
 * registra a linha correspondente em `fornecedor_documentos`.
 */
export function useUploadDocumento(fornecedorId: string | null | undefined) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: { tipo: DocumentoTipo; file: File }) => {
      if (!fornecedorId) throw new Error("Fornecedor não identificado.");
      const ext = input.file.name.split(".").pop() ?? "bin";
      const path = `${fornecedorId}/${input.tipo}-${Date.now()}.${ext}`;

      const { error: uploadError } = await supabase.storage
        .from("fornecedor-documentos")
        .upload(path, input.file, {
          cacheControl: "3600",
          upsert: false,
          contentType: input.file.type || undefined,
        });
      if (uploadError) throw new Error(uploadError.message);

      const { data, error } = await supabase
        .from("fornecedor_documentos")
        .insert({
          fornecedor_id: fornecedorId,
          tipo: input.tipo,
          storage_path: path,
          nome_arquivo: input.file.name,
          tamanho_bytes: input.file.size,
          mime_type: input.file.type || null,
          status: "pendente",
        })
        .select()
        .single();
      if (error) {
        // Se falhou ao gravar no banco, limpa o arquivo órfão do storage.
        await supabase.storage.from("fornecedor-documentos").remove([path]);
        throw new Error(error.message);
      }
      return data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["meus-documentos", fornecedorId] });
    },
  });
}

/**
 * Remove um documento pendente (arquivo + linha).
 */
export function useRemoverDocumento(fornecedorId: string | null | undefined) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (doc: FornecedorDocumento) => {
      if (doc.status !== "pendente") {
        throw new Error("Só é possível remover documentos pendentes.");
      }
      const { error: storageError } = await supabase.storage
        .from("fornecedor-documentos")
        .remove([doc.storage_path]);
      if (storageError) throw new Error(storageError.message);

      const { error } = await supabase
        .from("fornecedor_documentos")
        .delete()
        .eq("id", doc.id);
      if (error) throw new Error(error.message);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["meus-documentos", fornecedorId] });
    },
  });
}

/**
 * Cria o registro inicial em `public.fornecedores` para o usuário logado,
 * com `status_onboarding = 'rascunho'`. Usado quando o fornecedor autenticado
 * ainda não tem empresa vinculada.
 */
export interface CriarFornecedorInput {
  razao_social: string;
  nome_fantasia?: string | null;
  cnpj: string;
  telefone?: string | null;
  whatsapp?: string | null;
  cidade?: string | null;
  estado?: string | null;
  descricao?: string | null;
}

export function useCriarFornecedor() {
  const { profile } = useAuthContext();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: CriarFornecedorInput) => {
      if (!profile) throw new Error("Sessão não encontrada.");
      const { data, error } = await supabase
        .from("fornecedores")
        .insert({
          user_id: profile.id,
          razao_social: input.razao_social,
          nome_fantasia: input.nome_fantasia || null,
          cnpj: input.cnpj,
          telefone: input.telefone || null,
          whatsapp: input.whatsapp || null,
          cidade: input.cidade || null,
          estado: input.estado ? input.estado.toUpperCase() : null,
          descricao: input.descricao || null,
          status_onboarding: "rascunho",
        })
        .select()
        .single();
      if (error) throw new Error(error.message);
      return data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["my-fornecedor"] });
    },
  });
}

/**
 * Marca o cadastro do fornecedor como `em_analise`. Exige que todos os
 * documentos obrigatórios estejam enviados.
 */
export function useSubmeterOnboarding(fornecedorId: string | null | undefined) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      if (!fornecedorId) throw new Error("Fornecedor não identificado.");
      const { error } = await supabase
        .from("fornecedores")
        .update({
          status_onboarding: "em_analise",
          submetido_em: new Date().toISOString(),
          motivo_recusa: null,
        })
        .eq("id", fornecedorId);
      if (error) throw new Error(error.message);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["my-fornecedor"] });
    },
  });
}
