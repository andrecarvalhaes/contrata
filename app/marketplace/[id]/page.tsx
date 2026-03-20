import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'
import { Star, MapPin, Clock, Award, BadgeCheck, Mail, Phone, Shield, TrendingUp, CheckCircle2, Wrench, ChevronRight } from 'lucide-react'
import Link from 'next/link'
import { ProviderDetailClient } from '@/components/marketplace/ProviderDetailClient'

// Mock data - substituir por fetch real
const mockProviderDetails = {
  1: {
    id: 1,
    name: 'TechPetro Manutenção',
    category: 'Manutenção de Bombas',
    rating: 4.8,
    reviews: 127,
    location: 'São Paulo, SP',
    distance: '2.5 km',
    verified: true,
    certifications: ['NR-13', 'ISO 9001'],
    description: 'Especialista em manutenção preventiva e corretiva de bombas de combustível com mais de 15 anos de experiência no mercado.',
    responseTime: '2h',
    startingPrice: 350,
    fullDescription: 'A TechPetro Manutenção é referência em serviços de manutenção de bombas de combustível na região metropolitana de São Paulo. Com equipe altamente qualificada e equipamentos de última geração, oferecemos soluções completas para postos de combustível.',
    phone: '(11) 98765-4321',
    email: 'contato@techpetro.com.br',
    address: 'Rua das Bombas, 123 - Vila Mariana, São Paulo - SP',
    workingHours: 'Segunda a Sexta: 7h às 18h | Sábado: 8h às 13h',
    experience: '15 anos',
    completedJobs: 2341,
    responseRate: '98%',
    services: [
      { name: 'Manutenção Preventiva de Bombas', price: 350, duration: '2-3 horas' },
      { name: 'Manutenção Corretiva de Bombas', price: 450, duration: '3-5 horas' },
      { name: 'Troca de Bico e Mangueira', price: 280, duration: '1-2 horas' },
      { name: 'Calibração de Bombas', price: 320, duration: '2-3 horas' },
      { name: 'Inspeção Completa do Sistema', price: 500, duration: '4-6 horas' },
    ],
    reviews_list: [
      {
        id: 1,
        name: 'Carlos Silva',
        rating: 5,
        date: '2 dias atrás',
        comment: 'Excelente serviço! Resolveram o problema da bomba rapidamente e o preço foi justo. Recomendo!',
        service: 'Manutenção Corretiva de Bombas'
      },
      {
        id: 2,
        name: 'Maria Santos',
        rating: 5,
        date: '1 semana atrás',
        comment: 'Muito profissionais e pontuais. Fizeram a manutenção preventiva de todas as bombas do posto.',
        service: 'Manutenção Preventiva de Bombas'
      },
      {
        id: 3,
        name: 'João Oliveira',
        rating: 4,
        date: '2 semanas atrás',
        comment: 'Bom atendimento e serviço de qualidade. Única observação é que demoraram um pouco mais que o esperado.',
        service: 'Calibração de Bombas'
      },
    ],
  },
}

export function generateStaticParams() {
  return [
    { id: '1' },
    { id: '2' },
    { id: '3' },
    { id: '4' },
    { id: '5' },
    { id: '6' },
  ]
}

export default function ProviderDetailPage({ params }: { params: { id: string } }) {
  const providerId = params.id as '1' | keyof typeof mockProviderDetails
  const provider = mockProviderDetails[providerId] || mockProviderDetails[1]

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
              <span className="text-gray-900 font-medium truncate">{provider.name}</span>
            </div>
          </div>
        </div>

        {/* Hero Section */}
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-6 sm:py-8">
            <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
              {/* Logo/Image */}
              <div className="flex-shrink-0">
                <div className="w-full lg:w-[200px] h-[200px] bg-gradient-to-br from-purple/10 to-purple-medium/10 rounded-2xl flex items-center justify-center">
                  <Wrench className="w-24 h-24 text-purple/30" />
                </div>
              </div>

              {/* Info Principal */}
              <div className="flex-1 min-w-0">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <h1 className="text-2xl sm:text-3xl font-display font-bold text-gray-900">
                        {provider.name}
                      </h1>
                      {provider.verified && (
                        <BadgeCheck className="w-6 h-6 text-purple flex-shrink-0" />
                      )}
                    </div>
                    <p className="text-purple font-medium mb-3">{provider.category}</p>
                    <p className="text-gray-600 leading-relaxed">{provider.fullDescription}</p>
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mt-6">
                  <div className="bg-gray-50 rounded-xl p-3 sm:p-4">
                    <div className="flex items-center gap-2 mb-1">
                      <Star className="w-4 h-4 text-amber-500" />
                      <span className="text-xs text-gray-500">Avaliação</span>
                    </div>
                    <div className="text-xl sm:text-2xl font-bold text-gray-900">{provider.rating}</div>
                    <div className="text-xs text-gray-500">{provider.reviews} avaliações</div>
                  </div>

                  <div className="bg-gray-50 rounded-xl p-3 sm:p-4">
                    <div className="flex items-center gap-2 mb-1">
                      <TrendingUp className="w-4 h-4 text-green-600" />
                      <span className="text-xs text-gray-500">Taxa de resposta</span>
                    </div>
                    <div className="text-xl sm:text-2xl font-bold text-gray-900">{provider.responseRate}</div>
                    <div className="text-xs text-gray-500">Responde em {provider.responseTime}</div>
                  </div>

                  <div className="bg-gray-50 rounded-xl p-3 sm:p-4">
                    <div className="flex items-center gap-2 mb-1">
                      <CheckCircle2 className="w-4 h-4 text-purple" />
                      <span className="text-xs text-gray-500">Trabalhos</span>
                    </div>
                    <div className="text-xl sm:text-2xl font-bold text-gray-900">{provider.completedJobs}</div>
                    <div className="text-xs text-gray-500">Concluídos</div>
                  </div>

                  <div className="bg-gray-50 rounded-xl p-3 sm:p-4">
                    <div className="flex items-center gap-2 mb-1">
                      <Clock className="w-4 h-4 text-blue-600" />
                      <span className="text-xs text-gray-500">Experiência</span>
                    </div>
                    <div className="text-xl sm:text-2xl font-bold text-gray-900">{provider.experience}</div>
                    <div className="text-xs text-gray-500">no mercado</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Conteúdo Principal */}
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-6 sm:py-8">
          <div className="grid lg:grid-cols-3 gap-6 lg:gap-8">
            {/* Coluna Principal */}
            <div className="lg:col-span-2 space-y-6">
              <ProviderDetailClient
                services={provider.services}
                reviews={provider.reviews_list}
                provider={{ name: provider.name, phone: provider.phone, email: provider.email }}
              />

              {/* Certificações */}
              <div className="bg-white rounded-2xl p-5 sm:p-6 shadow-sm border border-gray-200">
                <h2 className="text-xl font-display font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Shield className="w-5 h-5 text-purple" />
                  Certificações e Qualificações
                </h2>
                <div className="flex flex-wrap gap-3">
                  {provider.certifications.map((cert) => (
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
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-200 sticky top-24">
                <h3 className="font-display font-bold text-gray-900 mb-4">Informações</h3>

                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <div className="text-sm font-medium text-gray-900 mb-1">Localização</div>
                      <div className="text-sm text-gray-600">{provider.address}</div>
                      <div className="text-xs text-purple font-medium mt-1">{provider.distance} de você</div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Clock className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <div className="text-sm font-medium text-gray-900 mb-1">Horário de Atendimento</div>
                      <div className="text-sm text-gray-600">{provider.workingHours}</div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Phone className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <div className="text-sm font-medium text-gray-900 mb-1">Telefone</div>
                      <a href={`tel:${provider.phone}`} className="text-sm text-purple hover:underline">
                        {provider.phone}
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Mail className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <div className="text-sm font-medium text-gray-900 mb-1">E-mail</div>
                      <a href={`mailto:${provider.email}`} className="text-sm text-purple hover:underline break-all">
                        {provider.email}
                      </a>
                    </div>
                  </div>
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
