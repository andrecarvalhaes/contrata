"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { AlertTriangle, ChevronRight, Star, Info, X, CheckCircle, Clock } from "lucide-react";
import {
  useCategorias,
  useContagemFornecedoresDisponiveis,
  useCriarSosDisparo,
  useMinhasLojas,
} from "@/lib/data/queries";

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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={onClose}>
      <div
        className="w-full max-w-2xl bg-white rounded-2xl p-6 sm:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-[#1A1A2E]">Como funciona o SOS Conekta?</h3>
          <button onClick={onClose} className="p-1.5 rounded-full hover:bg-gray-100">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
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
  const [lojaId, setLojaId] = useState("");
  const [categoriaSlug, setCategoriaSlug] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  const { data: lojas = [], isLoading: loadingLojas } = useMinhasLojas();
  const { data: categorias = [], isLoading: loadingCategorias } = useCategorias();
  const criarSos = useCriarSosDisparo();

  const lojaSelecionada = useMemo(
    () => lojas.find((l) => l.id === lojaId),
    [lojas, lojaId]
  );

  const { data: disponiveis } = useContagemFornecedoresDisponiveis({
    cidade: lojaSelecionada?.cidade,
    categoriaSlug: categoriaSlug || null,
    enabled: step === 2,
  });

  const canProceed = descricao.trim() && lojaId && categoriaSlug;

  const handleDispararSos = async () => {
    if (!lojaSelecionada) return;
    setErro(null);
    try {
      await criarSos.mutateAsync({
        titulo: descricao.slice(0, 100),
        descricao,
        posto_loja_id: lojaId,
        categoria_slug: categoriaSlug,
      });
      setStep(3);
    } catch (err: any) {
      setErro(err?.message || "Erro ao disparar SOS.");
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      {/* Hero urgente */}
      <div className="bg-gradient-to-br from-[#DC2626] to-[#991b1b] rounded-2xl p-6 sm:p-8 mb-6 shadow-lg">
        <div className="flex items-center gap-4 mb-3">
          <div className="w-12 h-12 sm:w-14 sm:h-14 bg-white/20 rounded-xl flex items-center justify-center">
            <AlertTriangle className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white">SOS Conekta</h1>
            <p className="text-red-100 text-sm sm:text-base">Cotação imediata para todos os fornecedores</p>
          </div>
        </div>

        {/* Steps indicator */}
        <div className="flex items-center gap-2 mt-6">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex items-center gap-2">
              <div
                className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                  step >= s ? "bg-white text-[#DC2626]" : "bg-white/30 text-white"
                }`}
              >
                {step > s ? <CheckCircle className="w-5 h-5 text-[#DC2626]" /> : s}
              </div>
              {s < 3 && (
                <div className={`flex-1 h-1 w-12 sm:w-16 rounded ${step > s ? "bg-white" : "bg-white/30"}`} />
              )}
            </div>
          ))}
          <span className="text-white/90 text-sm ml-2 hidden sm:inline">
            {step === 1 && "Descrever Urgência"}
            {step === 2 && "Confirmação"}
            {step === 3 && "Enviado!"}
          </span>
        </div>
      </div>

      {/* Conteúdo dos steps */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 sm:p-8">

        {/* STEP 1 */}
        {step === 1 && (
          <>
            <div className="flex flex-col gap-5">
              {/* Textarea */}
              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-[#1A1A2E]">
                  Qual é a urgência?
                </label>
                <textarea
                  value={descricao}
                  onChange={(e) => setDescricao(e.target.value)}
                  rows={4}
                  placeholder="Ex: Bomba de combustível parou de funcionar, perda total de produção..."
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-sm text-[#2D2D2D] placeholder-gray-400 outline-none focus:border-[#DC2626] focus:ring-2 focus:ring-[#DC2626]/20 resize-none transition-all"
                />
              </div>

              {/* Selects em grid para desktop */}
              <div className="grid sm:grid-cols-2 gap-4">
                {/* Select loja */}
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-semibold text-[#1A1A2E]">Qual loja?</label>
                  <select
                    value={lojaId}
                    onChange={(e) => setLojaId(e.target.value)}
                    disabled={loadingLojas}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-sm text-[#2D2D2D] outline-none focus:border-[#DC2626] focus:ring-2 focus:ring-[#DC2626]/20 transition-all disabled:bg-gray-50"
                  >
                    <option value="">
                      {loadingLojas
                        ? "Carregando lojas..."
                        : lojas.length === 0
                        ? "Nenhuma loja cadastrada"
                        : "Selecione a loja"}
                    </option>
                    {lojas.map((l) => (
                      <option key={l.id} value={l.id}>
                        {l.nome} {l.cidade ? `— ${l.cidade}/${l.estado}` : ""}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Select categoria */}
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-semibold text-[#1A1A2E]">Categoria do serviço</label>
                  <select
                    value={categoriaSlug}
                    onChange={(e) => setCategoriaSlug(e.target.value)}
                    disabled={loadingCategorias}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-sm text-[#2D2D2D] outline-none focus:border-[#DC2626] focus:ring-2 focus:ring-[#DC2626]/20 transition-all disabled:bg-gray-50"
                  >
                    <option value="">
                      {loadingCategorias ? "Carregando categorias..." : "Selecione a categoria"}
                    </option>
                    {categorias.map((c) => (
                      <option key={c.slug} value={c.slug}>
                        {c.nome}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Info box */}
              <div className="flex gap-3 bg-blue-50 border border-blue-100 rounded-xl p-4">
                <Info className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-blue-700 leading-relaxed">
                  Sua solicitação será enviada automaticamente para <strong>TODOS</strong> os fornecedores verificados que atendem sua cidade. Você receberá as propostas em tempo real.
                </p>
              </div>
            </div>

            <button
              onClick={() => canProceed && setStep(2)}
              disabled={!canProceed}
              className="w-full mt-6 flex items-center justify-center gap-2 py-4 bg-[#DC2626] hover:bg-red-700 text-white font-bold rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-base shadow-lg"
            >
              Ver fornecedores disponíveis
              <ChevronRight className="w-5 h-5" />
            </button>
          </>
        )}

        {/* STEP 2 */}
        {step === 2 && (
          <>
            {/* Resumo */}
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-5 mb-6">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Resumo da solicitação</p>
              <p className="text-sm text-[#2D2D2D] leading-relaxed mb-3">{descricao}</p>
              <div className="flex gap-2">
                <span className="text-xs bg-white border border-gray-200 text-gray-700 px-3 py-1.5 rounded-full font-medium">
                  {lojaSelecionada?.nome ?? "Loja"}
                </span>
                <span className="text-xs bg-[#DC2626]/10 border border-[#DC2626]/20 text-[#DC2626] px-3 py-1.5 rounded-full font-medium">
                  {categorias.find((c) => c.slug === categoriaSlug)?.nome ?? categoriaSlug}
                </span>
              </div>
            </div>

            {/* Box fornecedores */}
            <div className="bg-green-50 border border-green-200 rounded-xl p-5 mb-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <span className="text-xl font-black text-green-700">{disponiveis?.total ?? 0}</span>
                </div>
                <p className="text-base font-bold text-green-800">
                  fornecedores encontrados
                  {lojaSelecionada?.cidade ? ` em ${lojaSelecionada.cidade}, ${lojaSelecionada.estado}` : ""}
                </p>
              </div>
              {disponiveis && disponiveis.total > 0 ? (
                <>
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {disponiveis.amostra.map((f) => (
                      <div key={f.id} className="flex flex-col bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                        <p className="text-sm font-semibold text-[#1A1A2E] mb-1">{f.nome}</p>
                        <p className="text-xs text-gray-500 mb-2">{f.categoria_nome ?? "—"}</p>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-400">
                            {[f.cidade, f.estado].filter(Boolean).join(", ") || "—"}
                          </span>
                          <StarRating value={f.rating || 0} />
                        </div>
                      </div>
                    ))}
                  </div>
                  {disponiveis.total > disponiveis.amostra.length && (
                    <p className="text-xs text-gray-500 text-center mt-3">
                      +{disponiveis.total - disponiveis.amostra.length} outros fornecedores...
                    </p>
                  )}
                </>
              ) : (
                <p className="text-sm text-gray-600 text-center py-4">
                  Nenhum fornecedor ativo encontrado nessa região/categoria. Sua solicitação ficará
                  aberta no marketplace.
                </p>
              )}
            </div>

            {/* Box pagamento */}
            <div className="bg-white border-2 border-[#DC2626]/20 rounded-xl p-6 mb-6">
              <p className="text-sm text-gray-600 mb-4">
                Para disparar para todos os 12 fornecedores simultaneamente:
              </p>
              <div className="flex items-baseline gap-2 mb-2">
                <span className="text-4xl font-black text-[#DC2626]">R$ 47,90</span>
              </div>
              <p className="text-xs text-gray-500 mb-5">Pagamento único. Sem taxa por proposta recebida.</p>
              <button
                onClick={handleDispararSos}
                disabled={criarSos.isPending}
                className="w-full flex items-center justify-center gap-2 py-4 bg-[#10B981] hover:bg-[#059669] text-white font-bold rounded-xl transition-colors text-base shadow-lg disabled:opacity-60"
              >
                <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
                  <path d="M20.5 12c0-4.7-3.8-8.5-8.5-8.5S3.5 7.3 3.5 12s3.8 8.5 8.5 8.5 8.5-3.8 8.5-8.5zm-8.5 6c-3.3 0-6-2.7-6-6s2.7-6 6-6 6 2.7 6 6-2.7 6-6 6zm-1-9v2h2V9h-2zm0 4v4h2v-4h-2z" />
                </svg>
                {criarSos.isPending ? "Disparando..." : "Disparar SOS — R$ 47,90"}
              </button>
              {erro && <p className="text-xs text-red-600 mt-3 text-center">{erro}</p>}
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => setShowModal(true)}
                className="flex-1 text-sm text-[#DC2626] hover:bg-red-50 font-semibold text-center py-3 rounded-xl border border-[#DC2626]/20 transition-colors"
              >
                Como funciona o SOS Conekta?
              </button>
              <button
                onClick={() => setStep(1)}
                className="flex-1 text-sm text-gray-500 hover:bg-gray-50 text-center py-3 rounded-xl border border-gray-200 transition-colors"
              >
                Voltar e editar
              </button>
            </div>
          </>
        )}

        {/* STEP 3 — Aguardando */}
        {step === 3 && (
          <div className="flex flex-col items-center gap-6 py-8">
            {/* Radar pulsando */}
            <div className="relative flex items-center justify-center w-32 h-32">
              <span className="absolute inset-0 rounded-full bg-[#DC2626]/10 animate-ping" />
              <span className="absolute inset-3 rounded-full bg-[#DC2626]/15 animate-ping [animation-delay:0.2s]" />
              <span className="absolute inset-6 rounded-full bg-[#DC2626]/20 animate-ping [animation-delay:0.4s]" />
              <div className="relative z-10 w-20 h-20 rounded-full bg-[#DC2626] flex items-center justify-center shadow-lg">
                <AlertTriangle className="w-10 h-10 text-white" />
              </div>
            </div>

            <div className="text-center">
              <h2 className="text-2xl sm:text-3xl font-black text-[#1A1A2E] mb-3">
                Solicitação enviada para<br />
                <span className="text-[#DC2626]">
                  {disponiveis?.total ?? 0} fornecedores!
                </span>
              </h2>
              <p className="text-base text-gray-600 leading-relaxed">
                Você receberá notificações conforme as propostas chegarem
              </p>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-xl px-6 py-4 flex items-center gap-4 w-full max-w-md">
              <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center flex-shrink-0">
                <Clock className="w-6 h-6 text-yellow-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500 font-medium">Tempo médio</p>
                <p className="text-sm font-bold text-[#1A1A2E]">Primeira proposta em 8 minutos</p>
              </div>
            </div>

            <button
              onClick={() => router.push("/solicitacoes")}
              className="w-full max-w-md py-4 bg-[#E05C1A] hover:bg-[#c54d15] text-white font-bold rounded-xl transition-colors text-base shadow-lg"
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
