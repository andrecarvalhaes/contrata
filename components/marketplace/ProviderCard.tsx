'use client'

import { Star, MapPin, Clock, Award, CheckCircle2, ArrowRight, Wrench } from 'lucide-react'
import Link from 'next/link'

interface Provider {
  id: number
  name: string
  category: string
  rating: number
  reviews: number
  location: string
  distance: string
  image: string
  verified: boolean
  certifications: string[]
  description: string
  responseTime: string
  startingPrice: number
}

interface ProviderCardProps {
  provider: Provider
}

export function ProviderCard({ provider }: ProviderCardProps) {
  return (
    <Link
      href={`/marketplace/${provider.id}`}
      className="group bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-xl hover:shadow-purple/10 hover:border-purple/30 hover:-translate-y-1 transition-all duration-300"
    >
      {/* Imagem */}
      <div className="relative h-48 bg-gradient-to-br from-purple/10 to-purple-medium/10 overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center">
          <Wrench className="w-20 h-20 text-purple/20" />
        </div>

        {/* Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-start justify-between">
          <div className="flex flex-col gap-2">
            {provider.verified && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-purple text-white rounded-full text-xs font-medium">
                <CheckCircle2 className="w-3 h-3" />
                Verificado
              </span>
            )}
          </div>
          <div className="flex items-center gap-1 px-2.5 py-1 bg-white/95 backdrop-blur-sm rounded-full">
            <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
            <span className="text-sm font-semibold text-gray-900">{provider.rating}</span>
          </div>
        </div>
      </div>

      {/* Conteúdo */}
      <div className="p-4 sm:p-5">
        {/* Categoria */}
        <div className="text-xs text-purple font-medium mb-1.5">
          {provider.category}
        </div>

        {/* Nome */}
        <h3 className="font-display text-base sm:text-lg font-bold text-gray-900 mb-2 group-hover:text-purple transition-colors">
          {provider.name}
        </h3>

        {/* Descrição */}
        <p className="text-xs sm:text-sm text-gray-600 mb-3 sm:mb-4 line-clamp-2">
          {provider.description}
        </p>

        {/* Certificações */}
        <div className="flex flex-wrap gap-1.5 mb-3 sm:mb-4">
          {provider.certifications.map((cert) => (
            <span
              key={cert}
              className="inline-flex items-center gap-1 px-2 py-0.5 bg-purple/5 text-purple rounded text-[10px] sm:text-xs font-medium"
            >
              <Award className="w-3 h-3" />
              {cert}
            </span>
          ))}
        </div>

        {/* Informações */}
        <div className="space-y-2 mb-3 sm:mb-4 pb-3 sm:pb-4 border-b border-gray-100">
          <div className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-gray-600">
            <MapPin className="w-3.5 sm:w-4 h-3.5 sm:h-4 text-gray-400 flex-shrink-0" />
            <span className="truncate">{provider.location}</span>
            <span className="text-gray-400">•</span>
            <span className="text-purple font-medium flex-shrink-0">{provider.distance}</span>
          </div>

          <div className="flex items-center justify-between text-xs sm:text-sm gap-2">
            <div className="flex items-center gap-1.5 sm:gap-2 text-gray-600 min-w-0">
              <Clock className="w-3.5 sm:w-4 h-3.5 sm:h-4 text-gray-400 flex-shrink-0" />
              <span className="truncate">Responde em {provider.responseTime}</span>
            </div>
            <div className="flex items-center gap-0.5 text-gray-500 flex-shrink-0">
              <Star className="w-3 sm:w-3.5 h-3 sm:h-3.5 fill-amber-500 text-amber-500" />
              <span className="text-[10px] sm:text-xs whitespace-nowrap">
                {provider.reviews} aval.
              </span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between gap-3">
          <div>
            <div className="text-[10px] sm:text-xs text-gray-500 mb-0.5">A partir de</div>
            <div className="text-lg sm:text-xl font-bold text-gray-900">
              R$ {provider.startingPrice}
            </div>
          </div>

          <button className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-5 py-2 sm:py-2.5 bg-purple text-white rounded-lg text-xs sm:text-sm font-medium group-hover:bg-purple-medium transition-colors flex-shrink-0">
            <span className="hidden sm:inline">Ver perfil</span>
            <span className="sm:hidden">Ver</span>
            <ArrowRight className="w-3.5 sm:w-4 h-3.5 sm:h-4 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>
      </div>
    </Link>
  )
}
