"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Star,
  ArrowLeft,
  Filter,
  MessageSquareReply,
  CheckCircle2,
  Loader2,
} from "lucide-react";
import {
  useMinhasAvaliacoes,
  useResponderAvaliacao,
  calcularStats,
  type AvaliacaoComPosto,
} from "@/lib/data/perfil";
import { StarRating } from "@/components/fornecedor/StarRating";

const PERIODOS = [
  { value: "todos", label: "Todo o período" },
  { value: "30d", label: "Últimos 30 dias" },
  { value: "90d", label: "Últimos 90 dias" },
  { value: "1a", label: "Último ano" },
] as const;
type PeriodoValue = (typeof PERIODOS)[number]["value"];

export default function AvaliacoesPage() {
  const { data: avaliacoes = [], isLoading } = useMinhasAvaliacoes();
  const [filtroNota, setFiltroNota] = useState<number | null>(null);
  const [periodo, setPeriodo] = useState<PeriodoValue>("todos");

  const stats = calcularStats(avaliacoes);

  const [agora] = useState(() => Date.now());
  const limiteMs: Record<PeriodoValue, number | null> = {
    todos: null,
    "30d": 30 * 24 * 60 * 60 * 1000,
    "90d": 90 * 24 * 60 * 60 * 1000,
    "1a": 365 * 24 * 60 * 60 * 1000,
  };
  const limite = limiteMs[periodo];
  const filtradas = avaliacoes.filter((a) => {
    if (filtroNota !== null && a.nota !== filtroNota) return false;
    if (limite !== null) {
      const idade = agora - new Date(a.created_at).getTime();
      if (idade > limite) return false;
    }
    return true;
  });

  return (
    <div className="mx-auto w-full max-w-4xl space-y-6">
      {/* Header */}
      <header>
        <Link
          href="/parceiro/perfil"
          className="inline-flex items-center gap-1 text-xs font-semibold text-gray-500 hover:text-purple transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Voltar ao perfil
        </Link>
        <div className="mt-2 inline-flex items-center gap-2 text-purple">
          <Star className="w-4 h-4" />
          <span className="text-xs font-semibold uppercase tracking-wider">
            Reputação
          </span>
        </div>
        <h1 className="mt-1 text-2xl sm:text-3xl font-bold text-gray-900 font-display">
          Avaliações recebidas
        </h1>
        <p className="mt-1 text-sm text-gray-600">
          Acompanhe o que os postos têm dito sobre seus serviços e responda
          publicamente quando fizer sentido.
        </p>
      </header>

      {isLoading ? (
        <LoadingState />
      ) : avaliacoes.length === 0 ? (
        <EmptyState />
      ) : (
        <>
          {/* Resumo da nota */}
          <section className="grid grid-cols-1 md:grid-cols-[1fr_1.5fr] gap-4">
            <div className="rounded-2xl border border-purple/20 bg-gradient-to-br from-purple/5 to-purple-light/5 p-6 text-center">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-purple">
                Nota média
              </p>
              <p className="mt-2 text-5xl font-bold text-gray-900 font-display">
                {stats.media.toFixed(1)}
              </p>
              <div className="mt-2 flex justify-center">
                <StarRating value={stats.media} size="lg" />
              </div>
              <p className="mt-2 text-xs text-gray-500">
                {stats.total} {stats.total === 1 ? "avaliação" : "avaliações"}
              </p>
            </div>

            {/* Distribuição */}
            <div className="rounded-2xl border border-gray-100 bg-white p-6">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-gray-500 mb-3">
                Distribuição
              </p>
              <div className="space-y-2">
                {[5, 4, 3, 2, 1].map((nota) => {
                  const count =
                    stats.distribuicao[nota as 1 | 2 | 3 | 4 | 5];
                  const pct = stats.total > 0 ? (count / stats.total) * 100 : 0;
                  const active = filtroNota === nota;
                  return (
                    <button
                      key={nota}
                      onClick={() => setFiltroNota(active ? null : nota)}
                      className={`w-full flex items-center gap-3 text-left group ${
                        active ? "text-purple" : "text-gray-700"
                      }`}
                    >
                      <span className="text-xs font-semibold w-4">
                        {nota}
                      </span>
                      <Star
                        className={`w-3.5 h-3.5 ${
                          active
                            ? "fill-purple text-purple"
                            : "fill-amber-400 text-amber-400"
                        }`}
                      />
                      <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className={`h-full transition-colors ${
                            active ? "bg-purple" : "bg-amber-400"
                          }`}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                      <span className="text-xs text-gray-500 w-8 text-right">
                        {count}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </section>

          {/* Filtros */}
          <section className="flex flex-wrap items-center gap-2">
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-500">
              <Filter className="w-3.5 h-3.5" />
              Filtrar por:
            </div>
            <select
              value={periodo}
              onChange={(e) => setPeriodo(e.target.value as PeriodoValue)}
              className="px-3 py-1.5 rounded-lg border border-gray-200 bg-white text-xs font-semibold text-gray-700 outline-none focus:border-purple"
            >
              {PERIODOS.map((p) => (
                <option key={p.value} value={p.value}>
                  {p.label}
                </option>
              ))}
            </select>
            {filtroNota !== null && (
              <button
                onClick={() => setFiltroNota(null)}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-purple/10 text-purple text-xs font-semibold"
              >
                {filtroNota} {filtroNota === 1 ? "estrela" : "estrelas"}
                <span className="text-purple/60">×</span>
              </button>
            )}
          </section>

          {/* Lista */}
          <section className="space-y-3">
            {filtradas.length === 0 ? (
              <div className="rounded-2xl border border-gray-100 bg-white p-8 text-center">
                <p className="text-sm text-gray-500">
                  Nenhuma avaliação encontrada com os filtros selecionados.
                </p>
              </div>
            ) : (
              filtradas.map((a) => <AvaliacaoCard key={a.id} avaliacao={a} />)
            )}
          </section>
        </>
      )}
    </div>
  );
}

// ─── Card de avaliação ───────────────────────────────────────────────────────

function AvaliacaoCard({ avaliacao }: { avaliacao: AvaliacaoComPosto }) {
  const [respondendo, setRespondendo] = useState(false);
  const [texto, setTexto] = useState(avaliacao.resposta_fornecedor ?? "");
  const [error, setError] = useState<string | null>(null);
  const responder = useResponderAvaliacao();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    try {
      await responder.mutateAsync({ id: avaliacao.id, resposta: texto });
      setRespondendo(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Falha ao responder.");
    }
  }

  const data = new Date(avaliacao.created_at).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  return (
    <article className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <StarRating value={avaliacao.nota} size="sm" />
            <h3 className="text-sm font-bold text-gray-900">
              {avaliacao.posto_nome || "Posto"}
            </h3>
          </div>
          {avaliacao.sos_titulo && (
            <p className="mt-0.5 text-xs text-gray-500">
              Serviço: {avaliacao.sos_titulo}
            </p>
          )}
          <p className="mt-0.5 text-xs text-gray-400">{data}</p>
        </div>
      </div>

      {avaliacao.comentario && (
        <p className="mt-3 text-sm text-gray-700 leading-relaxed">
          {avaliacao.comentario}
        </p>
      )}

      {/* Resposta existente */}
      {avaliacao.resposta_fornecedor && !respondendo && (
        <div className="mt-4 rounded-xl bg-purple/5 border border-purple/10 p-4">
          <div className="flex items-center justify-between gap-2">
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-purple">
              <MessageSquareReply className="w-3.5 h-3.5" />
              Sua resposta
              {avaliacao.respondida_em && (
                <span className="text-[11px] text-gray-400 font-normal">
                  ·{" "}
                  {new Date(avaliacao.respondida_em).toLocaleDateString(
                    "pt-BR"
                  )}
                </span>
              )}
            </div>
            <button
              onClick={() => {
                setTexto(avaliacao.resposta_fornecedor ?? "");
                setRespondendo(true);
              }}
              className="text-xs font-semibold text-purple hover:underline"
            >
              Editar
            </button>
          </div>
          <p className="mt-2 text-sm text-gray-700 leading-relaxed">
            {avaliacao.resposta_fornecedor}
          </p>
        </div>
      )}

      {/* Form de resposta */}
      {respondendo ? (
        <form onSubmit={handleSubmit} className="mt-4 space-y-3">
          <textarea
            value={texto}
            onChange={(e) => setTexto(e.target.value)}
            rows={3}
            placeholder="Escreva uma resposta pública a esta avaliação..."
            className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-sm text-gray-900 placeholder-gray-400 outline-none focus:border-purple focus:ring-2 focus:ring-purple/10 resize-none"
          />
          {error && <p className="text-xs text-red-600">{error}</p>}
          <div className="flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={() => {
                setRespondendo(false);
                setTexto(avaliacao.resposta_fornecedor ?? "");
              }}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-gray-600 hover:bg-gray-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={responder.isPending}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-purple hover:bg-purple-medium text-white text-xs font-semibold shadow-lg shadow-purple/20 disabled:opacity-60"
            >
              {responder.isPending ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  Salvando...
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Publicar resposta
                </>
              )}
            </button>
          </div>
        </form>
      ) : (
        !avaliacao.resposta_fornecedor && (
          <button
            onClick={() => setRespondendo(true)}
            className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-purple hover:underline"
          >
            <MessageSquareReply className="w-3.5 h-3.5" />
            Responder publicamente
          </button>
        )
      )}
    </article>
  );
}

// ─── Estados auxiliares ──────────────────────────────────────────────────────

function LoadingState() {
  return (
    <div className="space-y-3">
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className="rounded-2xl border border-gray-100 bg-white p-5 animate-pulse"
        >
          <div className="h-3 w-20 bg-gray-100 rounded" />
          <div className="mt-3 h-5 w-2/3 bg-gray-100 rounded" />
          <div className="mt-2 h-10 w-full bg-gray-100 rounded" />
        </div>
      ))}
    </div>
  );
}

function EmptyState() {
  return (
    <div className="rounded-2xl border-2 border-dashed border-purple/20 bg-white p-10 text-center">
      <div className="w-14 h-14 rounded-2xl bg-purple/10 flex items-center justify-center mx-auto mb-4">
        <Star className="w-7 h-7 text-purple" />
      </div>
      <h3 className="text-lg font-bold text-gray-900 font-display">
        Ainda sem avaliações
      </h3>
      <p className="mt-1 text-sm text-gray-500 max-w-md mx-auto">
        Assim que os postos concluírem serviços contratados pela Conekta, as
        avaliações aparecem aqui. Responder publicamente ajuda a construir
        reputação.
      </p>
    </div>
  );
}
