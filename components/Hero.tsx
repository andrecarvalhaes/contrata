'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useIntersectionObserver } from '@/lib/hooks/useIntersectionObserver'
import { useSpeechRecognition } from '@/lib/hooks/useSpeechRecognition'
import { TextLoop } from '@/components/ui/text-loop'
import { ServiceSearchBar } from '@/components/ServiceSearchBar'
import { Variants } from 'framer-motion'
import { Search } from 'lucide-react'

const services = [
  'Inspeções Técnicas',
  'Manutenção em Tanques',
  'Manutenção em Bombas',
  'Manutenção em Dispensers',
  'Serviço Elétrico',
  'Manutenção em Automação',
  'Controle de Qualidade',
  'Serviço Civil'
]

const problemExamples = [
  'Cheiro de combustível nos tanques',
  'Bomba não funciona',
  'Vazamento detectado',
  'Sistema de automação com erro'
]

const serviceExamples = [
  'Inspeção Técnica',
  'NR-13',
  'Laudo de Estanqueidade',
  'Manutenção Preventiva'
]

type SearchMode = 'problem' | 'service';

export function Hero() {
  const [searchValue, setSearchValue] = useState('')
  const [searchMode, setSearchMode] = useState<SearchMode>('problem')
  const { ref, isIntersecting } = useIntersectionObserver({ threshold: 0.1 })
  const { isListening, transcript, isSupported, startListening, stopListening } = useSpeechRecognition()
  const router = useRouter()

  // Sincroniza transcrição de voz no input sem usar setState em effect
  const [prevTranscript, setPrevTranscript] = useState('')
  if (transcript !== prevTranscript) {
    setPrevTranscript(transcript)
    if (transcript) {
      setSearchValue(transcript)
    }
  }

  const fillSearch = (text: string) => {
    setSearchValue(text)
  }

  const handleMicClick = () => {
    if (isListening) {
      stopListening()
    } else {
      startListening()
    }
  }

  const handleSearch = () => {
    if (searchValue.trim()) {
      // Navegação imediata sem timeout
      if (searchMode === 'service') {
        router.push(`/marketplace?search=${encodeURIComponent(searchValue)}`)
      } else {
        router.push(`/chat?message=${encodeURIComponent(searchValue)}&mode=${searchMode}`)
      }
    }
  }

  // Prefetch das rotas para carregamento mais rápido
  useEffect(() => {
    router.prefetch('/chat')
    router.prefetch('/marketplace')
  }, [router])

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch()
    }
  }

  const textLoopVariants: Variants = {
    initial: { y: 30, opacity: 0, filter: 'blur(10px)' },
    animate: { y: 0, opacity: 1, filter: 'blur(0px)' },
    exit: { y: -30, opacity: 0, filter: 'blur(10px)' },
  }

  return (
    <section ref={ref} className="relative z-[1] min-h-screen flex flex-col items-center justify-center text-center px-6 pt-[120px] pb-20">
      <h1 className={`font-display text-[clamp(32px,5vw,56px)] font-extrabold leading-[1.2] tracking-[-2px] max-w-[1200px] w-full px-4 mb-6 text-gray-900 ${isIntersecting ? 'anim active d1' : 'anim d1'}`}>
        Uma única plataforma onde<br />
        você contrata{' '}
        <TextLoop
          interval={3}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          variants={textLoopVariants}
          className="inline-block min-w-[280px] text-left"
        >
          {services.map((service) => (
            <span
              key={service}
              className="bg-gradient-to-br from-purple via-purple-medium to-purple-light bg-clip-text text-transparent"
            >
              {service}
            </span>
          ))}
        </TextLoop>
      </h1>

      <p className={`text-[clamp(16px,2vw,20px)] text-gray-600 max-w-[680px] leading-[1.7] mb-12 ${isIntersecting ? 'anim active d2' : 'anim d2'}`}>
        O marketplace que conecta postos de combustível aos melhores fornecedores de serviços especializados.
      </p>

      <div className={`w-full max-w-[700px] ${isIntersecting ? 'anim active d3' : 'anim d3'}`}>
        {/* Campo de busca */}
        {searchMode === 'service' ? (
          <ServiceSearchBar
            value={searchValue}
            onChange={setSearchValue}
            onSearch={handleSearch}
            onKeyPress={handleKeyPress}
            placeholder="Ex: Inspeção técnica NR-13..."
            onModeChange={(mode) => setSearchMode(mode)}
          />
        ) : (
          <>
            {/* Seletor de modo */}
            <div className="flex gap-2 mb-6 bg-gray-100 p-1 rounded-full border border-purple/20 max-w-[500px] mx-auto">
              <button
                onClick={() => setSearchMode('problem')}
                className={
                  searchMode === 'problem'
                    ? 'flex-1 px-3 sm:px-5 py-2.5 rounded-full text-[11px] sm:text-[13px] font-semibold transition-all bg-purple text-white shadow-lg shadow-purple/30'
                    : 'flex-1 px-3 sm:px-5 py-2.5 rounded-full text-[11px] sm:text-[13px] font-semibold transition-all text-gray-600 hover:text-purple'
                }
              >
                <span className="hidden sm:inline">Descrever meu problema</span>
                <span className="sm:hidden">Problema</span>
              </button>
              <button
                onClick={() => setSearchMode('service' as SearchMode)}
                className={
                  (searchMode as string) === 'service'
                    ? 'flex-1 px-3 sm:px-5 py-2.5 rounded-full text-[11px] sm:text-[13px] font-semibold transition-all bg-purple text-white shadow-lg shadow-purple/30'
                    : 'flex-1 px-3 sm:px-5 py-2.5 rounded-full text-[11px] sm:text-[13px] font-semibold transition-all text-gray-600 hover:text-purple'
                }
              >
                <span className="hidden sm:inline">Cotar serviço</span>
                <span className="sm:hidden">Serviço</span>
              </button>
            </div>
            <div className="relative">
              <input
                type="text"
                className="w-full px-5 sm:px-7 py-4 sm:py-5 pr-16 sm:pr-52 bg-white border-[1.5px] border-gray-300 rounded-full text-[15px] sm:text-[17px] text-gray-900 outline-none transition-all focus:border-purple focus:shadow-[0_0_0_4px_rgba(98,57,150,0.15)] placeholder:text-gray-400"
                placeholder="Ex: Cheiro de combustível nos tanques..."
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                onKeyPress={handleKeyPress}
              />
              <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-1 sm:gap-2 items-center">
                {isSupported && (
                  <button
                    onClick={handleMicClick}
                    className={`p-2 sm:p-3 rounded-full transition-all ${
                      isListening
                        ? 'bg-red-500 text-white animate-pulse'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                    title={isListening ? 'Parar gravação' : 'Gravar áudio'}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 sm:h-5 sm:w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 015 8a1 1 0 00-2 0 7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                )}
                <button
                  onClick={handleSearch}
                  className="bg-purple text-white px-4 sm:px-7 py-2.5 sm:py-3.5 rounded-full text-[13px] sm:text-[15px] font-semibold hover:bg-purple-medium hover:scale-[1.02] transition-all shadow-lg shadow-purple/20"
                >
                  <span className="hidden sm:inline">Buscar</span>
                  <Search className="w-4 h-4 sm:hidden" />
                </button>
              </div>
            </div>
          </>
        )}

        {/* Exemplos de busca */}
        <div className="flex gap-2.5 mt-4 flex-wrap justify-center">
          {(searchMode === 'problem' ? problemExamples : serviceExamples).map((example, idx) => (
            <span
              key={idx}
              onClick={() => fillSearch(example)}
              className="text-xs text-gray-600 bg-white border border-purple/20 px-3.5 py-1.5 rounded-full cursor-pointer hover:border-purple hover:text-purple transition-all shadow-sm"
            >
              {example}
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}
