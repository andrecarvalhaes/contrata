"use client";

import Link from "next/link";
import {
  Megaphone,
  Target,
  MessageSquare,
  Wallet,
  Eye,
  Users,
  DollarSign,
  Star,
  ArrowUpRight,
  Sparkles,
  Plus,
  Send,
  MapPin,
  BarChart2,
  TrendingUp,
} from "lucide-react";
import { useAuthContext } from "@/components/providers/AuthProvider";
import { useDashboard } from "@/lib/data/dashboard";
import { ESTAGIO_LABEL, ESTAGIO_COR, type LeadEstagio } from "@/lib/data/leads";
import { STATUS_LABEL, type AnuncioStatus } from "@/lib/data/anuncios";

// ─── Status color para anúncios ───────────────────────────────────────────────

const STATUS_COR: Record<AnuncioStatus, string> = {
  rascunho: "bg-gray-100 text-gray-600 border-gray-200",
  ativo: "bg-green-100 text-green-700 border-green-200",
  pausado: "bg-amber-100 text-amber-700 border-amber-200",
  encerrado: "bg-red-100 text-red-700 border-red-200",
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatarReais(centavos: number) {
  return (centavos / 100).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

function formatarRating(r: number) {
  return r > 0 ? r.toFixed(1) : "—";
}

// ─── Página principal ─────────────────────────────────────────────────────────

export default function ParceiroHomePage() {
  const { profile } = useAuthContext();
  const nome =
    profile?.display_name?.split(" ")[0] ||
    profile?.email?.split("@")[0] ||
    "parceiro";

  const { data, isLoading } = useDashboard();

  return (
    <div className="mx-auto w-full max-w-6xl space-y-8">
      {/* Saudação */}
      <header className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 text-purple">
            <Sparkles className="w-4 h-4" />
            <span className="text-xs font-semibold uppercase tracking-wider">
              Área do Parceiro
            </span>
          </div>
          <h1 className="mt-2 text-2xl sm:text-3xl font-bold text-gray-900 font-display">
            Olá, <span className="text-purple">{nome}</span>
          </h1>
          <p className="mt-1 text-sm text-gray-600">
            Acompanhe seus anúncios, leads e recebimentos num só lugar.
          </p>
        </div>
        <Link
          href="/parceiro/anuncios/novo"
          className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-purple hover:bg-purple-medium text-white font-semibold text-sm transition-colors shadow-lg shadow-purple/20 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          Novo anúncio
        </Link>
      </header>

      {/* ── KPIs ── */}
      <section className="grid grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
        <KpiCard
          icon={Eye}
          label="Visualizações"
          value={isLoading ? null : data?.kpis.views_total ?? 0}
          hint="Total nos anúncios"
          loading={isLoading}
        />
        <KpiCard
          icon={Users}
          label="Leads hoje"
          value={isLoading ? null : data?.kpis.leads_hoje ?? 0}
          hint="Novos interessados"
          loading={isLoading}
        />
        <KpiCard
          icon={Send}
          label="Propostas abertas"
          value={isLoading ? null : data?.kpis.propostas_abertas ?? 0}
          hint="Aguardando resposta"
          loading={isLoading}
        />
        <KpiCard
          icon={Star}
          label="Avaliação média"
          value={
            isLoading
              ? null
              : formatarRating(data?.kpis.rating_medio ?? 0)
          }
          hint={
            data
              ? `${data.kpis.total_avaliacoes} avaliação${data.kpis.total_avaliacoes !== 1 ? "ões" : ""}`
              : "—"
          }
          loading={isLoading}
        />
        <KpiCard
          icon={DollarSign}
          label="Receita do mês"
          value={
            isLoading
              ? null
              : data?.kpis.receita_mes_centavos
              ? formatarReais(data.kpis.receita_mes_centavos)
              : "R$ 0"
          }
          hint="Via Conekta Pay"
          loading={isLoading}
          wide
        />
      </section>

      {/* ── Leads recentes + Anúncios ativos ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Leads recentes */}
        <section className="rounded-2xl border border-gray-100 bg-white shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-50">
            <div className="flex items-center gap-2 text-gray-900 font-bold">
              <Target className="w-4 h-4 text-purple" />
              Leads recentes
            </div>
            <Link
              href="/parceiro/leads"
              className="text-xs text-purple font-semibold hover:underline flex items-center gap-1"
            >
              Ver todos
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {isLoading ? (
            <LeadsSkeleton />
          ) : !data?.leads_recentes.length ? (
            <EmptyLeads />
          ) : (
            <ul className="divide-y divide-gray-50">
              {data.leads_recentes.map((lead) => (
                <li key={lead.id}>
                  <Link
                    href={`/parceiro/leads/detalhe?id=${lead.id}`}
                    className="flex items-start gap-3 px-5 py-4 hover:bg-gray-50/70 transition-colors"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-1.5 mb-1">
                        <span
                          className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${ESTAGIO_COR[lead.estagio as LeadEstagio]}`}
                        >
                          {ESTAGIO_LABEL[lead.estagio as LeadEstagio]}
                        </span>
                      </div>
                      <p className="text-sm font-semibold text-gray-900 truncate">
                        {lead.titulo}
                      </p>
                      {(lead.posto_nome || lead.cidade) && (
                        <p className="mt-0.5 text-xs text-gray-500 flex items-center gap-1">
                          {lead.posto_nome && (
                            <span className="truncate">{lead.posto_nome}</span>
                          )}
                          {lead.cidade && (
                            <>
                              <MapPin className="w-3 h-3 flex-shrink-0" />
                              <span>
                                {[lead.cidade, lead.estado]
                                  .filter(Boolean)
                                  .join(" — ")}
                              </span>
                            </>
                          )}
                        </p>
                      )}
                    </div>
                    <ArrowUpRight className="w-4 h-4 text-gray-300 flex-shrink-0 mt-1" />
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>

        {/* Anúncios ativos */}
        <section className="rounded-2xl border border-gray-100 bg-white shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-50">
            <div className="flex items-center gap-2 text-gray-900 font-bold">
              <Megaphone className="w-4 h-4 text-purple" />
              Anúncios ativos
            </div>
            <Link
              href="/parceiro/anuncios"
              className="text-xs text-purple font-semibold hover:underline flex items-center gap-1"
            >
              Gerenciar
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {isLoading ? (
            <AnunciosSkeleton />
          ) : !data?.anuncios_ativos.length ? (
            <EmptyAnuncios />
          ) : (
            <ul className="divide-y divide-gray-50">
              {data.anuncios_ativos.map((a) => (
                <li key={a.id}>
                  <Link
                    href={`/parceiro/anuncios/editar?id=${a.id}`}
                    className="flex items-center gap-3 px-5 py-4 hover:bg-gray-50/70 transition-colors"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-1.5 mb-1">
                        <span
                          className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${STATUS_COR[a.status as AnuncioStatus]}`}
                        >
                          {STATUS_LABEL[a.status as AnuncioStatus]}
                        </span>
                        {a.categoria_nome && (
                          <span className="text-[10px] text-gray-400 font-medium">
                            {a.categoria_nome}
                          </span>
                        )}
                      </div>
                      <p className="text-sm font-semibold text-gray-900 truncate">
                        {a.titulo}
                      </p>
                    </div>
                    <div className="flex flex-col items-end gap-1 flex-shrink-0 text-right">
                      <span className="flex items-center gap-1 text-xs text-gray-500">
                        <Eye className="w-3 h-3" />
                        {a.views.toLocaleString("pt-BR")}
                      </span>
                      <span className="flex items-center gap-1 text-xs text-gray-400">
                        <TrendingUp className="w-3 h-3" />
                        {a.cliques} cliques
                      </span>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>

      {/* ── Mensagens (placeholder até módulo ficar pronto) ── */}
      <section className="rounded-2xl border border-gray-100 bg-white shadow-sm p-5 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple/10 flex items-center justify-center flex-shrink-0">
            <MessageSquare className="w-5 h-5 text-purple" />
          </div>
          <div>
            <p className="text-sm font-bold text-gray-900">Mensagens</p>
            <p className="text-xs text-gray-500 mt-0.5">
              Chat em tempo real com os postos em negociação.
            </p>
          </div>
        </div>
        <Link
          href="/parceiro/mensagens"
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-purple/20 text-purple font-semibold text-sm hover:bg-purple/5 transition-colors flex-shrink-0"
        >
          Abrir
          <ArrowUpRight className="w-3.5 h-3.5" />
        </Link>
      </section>

      {/* ── Atalhos rápidos ── */}
      <section className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { href: "/parceiro/anuncios", icon: Megaphone, label: "Anúncios" },
          { href: "/parceiro/leads", icon: Target, label: "Leads" },
          { href: "/parceiro/financeiro", icon: Wallet, label: "Financeiro" },
          { href: "/parceiro/perfil", icon: BarChart2, label: "Meu perfil" },
        ].map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className="group flex flex-col items-center gap-2 rounded-2xl border border-gray-100 bg-white p-4 hover:border-purple/30 hover:shadow-md transition-all text-center"
            >
              <div className="w-10 h-10 rounded-xl bg-purple/10 flex items-center justify-center group-hover:bg-purple group-hover:text-white transition-colors">
                <Icon className="w-5 h-5 text-purple group-hover:text-white transition-colors" />
              </div>
              <span className="text-xs font-semibold text-gray-700">
                {item.label}
              </span>
            </Link>
          );
        })}
      </section>
    </div>
  );
}

// ─── KPI Card ─────────────────────────────────────────────────────────────────

function KpiCard({
  icon: Icon,
  label,
  value,
  hint,
  loading,
  wide,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string | number | null;
  hint: string;
  loading: boolean;
  wide?: boolean;
}) {
  return (
    <div
      className={`rounded-2xl border border-purple/10 bg-white p-4 sm:p-5 shadow-sm ${wide ? "col-span-2 lg:col-span-1" : ""}`}
    >
      <div className="w-9 h-9 rounded-xl bg-purple/10 flex items-center justify-center mb-3">
        <Icon className="w-4 h-4 text-purple" />
      </div>
      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
        {label}
      </p>
      {loading ? (
        <div className="mt-2 h-8 w-20 bg-gray-100 rounded animate-pulse" />
      ) : (
        <p className="mt-1 text-2xl sm:text-3xl font-bold text-gray-900 font-display">
          {value ?? "—"}
        </p>
      )}
      <p className="mt-1 text-xs text-gray-500">{hint}</p>
    </div>
  );
}

// ─── Skeletons e estados vazios ───────────────────────────────────────────────

function LeadsSkeleton() {
  return (
    <ul className="divide-y divide-gray-50">
      {[0, 1, 2].map((i) => (
        <li key={i} className="px-5 py-4 animate-pulse space-y-2">
          <div className="h-3 w-16 bg-gray-100 rounded-full" />
          <div className="h-4 w-3/4 bg-gray-100 rounded" />
          <div className="h-3 w-1/2 bg-gray-100 rounded" />
        </li>
      ))}
    </ul>
  );
}

function AnunciosSkeleton() {
  return (
    <ul className="divide-y divide-gray-50">
      {[0, 1, 2].map((i) => (
        <li key={i} className="px-5 py-4 animate-pulse flex justify-between">
          <div className="space-y-2 flex-1">
            <div className="h-3 w-12 bg-gray-100 rounded-full" />
            <div className="h-4 w-2/3 bg-gray-100 rounded" />
          </div>
          <div className="space-y-1 items-end flex flex-col">
            <div className="h-3 w-12 bg-gray-100 rounded" />
            <div className="h-3 w-10 bg-gray-100 rounded" />
          </div>
        </li>
      ))}
    </ul>
  );
}

function EmptyLeads() {
  return (
    <div className="px-5 py-8 text-center">
      <Target className="w-8 h-8 text-gray-300 mx-auto mb-2" />
      <p className="text-sm text-gray-400">Nenhum lead ainda.</p>
      <Link
        href="/parceiro/leads"
        className="mt-2 inline-block text-xs text-purple hover:underline font-semibold"
      >
        Gerenciar leads
      </Link>
    </div>
  );
}

function EmptyAnuncios() {
  return (
    <div className="px-5 py-8 text-center">
      <Megaphone className="w-8 h-8 text-gray-300 mx-auto mb-2" />
      <p className="text-sm text-gray-400">Nenhum anúncio ativo.</p>
      <Link
        href="/parceiro/anuncios/novo"
        className="mt-2 inline-block text-xs text-purple hover:underline font-semibold"
      >
        Criar primeiro anúncio
      </Link>
    </div>
  );
}
