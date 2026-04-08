"use client";

import { CreditCard, Zap, FileText, Lock, Wrench, CheckCircle, DollarSign, Shield, Users, Receipt } from "lucide-react";
import { useMinhasTransacoes, type PayStatus, type PayMetodo } from "@/lib/data/queries";

const STATUS_LABEL: Record<PayStatus, { label: string; color: string }> = {
  pendente: { label: "Pendente", color: "bg-amber-100 text-amber-700 border-amber-200" },
  autorizada: { label: "Autorizada", color: "bg-blue-100 text-blue-700 border-blue-200" },
  capturada: { label: "Capturada", color: "bg-blue-100 text-blue-700 border-blue-200" },
  em_garantia: { label: "Em custódia (Lock)", color: "bg-purple-100 text-purple-700 border-purple-200" },
  liberada: { label: "Liberada", color: "bg-green-100 text-green-700 border-green-200" },
  reembolsada: { label: "Reembolsada", color: "bg-gray-100 text-gray-600 border-gray-200" },
  falhou: { label: "Falhou", color: "bg-red-100 text-red-700 border-red-200" },
  cancelada: { label: "Cancelada", color: "bg-gray-100 text-gray-600 border-gray-200" },
};

const METODO_LABEL: Record<PayMetodo, string> = {
  cartao: "Cartão",
  pix: "Pix",
  boleto: "Boleto",
};

function formatMoeda(centavos: number, moeda = "BRL"): string {
  return (centavos / 100).toLocaleString("pt-BR", {
    style: "currency",
    currency: moeda,
  });
}

function formatData(iso: string): string {
  return new Date(iso).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

const beneficios = [
  {
    icon: CreditCard,
    label: "Parcelamento",
    desc: "Em até 12x no cartão de crédito",
    color: "text-blue-600",
    bg: "bg-blue-50",
    borderColor: "border-blue-100",
  },
  {
    icon: Zap,
    label: "Pix",
    desc: "Receba na hora, sem taxas absurdas",
    color: "text-green-600",
    bg: "bg-green-50",
    borderColor: "border-green-100",
  },
  {
    icon: FileText,
    label: "Boleto",
    desc: "Para quem prefere pagar no banco",
    color: "text-purple-600",
    bg: "bg-purple-50",
    borderColor: "border-purple-100",
  },
  {
    icon: Lock,
    label: "Conekta Lock",
    desc: "Segurança total na transação",
    color: "text-[#E05C1A]",
    bg: "bg-[#E05C1A]/10",
    borderColor: "border-[#E05C1A]/20",
  },
];

const lockSteps = [
  {
    icon: Wrench,
    label: "Fornecedor realiza o serviço",
    bg: "bg-orange-100",
    color: "text-[#E05C1A]",
  },
  {
    icon: CheckCircle,
    label: "Cliente e fornecedor confirmam que o serviço foi feito",
    bg: "bg-blue-100",
    color: "text-blue-600",
  },
  {
    icon: DollarSign,
    label: "Dinheiro liberado automaticamente para o fornecedor",
    bg: "bg-green-100",
    color: "text-green-600",
  },
];

export default function ConektaPayPage() {
  const { data: transacoes, isLoading: loadingTransacoes, error: errorTransacoes } = useMinhasTransacoes();

  return (
    <div className="max-w-6xl mx-auto">
      {/* Hero */}
      <div className="bg-gradient-to-br from-purple via-purple-medium to-purple-light rounded-2xl p-8 sm:p-12 mb-8 shadow-2xl shadow-purple/20">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full mb-4">
            <CreditCard className="w-5 h-5 text-white" />
            <span className="font-semibold text-white text-sm">Conekta Pay</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white leading-tight mb-4">
            Receba com segurança.<br />
            Pague com flexibilidade.
          </h1>
          <p className="text-lg text-purple-100 leading-relaxed">
            A solução de pagamentos integrada do Conekta para serviços de manutenção
          </p>
        </div>
      </div>

      {/* Cards de benefícios */}
      <div className="mb-10">
        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-5">
          Formas de pagamento
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {beneficios.map((b) => {
            const Icon = b.icon;
            return (
              <div
                key={b.label}
                className={`bg-white border ${b.borderColor} rounded-xl p-5 shadow-sm hover:shadow-md transition-all`}
              >
                <div className={`w-12 h-12 rounded-xl ${b.bg} flex items-center justify-center mb-4`}>
                  <Icon className={`w-6 h-6 ${b.color}`} />
                </div>
                <p className="text-base font-bold text-[#1A1A2E] mb-1">{b.label}</p>
                <p className="text-sm text-gray-600 leading-relaxed">{b.desc}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Seção Conekta Lock */}
      <div className="bg-gradient-to-br from-[#E05C1A] to-[#c54d15] rounded-2xl p-8 sm:p-10 text-white mb-10 shadow-lg">
        <div className="flex items-start gap-4 mb-6">
          <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center flex-shrink-0">
            <Lock className="w-8 h-8 text-white" />
          </div>
          <div>
            <p className="text-sm text-orange-200 font-semibold uppercase tracking-wide mb-1">Tecnologia exclusiva</p>
            <h3 className="text-2xl sm:text-3xl font-black text-white leading-tight mb-2">
              Conekta Lock
            </h3>
            <p className="text-base text-orange-100 font-medium">
              A tecnologia que protege todo mundo
            </p>
          </div>
        </div>

        <div className="grid sm:grid-cols-3 gap-4 mb-6">
          {lockSteps.map((step, i) => {
            const Icon = step.icon;
            return (
              <div key={i} className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-5">
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <div className="w-6 h-6 bg-white text-[#E05C1A] rounded-full flex items-center justify-center text-sm font-black flex-shrink-0">
                    {i + 1}
                  </div>
                </div>
                <p className="text-sm text-white font-medium leading-relaxed">{step.label}</p>
              </div>
            );
          })}
        </div>

        <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-5 flex items-start gap-4">
          <Shield className="w-6 h-6 text-white flex-shrink-0 mt-0.5" />
          <p className="text-sm text-orange-100 leading-relaxed">
            O pagamento fica em <strong className="text-white">custódia segura</strong> até que AMBOS confirmem a conclusão. Sem risco para nenhum lado.
          </p>
        </div>
      </div>

      {/* Para quem é */}
      <div className="mb-10">
        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-5">
          Para quem é
        </h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-blue-50 border border-blue-100 rounded-xl p-6 shadow-sm">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
            <p className="text-lg font-bold text-[#1A1A2E] mb-3">Para clientes</p>
            <p className="text-sm text-gray-700 leading-relaxed">
              Pague só quando o serviço estiver concluído. Sem risco de calote.
            </p>
          </div>
          <div className="bg-green-50 border border-green-100 rounded-xl p-6 shadow-sm">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-4">
              <Shield className="w-6 h-6 text-green-600" />
            </div>
            <p className="text-lg font-bold text-[#1A1A2E] mb-3">Para fornecedores</p>
            <p className="text-sm text-gray-700 leading-relaxed">
              Receba garantido. Sem inadimplência. Sem susto.
            </p>
          </div>
        </div>
      </div>

      {/* Minhas transações */}
      <div className="mb-10">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide flex items-center gap-2">
            <Receipt className="w-4 h-4" />
            Minhas transações
          </h2>
          {transacoes && transacoes.length > 0 && (
            <span className="text-xs text-gray-400">
              {transacoes.length} {transacoes.length === 1 ? "transação" : "transações"}
            </span>
          )}
        </div>

        {loadingTransacoes ? (
          <div className="bg-white border border-gray-100 rounded-2xl">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-16 border-b border-gray-100 last:border-0 animate-pulse" />
            ))}
          </div>
        ) : errorTransacoes ? (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-sm text-red-600">
            Erro ao carregar transações: {(errorTransacoes as Error).message}
          </div>
        ) : !transacoes || transacoes.length === 0 ? (
          <div className="bg-white border border-gray-100 rounded-2xl p-10 text-center">
            <div className="w-14 h-14 bg-purple/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Receipt className="w-7 h-7 text-purple" />
            </div>
            <h3 className="text-base font-bold text-gray-900 mb-1">Nenhuma transação ainda</h3>
            <p className="text-sm text-gray-500">
              Quando você fizer ou receber um pagamento pelo Conekta Pay, ele aparecerá aqui.
            </p>
          </div>
        ) : (
          <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden">
            <div className="hidden sm:grid grid-cols-[1fr_120px_100px_160px_120px] gap-4 px-5 py-3 bg-gray-50 text-xs font-semibold text-gray-500 uppercase tracking-wide">
              <span>Referência</span>
              <span>Método</span>
              <span className="text-right">Valor</span>
              <span>Status</span>
              <span className="text-right">Data</span>
            </div>
            {transacoes.map((t) => {
              const status = STATUS_LABEL[t.status];
              return (
                <div
                  key={t.id}
                  className="grid grid-cols-1 sm:grid-cols-[1fr_120px_100px_160px_120px] gap-2 sm:gap-4 px-5 py-4 border-t border-gray-100 items-start sm:items-center"
                >
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-gray-900 truncate">
                      {t.referencia || "Transação"}
                    </p>
                    {t.contraparte && (
                      <p className="text-xs text-gray-500 truncate">{t.contraparte}</p>
                    )}
                  </div>
                  <div className="text-sm text-gray-600">{METODO_LABEL[t.metodo]}</div>
                  <div className="text-sm font-bold text-gray-900 sm:text-right">
                    {formatMoeda(t.valor_centavos, t.moeda)}
                  </div>
                  <div>
                    <span
                      className={`inline-block px-2.5 py-1 text-xs font-semibold rounded-full border ${status.color}`}
                    >
                      {status.label}
                    </span>
                    {t.conekta_lock && t.status === "em_garantia" && (
                      <span className="ml-1.5 inline-flex items-center gap-1 text-[10px] text-purple font-medium">
                        <Lock className="w-2.5 h-2.5" />
                        Lock
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-gray-500 sm:text-right">
                    {formatData(t.created_at)}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* CTA final */}
      <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-8 sm:p-10 shadow-lg relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-purple rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-light rounded-full blur-3xl transform -translate-x-1/2 translate-y-1/2" />
        </div>
        <div className="text-center max-w-2xl mx-auto relative z-10">
          <h3 className="text-2xl sm:text-3xl font-black text-white mb-3">
            Ative o Conekta Pay na sua conta
          </h3>
          <p className="text-base text-gray-400 leading-relaxed mb-6">
            Gratuito para ativar. Comissão só quando você recebe.
          </p>
          <button className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-purple to-purple-medium hover:from-purple-medium hover:to-purple text-white font-bold rounded-xl text-base transition-all shadow-lg shadow-purple/30 hover:scale-105">
            Ativar Conekta Pay
          </button>
          <button className="block mx-auto mt-4 text-sm text-gray-400 hover:text-gray-300 transition-colors">
            Saber mais sobre taxas
          </button>
        </div>
      </div>
    </div>
  );
}
