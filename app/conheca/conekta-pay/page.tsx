"use client";

import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { CreditCard, Lock, Shield, DollarSign, CheckCircle, Zap, Clock, ArrowRight, Star } from "lucide-react";

const benefits = [
  {
    icon: CreditCard,
    title: "Parcelamento em até 12x",
    desc: "Seus clientes pagam parcelado no cartão de crédito, você recebe à vista",
  },
  {
    icon: Zap,
    title: "Pix Instantâneo",
    desc: "Receba pagamentos por Pix sem taxas absurdas",
  },
  {
    icon: Lock,
    title: "Conekta Lock",
    desc: "Pagamento só é liberado quando cliente E fornecedor confirmam o serviço concluído",
  },
  {
    icon: Shield,
    title: "Proteção Total",
    desc: "Sem risco de calote para fornecedores. Sem risco de pagar por serviço mal feito para clientes",
  },
];

const lockSteps = [
  {
    step: "1",
    title: "Cliente paga pelo serviço",
    desc: "Valor fica em custódia segura na plataforma",
  },
  {
    step: "2",
    title: "Fornecedor realiza o serviço",
    desc: "Executa o trabalho com tranquilidade, sabendo que o pagamento está garantido",
  },
  {
    step: "3",
    title: "Ambos confirmam a conclusão",
    desc: "Cliente e fornecedor confirmam que o serviço foi realizado corretamente",
  },
  {
    step: "4",
    title: "Dinheiro liberado automaticamente",
    desc: "Fornecedor recebe o pagamento direto na conta",
  },
];

const testimonials = [
  {
    name: "Roberto Souza",
    role: "TechBombas SP - Fornecedor",
    comment: "Antes perdia muito tempo cobrando clientes. Com o Conekta Pay, sei que vou receber assim que terminar o serviço. Mudou meu negócio!",
    rating: 5,
  },
  {
    name: "Fernanda Lima",
    role: "Posto Verde - Cliente",
    comment: "Parcelei uma manutenção cara em 6x sem juros. O Conekta Lock me deu segurança de que só pagaria quando o serviço estivesse perfeito.",
    rating: 5,
  },
];

export default function ConektaPayLandingPage() {
  return (
    <div className="bg-gray-50 min-h-screen">
      <Navbar />

      {/* Hero */}
      <section className="relative bg-gradient-to-b from-[#E05C1A] to-[#c54d15] text-white pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
            backgroundSize: '40px 40px'
          }} />
        </div>

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
              <CreditCard className="w-5 h-5" />
              <span className="font-semibold">Conekta Pay</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black mb-6 leading-tight">
              Receba com segurança.<br />
              <span className="text-orange-200">Pague com flexibilidade.</span>
            </h1>

            <p className="text-xl text-orange-100 mb-8 leading-relaxed">
              A solução de pagamentos que protege clientes e fornecedores com a tecnologia exclusiva Conekta Lock.
              Parcelamento, Pix e Boleto em uma plataforma segura.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                href="/login"
                className="px-8 py-4 bg-white text-[#E05C1A] rounded-xl font-bold text-lg hover:bg-gray-100 transition-colors shadow-xl flex items-center gap-2"
              >
                Ativar Conekta Pay
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                href="/cadastro"
                className="px-8 py-4 bg-white/10 backdrop-blur-sm border-2 border-white text-white rounded-xl font-bold text-lg hover:bg-white/20 transition-colors"
              >
                Criar Conta Grátis
              </Link>
            </div>

            <p className="text-sm text-orange-200 mt-4">
              Sem mensalidade. Comissão só quando você recebe.
            </p>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-black text-gray-900 mb-4">
              Por que usar Conekta Pay?
            </h2>
            <p className="text-xl text-gray-600">
              Pagamentos seguros para todos
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {benefits.map((benefit) => {
              const Icon = benefit.icon;
              return (
                <div key={benefit.title} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Icon className="w-6 h-6 text-[#E05C1A]" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2">
                        {benefit.title}
                      </h3>
                      <p className="text-gray-600 leading-relaxed">
                        {benefit.desc}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Conekta Lock Explanation */}
      <section className="py-20 bg-gradient-to-br from-[#E05C1A] to-[#c54d15] text-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full mb-4">
              <Lock className="w-5 h-5" />
              <span className="font-semibold">Tecnologia Exclusiva</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black mb-4">
              Conekta Lock: A tecnologia que protege todo mundo
            </h2>
            <p className="text-xl text-orange-100 max-w-3xl mx-auto">
              O pagamento fica em custódia segura até que ambas as partes confirmem a conclusão do serviço
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {lockSteps.map((item) => (
              <div key={item.step} className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                <div className="w-12 h-12 bg-white text-[#E05C1A] rounded-xl flex items-center justify-center text-xl font-black mb-4">
                  {item.step}
                </div>
                <h3 className="text-lg font-bold mb-2">
                  {item.title}
                </h3>
                <p className="text-orange-100 text-sm leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-12 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-8 max-w-3xl mx-auto">
            <div className="flex items-start gap-4">
              <Shield className="w-8 h-8 text-white flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-xl font-bold mb-2">Proteção garantida para ambos os lados</h3>
                <p className="text-orange-100 leading-relaxed">
                  Clientes não pagam por serviço mal feito. Fornecedores não trabalham de graça.
                  Com o Conekta Lock, ambos ficam protegidos e satisfeitos.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* For Who */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-black text-gray-900 mb-4">
              Para quem é o Conekta Pay?
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="bg-blue-50 rounded-2xl p-8 border border-blue-100">
              <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mb-4">
                <DollarSign className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Para Clientes</h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">Parcele em até 12x no cartão</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">Pague só quando o serviço estiver perfeito</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">Proteção contra serviços mal feitos</span>
                </li>
              </ul>
            </div>

            <div className="bg-green-50 rounded-2xl p-8 border border-green-100">
              <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mb-4">
                <Shield className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Para Fornecedores</h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">Receba garantido, sem inadimplência</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">Pagamento liberado rapidamente</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">Aumente suas vendas com parcelamento</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-black text-gray-900 mb-4">
              Quem usa, aprova
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {testimonials.map((testimonial) => (
              <div key={testimonial.name} className="bg-white rounded-2xl p-8 border border-gray-200 shadow-sm">
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-amber-500 text-amber-500" />
                  ))}
                </div>
                <p className="text-gray-700 leading-relaxed mb-4 text-lg">
                  "{testimonial.comment}"
                </p>
                <div>
                  <p className="font-bold text-gray-900">{testimonial.name}</p>
                  <p className="text-sm text-gray-500">{testimonial.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-20 bg-gradient-to-r from-[#E05C1A] to-[#c54d15] text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-3xl sm:text-4xl font-black mb-6">
            Pronto para pagamentos seguros e sem complicação?
          </h2>
          <p className="text-xl text-orange-100 mb-8">
            Ative o Conekta Pay agora e comece a receber com segurança
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/login"
              className="px-8 py-4 bg-white text-[#E05C1A] rounded-xl font-bold text-lg hover:bg-gray-100 transition-colors shadow-xl"
            >
              Ativar Conekta Pay
            </Link>
            <Link
              href="/cadastro"
              className="px-8 py-4 bg-white/10 backdrop-blur-sm border-2 border-white text-white rounded-xl font-bold text-lg hover:bg-white/20 transition-colors"
            >
              Criar Conta Grátis
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
