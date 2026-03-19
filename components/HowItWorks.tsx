'use client'

import { useIntersectionObserver } from '@/lib/hooks/useIntersectionObserver'

const steps = [
  {
    num: '01',
    title: 'Descreva',
    description: 'Digite o que esta acontecendo com suas palavras. Sem termos tecnicos, sem formularios longos. A IA entende linguagem natural e faz perguntas se precisar.',
    icon: (
      <svg viewBox="0 0 24 24" className="w-6 h-6 stroke-indigo-light stroke-2 fill-none">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    num: '02',
    title: 'Match',
    description: 'A plataforma cruza sua necessidade com fornecedores qualificados usando 5 fatores: relevancia tecnica, proximidade, avaliacao, disponibilidade e preco.',
    icon: (
      <svg viewBox="0 0 24 24" className="w-6 h-6 stroke-indigo-light stroke-2 fill-none">
        <circle cx="11" cy="11" r="8" strokeLinecap="round" strokeLinejoin="round" />
        <path d="m21 21-4.3-4.3" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    num: '03',
    title: 'Resolva',
    description: 'Receba propostas padronizadas, compare lado a lado e contrate. Tudo na plataforma, com historico e avaliacao para proximas vezes.',
    icon: (
      <svg viewBox="0 0 24 24" className="w-6 h-6 stroke-indigo-light stroke-2 fill-none">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" strokeLinecap="round" strokeLinejoin="round" />
        <polyline points="22 4 12 14.01 9 11.01" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
]

export function HowItWorks() {
  const { ref, isIntersecting } = useIntersectionObserver()

  return (
    <section id="como-funciona" className="relative z-[1] px-6 py-[100px]">
      <div ref={ref} className="max-w-[1100px] mx-auto">
        <div className={`font-mono text-xs text-indigo-light uppercase tracking-[3px] mb-4 ${isIntersecting ? 'anim active' : 'anim'}`}>
          Como funciona
        </div>
        <div className={`font-display text-[clamp(28px,4vw,44px)] font-bold leading-[1.15] tracking-tight mb-5 ${isIntersecting ? 'anim active d1' : 'anim d1'}`}>
          Tres passos. Zero complicacao.
        </div>
        <div className={`text-[17px] text-steel leading-[1.7] max-w-[560px] mb-12 ${isIntersecting ? 'anim active d2' : 'anim d2'}`}>
          Voce descreve o problema do seu jeito. Nossa IA traduz, classifica e encontra quem resolve.
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-0.5 bg-indigo-light/10 rounded-[20px] overflow-hidden">
          {steps.map((step, idx) => (
            <div
              key={idx}
              className={`bg-ink-90 p-10 relative hover:bg-ink-80 transition-colors ${isIntersecting ? `anim active d${idx + 2}` : `anim d${idx + 2}`}`}
            >
              <div className="font-mono text-[52px] font-bold text-indigo-light/[0.15] absolute top-5 right-6 leading-none">
                {step.num}
              </div>
              <div className="w-12 h-12 bg-indigo-glow border border-indigo-light/20 rounded-xl flex items-center justify-center mb-5">
                {step.icon}
              </div>
              <h3 className="font-display text-xl font-bold mb-2.5 text-white">
                {step.title}
              </h3>
              <p className="text-sm text-steel leading-[1.6]">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
