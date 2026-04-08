"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Filter, Clock, CheckCircle, AlertCircle, Building2, ChevronRight, MessageSquare } from "lucide-react";
import { useMinhasSolicitacoes, type MinhaSolicitacao, type SosStatus } from "@/lib/data/queries";

type FilterType = "todas" | SosStatus;

const STATUS_UI: Record<SosStatus, { label: string; color: string }> = {
  aberto: {
    label: "Aguardando propostas",
    color: "bg-amber-100 text-amber-700 border-amber-200",
  },
  em_andamento: {
    label: "Em andamento",
    color: "bg-blue-100 text-blue-700 border-blue-200",
  },
  concluido: {
    label: "Concluído",
    color: "bg-gray-100 text-gray-600 border-gray-200",
  },
  cancelado: {
    label: "Cancelado",
    color: "bg-red-100 text-red-700 border-red-200",
  },
};

function formatTempoRelativo(iso: string): string {
  const diffMs = Date.now() - new Date(iso).getTime();
  const h = Math.floor(diffMs / (1000 * 60 * 60));
  if (h < 1) return "agora";
  if (h < 24) return `${h} hora${h > 1 ? "s" : ""} atrás`;
  const d = Math.floor(h / 24);
  if (d < 30) return `${d} dia${d > 1 ? "s" : ""} atrás`;
  const m = Math.floor(d / 30);
  return `${m} ${m === 1 ? "mês" : "meses"} atrás`;
}

export default function SolicitacoesPage() {
  const [filtroAtivo, setFiltroAtivo] = useState<FilterType>("todas");
  const { data: solicitacoes = [], isLoading, error } = useMinhasSolicitacoes();

  const solicitacoesFiltradas = useMemo(() => {
    if (filtroAtivo === "todas") return solicitacoes;
    return solicitacoes.filter((s) => s.status === filtroAtivo);
  }, [solicitacoes, filtroAtivo]);

  const counts = useMemo(() => {
    return {
      todas: solicitacoes.length,
      aberto: solicitacoes.filter((s) => s.status === "aberto").length,
      em_andamento: solicitacoes.filter((s) => s.status === "em_andamento").length,
      concluido: solicitacoes.filter((s) => s.status === "concluido").length,
      cancelado: solicitacoes.filter((s) => s.status === "cancelado").length,
    };
  }, [solicitacoes]);

  const filters: Array<{ id: FilterType; label: string; count: number }> = [
    { id: "todas", label: "Todas", count: counts.todas },
    { id: "aberto", label: "Aguardando", count: counts.aberto },
    { id: "em_andamento", label: "Em andamento", count: counts.em_andamento },
    { id: "concluido", label: "Concluídas", count: counts.concluido },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Minhas Solicitações</h1>
          <p className="text-gray-600 mt-1">Acompanhe o status das suas demandas</p>
        </div>
        <Link
          href="/sos"
          className="px-6 py-3 bg-gradient-to-r from-purple to-purple-medium text-white rounded-xl font-semibold hover:scale-105 transition-transform shadow-lg shadow-purple/20"
        >
          + Nova Solicitação
        </Link>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <Filter className="w-5 h-5 text-gray-400" />
          <h2 className="font-semibold text-gray-700">Filtros</h2>
        </div>
        <div className="flex flex-wrap gap-2">
          {filters.map((filter) => (
            <button
              key={filter.id}
              onClick={() => setFiltroAtivo(filter.id as FilterType)}
              className={`px-4 py-2 rounded-xl font-medium text-sm transition-all ${
                filtroAtivo === filter.id
                  ? "bg-gradient-to-r from-purple to-purple-medium text-white shadow-lg shadow-purple/20"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {filter.label} ({filter.count})
            </button>
          ))}
        </div>
      </div>

      {/* Lista de Solicitações */}
      <div className="space-y-4">
        {isLoading ? (
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="bg-white rounded-2xl h-32 border border-gray-100 animate-pulse" />
            ))}
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-sm text-red-600">
            Erro ao carregar solicitações: {(error as Error).message}
          </div>
        ) : solicitacoesFiltradas.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-gray-100">
            <div className="w-16 h-16 bg-purple/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <MessageSquare className="w-8 h-8 text-purple" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Nenhuma solicitação encontrada</h3>
            <p className="text-gray-600 mb-6">
              {filtroAtivo === "todas"
                ? "Você ainda não criou nenhuma solicitação"
                : "Nenhuma solicitação nessa categoria"}
            </p>
            <Link
              href="/sos"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple to-purple-medium text-white rounded-xl font-semibold hover:scale-105 transition-transform"
            >
              Criar primeira solicitação
            </Link>
          </div>
        ) : (
          solicitacoesFiltradas.map((s: MinhaSolicitacao) => {
            const statusUi = STATUS_UI[s.status];
            const isUrgente = s.urgencia >= 3;
            const lojaDisplay =
              s.loja_nome && (s.cidade || s.estado)
                ? `${s.loja_nome} — ${[s.cidade, s.estado].filter(Boolean).join("/")}`
                : s.loja_nome ?? "—";
            return (
              <div
                key={s.id}
                className="bg-white rounded-2xl p-6 border border-gray-100 hover:border-purple/30 hover:shadow-xl transition-all group cursor-pointer"
              >
                <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start gap-4 mb-3">
                      <div className="w-12 h-12 rounded-xl bg-purple/10 flex items-center justify-center flex-shrink-0 group-hover:bg-purple/20 transition-colors">
                        {s.status === "concluido" ? (
                          <CheckCircle className="w-6 h-6 text-purple" />
                        ) : isUrgente ? (
                          <AlertCircle className="w-6 h-6 text-red-600" />
                        ) : (
                          <Clock className="w-6 h-6 text-purple" />
                        )}
                      </div>

                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-bold text-gray-900 group-hover:text-purple transition-colors">
                            {s.titulo}
                          </h3>
                          {isUrgente && s.status !== "concluido" && (
                            <span className="px-2 py-0.5 bg-red-100 text-red-700 text-xs font-semibold rounded-full">
                              Urgente
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-2 mb-3">
                          <Building2 className="w-4 h-4 text-gray-400" />
                          <span className="text-sm text-gray-600">{lojaDisplay}</span>
                          {s.categoria_nome && (
                            <>
                              <span className="text-gray-300">•</span>
                              <span className="text-sm text-gray-500">{s.categoria_nome}</span>
                            </>
                          )}
                        </div>

                        {s.descricao && (
                          <p className="text-sm text-gray-600 leading-relaxed mb-3">
                            {s.descricao}
                          </p>
                        )}

                        <div className="flex items-center gap-3">
                          <span
                            className={`px-3 py-1 text-xs font-semibold rounded-full border ${statusUi.color}`}
                          >
                            {s.propostas_count > 0 && s.status === "aberto"
                              ? `${s.propostas_count} proposta${s.propostas_count > 1 ? "s" : ""} recebida${s.propostas_count > 1 ? "s" : ""}`
                              : statusUi.label}
                          </span>
                          {s.propostas_count > 0 && s.status !== "concluido" && (
                            <span className="text-xs text-gray-500 flex items-center gap-1">
                              <MessageSquare className="w-3.5 h-3.5" />
                              {s.propostas_count}{" "}
                              {s.propostas_count === 1 ? "proposta" : "propostas"}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex lg:flex-col items-center lg:items-end gap-3 lg:gap-4">
                    <div className="flex items-center gap-1.5 text-gray-400">
                      <Clock className="w-4 h-4" />
                      <span className="text-xs">{formatTempoRelativo(s.created_at)}</span>
                    </div>

                    <button className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-purple hover:bg-purple/5 rounded-xl transition-colors">
                      Ver detalhes <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* CTA Bottom */}
      {solicitacoesFiltradas.length > 0 && (
        <div className="bg-gradient-to-br from-purple/5 to-purple-light/10 rounded-2xl p-8 border border-purple/20 text-center">
          <h3 className="text-xl font-bold text-gray-900 mb-2">Precisa de algo urgente?</h3>
          <p className="text-gray-600 mb-6">
            Use o SOS Conekta para enviar sua solicitação para todos os fornecedores de uma só vez
          </p>
          <Link
            href="/sos"
            className="inline-flex items-center gap-2 px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl font-semibold transition-colors"
          >
            <AlertCircle className="w-5 h-5" />
            Usar SOS Conekta
          </Link>
        </div>
      )}
    </div>
  );
}
