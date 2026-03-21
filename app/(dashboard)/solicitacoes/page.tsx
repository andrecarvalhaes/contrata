"use client";

import { useState } from "react";
import Link from "next/link";
import { Filter, Clock, CheckCircle, AlertCircle, Building2, ChevronRight, MessageSquare } from "lucide-react";

type FilterType = "todas" | "aguardando" | "propostas" | "andamento" | "concluidas";

const solicitacoes = [
  {
    id: 1,
    titulo: "Manutenção preventiva em bomba de combustível",
    loja: "Posto Exemplo - São Paulo/SP",
    categoria: "Bombas",
    status: "aguardando",
    statusLabel: "Aguardando propostas",
    statusColor: "bg-amber-100 text-amber-700 border-amber-200",
    tempo: "2 horas atrás",
    propostas: 0,
    urgencia: "normal",
    descricao: "Bomba apresentando ruído anormal durante operação. Necessária verificação técnica.",
  },
  {
    id: 2,
    titulo: "Serviço de elétrica automotiva",
    loja: "Auto Posto Centro - Campinas/SP",
    categoria: "Elétrica",
    status: "propostas",
    statusLabel: "2 propostas recebidas",
    statusColor: "bg-green-100 text-green-700 border-green-200",
    tempo: "1 dia atrás",
    propostas: 2,
    urgencia: "normal",
    descricao: "Instalação de sistema elétrico em novo ponto de abastecimento.",
  },
  {
    id: 3,
    titulo: "Inspeção técnica NR-13 completa",
    loja: "Posto BR Sul - Curitiba/PR",
    categoria: "Inspeções",
    status: "andamento",
    statusLabel: "Em andamento",
    statusColor: "bg-blue-100 text-blue-700 border-blue-200",
    tempo: "3 dias atrás",
    propostas: 1,
    urgencia: "alta",
    descricao: "Inspeção anual obrigatória dos tanques de combustível conforme NR-13.",
  },
  {
    id: 4,
    titulo: "Vazamento detectado no sistema hidráulico",
    loja: "Posto Exemplo - São Paulo/SP",
    categoria: "Hidráulica",
    status: "concluidas",
    statusLabel: "Concluído",
    statusColor: "bg-gray-100 text-gray-600 border-gray-200",
    tempo: "5 dias atrás",
    propostas: 3,
    urgencia: "alta",
    descricao: "Reparo de vazamento identificado na tubulação principal.",
  },
  {
    id: 5,
    titulo: "Calibração de dispensers",
    loja: "Auto Posto Centro - Campinas/SP",
    categoria: "Calibradores",
    status: "andamento",
    statusLabel: "Em andamento",
    statusColor: "bg-blue-100 text-blue-700 border-blue-200",
    tempo: "4 dias atrás",
    propostas: 1,
    urgencia: "normal",
    descricao: "Calibração periódica de todos os bicos de abastecimento.",
  },
  {
    id: 6,
    titulo: "Instalação de câmeras de segurança",
    loja: "Posto BR Sul - Curitiba/PR",
    categoria: "Segurança",
    status: "propostas",
    statusLabel: "4 propostas recebidas",
    statusColor: "bg-green-100 text-green-700 border-green-200",
    tempo: "6 dias atrás",
    propostas: 4,
    urgencia: "normal",
    descricao: "Instalação de sistema completo de CFTV com 8 câmeras.",
  },
];

const filters = [
  { id: "todas", label: "Todas", count: 6 },
  { id: "aguardando", label: "Aguardando", count: 1 },
  { id: "propostas", label: "Com propostas", count: 2 },
  { id: "andamento", label: "Em andamento", count: 2 },
  { id: "concluidas", label: "Concluídas", count: 1 },
];

export default function SolicitacoesPage() {
  const [filtroAtivo, setFiltroAtivo] = useState<FilterType>("todas");

  const solicitacoesFiltradas =
    filtroAtivo === "todas"
      ? solicitacoes
      : solicitacoes.filter((s) => s.status === filtroAtivo);

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Minhas Solicitações</h1>
          <p className="text-gray-600 mt-1">Acompanhe o status das suas demandas</p>
        </div>
        <Link
          href="/nova-solicitacao"
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
        {solicitacoesFiltradas.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-gray-100">
            <div className="w-16 h-16 bg-purple/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <MessageSquare className="w-8 h-8 text-purple" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Nenhuma solicitação encontrada</h3>
            <p className="text-gray-600 mb-6">Não há solicitações nesta categoria no momento</p>
            <Link
              href="/nova-solicitacao"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple to-purple-medium text-white rounded-xl font-semibold hover:scale-105 transition-transform"
            >
              Criar primeira solicitação
            </Link>
          </div>
        ) : (
          solicitacoesFiltradas.map((s) => (
            <div
              key={s.id}
              className="bg-white rounded-2xl p-6 border border-gray-100 hover:border-purple/30 hover:shadow-xl transition-all group cursor-pointer"
            >
              <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                {/* Conteúdo principal */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start gap-4 mb-3">
                    <div className="w-12 h-12 rounded-xl bg-purple/10 flex items-center justify-center flex-shrink-0 group-hover:bg-purple/20 transition-colors">
                      {s.status === "concluidas" ? (
                        <CheckCircle className="w-6 h-6 text-purple" />
                      ) : s.urgencia === "alta" ? (
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
                        {s.urgencia === "alta" && s.status !== "concluidas" && (
                          <span className="px-2 py-0.5 bg-red-100 text-red-700 text-xs font-semibold rounded-full">
                            Urgente
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-2 mb-3">
                        <Building2 className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-600">{s.loja}</span>
                        <span className="text-gray-300">•</span>
                        <span className="text-sm text-gray-500">{s.categoria}</span>
                      </div>

                      <p className="text-sm text-gray-600 leading-relaxed mb-3">
                        {s.descricao}
                      </p>

                      <div className="flex items-center gap-3">
                        <span className={`px-3 py-1 text-xs font-semibold rounded-full border ${s.statusColor}`}>
                          {s.statusLabel}
                        </span>
                        {s.propostas > 0 && s.status !== "concluidas" && (
                          <span className="text-xs text-gray-500 flex items-center gap-1">
                            <MessageSquare className="w-3.5 h-3.5" />
                            {s.propostas} {s.propostas === 1 ? "proposta" : "propostas"}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Sidebar */}
                <div className="flex lg:flex-col items-center lg:items-end gap-3 lg:gap-4">
                  <div className="flex items-center gap-1.5 text-gray-400">
                    <Clock className="w-4 h-4" />
                    <span className="text-xs">{s.tempo}</span>
                  </div>

                  <button className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-purple hover:bg-purple/5 rounded-xl transition-colors group-hover:translate-x-1 transition-transform">
                    Ver detalhes <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))
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
