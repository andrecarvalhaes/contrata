'use client'

import { Suspense } from 'react'
import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'
import {
  Star,
  MapPin,
  Clock,
  Award,
  BadgeCheck,
  Mail,
  Phone,
  Shield,
  CheckCircle2,
  Wrench,
  ChevronRight,
} from 'lucide-react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { ProviderDetailClient } from '@/components/marketplace/ProviderDetailClient'
import { useFornecedor } from '@/lib/data/queries'

function formatReais(centavos: number | null | undefined): number {
  if (!centavos) return 0
  return Math.round(centavos / 100)
}

function formatDataRelativa(iso: string): string {
  const d = new Date(iso)
  const diffMs = Date.now() - d.getTime()
  const diffDias = Math.floor(diffMs / (1000 * 60 * 60 * 24))
  if (diffDias < 1) return 'hoje'
  if (diffDias < 7) return `${diffDias} dia${diffDias > 1 ? 's' : ''} atrás`
  if (diffDias < 30) return `${Math.floor(diffDias / 7)} semana${diffDias >= 14 ? 's' : ''} atrás`
  return `${Math.floor(diffDias / 30)} mês${diffDias >= 60 ? 'es' : ''} atrás`
}

function LoadingState() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple mx-auto mb-4" />
        <p className="text-gray-600">Carregando fornecedor...</p>
      </div>
    </div>
  )
}

function NotFoundState() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center max-w-md px-6">
        <h1 className="text-2xl font-display font-bold text-gray-900 mb-2">
          Fornecedor não encontrado
        </h1>
        <p className="text-gray-600 mb-6">
          O fornecedor que você está procurando não existe ou foi removido.
        </p>
        <Link
          href="/marketplace"
          className="inline-flex items-center gap-2 px-5 py-3 bg-purple text-white rounded-lg font-medium hover:bg-purple-medium transition-colors"
        >
          Voltar ao marketplace
        </Link>
      </div>
    </div>
  )
}

function ProviderDetailContent() {
  const params = useSearchParams()
  const id = params.get('id')
  const { data: provider, isLoading, error } = useFornecedor(id)

  if (isLoading) return <LoadingState />
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-red-600">Erro ao carregar fornecedor.</p>
        </div>
      </div>
    )
  }
  if (!provider) return <NotFoundState />

  const localizacao = [provider.cidade, provider.estado].filter(Boolean).join(', ')

  const servicosFormatados = provider.servicos.map((s) => ({
    name: s.nome,
    price: formatReais(s.preco_base ? s.preco_base * 100 : null),
    duration: '',
  }))

  const reviewsFormatados = provider.avaliacoes.map((av, idx) => ({
    id: idx + 1,
    name: av.autor_nome || 'Usuário',
    rating: av.nota,
    date: formatDataRelativa(av.created_at),
    comment: av.comentario || '',
    service: '',
  }))

  return (
    <div className="bg-gray-50 min-h-screen">
      <Navbar />

      <main className="pt-[80px]">
        {/* Breadcrumb */}
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-3">
            <div className="flex items-center gap-2 text-sm">
              <Link href="/" className="text-gray-500 hover:text-purple transition-colors">
                Início
              </Link>
              <ChevronRight className="w-4 h-4 text-gray-400" />
              <Link href="/marketplace" className="text-gray-500 hover:text-purple transition-colors">
                Marketplace
              </Link>
              <ChevronRight className="w-4 h-4 text-gray-400" />
              <span className="text-gray-900 font-medium truncate">{provider.nome}</span>
            </div>
          </div>
        </div>

        {/* Hero Section */}
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-6 sm:py-8">
            <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
              <div className="flex-shrink-0">
                <div className="w-full lg:w-[200px] h-[200px] bg-gradient-to-br from-purple/10 to-purple-medium/10 rounded-2xl flex items-center justify-center">
                  <Wrench className="w-24 h-24 text-purple/30" />
                </div>
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <h1 className="text-2xl sm:text-3xl font-display font-bold text-gray-900">
                        {provider.nome}
                      </h1>
                      {provider.verificado && (
                        <BadgeCheck className="w-6 h-6 text-purple flex-shrink-0" />
                      )}
                    </div>
                    {provider.categoria_nome && (
                      <p className="text-purple font-medium mb-3">{provider.categoria_nome}</p>
                    )}
                    {provider.descricao && (
                      <p className="text-gray-600 leading-relaxed">{provider.descricao}</p>
                    )}
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4 mt-6">
                  <div className="bg-gray-50 rounded-xl p-3 sm:p-4">
                    <div className="flex items-center gap-2 mb-1">
                      <Star className="w-4 h-4 text-amber-500" />
                      <span className="text-xs text-gray-500">Avaliação</span>
                    </div>
                    <div className="text-xl sm:text-2xl font-bold text-gray-900">
                      {provider.rating.toFixed(1)}
                    </div>
                    <div className="text-xs text-gray-500">
                      {provider.total_avaliacoes} avaliações
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-xl p-3 sm:p-4">
                    <div className="flex items-center gap-2 mb-1">
                      <Clock className="w-4 h-4 text-blue-600" />
                      <span className="text-xs text-gray-500">Responde em</span>
                    </div>
                    <div className="text-xl sm:text-2xl font-bold text-gray-900">
                      {provider.tempo_resposta_horas ? `${provider.tempo_resposta_horas}h` : '—'}
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-xl p-3 sm:p-4">
                    <div className="flex items-center gap-2 mb-1">
                      <CheckCircle2 className="w-4 h-4 text-purple" />
                      <span className="text-xs text-gray-500">Serviços</span>
                    </div>
                    <div className="text-xl sm:text-2xl font-bold text-gray-900">
                      {provider.servicos.length}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Conteúdo Principal */}
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-6 sm:py-8">
          <div className="grid lg:grid-cols-3 gap-6 lg:gap-8">
            <div className="lg:col-span-2 space-y-6">
              <ProviderDetailClient
                services={servicosFormatados}
                reviews={reviewsFormatados}
                provider={{
                  name: provider.nome,
                  phone: provider.telefone || '',
                  email: provider.email_contato || '',
                }}
              />

              {/* Certificações */}
              {provider.certificacoes.length > 0 && (
                <div className="bg-white rounded-2xl p-5 sm:p-6 shadow-sm border border-gray-200">
                  <h2 className="text-xl font-display font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <Shield className="w-5 h-5 text-purple" />
                    Certificações e Qualificações
                  </h2>
                  <div className="flex flex-wrap gap-3">
                    {provider.certificacoes.map((cert) => (
                      <div
                        key={cert}
                        className="flex items-center gap-2 px-4 py-2 bg-purple/5 border border-purple/20 rounded-lg"
                      >
                        <Award className="w-5 h-5 text-purple" />
                        <span className="font-medium text-gray-900">{cert}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-200 sticky top-24">
                <h3 className="font-display font-bold text-gray-900 mb-4">Informações</h3>

                <div className="space-y-4">
                  {(localizacao || provider.endereco) && (
                    <div className="flex items-start gap-3">
                      <MapPin className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                      <div>
                        <div className="text-sm font-medium text-gray-900 mb-1">Localização</div>
                        <div className="text-sm text-gray-600">
                          {provider.endereco || localizacao}
                        </div>
                      </div>
                    </div>
                  )}

                  {provider.telefone && (
                    <div className="flex items-start gap-3">
                      <Phone className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                      <div>
                        <div className="text-sm font-medium text-gray-900 mb-1">Telefone</div>
                        <a
                          href={`tel:${provider.telefone}`}
                          className="text-sm text-purple hover:underline"
                        >
                          {provider.telefone}
                        </a>
                      </div>
                    </div>
                  )}

                  {provider.email_contato && (
                    <div className="flex items-start gap-3">
                      <Mail className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                      <div>
                        <div className="text-sm font-medium text-gray-900 mb-1">E-mail</div>
                        <a
                          href={`mailto:${provider.email_contato}`}
                          className="text-sm text-purple hover:underline break-all"
                        >
                          {provider.email_contato}
                        </a>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}

export default function ProviderDetailPage() {
  return (
    <Suspense fallback={<LoadingState />}>
      <ProviderDetailContent />
    </Suspense>
  )
}
