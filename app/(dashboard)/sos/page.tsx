"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AlertTriangle, ChevronRight, Star, Info, X, CheckCircle } from "lucide-react";

const fornecedores = [
  { nome: "TechBombas SP", especialidade: "Bombas de combustível", cidade: "São Paulo", rating: 4.8 },
  { nome: "Eletro Postos Ltda", especialidade: "Elétrica automotiva", cidade: "São Paulo", rating: 4.6 },
  { nome: "Hidra Service", especialidade: "Hidráulica", cidade: "São Paulo", rating: 4.5 },
];

const categorias = [
  "Bombas", "Elétrica", "Hidráulica", "Calibradores",
  "Filtragem", "Segurança", "Civil", "Outros",
];

const lojas = ["Posto Exemplo", "Auto Posto Centro"];

function StarRating({ value }: { value: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          className={`w-3.5 h-3.5 ${i <= Math.round(value) ? "fill-yellow-400 text-yellow-400" : "text-gray-200 fill-gray-200"}`}
        />
      ))}
      <span className="text-xs font-semibold text-gray-700 ml-1">{value}</span>
    </div>
  );
}

function HowItWorksModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40" onClick={onClose}>
      <div
        className="w-full max-w-2xl bg-white rounded-t-3xl p-6 pb-10"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-lg font-bold text-[#1A1A2E]">Como funciona o SOS Conekta?</h3>
          <button onClick={onClose} className="p-1.5 rounded-full hover:bg-gray-100">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>
        <div className="flex flex-col gap-4">
          {[
            { n: "1", title: "Descreva a urgência", desc: "Informe o problema e a categoria do serviço." },
            { n: "2", title: "Disparo simultâneo", desc: "Sua solicitação é enviada para TODOS os fornecedores verificados da sua cidade de uma vez." },
            { n: "3", title: "Receba propostas em tempo real", desc: "Os fornecedores respondem e você escolhe a melhor opção." },
            { n: "4", title: "Pagamento seguro", desc: "Use o Conekta Pay com Conekta Lock para garantir que você paga só após o serviço concluído." },
          ].map((step) => (
            <div key={step.n} className="flex gap-3 items-start">
              <div className="w-8 h-8 rounded-full bg-[#DC2626] text-white text-sm font-bold flex items-center justify-center flex-shrink-0">
                {step.n}
              </div>
              <div>
                <p className="text-sm font-semibold text-[#1A1A2E]">{step.title}</p>
                <p className="text-xs text-gray-500 mt-0.5">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function SOSPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [descricao, setDescricao] = useState("");
  const [loja, setLoja] = useState("");
  const [categoria, setCategoria] = useState("");
  const [showModal, setShowModal] = useState(false);

  const canProceed = descricao.trim() && loja && categoria;

  return (
    <div className="flex flex-col gap-0 -mx-4 -mt-4">
      {/* Hero urgente */}
      <div className="bg-[#DC2626] px-4 pt-6 pb-5">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
            <AlertTriangle className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">🚨 SOS Conekta</h1>
            <p className="text-red-100 text-xs">Cotação imediata para todos os fornecedores</p>
          </div>
        </div>

        {/* Steps indicator */}
        <div className="flex items-center gap-2 mt-4">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex items-center gap-2">
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                  step >= s ? "bg-white text-[#DC2626]" : "bg-white/30 text-white"
                }`}
              >
                {step > s ? <CheckCircle className="w-4 h-4 text-[#DC2626]" /> : s}
              </div>
              {s < 3 && (
                <div className={`flex-1 h-0.5 w-8 ${step > s ? "bg-white" : "bg-white/30"}`} />
              )}
            </div>
          ))}
          <span className="text-white/80 text-xs ml-2">
            {step === 1 && "Urgência"}
            {step === 2 && "Confirmação"}
            {step === 3 && "Enviado!"}
          </span>
        </div>
      </div>

      {/* Conteúdo dos steps */}
      <div className="px-4 py-5 flex flex-col gap-5">

        {/* STEP 1 */}
        {step === 1 && (
          <>
            <div className="flex flex-col gap-4">
              {/* Textarea */}
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-semibold text-[#1A1A2E]">
                  Qual é a urgência?
                </label>
                <textarea
                  value={descricao}
                  onChange={(e) => setDescricao(e.target.value)}
                  rows={4}
                  placeholder="Ex: Bomba de combustível parou de funcionar, perda total de produção..."
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-sm text-[#2D2D2D] placeholder-gray-400 outline-none focus:border-[#DC2626] resize-none transition-colors"
                />
              </div>

              {/* Select loja */}
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-semibold text-[#1A1A2E]">Qual loja?</label>
                <select
                  value={loja}
                  onChange={(e) => setLoja(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-sm text-[#2D2D2D] outline-none focus:border-[#DC2626] transition-colors"
                >
                  <option value="">Selecione a loja</option>
                  {lojas.map((l) => (
                    <option key={l} value={l}>{l}</option>
                  ))}
                </select>
              </div>

              {/* Select categoria */}
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-semibold text-[#1A1A2E]">Categoria do serviço</label>
                <select
                  value={categoria}
                  onChange={(e) => setCategoria(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-sm text-[#2D2D2D] outline-none focus:border-[#DC2626] transition-colors"
                >
                  <option value="">Selecione a categoria</option>
                  {categorias.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              {/* Info box */}
              <div className="flex gap-3 bg-blue-50 border border-blue-100 rounded-xl p-3.5">
                <Info className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-blue-700 leading-relaxed">
                  Sua solicitação será enviada automaticamente para <strong>TODOS</strong> os fornecedores verificados que atendem sua cidade. Você receberá as propostas em tempo real.
                </p>
              </div>
            </div>

            <button
              onClick={() => canProceed && setStep(2)}
              disabled={!canProceed}
              className="w-full flex items-center justify-center gap-2 py-3.5 bg-[#DC2626] hover:bg-red-700 text-white font-bold rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Ver fornecedores disponíveis
              <ChevronRight className="w-4 h-4" />
            </button>
          </>
        )}

        {/* STEP 2 */}
        {step === 2 && (
          <>
            {/* Resumo */}
            <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Resumo da solicitação</p>
              <p className="text-sm text-[#2D2D2D] leading-relaxed">{descricao}</p>
              <div className="flex gap-2 mt-2">
                <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">{loja}</span>
                <span className="text-xs bg-[#E05C1A]/10 text-[#E05C1A] px-2 py-1 rounded-full">{categoria}</span>
              </div>
            </div>

            {/* Box fornecedores */}
            <div className="bg-green-50 border border-green-100 rounded-2xl p-4">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <span className="text-lg font-black text-green-700">12</span>
                </div>
                <p className="text-sm font-bold text-green-800">
                  fornecedores encontrados em São Paulo, SP
                </p>
              </div>
              <div className="flex flex-col gap-2.5">
                {fornecedores.map((f) => (
                  <div key={f.nome} className="flex items-center justify-between bg-white rounded-xl p-3 shadow-sm">
                    <div>
                      <p className="text-sm font-semibold text-[#1A1A2E]">{f.nome}</p>
                      <p className="text-xs text-gray-500">{f.especialidade} · {f.cidade}</p>
                    </div>
                    <StarRating value={f.rating} />
                  </div>
                ))}
                <p className="text-xs text-gray-500 text-center">+9 outros fornecedores...</p>
              </div>
            </div>

            {/* Box pagamento */}
            <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm">
              <p className="text-sm text-gray-600 mb-3">
                Para disparar para todos os 12 fornecedores simultaneamente:
              </p>
              <div className="flex items-baseline gap-1 mb-1">
                <span className="text-3xl font-black text-[#1A1A2E]">R$ 47,90</span>
              </div>
              <p className="text-xs text-gray-400 mb-4">Pagamento único. Sem taxa por proposta recebida.</p>
              <button
                onClick={() => setStep(3)}
                className="w-full flex items-center justify-center gap-2 py-3.5 bg-[#10B981] hover:bg-[#059669] text-white font-bold rounded-xl transition-colors text-sm"
              >
                <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
                  <path d="M20.5 12c0-4.7-3.8-8.5-8.5-8.5S3.5 7.3 3.5 12s3.8 8.5 8.5 8.5 8.5-3.8 8.5-8.5zm-8.5 6c-3.3 0-6-2.7-6-6s2.7-6 6-6 6 2.7 6 6-2.7 6-6 6zm-1-9v2h2V9h-2zm0 4v4h2v-4h-2z" />
                </svg>
                Pagar com Pix — R$ 47,90
              </button>
            </div>

            <button
              onClick={() => setShowModal(true)}
              className="text-sm text-[#E05C1A] hover:underline font-semibold text-center"
            >
              Como funciona o SOS Conekta?
            </button>

            <button
              onClick={() => setStep(1)}
              className="text-sm text-gray-400 hover:text-gray-600 text-center"
            >
              ← Voltar e editar
            </button>
          </>
        )}

        {/* STEP 3 — Aguardando */}
        {step === 3 && (
          <div className="flex flex-col items-center gap-6 py-8">
            {/* Radar pulsando */}
            <div className="relative flex items-center justify-center w-28 h-28">
              <span className="absolute inset-0 rounded-full bg-[#DC2626]/10 animate-ping" />
              <span className="absolute inset-3 rounded-full bg-[#DC2626]/15 animate-ping [animation-delay:0.2s]" />
              <span className="absolute inset-6 rounded-full bg-[#DC2626]/20 animate-ping [animation-delay:0.4s]" />
              <div className="relative z-10 w-16 h-16 rounded-full bg-[#DC2626] flex items-center justify-center">
                <AlertTriangle className="w-8 h-8 text-white" />
              </div>
            </div>

            <div className="text-center">
              <h2 className="text-xl font-black text-[#1A1A2E]">
                Solicitação enviada para<br />
                <span className="text-[#DC2626]">12 fornecedores!</span>
              </h2>
              <p className="text-sm text-gray-500 mt-2 leading-relaxed">
                Você receberá notificações conforme<br />as propostas chegarem
              </p>
            </div>

            <div className="bg-yellow-50 border border-yellow-100 rounded-2xl px-6 py-4 flex items-center gap-3">
              <span className="text-2xl">⏱️</span>
              <div>
                <p className="text-xs text-gray-400 font-medium">Tempo médio</p>
                <p className="text-sm font-bold text-[#1A1A2E]">Primeira proposta em 8 minutos</p>
              </div>
            </div>

            <button
              onClick={() => router.push("/home")}
              className="w-full py-3.5 bg-[#E05C1A] hover:bg-[#c54d15] text-white font-bold rounded-xl transition-colors"
            >
              Ver propostas em tempo real
            </button>
          </div>
        )}
      </div>

      {showModal && <HowItWorksModal onClose={() => setShowModal(false)} />}
    </div>
  );
}
