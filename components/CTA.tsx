'use client'

import { useState } from 'react'
import { useIntersectionObserver } from '@/lib/hooks/useIntersectionObserver'

type CTAType = 'cliente' | 'fornecedor'

export function CTA() {
  const { ref, isIntersecting } = useIntersectionObserver()
  const [emailCliente, setEmailCliente] = useState('')
  const [emailFornecedor, setEmailFornecedor] = useState('')
  const [msgCliente, setMsgCliente] = useState('')
  const [msgFornecedor, setMsgFornecedor] = useState('')
  const [showMsgCliente, setShowMsgCliente] = useState(false)
  const [showMsgFornecedor, setShowMsgFornecedor] = useState(false)

  const subscribe = (type: CTAType) => {
    const email = type === 'cliente' ? emailCliente : emailFornecedor
    const setMsg = type === 'cliente' ? setMsgCliente : setMsgFornecedor
    const setShowMsg = type === 'cliente' ? setShowMsgCliente : setShowMsgFornecedor
    const setEmail = type === 'cliente' ? setEmailCliente : setEmailFornecedor

    if (!email.trim() || !email.includes('@')) {
      setMsg('Por favor, insira um e-mail valido.')
      setShowMsg(true)
      return
    }

    setMsg('Pronto! Voce esta na lista. Entraremos em contato em breve.')
    setShowMsg(true)
    setEmail('')
  }

  return (
    <section id="cadastro" className="relative z-[1] px-6 py-[100px] bg-gradient-to-b from-ink to-ink-90">
      <div ref={ref} className="max-w-[1100px] mx-auto">
        <div className={`font-mono text-xs text-indigo-light uppercase tracking-[3px] mb-4 text-center ${isIntersecting ? 'anim active' : 'anim'}`}>
          Lista de espera
        </div>
        <div className={`font-display text-[clamp(28px,4vw,44px)] font-bold leading-[1.15] tracking-tight mb-12 text-center ${isIntersecting ? 'anim active d1' : 'anim d1'}`}>
          Entre antes de todo mundo.
        </div>

        <div className={`grid grid-cols-1 md:grid-cols-2 gap-0.5 bg-indigo-light/15 rounded-3xl overflow-hidden ${isIntersecting ? 'anim active d2' : 'anim d2'}`}>
          {/* Cliente */}
          <div className="px-12 py-14 bg-ink-90 flex flex-col md:rounded-l-3xl">
            <div className="font-mono text-[11px] text-amber uppercase tracking-[3px] mb-4">
              Sou cliente
            </div>
            <h3 className="font-display text-[28px] font-bold mb-3 text-white tracking-tight">
              Preciso de manutencao
            </h3>
            <p className="text-[15px] text-steel leading-[1.65] mb-7 flex-1">
              Entre na lista e seja um dos primeiros a usar a busca inteligente do Nex.to quando lancarmos.
            </p>
            <ul className="list-none mb-8">
              <li className="text-sm text-steel-light py-2 border-b border-indigo-light/[0.06] flex items-center gap-2.5">
                <span className="w-1.5 h-1.5 bg-indigo-light rounded-full flex-shrink-0" />
                Acesso antecipado a plataforma
              </li>
              <li className="text-sm text-steel-light py-2 border-b border-indigo-light/[0.06] flex items-center gap-2.5">
                <span className="w-1.5 h-1.5 bg-indigo-light rounded-full flex-shrink-0" />
                Busca ilimitada no periodo beta
              </li>
              <li className="text-sm text-steel-light py-2 border-b border-indigo-light/[0.06] flex items-center gap-2.5">
                <span className="w-1.5 h-1.5 bg-indigo-light rounded-full flex-shrink-0" />
                Suporte prioritario
              </li>
            </ul>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="Seu melhor e-mail"
                value={emailCliente}
                onChange={(e) => setEmailCliente(e.target.value)}
                className="flex-1 px-4.5 py-3.5 bg-ink-80 border-[1.5px] border-indigo-light/20 rounded-[10px] text-white text-sm outline-none focus:border-indigo-light transition-colors placeholder:text-steel-dark"
              />
              <button
                onClick={() => subscribe('cliente')}
                className="bg-indigo text-white px-7 py-3.5 rounded-[10px] text-sm font-semibold hover:bg-indigo-light hover:-translate-y-px transition-all whitespace-nowrap"
              >
                Entrar na fila
              </button>
            </div>
            {showMsgCliente && (
              <div className={`mt-3 text-[13px] ${msgCliente.includes('valido') ? 'text-red-400' : 'text-[#34d399]'}`}>
                {msgCliente}
              </div>
            )}
          </div>

          {/* Fornecedor */}
          <div className="px-12 py-14 bg-ink-90 flex flex-col md:rounded-r-3xl">
            <div className="font-mono text-[11px] text-amber uppercase tracking-[3px] mb-4">
              Sou fornecedor
            </div>
            <h3 className="font-display text-[28px] font-bold mb-3 text-white tracking-tight">
              Quero receber demandas
            </h3>
            <p className="text-[15px] text-steel leading-[1.65] mb-7 flex-1">
              Cadastre-se e receba demandas qualificadas pela IA assim que a plataforma abrir.
            </p>
            <ul className="list-none mb-8">
              <li className="text-sm text-steel-light py-2 border-b border-indigo-light/[0.06] flex items-center gap-2.5">
                <span className="w-1.5 h-1.5 bg-indigo-light rounded-full flex-shrink-0" />
                Perfil gratuito no lancamento
              </li>
              <li className="text-sm text-steel-light py-2 border-b border-indigo-light/[0.06] flex items-center gap-2.5">
                <span className="w-1.5 h-1.5 bg-indigo-light rounded-full flex-shrink-0" />
                Primeiras 20 demandas sem comissao
              </li>
              <li className="text-sm text-steel-light py-2 border-b border-indigo-light/[0.06] flex items-center gap-2.5">
                <span className="w-1.5 h-1.5 bg-indigo-light rounded-full flex-shrink-0" />
                Destaque como fornecedor pioneiro
              </li>
            </ul>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="E-mail corporativo"
                value={emailFornecedor}
                onChange={(e) => setEmailFornecedor(e.target.value)}
                className="flex-1 px-4.5 py-3.5 bg-ink-80 border-[1.5px] border-indigo-light/20 rounded-[10px] text-white text-sm outline-none focus:border-indigo-light transition-colors placeholder:text-steel-dark"
              />
              <button
                onClick={() => subscribe('fornecedor')}
                className="bg-transparent text-indigo-light border-[1.5px] border-indigo px-7 py-3.5 rounded-[10px] text-sm font-semibold hover:bg-indigo-glow hover:border-indigo-light transition-all whitespace-nowrap"
              >
                Garantir vaga
              </button>
            </div>
            {showMsgFornecedor && (
              <div className={`mt-3 text-[13px] ${msgFornecedor.includes('valido') ? 'text-red-400' : 'text-[#34d399]'}`}>
                {msgFornecedor}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
