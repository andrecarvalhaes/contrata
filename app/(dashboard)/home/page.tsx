"use client";

import Link from "next/link";
import { Search, MapPin, ChevronRight, AlertTriangle, MessageSquare, ShoppingCart, CreditCard, Building2, Clock } from "lucide-react";

const quickActions = [
  {
    href: "/sos",
    icon: AlertTriangle,
    label: "SOS Conekta",
    desc: "Urgência? Cotação imediata para todos os fornecedores",
    bg: "bg-[#DC2626]",
    textColor: "text-white",
    descColor: "text-red-100",
  },
  {
    href: "/nova-solicitacao",
    icon: MessageSquare,
    label: "Nova Solicitação",
    desc: "Descreva e receba propostas",
    bg: "bg-white",
    textColor: "text-[#1A1A2E]",
    descColor: "text-gray-500",
    border: true,
  },
  {
    href: "/shop",
    icon: ShoppingCart,
    label: "Shop Conekta",
    desc: "Produtos e peças para seu posto",
    bg: "bg-white",
    textColor: "text-[#1A1A2E]",
    descColor: "text-gray-500",
    border: true,
  },
  {
    href: "/conekta-pay",
    icon: CreditCard,
    label: "Conekta Pay",
    desc: "Pague com segurança e parcelado",
    bg: "bg-white",
    textColor: "text-[#1A1A2E]",
    descColor: "text-gray-500",
    border: true,
  },
];

const lojas = [
  { id: 1, nome: "Posto Exemplo", cidade: "São Paulo/SP" },
  { id: 2, nome: "Auto Posto Centro", cidade: "Campinas/SP" },
];

const solicitacoes = [
  {
    id: 1,
    titulo: "Bomba de combustível",
    loja: "Posto Exemplo",
    status: "Aguardando propostas",
    statusColor: "bg-yellow-100 text-yellow-700",
    tempo: "2h atrás",
  },
  {
    id: 2,
    titulo: "Elétrica automotiva",
    loja: "Auto Posto Centro",
    status: "2 propostas recebidas",
    statusColor: "bg-green-100 text-green-700",
    tempo: "1 dia atrás",
  },
  {
    id: 3,
    titulo: "Calibrador de pneus",
    loja: "Posto Exemplo",
    status: "Concluído",
    statusColor: "bg-gray-100 text-gray-600",
    tempo: "5 dias atrás",
  },
];

export default function HomePage() {
  return (
    <div className="flex flex-col gap-6 max-w-2xl mx-auto">
      {/* Boas-vindas */}
      <div>
        <h1 className="text-2xl font-bold text-[#1A1A2E]">
          Olá, João
        </h1>
        <p className="text-gray-500 text-sm mt-1">O que você precisa hoje?</p>
      </div>

      {/* Barra de busca */}
      <div className="flex gap-2">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Descreva o problema ou serviço que precisa..."
            className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 bg-white text-sm text-[#2D2D2D] placeholder-gray-400 outline-none focus:border-[#E05C1A] transition-colors"
          />
        </div>
        <button className="px-4 py-3 bg-[#E05C1A] hover:bg-[#c54d15] text-white rounded-xl font-semibold text-sm transition-colors flex items-center gap-1.5">
          <Search className="w-4 h-4" />
        </button>
      </div>

      {/* Cards de acesso rápido */}
      <div>
        <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wide mb-3">
          Acesso rápido
        </h2>
        <div className="grid grid-cols-2 gap-3">
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <Link
                key={action.href}
                href={action.href}
                className={`${action.bg} ${
                  action.border ? "border border-gray-100 shadow-sm" : ""
                } rounded-2xl p-4 flex flex-col gap-2 hover:scale-[1.02] transition-transform active:scale-[0.98]`}
              >
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                    action.bg === "bg-[#DC2626]"
                      ? "bg-white/20"
                      : "bg-[#E05C1A]/10"
                  }`}
                >
                  <Icon
                    className={`w-5 h-5 ${
                      action.bg === "bg-[#DC2626]"
                        ? "text-white"
                        : "text-[#E05C1A]"
                    }`}
                  />
                </div>
                <div>
                  <p className={`text-sm font-bold ${action.textColor}`}>
                    {action.label}
                  </p>
                  <p className={`text-xs mt-0.5 leading-snug ${action.descColor}`}>
                    {action.desc}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Minhas lojas */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wide">
            Minhas lojas
          </h2>
          <button className="text-xs text-[#E05C1A] font-semibold hover:underline">
            + Adicionar
          </button>
        </div>
        <div className="flex gap-3 overflow-x-auto pb-1 -mx-4 px-4 scrollbar-none">
          {lojas.map((loja) => (
            <div
              key={loja.id}
              className="flex-shrink-0 bg-white border border-gray-100 rounded-2xl p-4 shadow-sm w-52"
            >
              <div className="flex items-center gap-2.5 mb-3">
                <div className="w-9 h-9 rounded-xl bg-[#E05C1A]/10 flex items-center justify-center">
                  <Building2 className="w-5 h-5 text-[#E05C1A]" />
                </div>
                <div>
                  <p className="text-sm font-bold text-[#1A1A2E] leading-tight">
                    {loja.nome}
                  </p>
                  <div className="flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3 h-3 text-gray-400" />
                    <p className="text-xs text-gray-500">{loja.cidade}</p>
                  </div>
                </div>
              </div>
              <button className="w-full text-xs font-semibold text-[#E05C1A] border border-[#E05C1A] rounded-lg py-1.5 hover:bg-[#E05C1A]/5 transition-colors">
                Ver solicitações
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Solicitações recentes */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wide">
            Solicitações recentes
          </h2>
          <Link href="/solicitacoes" className="text-xs text-[#E05C1A] font-semibold hover:underline flex items-center gap-0.5">
            Ver todas <ChevronRight className="w-3 h-3" />
          </Link>
        </div>
        <div className="flex flex-col gap-2.5">
          {solicitacoes.map((s) => (
            <div
              key={s.id}
              className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm flex items-center justify-between gap-3"
            >
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-[#1A1A2E] truncate">
                  {s.titulo}
                </p>
                <p className="text-xs text-gray-500 mt-0.5">{s.loja}</p>
              </div>
              <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
                <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${s.statusColor}`}>
                  {s.status}
                </span>
                <div className="flex items-center gap-1 text-gray-400">
                  <Clock className="w-3 h-3" />
                  <span className="text-[11px]">{s.tempo}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
