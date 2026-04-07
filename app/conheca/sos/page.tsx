"use client";

import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { AlertTriangle, CheckCircle, Clock, Users, Zap, ArrowRight, Star } from "lucide-react";

const features = [
  {
    icon: Zap,
    title: "Disparo Simultâneo",
    desc: "Sua solicitação é enviada para TODOS os fornecedores verificados da sua cidade ao mesmo tempo",
  },
  {
    icon: Clock,
    title: "Resposta Rápida",
    desc: "Primeira proposta em média de 8 minutos. Sem perder tempo entrando em contato um por um",
  },
  {
    icon: Users,
    title: "Múltiplas Propostas",
    desc: "Compare preços, prazos e avaliações de todos os fornecedores disponíveis",
  },
  {
    icon: CheckCircle,
    title: "Fornecedores Verificados",
    desc: "Todos os profissionais são verificados e avaliados pela comunidade",
  },
];

const steps = [
  {
    number: "1",
    title: "Descreva a urgência",
    desc: "Conte qual é o problema e a categoria do serviço que precisa",
  },
  {
    number: "2",
    title: "Pagamento único de R$ 47,90",
    desc: "Valor fixo para disparar para todos os fornecedores. Sem taxas por proposta recebida",
  },
  {
    number: "3",
    title: "Receba propostas em tempo real",
    desc: "Os fornecedores respondem rapidamente e você escolhe a melhor opção",
  },
  {
    number: "4",
    title: "Contrate com segurança",
    desc: "Use o Conekta Pay para garantir pagamento seguro e satisfação garantida",
  },
];

const testimonials = [
  {
    name: "Carlos Mendes",
    role: "Gerente - Posto Exemplo",
    comment: "A bomba parou de funcionar às 6h da manhã. Usei o SOS Conekta e em 15 minutos já tinha 8 propostas. Serviço resolvido antes do horário de pico!",
    rating: 5,
  },
  {
    name: "Ana Paula",
    role: "Proprietária - Auto Posto Centro",
    comment: "Economizei 40% comparando as propostas. Além disso, o fornecedor chegou em 1 hora. Valeu muito a pena!",
    rating: 5,
  },
];

export default function SOSLandingPage() {
  return (
    <div className="bg-gray-50 min-h-screen">
      <Navbar />

      {/* Hero */}
      <section className="relative bg-gradient-to-b from-[#DC2626] to-[#991b1b] text-white pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
            backgroundSize: '40px 40px'
          }} />
        </div>

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
              <AlertTriangle className="w-5 h-5" />
              <span className="font-semibold">SOS Conekta</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black mb-6 leading-tight">
              Urgência no posto?<br />
              <span className="text-red-200">Cotação imediata</span> com todos os fornecedores
            </h1>

            <p className="text-xl text-red-100 mb-8 leading-relaxed">
              Dispare sua solicitação para TODOS os fornecedores da sua região simultaneamente.
              Receba múltiplas propostas em minutos e escolha a melhor opção.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                href="/login"
                className="px-8 py-4 bg-white text-[#DC2626] rounded-xl font-bold text-lg hover:bg-gray-100 transition-colors shadow-xl flex items-center gap-2"
              >
                Usar SOS Conekta Agora
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                href="/cadastro"
                className="px-8 py-4 bg-white/10 backdrop-blur-sm border-2 border-white text-white rounded-xl font-bold text-lg hover:bg-white/20 transition-colors"
              >
                Criar Conta Grátis
              </Link>
            </div>

            <p className="text-sm text-red-200 mt-4">
              Primeira proposta em média de 8 minutos
            </p>
          </div>
        </div>
      </section>

      {/* Como Funciona */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-black text-gray-900 mb-4">
              Como funciona o SOS Conekta?
            </h2>
            <p className="text-xl text-gray-600">
              Simples, rápido e eficiente
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step) => (
              <div key={step.number} className="relative">
                <div className="flex flex-col items-center text-center">
                  <div className="w-16 h-16 bg-[#DC2626] text-white rounded-2xl flex items-center justify-center text-2xl font-black mb-4">
                    {step.number}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {step.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {step.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-black text-gray-900 mb-4">
              Por que usar o SOS Conekta?
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <div key={feature.title} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Icon className="w-6 h-6 text-[#DC2626]" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2">
                        {feature.title}
                      </h3>
                      <p className="text-gray-600 leading-relaxed">
                        {feature.desc}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-black text-gray-900 mb-4">
              O que nossos clientes dizem
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {testimonials.map((testimonial) => (
              <div key={testimonial.name} className="bg-gray-50 rounded-2xl p-8 border border-gray-200">
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-amber-500 text-amber-500" />
                  ))}
                </div>
                <p className="text-gray-700 leading-relaxed mb-4 text-lg">
                  &ldquo;{testimonial.comment}&rdquo;
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
      <section className="py-20 bg-gradient-to-r from-[#DC2626] to-[#991b1b] text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-3xl sm:text-4xl font-black mb-6">
            Pronto para resolver sua urgência em minutos?
          </h2>
          <p className="text-xl text-red-100 mb-8">
            Junte-se a centenas de postos que já usam o SOS Conekta
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/login"
              className="px-8 py-4 bg-white text-[#DC2626] rounded-xl font-bold text-lg hover:bg-gray-100 transition-colors shadow-xl"
            >
              Começar Agora
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
