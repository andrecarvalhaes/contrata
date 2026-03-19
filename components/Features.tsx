'use client'

import { useIntersectionObserver } from '@/lib/hooks/useIntersectionObserver'

const features = [
  {
    label: 'Inteligencia',
    title: 'IA que entende tecnico',
    description: 'Voce diz "cheiro de combustivel perto do tanque". A IA interpreta: possivel vazamento em sistema de abastecimento, urgencia alta, categoria combustiveis. E encontra quem resolve.',
  },
  {
    label: 'Precisao',
    title: 'Match com 5 fatores',
    description: 'Nao e so proximidade. O ranking combina relevancia tecnica (35%), localizacao (25%), reputacao (20%), disponibilidade (10%) e competitividade de preco (10%).',
  },
  {
    label: 'Conformidade',
    title: 'Filtro por NR-13 e certificacoes',
    description: 'Filtre fornecedores por certificacoes reais: NR-13, ISO, licencas ambientais, seguros. Garantia de conformidade regulatoria desde a busca.',
  },
  {
    label: 'Eficiencia',
    title: 'Propostas padronizadas',
    description: 'Chega de PDFs diferentes. Todas as propostas seguem um padrao que facilita comparacao lado a lado: escopo, prazo, valor e responsabilidades claros.',
  },
]

export function Features() {
  const { ref, isIntersecting } = useIntersectionObserver()

  return (
    <section id="diferenciais" className="relative z-[1] px-6 py-[100px]">
      <div ref={ref} className="max-w-[1100px] mx-auto">
        <div className={`font-mono text-xs text-indigo-light uppercase tracking-[3px] mb-4 ${isIntersecting ? 'anim active' : 'anim'}`}>
          Diferenciais
        </div>
        <div className={`font-display text-[clamp(28px,4vw,44px)] font-bold leading-[1.15] tracking-tight mb-5 ${isIntersecting ? 'anim active d1' : 'anim d1'}`}>
          Por que o Nex.to e diferente
        </div>
        <div className={`text-[17px] text-steel leading-[1.7] max-w-[560px] mb-12 ${isIntersecting ? 'anim active d2' : 'anim d2'}`}>
          Construido para quem trabalha com manutencao industrial de verdade. Nao e um marketplace generico.
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {features.map((feature, idx) => (
            <div
              key={idx}
              className={`bg-ink-90 border border-indigo-light/[0.08] rounded-2xl p-9 transition-all hover:border-indigo-light/25 hover:-translate-y-0.5 relative overflow-hidden group ${isIntersecting ? `anim active d${idx + 2}` : `anim d${idx + 2}`}`}
            >
              <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-indigo to-indigo-light opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="font-mono text-[11px] text-amber uppercase tracking-[2px] mb-3">
                {feature.label}
              </div>
              <h3 className="font-display text-xl font-bold mb-2.5 text-white">
                {feature.title}
              </h3>
              <p className="text-sm text-steel leading-[1.65]">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
