import { CreditCard, Zap, FileText, Lock, Wrench, CheckCircle, DollarSign, Shield, Users } from "lucide-react";

const beneficios = [
  {
    icon: CreditCard,
    label: "Parcelamento",
    desc: "Em até 12x no cartão de crédito",
    color: "text-blue-600",
    bg: "bg-blue-50",
    highlight: false,
  },
  {
    icon: Zap,
    label: "Pix",
    desc: "Receba na hora, sem taxas absurdas",
    color: "text-green-600",
    bg: "bg-green-50",
    highlight: false,
  },
  {
    icon: FileText,
    label: "Boleto",
    desc: "Para quem prefere pagar no banco",
    color: "text-purple-600",
    bg: "bg-purple-50",
    highlight: false,
  },
  {
    icon: Lock,
    label: "Conekta Lock",
    desc: "Segurança total na transação",
    color: "text-[#E05C1A]",
    bg: "bg-[#E05C1A]/10",
    highlight: true,
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
  return (
    <div className="flex flex-col gap-8 -mx-4 -mt-4">
      {/* Hero */}
      <div className="bg-gradient-to-b from-white to-gray-50 px-4 pt-8 pb-8">
        <div className="flex flex-col items-center text-center gap-3 max-w-md mx-auto">
          <span className="inline-flex items-center gap-2 bg-white border border-gray-200 text-[#E05C1A] text-xs font-bold px-3 py-1.5 rounded-full shadow-sm">
            💳 Conekta Pay
          </span>
          <h1 className="text-2xl font-black text-[#1A1A2E] leading-tight">
            Receba com segurança.<br />
            Pague com flexibilidade.
          </h1>
          <p className="text-sm text-gray-500 leading-relaxed">
            A solução de pagamentos integrada do Nex.to para serviços de manutenção
          </p>
        </div>
      </div>

      <div className="px-4 flex flex-col gap-8">
        {/* Cards de benefícios */}
        <div>
          <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wide mb-4">
            Formas de pagamento
          </h2>
          <div className="grid grid-cols-2 gap-3">
            {beneficios.map((b) => {
              const Icon = b.icon;
              return (
                <div
                  key={b.label}
                  className={`bg-white border ${
                    b.highlight
                      ? "border-[#E05C1A]/30 ring-1 ring-[#E05C1A]/20"
                      : "border-gray-100"
                  } rounded-2xl p-4 shadow-sm flex flex-col gap-3`}
                >
                  <div className={`w-9 h-9 rounded-xl ${b.bg} flex items-center justify-center`}>
                    <Icon className={`w-5 h-5 ${b.color}`} />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-[#1A1A2E]">{b.label}</p>
                    <p className="text-xs text-gray-500 mt-0.5 leading-snug">{b.desc}</p>
                  </div>
                  {b.highlight && (
                    <span className="text-[10px] font-bold text-[#E05C1A] bg-[#E05C1A]/10 px-2 py-0.5 rounded-full self-start">
                      DESTAQUE
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Seção Conekta Lock */}
        <div className="bg-gradient-to-br from-[#E05C1A] to-[#c54d15] rounded-3xl p-5 text-white">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center">
              <Lock className="w-7 h-7 text-white" />
            </div>
            <div>
              <p className="text-xs text-orange-200 font-semibold uppercase tracking-wide">Tecnologia exclusiva</p>
              <h3 className="text-lg font-black text-white leading-tight">
                Conekta Lock
              </h3>
            </div>
          </div>
          <p className="text-sm text-orange-100 font-semibold mb-5">
            A tecnologia que protege todo mundo
          </p>

          <div className="flex flex-col gap-3">
            {lockSteps.map((step, i) => {
              const Icon = step.icon;
              return (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Icon className="w-4 h-4 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-orange-300 font-bold">{i + 1}.</span>
                      <p className="text-sm text-white font-medium leading-snug">{step.label}</p>
                    </div>
                  </div>
                  {i < lockSteps.length - 1 && (
                    <div className="absolute ml-4 mt-8 h-3 w-px bg-white/30" />
                  )}
                </div>
              );
            })}
          </div>

          <div className="mt-5 pt-4 border-t border-white/20">
            <p className="text-xs text-orange-100 leading-relaxed">
              🔒 O pagamento fica em <strong>custódia segura</strong> até que AMBOS confirmem a conclusão. Sem risco para nenhum lado.
            </p>
          </div>
        </div>

        {/* Para quem é */}
        <div>
          <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wide mb-4">
            Para quem é
          </h2>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm">
              <div className="w-9 h-9 bg-blue-50 rounded-xl flex items-center justify-center mb-3">
                <Users className="w-5 h-5 text-blue-600" />
              </div>
              <p className="text-sm font-bold text-[#1A1A2E] mb-1">Para clientes</p>
              <p className="text-xs text-gray-500 leading-relaxed">
                Pague só quando o serviço estiver concluído. Sem risco de calote.
              </p>
            </div>
            <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm">
              <div className="w-9 h-9 bg-green-50 rounded-xl flex items-center justify-center mb-3">
                <Shield className="w-5 h-5 text-green-600" />
              </div>
              <p className="text-sm font-bold text-[#1A1A2E] mb-1">Para fornecedores</p>
              <p className="text-xs text-gray-500 leading-relaxed">
                Receba garantido. Sem inadimplência. Sem susto.
              </p>
            </div>
          </div>
        </div>

        {/* CTA final */}
        <div className="bg-[#1A1A2E] rounded-3xl p-6 flex flex-col gap-4 mb-4">
          <div className="text-center">
            <h3 className="text-xl font-black text-white mb-2">
              Ative o Conekta Pay na sua conta
            </h3>
            <p className="text-sm text-gray-400 leading-relaxed">
              Gratuito para ativar. Comissão só quando você recebe.
            </p>
          </div>
          <button className="w-full py-4 bg-[#E05C1A] hover:bg-[#c54d15] text-white font-bold rounded-xl text-base transition-colors">
            Ativar Conekta Pay →
          </button>
          <button className="text-xs text-gray-500 hover:text-gray-300 text-center transition-colors">
            Saber mais sobre taxas
          </button>
        </div>
      </div>
    </div>
  );
}
