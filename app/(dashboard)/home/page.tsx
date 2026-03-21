"use client";

import Link from "next/link";
import { Search, AlertTriangle, MessageSquare, ShoppingCart, CreditCard, Building2, Clock, TrendingUp, ChevronRight, Zap } from "lucide-react";

const quickActions = [
  {
    href: "/sos",
    icon: AlertTriangle,
    label: "SOS Conekta",
    desc: "Cotação urgente para todos os fornecedores",
    gradient: "from-red-500 to-red-600",
    bgGradient: "from-red-50 to-red-100",
    highlight: true,
  },
  {
    href: "/nova-solicitacao",
    icon: MessageSquare,
    label: "Nova Solicitação",
    desc: "Descreva e receba propostas personalizadas",
    gradient: "from-purple to-purple-medium",
    bgGradient: "from-purple/5 to-purple-light/10",
  },
  {
    href: "/shop",
    icon: ShoppingCart,
    label: "Shop Conekta",
    desc: "Produtos e peças para seu posto",
    gradient: "from-purple-medium to-purple-light",
    bgGradient: "from-purple/5 to-purple-light/10",
  },
  {
    href: "/conekta-pay",
    icon: CreditCard,
    label: "Conekta Pay",
    desc: "Pague com segurança e parcelamento",
    gradient: "from-purple to-purple-medium",
    bgGradient: "from-purple/5 to-purple-light/10",
  },
];

const lojas = [
  { id: 1, nome: "Posto Exemplo", cidade: "São Paulo/SP", solicitacoes: 12, ativas: 3 },
  { id: 2, nome: "Auto Posto Centro", cidade: "Campinas/SP", solicitacoes: 8, ativas: 1 },
  { id: 3, nome: "Posto BR Sul", cidade: "Curitiba/PR", solicitacoes: 15, ativas: 5 },
];

const solicitacoes = [
  {
    id: 1,
    titulo: "Manutenção em bomba de combustível",
    loja: "Posto Exemplo",
    status: "Aguardando propostas",
    statusColor: "bg-amber-100 text-amber-700 border-amber-200",
    tempo: "2h atrás",
    urgencia: "normal",
  },
  {
    id: 2,
    titulo: "Serviço de elétrica automotiva",
    loja: "Auto Posto Centro",
    status: "2 propostas",
    statusColor: "bg-green-100 text-green-700 border-green-200",
    tempo: "1 dia atrás",
    urgencia: "normal",
  },
  {
    id: 3,
    titulo: "Inspeção técnica NR-13",
    loja: "Posto BR Sul",
    status: "Em andamento",
    statusColor: "bg-blue-100 text-blue-700 border-blue-200",
    tempo: "3 dias atrás",
    urgencia: "alta",
  },
];

export default function HomePage() {
  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-purple via-purple-medium to-purple-light p-8 sm:p-12 text-white shadow-2xl shadow-purple/20">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl transform -translate-x-1/2 translate-y-1/2" />
        </div>

        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-4">
            <Zap className="w-5 h-5" />
            <span className="text-sm font-semibold tracking-wide uppercase opacity-90">Dashboard</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold mb-3 tracking-tight">
            Olá, João 👋
          </h1>
          <p className="text-lg opacity-90 mb-8 max-w-2xl">
            O que você precisa resolver hoje? Use a busca inteligente ou acesse rapidamente nossas ferramentas.
          </p>

          {/* Search Bar */}
          <div className="relative max-w-2xl">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Descreva o problema ou serviço que você precisa..."
              className="w-full pl-12 pr-32 py-4 rounded-2xl bg-white text-gray-900 text-base placeholder-gray-400 outline-none focus:ring-4 focus:ring-white/20 transition-all shadow-xl"
            />
            <button className="absolute right-2 top-1/2 -translate-y-1/2 px-6 py-2.5 bg-gradient-to-r from-purple to-purple-medium text-white rounded-xl font-semibold text-sm hover:scale-105 transition-transform shadow-lg">
              Buscar
            </button>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Acesso Rápido</h2>
            <p className="text-sm text-gray-600 mt-1">Ferramentas essenciais do Conekta</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <Link
                key={action.href}
                href={action.href}
                className={`group relative overflow-hidden bg-gradient-to-br ${action.bgGradient} rounded-2xl p-6 border border-purple/10 hover:border-purple/30 transition-all hover:scale-[1.02] hover:shadow-xl`}
              >
                {action.highlight && (
                  <div className="absolute top-3 right-3">
                    <span className="flex h-3 w-3">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                    </span>
                  </div>
                )}

                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${action.gradient} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>

                <h3 className="text-base font-bold text-gray-900 mb-1">
                  {action.label}
                </h3>
                <p className="text-sm text-gray-600 leading-snug">
                  {action.desc}
                </p>

                <div className="mt-4 flex items-center text-purple font-semibold text-sm group-hover:translate-x-1 transition-transform">
                  Acessar <ChevronRight className="w-4 h-4 ml-1" />
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Stats + Lojas */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Stats Cards */}
        <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-purple/10 flex items-center justify-center">
                <ClipboardList className="w-5 h-5 text-purple" />
              </div>
              <span className="text-2xl font-bold text-gray-900">12</span>
            </div>
            <p className="text-sm text-gray-600 font-medium">Solicitações ativas</p>
            <div className="flex items-center gap-1 mt-2 text-xs text-green-600">
              <TrendingUp className="w-3 h-3" />
              <span>+3 esta semana</span>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center">
                <MessageSquare className="w-5 h-5 text-green-600" />
              </div>
              <span className="text-2xl font-bold text-gray-900">8</span>
            </div>
            <p className="text-sm text-gray-600 font-medium">Propostas recebidas</p>
            <div className="flex items-center gap-1 mt-2 text-xs text-gray-500">
              <Clock className="w-3 h-3" />
              <span>Últimas 48h</span>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
                <Building2 className="w-5 h-5 text-blue-600" />
              </div>
              <span className="text-2xl font-bold text-gray-900">{lojas.length}</span>
            </div>
            <p className="text-sm text-gray-600 font-medium">Lojas cadastradas</p>
            <Link href="/lojas" className="text-xs text-purple font-semibold mt-2 inline-block hover:underline">
              Gerenciar →
            </Link>
          </div>
        </div>

        {/* Featured Loja */}
        <div className="bg-gradient-to-br from-purple/5 to-purple-light/10 rounded-2xl p-6 border border-purple/20">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Loja Principal</h3>
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          </div>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple to-purple-medium flex items-center justify-center shadow-lg shadow-purple/20">
              <Building2 className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="font-bold text-gray-900">{lojas[0].nome}</p>
              <p className="text-sm text-gray-600">{lojas[0].cidade}</p>
            </div>
          </div>
          <div className="flex gap-4 pt-4 border-t border-purple/10">
            <div>
              <p className="text-2xl font-bold text-purple">{lojas[0].solicitacoes}</p>
              <p className="text-xs text-gray-600">Total</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-green-600">{lojas[0].ativas}</p>
              <p className="text-xs text-gray-600">Ativas</p>
            </div>
          </div>
        </div>
      </div>

      {/* Solicitações Recentes */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Solicitações Recentes</h2>
            <p className="text-sm text-gray-600 mt-1">Acompanhe o status das suas demandas</p>
          </div>
          <Link href="/solicitacoes" className="text-sm text-purple font-semibold hover:underline flex items-center gap-1">
            Ver todas <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="space-y-3">
          {solicitacoes.map((s) => (
            <div
              key={s.id}
              className="bg-white rounded-2xl p-5 border border-gray-100 hover:border-purple/30 hover:shadow-lg transition-all group cursor-pointer"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-base font-semibold text-gray-900 group-hover:text-purple transition-colors">
                      {s.titulo}
                    </h3>
                    {s.urgencia === "alta" && (
                      <span className="flex-shrink-0 px-2 py-0.5 bg-red-100 text-red-700 text-xs font-semibold rounded-full">
                        Urgente
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600">{s.loja}</p>
                </div>

                <div className="flex flex-col items-end gap-2 flex-shrink-0">
                  <span className={`px-3 py-1 text-xs font-semibold rounded-full border ${s.statusColor}`}>
                    {s.status}
                  </span>
                  <div className="flex items-center gap-1.5 text-gray-400">
                    <Clock className="w-3.5 h-3.5" />
                    <span className="text-xs">{s.tempo}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Minhas Lojas - Horizontal Scroll */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Minhas Lojas</h2>
            <p className="text-sm text-gray-600 mt-1">Gerencie todos os seus estabelecimentos</p>
          </div>
          <button className="text-sm text-purple font-semibold hover:underline">
            + Adicionar Loja
          </button>
        </div>

        <div className="flex gap-4 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-thin scrollbar-thumb-purple/20 scrollbar-track-transparent">
          {lojas.map((loja) => (
            <div
              key={loja.id}
              className="flex-shrink-0 w-72 bg-white rounded-2xl p-6 border border-gray-100 hover:border-purple/30 hover:shadow-lg transition-all group cursor-pointer"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl bg-purple/10 flex items-center justify-center group-hover:bg-purple/20 transition-colors">
                  <Building2 className="w-6 h-6 text-purple" />
                </div>
                <div className="flex-1">
                  <p className="font-bold text-gray-900 group-hover:text-purple transition-colors">
                    {loja.nome}
                  </p>
                  <p className="text-sm text-gray-600">{loja.cidade}</p>
                </div>
              </div>

              <div className="flex gap-4 pb-4 mb-4 border-b border-gray-100">
                <div>
                  <p className="text-xl font-bold text-gray-900">{loja.solicitacoes}</p>
                  <p className="text-xs text-gray-600">Total</p>
                </div>
                <div>
                  <p className="text-xl font-bold text-purple">{loja.ativas}</p>
                  <p className="text-xs text-gray-600">Ativas</p>
                </div>
              </div>

              <button className="w-full py-2.5 text-sm font-semibold text-purple border border-purple rounded-xl hover:bg-purple hover:text-white transition-all">
                Ver solicitações
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
