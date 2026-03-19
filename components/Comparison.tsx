'use client'

import { useIntersectionObserver } from '@/lib/hooks/useIntersectionObserver'

const comparisonData = [
  { feature: 'Busca por linguagem natural', nexto: 'Sim', google: 'Nao', ninjas: 'Nao', indicacao: 'Nao' },
  { feature: 'IA classifica urgencia', nexto: 'Sim', google: 'Nao', ninjas: 'Nao', indicacao: 'Nao' },
  { feature: 'Foco industrial / tecnico', nexto: 'Sim', google: 'Generico', ninjas: 'Residencial', indicacao: 'Depende' },
  { feature: 'Ranking por relevancia tecnica', nexto: '5 fatores', google: 'SEO/Ads', ninjas: 'Basico', indicacao: 'Nao' },
  { feature: 'Filtro NR-13 / certificacoes', nexto: 'Sim', google: 'Nao', ninjas: 'Nao', indicacao: 'Nao' },
  { feature: 'Propostas padronizadas', nexto: 'Template', google: 'Nao', ninjas: 'Nao', indicacao: 'Nao' },
  { feature: 'Comparacao lado a lado', nexto: 'Sim', google: 'Nao', ninjas: 'Nao', indicacao: 'Nao' },
  { feature: 'Ofertas em massa (opt-in)', nexto: 'Sim', google: 'Nao', ninjas: 'Nao', indicacao: 'Nao' },
  { feature: 'Loop de aprendizado IA', nexto: 'Continuo', google: 'Nao', ninjas: 'Nao', indicacao: 'Nao' },
]

function getCellClass(value: string) {
  if (value === 'Sim' || value === '5 fatores' || value === 'Template' || value === 'Continuo') {
    return 'text-[#34d399] font-bold'
  }
  if (value === 'Nao') {
    return 'text-steel-dark opacity-50'
  }
  if (value === 'Basico' || value === 'Depende' || value === 'Generico' || value === 'Residencial') {
    return 'text-amber'
  }
  return 'text-steel'
}

export function Comparison() {
  const { ref, isIntersecting } = useIntersectionObserver()

  return (
    <section id="comparativo" className="relative z-[1] px-6 py-[100px]">
      <div ref={ref} className="max-w-[1100px] mx-auto">
        <div className={`font-mono text-xs text-indigo-light uppercase tracking-[3px] mb-4 ${isIntersecting ? 'anim active' : 'anim'}`}>
          Comparativo
        </div>
        <div className={`font-display text-[clamp(28px,4vw,44px)] font-bold leading-[1.15] tracking-tight mb-5 ${isIntersecting ? 'anim active d1' : 'anim d1'}`}>
          Nex.to vs. o mercado
        </div>
        <div className={`text-[17px] text-steel leading-[1.7] max-w-[560px] mb-12 ${isIntersecting ? 'anim active d2' : 'anim d2'}`}>
          O que existe hoje nao foi feito para manutencao industrial.
        </div>

        <div className={`overflow-x-auto ${isIntersecting ? 'anim active d3' : 'anim d3'}`}>
          <table className="w-full border-separate border-spacing-0 bg-ink-90 rounded-2xl overflow-hidden border border-indigo-light/10">
            <thead className="bg-ink-80">
              <tr>
                <th className="px-5 py-4 font-display text-[13px] font-semibold text-steel-dark text-left border-b border-indigo-light/10"></th>
                <th className="px-5 py-4 font-display text-[15px] font-semibold text-indigo-light text-center border-b border-indigo-light/10 bg-indigo-light/[0.06]">Nex.to</th>
                <th className="px-5 py-4 font-display text-[13px] font-semibold text-steel text-center border-b border-indigo-light/10">Google</th>
                <th className="px-5 py-4 font-display text-[13px] font-semibold text-steel text-center border-b border-indigo-light/10">GetNinjas</th>
                <th className="px-5 py-4 font-display text-[13px] font-semibold text-steel text-center border-b border-indigo-light/10">Indicacao</th>
              </tr>
            </thead>
            <tbody>
              {comparisonData.map((row, idx) => (
                <tr key={idx}>
                  <td className="px-5 py-3.5 text-[13px] text-steel-light font-medium text-left border-b border-indigo-light/[0.05] last:border-b-0">
                    {row.feature}
                  </td>
                  <td className={`px-5 py-3.5 text-[13px] text-center border-b border-indigo-light/[0.05] last:border-b-0 bg-indigo-light/[0.06] ${getCellClass(row.nexto)}`}>
                    {row.nexto}
                  </td>
                  <td className={`px-5 py-3.5 text-[13px] text-center border-b border-indigo-light/[0.05] last:border-b-0 ${getCellClass(row.google)}`}>
                    {row.google}
                  </td>
                  <td className={`px-5 py-3.5 text-[13px] text-center border-b border-indigo-light/[0.05] last:border-b-0 ${getCellClass(row.ninjas)}`}>
                    {row.ninjas}
                  </td>
                  <td className={`px-5 py-3.5 text-[13px] text-center border-b border-indigo-light/[0.05] last:border-b-0 ${getCellClass(row.indicacao)}`}>
                    {row.indicacao}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  )
}
