"use client";

import Link from "next/link";
import {
  Megaphone,
  Target,
  MessageSquare,
  Wallet,
  TrendingUp,
  Eye,
  Users,
  DollarSign,
  ArrowUpRight,
  Sparkles,
} from "lucide-react";
import { useAuthContext } from "@/components/providers/AuthProvider";

interface Kpi {
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  value: string;
  hint: string;
}

const kpis: Kpi[] = [
  { label: "Visualizações", icon: Eye, value: "—", hint: "Últimos 30 dias" },
  { label: "Leads recebidos", icon: Users, value: "—", hint: "Aguardando resposta" },
  { label: "Taxa de conversão", icon: TrendingUp, value: "—", hint: "Propostas aceitas" },
  { label: "Receita no mês", icon: DollarSign, value: "—", hint: "Conekta Lock + liberado" },
];

interface QuickCard {
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  desc: string;
}

const quickCards: QuickCard[] = [
  {
    href: "/parceiro/anuncios",
    icon: Megaphone,
    title: "Meus Anúncios",
    desc: "Crie, edite e acompanhe a performance das suas ofertas.",
  },
  {
    href: "/parceiro/leads",
    icon: Target,
    title: "Leads",
    desc: "Veja postos interessados e envie propostas com Conekta Lock.",
  },
  {
    href: "/parceiro/mensagens",
    icon: MessageSquare,
    title: "Mensagens",
    desc: "Chat em tempo real com os postos em negociação.",
  },
  {
    href: "/parceiro/financeiro",
    icon: Wallet,
    title: "Financeiro",
    desc: "Extrato, recebimentos, Conekta Lock e plano de assinatura.",
  },
];

export default function ParceiroHomePage() {
  const { profile } = useAuthContext();
  const nome =
    profile?.display_name?.split(" ")[0] ||
    profile?.email?.split("@")[0] ||
    "parceiro";

  return (
    <div className="mx-auto w-full max-w-6xl space-y-8">
      {/* Saudação */}
      <header className="flex flex-col gap-2">
        <div className="inline-flex items-center gap-2 text-purple">
          <Sparkles className="w-4 h-4" />
          <span className="text-xs font-semibold uppercase tracking-wider">
            Área do Parceiro
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 font-display">
          Olá, <span className="text-purple">{nome}</span>
        </h1>
        <p className="text-sm text-gray-600">
          Acompanhe seus anúncios, leads e recebimentos num só lugar.
        </p>
      </header>

      {/* KPIs */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {kpis.map((kpi) => {
          const Icon = kpi.icon;
          return (
            <div
              key={kpi.label}
              className="rounded-2xl border border-purple/10 bg-white p-4 sm:p-5 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="w-9 h-9 rounded-xl bg-purple/10 flex items-center justify-center">
                  <Icon className="w-4 h-4 text-purple" />
                </div>
              </div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                {kpi.label}
              </p>
              <p className="mt-1 text-2xl sm:text-3xl font-bold text-gray-900 font-display">
                {kpi.value}
              </p>
              <p className="mt-1 text-xs text-gray-500">{kpi.hint}</p>
            </div>
          );
        })}
      </section>

      {/* Aviso de construção */}
      <section className="rounded-2xl border border-purple/20 bg-gradient-to-br from-purple/5 to-purple-light/5 p-5 sm:p-6">
        <p className="text-sm text-gray-700">
          <strong className="text-purple">Em construção.</strong> Os KPIs e os
          módulos abaixo estão sendo implementados por grupo. Enquanto isso, você
          pode navegar pelas seções para acompanhar o progresso.
        </p>
      </section>

      {/* Atalhos */}
      <section className="space-y-3">
        <h2 className="text-lg font-bold text-gray-900 font-display">
          Seções da sua área
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          {quickCards.map((card) => {
            const Icon = card.icon;
            return (
              <Link
                key={card.href}
                href={card.href}
                className="group rounded-2xl border border-gray-100 bg-white p-5 shadow-sm hover:shadow-md hover:border-purple/30 transition-all"
              >
                <div className="flex items-start gap-4">
                  <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-purple to-purple-medium flex items-center justify-center flex-shrink-0 shadow-lg shadow-purple/20">
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <h3 className="text-base font-bold text-gray-900">
                        {card.title}
                      </h3>
                      <ArrowUpRight className="w-4 h-4 text-gray-400 group-hover:text-purple transition-colors" />
                    </div>
                    <p className="mt-1 text-sm text-gray-600">{card.desc}</p>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </section>
    </div>
  );
}
