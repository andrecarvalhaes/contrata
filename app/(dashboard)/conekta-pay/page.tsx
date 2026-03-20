import { CreditCard, Zap, FileText, Lock, Wrench, CheckCircle, DollarSign, Shield, Users } from "lucide-react";

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
  return (
    <div className="max-w-6xl mx-auto">
      {/* Hero */}
      <div className="bg-gradient-to-br from-[#E05C1A] to-[#c54d15] rounded-2xl p-8 sm:p-12 mb-8 shadow-lg">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full mb-4">
            <CreditCard className="w-5 h-5 text-white" />
            <span className="font-semibold text-white text-sm">Conekta Pay</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white leading-tight mb-4">
            Receba com segurança.<br />
            Pague com flexibilidade.
          </h1>
          <p className="text-lg text-orange-100 leading-relaxed">
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

      {/* CTA final */}
      <div className="bg-gradient-to-br from-[#1A1A2E] to-[#2D2D3E] rounded-2xl p-8 sm:p-10 shadow-lg">
        <div className="text-center max-w-2xl mx-auto">
          <h3 className="text-2xl sm:text-3xl font-black text-white mb-3">
            Ative o Conekta Pay na sua conta
          </h3>
          <p className="text-base text-gray-400 leading-relaxed mb-6">
            Gratuito para ativar. Comissão só quando você recebe.
          </p>
          <button className="w-full sm:w-auto px-8 py-4 bg-[#E05C1A] hover:bg-[#c54d15] text-white font-bold rounded-xl text-base transition-colors shadow-lg">
            Ativar Conekta Pay
          </button>
          <button className="block mx-auto mt-4 text-sm text-gray-500 hover:text-gray-300 transition-colors">
            Saber mais sobre taxas
          </button>
        </div>
      </div>
    </div>
  );
}
