import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase/client";
import { useMyFornecedor } from "./onboarding";

export interface DashboardKpis {
  views_total: number;
  cliques_total: number;
  leads_hoje: number;
  propostas_abertas: number;
  rating_medio: number;
  total_avaliacoes: number;
  receita_mes_centavos: number;
}

export interface DashboardLeadItem {
  id: string;
  titulo: string;
  estagio: string;
  posto_nome: string | null;
  cidade: string | null;
  estado: string | null;
  created_at: string;
}

export interface DashboardAnuncioItem {
  id: string;
  titulo: string;
  status: string;
  views: number;
  cliques: number;
  categoria_nome: string | null;
}

export interface DashboardData {
  kpis: DashboardKpis;
  leads_recentes: DashboardLeadItem[];
  anuncios_ativos: DashboardAnuncioItem[];
}

export function useDashboard() {
  const { data: my } = useMyFornecedor();
  const fornecedorId = my?.fornecedor?.id ?? null;

  return useQuery<DashboardData>({
    queryKey: ["dashboard", fornecedorId],
    enabled: !!fornecedorId,
    queryFn: async () => {
      const hoje = new Date();
      const inicioHoje = new Date(
        hoje.getFullYear(),
        hoje.getMonth(),
        hoje.getDate()
      ).toISOString();
      const inicioMes = new Date(
        hoje.getFullYear(),
        hoje.getMonth(),
        1
      ).toISOString();

      const [anunciosRes, leadsRes, fornecedorRes, transacoesRes] =
        await Promise.all([
          // Anúncios: views + cliques (todos)
          supabase
            .from("fornecedor_anuncios")
            .select(
              "id, titulo, status, views, cliques, categoria:categorias_servico ( nome )"
            )
            .eq("fornecedor_id", fornecedorId!),

          // Leads: todos (para contagem hoje e propostas abertas) + últimos 5
          supabase
            .from("leads")
            .select(
              `
              id, titulo, estagio, cidade, estado, created_at,
              posto:postos ( razao_social, nome_fantasia )
              `
            )
            .eq("fornecedor_id", fornecedorId!)
            .order("created_at", { ascending: false })
            .limit(100),

          // Fornecedor: rating_medio + total_avaliacoes
          supabase
            .from("fornecedores")
            .select("rating_medio, total_avaliacoes")
            .eq("id", fornecedorId!)
            .single(),

          // Transações pagas do mês atual
          supabase
            .from("conekta_pay_transacoes")
            .select("valor_centavos")
            .eq("fornecedor_id", fornecedorId!)
            .eq("status", "liberada")
            .gte("created_at", inicioMes),
        ]);

      // ── Anúncios ──────────────────────────────────────────────────────────
      const anuncios = (anunciosRes.data ?? []) as any[];
      const views_total = anuncios.reduce((s, a) => s + (a.views ?? 0), 0);
      const cliques_total = anuncios.reduce(
        (s, a) => s + (a.cliques ?? 0),
        0
      );
      const anuncios_ativos: DashboardAnuncioItem[] = anuncios
        .filter((a) => a.status === "ativo")
        .slice(0, 4)
        .map((a) => ({
          id: a.id,
          titulo: a.titulo,
          status: a.status,
          views: a.views ?? 0,
          cliques: a.cliques ?? 0,
          categoria_nome: a.categoria?.nome ?? null,
        }));

      // ── Leads ─────────────────────────────────────────────────────────────
      const leads = (leadsRes.data ?? []) as any[];
      const leads_hoje = leads.filter(
        (l) => l.created_at >= inicioHoje
      ).length;
      const propostas_abertas = leads.filter(
        (l) => l.estagio === "proposta_enviada"
      ).length;
      const leads_recentes: DashboardLeadItem[] = leads.slice(0, 5).map(
        (l) => ({
          id: l.id,
          titulo: l.titulo,
          estagio: l.estagio,
          posto_nome:
            l.posto?.nome_fantasia || l.posto?.razao_social || null,
          cidade: l.cidade,
          estado: l.estado,
          created_at: l.created_at,
        })
      );

      // ── Fornecedor ────────────────────────────────────────────────────────
      const f = fornecedorRes.data as any;
      const rating_medio = f?.rating_medio ?? 0;
      const total_avaliacoes = f?.total_avaliacoes ?? 0;

      // ── Transações ────────────────────────────────────────────────────────
      const transacoes = (transacoesRes.data ?? []) as any[];
      const receita_mes_centavos = transacoes.reduce(
        (s, t) => s + (t.valor_centavos ?? 0),
        0
      );

      return {
        kpis: {
          views_total,
          cliques_total,
          leads_hoje,
          propostas_abertas,
          rating_medio,
          total_avaliacoes,
          receita_mes_centavos,
        },
        leads_recentes,
        anuncios_ativos,
      };
    },
  });
}
