"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Eye,
  TrendingUp,
  Target,
  MousePointerClick,
  BarChart2,
  Edit,
  Lightbulb,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase/client";
import { useMyFornecedor } from "@/lib/data/onboarding";

export default function AnuncioPerformancePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[40vh] flex items-center justify-center">
          <div className="w-8 h-8 border-4 border-purple border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <PerformanceContent />
    </Suspense>
  );
}

interface AnuncioStats {
  id: string;
  titulo: string;
  status: string;
  views: number;
  cliques: number;
  categoria_nome: string | null;
  leads_count: number;
  leads_ganhos: number;
  created_at: string;
}

function useAnuncioStats(id: string | null) {
  const { data: my } = useMyFornecedor();
  const fornecedorId = my?.fornecedor?.id ?? null;
  return useQuery<AnuncioStats | null>({
    queryKey: ["anuncio-stats", id, fornecedorId],
    enabled: !!id && !!fornecedorId,
    queryFn: async () => {
      const [anuncioRes, leadsRes] = await Promise.all([
        supabase
          .from("fornecedor_anuncios")
          .select("id, titulo, status, views, cliques, created_at, categoria:categorias_servico ( nome )")
          .eq("id", id!)
          .eq("fornecedor_id", fornecedorId!)
          .single(),
        supabase
          .from("leads")
          .select("id, estagio")
          .eq("fornecedor_id", fornecedorId!)
          .eq("anuncio_id", id!),
      ]);
      if (anuncioRes.error) throw new Error(anuncioRes.error.message);
      const a = anuncioRes.data as any;
      const leads = (leadsRes.data ?? []) as any[];
      return {
        id: a.id,
        titulo: a.titulo,
        status: a.status,
        views: a.views ?? 0,
        cliques: a.cliques ?? 0,
        categoria_nome: a.categoria?.nome ?? null,
        leads_count: leads.length,
        leads_ganhos: leads.filter((l) => l.estagio === "ganho").length,
        created_at: a.created_at,
      };
    },
  });
}

function PerformanceContent() {
  const params = useSearchParams();
  const id = params.get("id");
  const { data: stats, isLoading } = useAnuncioStats(id);

  if (!id) {
    return (
      <div className="mx-auto max-w-5xl py-12 text-center">
        <p className="text-sm text-gray-500">Anúncio não informado.</p>
      </div>
    );
  }

  if (isLoading) return <Skeleton />;
  if (!stats) return null;

  const ctr =
    stats.views > 0 ? ((stats.cliques / stats.views) * 100).toFixed(1) : "0";
  const conversao =
    stats.views > 0
      ? ((stats.leads_count / stats.views) * 100).toFixed(1)
      : "0";

  const dicas = gerarDicas(stats);

  return (
    <div className="mx-auto w-full max-w-5xl space-y-6">
      {/* Voltar */}
      <Link
        href="/parceiro/anuncios"
        className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-purple transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Meus anúncios
      </Link>

      {/* Header */}
      <header className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 text-purple mb-2">
              <BarChart2 className="w-4 h-4" />
              <span className="text-xs font-semibold uppercase tracking-wider">
                Performance
              </span>
            </div>
            <h1 className="text-xl font-bold text-gray-900 font-display">
              {stats.titulo}
            </h1>
            {stats.categoria_nome && (
              <p className="mt-1 text-sm text-gray-500">{stats.categoria_nome}</p>
            )}
          </div>
          <Link
            href={`/parceiro/anuncios/editar?id=${stats.id}`}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-purple/30 text-purple font-semibold text-sm hover:bg-purple/5 transition-colors self-start"
          >
            <Edit className="w-4 h-4" />
            Editar anúncio
          </Link>
        </div>
      </header>

      {/* KPIs */}
      <section className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        <StatCard
          icon={Eye}
          label="Visualizações"
          value={stats.views.toLocaleString("pt-BR")}
          hint="Total acumulado"
        />
        <StatCard
          icon={MousePointerClick}
          label="Cliques"
          value={stats.cliques.toLocaleString("pt-BR")}
          hint={`CTR: ${ctr}%`}
        />
        <StatCard
          icon={Target}
          label="Leads gerados"
          value={String(stats.leads_count)}
          hint={`${stats.leads_ganhos} convertidos`}
        />
        <StatCard
          icon={TrendingUp}
          label="Taxa de conversão"
          value={conversao + "%"}
          hint="Leads / Visualizações"
        />
        <StatCard
          icon={TrendingUp}
          label="Taxa de clique"
          value={ctr + "%"}
          hint="Cliques / Visualizações"
        />
        <StatCard
          icon={Target}
          label="Tx. fechamento"
          value={
            stats.leads_count > 0
              ? ((stats.leads_ganhos / stats.leads_count) * 100).toFixed(0) +
                "%"
              : "—"
          }
          hint="Ganhos / Leads"
        />
      </section>

      {/* Gráfico placeholder */}
      <section className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-bold text-gray-900">
            Visualizações ao longo do tempo
          </h2>
          <div className="flex gap-1">
            {["7d", "30d", "90d"].map((p) => (
              <button
                key={p}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors ${
                  p === "30d"
                    ? "bg-purple text-white"
                    : "text-gray-500 hover:bg-gray-100"
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        {/* Gráfico simulado com barras CSS */}
        <GraficoSimulado views={stats.views} cliques={stats.cliques} />

        <p className="mt-3 text-xs text-gray-400 text-center">
          Rastreamento por dia será ativado na próxima versão da plataforma.
        </p>
      </section>

      {/* Dicas automáticas */}
      {dicas.length > 0 && (
        <section className="rounded-2xl border border-amber-100 bg-amber-50/50 p-6">
          <div className="flex items-center gap-2 mb-4">
            <Lightbulb className="w-4 h-4 text-amber-500" />
            <h2 className="text-sm font-bold text-gray-900">
              Dicas para melhorar sua performance
            </h2>
          </div>
          <ul className="space-y-3">
            {dicas.map((dica, i) => (
              <li key={i} className="flex items-start gap-2.5 text-sm text-gray-700">
                <span className="w-5 h-5 rounded-full bg-amber-100 text-amber-600 font-bold text-xs flex items-center justify-center flex-shrink-0 mt-0.5">
                  {i + 1}
                </span>
                {dica}
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}

// ─── Gráfico simulado ─────────────────────────────────────────────────────────

function GraficoSimulado({
  views,
  cliques,
}: {
  views: number;
  cliques: number;
}) {
  // Gera 30 barras com distribuição aleatória mas seed determinístico baseado nos totais
  const days = Array.from({ length: 30 }, (_, i) => {
    const seed = (views + cliques + i * 7) % 100;
    const v = Math.max(0, Math.round((seed / 100) * (views / 15)));
    const c = Math.max(0, Math.round((seed / 100) * (cliques / 15)));
    return { v, c };
  });
  const maxV = Math.max(...days.map((d) => d.v), 1);

  return (
    <div className="flex items-end gap-0.5 h-28">
      {days.map((d, i) => (
        <div key={i} className="flex-1 flex flex-col items-center gap-0.5 h-full justify-end">
          <div
            className="w-full bg-purple/20 rounded-sm"
            style={{ height: `${(d.v / maxV) * 100}%` }}
          />
          <div
            className="w-full bg-purple rounded-sm"
            style={{ height: `${(d.c / maxV) * 70}%` }}
          />
        </div>
      ))}
    </div>
  );
}

// ─── Dicas automáticas ────────────────────────────────────────────────────────

function gerarDicas(stats: AnuncioStats): string[] {
  const dicas: string[] = [];
  const ctr = stats.views > 0 ? stats.cliques / stats.views : 0;
  const conv = stats.views > 0 ? stats.leads_count / stats.views : 0;

  if (stats.views === 0) {
    dicas.push(
      "Seu anúncio ainda não teve visualizações. Verifique se ele está ativo e se cobre a região e categoria certa."
    );
  }
  if (ctr < 0.02 && stats.views > 50) {
    dicas.push(
      "Taxa de clique abaixo de 2%. Considere melhorar o título e as fotos — eles são o primeiro contato do posto com você."
    );
  }
  if (conv < 0.01 && stats.cliques > 20) {
    dicas.push(
      "Muitos cliques mas poucos leads. Revise a descrição e o preço para converter mais visitas em contatos."
    );
  }
  if (stats.leads_count > 0 && stats.leads_ganhos === 0) {
    dicas.push(
      "Você tem leads mas nenhum convertido ainda. Responda rápido — parceiros com tempo de resposta abaixo de 2h fecham 3× mais negócios."
    );
  }
  if (dicas.length === 0 && stats.views > 0) {
    dicas.push(
      "Bom desempenho! Continue respondendo leads rapidamente e mantenha o anúncio atualizado para manter a posição no ranking."
    );
  }
  return dicas;
}

// ─── Componentes auxiliares ───────────────────────────────────────────────────

function StatCard({
  icon: Icon,
  label,
  value,
  hint,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  hint: string;
}) {
  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
      <div className="w-8 h-8 rounded-xl bg-purple/10 flex items-center justify-center mb-3">
        <Icon className="w-4 h-4 text-purple" />
      </div>
      <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider">
        {label}
      </p>
      <p className="mt-1 text-2xl font-bold text-gray-900 font-display">
        {value}
      </p>
      <p className="mt-0.5 text-xs text-gray-500">{hint}</p>
    </div>
  );
}

function Skeleton() {
  return (
    <div className="mx-auto w-full max-w-5xl animate-pulse space-y-6">
      <div className="h-4 w-28 bg-gray-100 rounded" />
      <div className="rounded-2xl border border-gray-100 bg-white p-6 space-y-3">
        <div className="h-6 w-1/2 bg-gray-100 rounded" />
        <div className="h-4 w-1/4 bg-gray-100 rounded" />
      </div>
      <div className="grid grid-cols-3 gap-3">
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="rounded-2xl border border-gray-100 bg-white p-4 space-y-2">
            <div className="h-8 w-8 bg-gray-100 rounded-xl" />
            <div className="h-3 w-16 bg-gray-100 rounded" />
            <div className="h-6 w-12 bg-gray-100 rounded" />
          </div>
        ))}
      </div>
    </div>
  );
}
