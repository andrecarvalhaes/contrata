'use client'

import { useEffect, useState } from 'react'
import { useIntersectionObserver } from '@/lib/hooks/useIntersectionObserver'

interface StatData {
  target: number
  suffix: string
  label: string
  delay?: string
}

const stats: StatData[] = [
  { target: 247, suffix: '+', label: 'Fornecedores na fila' },
  { target: 58, suffix: '+', label: 'Categorias tecnicas', delay: 'd1' },
  { target: 12, suffix: 's', label: 'Tempo medio de match', delay: 'd2' },
  { target: 80, suffix: '%', label: 'Mais rapido que indicacao', delay: 'd3' },
]

function StatCounter({ target, suffix, label, delay }: StatData) {
  const [count, setCount] = useState(0)
  const { ref, isIntersecting } = useIntersectionObserver()
  const [hasAnimated, setHasAnimated] = useState(false)

  useEffect(() => {
    if (isIntersecting && !hasAnimated) {
      setHasAnimated(true)
      const step = Math.ceil(target / 40)
      const interval = setInterval(() => {
        setCount((prev) => {
          if (prev >= target) {
            clearInterval(interval)
            return target
          }
          return Math.min(prev + step, target)
        })
      }, 30)
      return () => clearInterval(interval)
    }
  }, [isIntersecting, hasAnimated, target])

  return (
    <div ref={ref} className={`text-center ${isIntersecting ? `anim active ${delay || ''}` : `anim ${delay || ''}`}`}>
      <div className="font-display text-[42px] font-extrabold text-white tracking-tight">
        {count}<span className="text-indigo-light">{suffix}</span>
      </div>
      <div className="text-[13px] text-steel-dark mt-1 uppercase tracking-wider font-medium">
        {label}
      </div>
    </div>
  )
}

export function Stats() {
  return (
    <div className="relative z-[1] flex justify-center gap-[60px] px-6 py-[60px] border-t border-b border-indigo-light/[0.08] flex-wrap">
      {stats.map((stat, idx) => (
        <StatCounter key={idx} {...stat} />
      ))}
    </div>
  )
}
