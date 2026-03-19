'use client'

import { Star, Award, MapPin, Clock, DollarSign } from 'lucide-react'
import { categories } from '@/lib/data/services'
import { CategoryIcon } from './CategoryIcon'

interface MarketplaceFiltersProps {
  selectedCategory: string
  setSelectedCategory: (category: string) => void
}

const certifications = [
  { id: 'nr13', name: 'NR-13', count: 89 },
  { id: 'iso9001', name: 'ISO 9001', count: 67 },
  { id: 'iso14001', name: 'ISO 14001', count: 54 },
  { id: 'nr10', name: 'NR-10', count: 43 },
  { id: 'cetesb', name: 'CETESB', count: 31 },
]

export function MarketplaceFilters({ selectedCategory, setSelectedCategory }: MarketplaceFiltersProps) {
  return (
    <div className="lg:sticky lg:top-24 space-y-4 lg:space-y-6">
      {/* Categorias */}
      <div className="bg-white border border-gray-200 rounded-xl p-5">
        <h3 className="font-display font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <span className="w-1 h-5 bg-purple rounded-full" />
          Categorias
        </h3>
        <div className="space-y-2">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`w-full flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm transition-all ${
                selectedCategory === category.id
                  ? 'bg-purple/10 text-purple font-medium'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <CategoryIcon
                iconName={category.iconName}
                className={selectedCategory === category.id ? 'w-4 h-4 text-purple' : 'w-4 h-4 text-gray-500'}
              />
              <span>{category.name}</span>
              <span className={`ml-auto text-xs ${selectedCategory === category.id ? 'text-purple' : 'text-gray-400'}`}>
                {category.count}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Avaliação */}
      <div className="bg-white border border-gray-200 rounded-xl p-5">
        <h3 className="font-display font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Star className="w-4 h-4 text-amber-500" />
          Avaliação
        </h3>
        <div className="space-y-2">
          {[5, 4, 3].map((stars) => (
            <label key={stars} className="flex items-center gap-2 cursor-pointer group">
              <input type="checkbox" className="rounded border-gray-300 text-purple focus:ring-purple" />
              <div className="flex items-center gap-1">
                {Array.from({ length: stars }).map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-500 text-amber-500" />
                ))}
                {Array.from({ length: 5 - stars }).map((_, i) => (
                  <Star key={i} className="w-4 h-4 text-gray-300" />
                ))}
              </div>
              <span className="text-sm text-gray-600 group-hover:text-purple transition-colors">
                ou mais
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Certificações */}
      <div className="bg-white border border-gray-200 rounded-xl p-5">
        <h3 className="font-display font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Award className="w-4 h-4 text-purple" />
          Certificações
        </h3>
        <div className="space-y-2">
          {certifications.map((cert) => (
            <label key={cert.id} className="flex items-center justify-between cursor-pointer group">
              <div className="flex items-center gap-2">
                <input type="checkbox" className="rounded border-gray-300 text-purple focus:ring-purple" />
                <span className="text-sm text-gray-700 group-hover:text-purple transition-colors">
                  {cert.name}
                </span>
              </div>
              <span className="text-xs text-gray-400">{cert.count}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Distância */}
      <div className="bg-white border border-gray-200 rounded-xl p-5">
        <h3 className="font-display font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <MapPin className="w-4 h-4 text-purple" />
          Distância
        </h3>
        <div className="space-y-3">
          <label className="flex items-center gap-2 cursor-pointer group">
            <input type="radio" name="distance" className="text-purple focus:ring-purple" defaultChecked />
            <span className="text-sm text-gray-700 group-hover:text-purple transition-colors">Qualquer distância</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer group">
            <input type="radio" name="distance" className="text-purple focus:ring-purple" />
            <span className="text-sm text-gray-700 group-hover:text-purple transition-colors">Até 5 km</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer group">
            <input type="radio" name="distance" className="text-purple focus:ring-purple" />
            <span className="text-sm text-gray-700 group-hover:text-purple transition-colors">Até 10 km</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer group">
            <input type="radio" name="distance" className="text-purple focus:ring-purple" />
            <span className="text-sm text-gray-700 group-hover:text-purple transition-colors">Até 25 km</span>
          </label>
        </div>
      </div>

      {/* Tempo de Resposta */}
      <div className="bg-white border border-gray-200 rounded-xl p-5">
        <h3 className="font-display font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Clock className="w-4 h-4 text-purple" />
          Tempo de Resposta
        </h3>
        <div className="space-y-2">
          <label className="flex items-center gap-2 cursor-pointer group">
            <input type="checkbox" className="rounded border-gray-300 text-purple focus:ring-purple" />
            <span className="text-sm text-gray-700 group-hover:text-purple transition-colors">Até 2 horas</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer group">
            <input type="checkbox" className="rounded border-gray-300 text-purple focus:ring-purple" />
            <span className="text-sm text-gray-700 group-hover:text-purple transition-colors">Até 6 horas</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer group">
            <input type="checkbox" className="rounded border-gray-300 text-purple focus:ring-purple" />
            <span className="text-sm text-gray-700 group-hover:text-purple transition-colors">Até 24 horas</span>
          </label>
        </div>
      </div>

      {/* Faixa de Preço */}
      <div className="bg-white border border-gray-200 rounded-xl p-5">
        <h3 className="font-display font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <DollarSign className="w-4 h-4 text-purple" />
          Faixa de Preço
        </h3>
        <div className="space-y-3">
          <div className="flex gap-2">
            <input
              type="number"
              placeholder="Min"
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-purple"
            />
            <input
              type="number"
              placeholder="Max"
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-purple"
            />
          </div>
          <button className="w-full bg-purple/10 text-purple py-2 rounded-lg text-sm font-medium hover:bg-purple/20 transition-colors">
            Aplicar
          </button>
        </div>
      </div>

      {/* Botão Limpar Filtros */}
      <button className="w-full bg-gray-100 text-gray-700 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors">
        Limpar todos os filtros
      </button>
    </div>
  )
}
