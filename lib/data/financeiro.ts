import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase/client";
import type { Enums, Tables } from "@/lib/supabase/types";
import { useMyFornecedor } from "./onboarding";

export type Transacao = Tables<"conekta_pay_transacoes">;
export type PayStatus = Enums<"pay_status">;
export type AssinaturaStatus = Enums<"assinatura_status">;

export const PAY_STATUS_LABEL: Record<PayStatus, string> = {
  pendente: "Pendente",
  autorizada: "Autorizada",
  capturada: "Capturada",
  em_garantia: "Em custódia",
  liberada: "Liberado",
  reembolsada: "Reembolsado",
  falhou: "Falhou",
  cancelada: "Cancelada",
};

export const PAY_STATUS_COR: Record<PayStatus, string> = {
  pendente: "bg-amber-100 text-amber-700 border-amber-200",
  autorizada: "bg-blue-100 text-blue-700 border-blue-200",
  capturada: "bg-indigo-100 text-indigo-700 border-indigo-200",
  em_garantia: "bg-purple/10 text-purple border-purple/20",
  liberada: "bg-green-100 text-green-700 border-green-200",
  reembolsada: "bg-gray-100 text-gray-700 border-gray-200",
  falhou: "bg-red-100 text-red-700 border-red-200",
  cancelada: "bg-red-100 text-red-600 border-red-200",
};

export interface TransacaoItem {
  id: string;
  created_at: string;
  valor_centavos: number;
  status: PayStatus;
  conekta_lock: boolean;
  liberado_em: string | null;
  posto_nome: string | null;
  sos_titulo: string | null;
}

export function useMinhasTransacoes(filtroStatus?: PayStatus | "todas") {
  const { data: my } = useMyFornecedor();
  const fornecedorId = my?.fornecedor?.id ?? null;
  return useQuery<TransacaoItem[]>({
    queryKey: ["minhas-transacoes", fornecedorId, filtroStatus ?? "todas"],
    enabled: !!fornecedorId,
    queryFn: async () => {
      let query = supabase
        .from("conekta_pay_transacoes")
        .select(
          `
          id, created_at, valor_centavos, status, conekta_lock, liberado_em,
          posto:postos ( razao_social, nome_fantasia ),
          sos:sos_disparos ( titulo )
          `
        )
        .eq("fornecedor_id", fornecedorId!)
        .order("created_at", { ascending: false });

      if (filtroStatus && filtroStatus !== "todas") {
        query = query.eq("status", filtroStatus);
      }

      const { data, error } = await query;
      if (error) throw new Error(error.message);
      return (data ?? []).map((t: any): TransacaoItem => ({
        id: t.id,
        created_at: t.created_at,
        valor_centavos: t.valor_centavos,
        status: t.status,
        conekta_lock: t.conekta_lock ?? false,
        liberado_em: t.liberado_em,
        posto_nome: t.posto?.nome_fantasia || t.posto?.razao_social || null,
        sos_titulo: t.sos?.titulo ?? null,
      }));
    },
  });
}

export function useConektaLockItems() {
  const { data: my } = useMyFornecedor();
  const fornecedorId = my?.fornecedor?.id ?? null;
  return useQuery<TransacaoItem[]>({
    queryKey: ["conekta-lock", fornecedorId],
    enabled: !!fornecedorId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("conekta_pay_transacoes")
        .select(
          `
          id, created_at, valor_centavos, status, conekta_lock, liberado_em,
          posto:postos ( razao_social, nome_fantasia ),
          sos:sos_disparos ( titulo )
          `
        )
        .eq("fornecedor_id", fornecedorId!)
        .eq("conekta_lock", true)
        .in("status", ["em_garantia", "liberada", "reembolsada"])
        .order("created_at", { ascending: false });
      if (error) throw new Error(error.message);
      return (data ?? []).map((t: any): TransacaoItem => ({
        id: t.id,
        created_at: t.created_at,
        valor_centavos: t.valor_centavos,
        status: t.status,
        conekta_lock: true,
        liberado_em: t.liberado_em,
        posto_nome: t.posto?.nome_fantasia || t.posto?.razao_social || null,
        sos_titulo: t.sos?.titulo ?? null,
      }));
    },
  });
}

// ─── Planos e assinaturas ─────────────────────────────────────────────────────

export interface PlanoItem {
  id: string;
  nome: string;
  slug: string;
  descricao: string | null;
  preco_mensal_centavos: number;
  preco_anual_centavos: number | null;
  recursos: string[];
  ativo: boolean;
}

export interface AssinaturaAtiva {
  id: string;
  plano_id: string;
  plano_nome: string;
  plano_slug: string;
  preco_mensal_centavos: number;
  status: AssinaturaStatus;
  inicio_em: string;
  proximo_ciclo_em: string | null;
  cancelada_em: string | null;
}

export function usePlanos() {
  return useQuery<PlanoItem[]>({
    queryKey: ["planos-fornecedor"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("planos_fornecedor")
        .select("*")
        .eq("ativo", true)
        .order("ordem");
      if (error) throw new Error(error.message);
      return (data ?? []).map((p: any): PlanoItem => ({
        id: p.id,
        nome: p.nome,
        slug: p.slug,
        descricao: p.descricao,
        preco_mensal_centavos: p.preco_mensal_centavos,
        preco_anual_centavos: p.preco_anual_centavos,
        recursos: Array.isArray(p.recursos) ? p.recursos : [],
        ativo: p.ativo,
      }));
    },
  });
}

export function useMinhaAssinatura() {
  const { data: my } = useMyFornecedor();
  const fornecedorId = my?.fornecedor?.id ?? null;
  return useQuery<AssinaturaAtiva | null>({
    queryKey: ["minha-assinatura", fornecedorId],
    enabled: !!fornecedorId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("assinaturas")
        .select("*, plano:planos_fornecedor ( nome, slug, preco_mensal_centavos )")
        .eq("fornecedor_id", fornecedorId!)
        .neq("status", "cancelada")
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();
      if (error) throw new Error(error.message);
      if (!data) return null;
      const d = data as any;
      return {
        id: d.id,
        plano_id: d.plano_id,
        plano_nome: d.plano?.nome ?? "—",
        plano_slug: d.plano?.slug ?? "",
        preco_mensal_centavos: d.plano?.preco_mensal_centavos ?? 0,
        status: d.status,
        inicio_em: d.inicio_em,
        proximo_ciclo_em: d.proximo_ciclo_em,
        cancelada_em: d.cancelada_em,
      };
    },
  });
}

export function formatarReais(centavos: number) {
  return (centavos / 100).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}
