'use client'

import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'
import { MarketplaceHeader } from '@/components/marketplace/MarketplaceHeader'
import { MarketplaceFilters } from '@/components/marketplace/MarketplaceFilters'
import { ProviderCard } from '@/components/marketplace/ProviderCard'
import { useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { Filter, X } from 'lucide-react'
import { useFornecedores } from '@/lib/data/queries'

function MarketplaceContent() {
  const searchParams = useSearchParams()
  const searchFromUrl = searchParams?.get('search') ?? ''
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState<string>(searchFromUrl)
  const [sortBy, setSortBy] = useState<string>('relevance')
  const [isFilterOpen, setIsFilterOpen] = useState(false)

  // Sincroniza mudanças do parâmetro da URL sem setState em effect
  const [prevSearchFromUrl, setPrevSearchFromUrl] = useState(searchFromUrl)
  if (searchFromUrl !== prevSearchFromUrl) {
    setPrevSearchFromUrl(searchFromUrl)
    if (searchFromUrl) {
      setSearchQuery(searchFromUrl)
    }
  }

  const { data: fornecedores, isLoading, error } = useFornecedores({
    search: searchQuery || undefined,
    categoriaSlug: selectedCategory,
  })

  const handleSearch = () => {
    // a query do useFornecedores já reage ao searchQuery
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <Navbar
        showSearch={true}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onSearch={handleSearch}
      />

      <main className="pt-[80px] lg:pt-[80px]">
        <MarketplaceHeader />

        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-4 sm:py-6">
          <div className="flex gap-6 lg:gap-8">
            {/* Filtros Laterais - Desktop */}
            <aside className="hidden lg:block w-[280px] flex-shrink-0">
              <MarketplaceFilters
                selectedCategory={selectedCategory}
                setSelectedCategory={setSelectedCategory}
              />
            </aside>

            {/* Grid de Fornecedores */}
            <div className="flex-1 min-w-0">
              {/* Barra de Resultados e Ordenação */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0 mb-4 sm:mb-6">
                <div className="flex items-center gap-3 w-full sm:w-auto">
                  {/* Botão Filtros Mobile */}
                  <button
                    onClick={() => setIsFilterOpen(true)}
                    className="lg:hidden flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium hover:border-purple hover:text-purple transition-colors"
                  >
                    <Filter className="w-4 h-4" />
                    Filtros
                  </button>

                  <div className="text-sm sm:text-base text-gray-600">
                    <span className="font-semibold text-gray-900">{fornecedores?.length ?? 0}</span> <span className="hidden sm:inline">fornecedores encontrados</span><span className="sm:hidden">encontrados</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto">
                  <span className="text-xs sm:text-sm text-gray-600 flex-shrink-0">Ordenar:</span>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="flex-1 sm:flex-initial px-3 sm:px-4 py-2 border border-gray-200 rounded-lg text-xs sm:text-sm focus:outline-none focus:border-purple transition-colors"
                  >
                    <option value="relevance">Mais relevantes</option>
                    <option value="rating">Melhor avaliados</option>
                    <option value="distance">Mais próximos</option>
                    <option value="price">Menor preço</option>
                  </select>
                </div>
              </div>

              {/* Grid de Cards */}
              {isLoading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div
                      key={i}
                      className="bg-white border border-gray-200 rounded-xl h-[400px] animate-pulse"
                    />
                  ))}
                </div>
              ) : error ? (
                <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-sm text-red-600">
                  Erro ao carregar fornecedores: {(error as Error).message}
                </div>
              ) : !fornecedores || fornecedores.length === 0 ? (
                <div className="bg-white border border-gray-200 rounded-xl p-10 text-center">
                  <p className="text-gray-600 font-medium mb-1">Nenhum fornecedor encontrado</p>
                  <p className="text-sm text-gray-500">
                    Seja o primeiro a cadastrar sua empresa no Conekta.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
                  {fornecedores.map((provider) => (
                    <ProviderCard key={provider.id} provider={provider} />
                  ))}
                </div>
              )}

              {/* Paginação */}
              <div className="mt-8 sm:mt-12 flex justify-center items-center gap-1 sm:gap-2">
                <button className="px-3 sm:px-4 py-2 border border-gray-200 rounded-lg text-xs sm:text-sm text-gray-600 hover:border-purple hover:text-purple transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                  <span className="hidden sm:inline">Anterior</span>
                  <span className="sm:hidden">Ant</span>
                </button>
                <button className="px-3 sm:px-4 py-2 bg-purple text-white rounded-lg text-xs sm:text-sm font-medium">
                  1
                </button>
                <button className="px-3 sm:px-4 py-2 border border-gray-200 rounded-lg text-xs sm:text-sm text-gray-600 hover:border-purple hover:text-purple transition-colors">
                  2
                </button>
                <button className="px-3 sm:px-4 py-2 border border-gray-200 rounded-lg text-xs sm:text-sm text-gray-600 hover:border-purple hover:text-purple transition-colors">
                  3
                </button>
                <button className="px-3 sm:px-4 py-2 border border-gray-200 rounded-lg text-xs sm:text-sm text-gray-600 hover:border-purple hover:text-purple transition-colors">
                  <span className="hidden sm:inline">Próximo</span>
                  <span className="sm:hidden">Prox</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Modal de Filtros Mobile */}
      {isFilterOpen && (
        <div className="lg:hidden fixed inset-0 z-[200] bg-black/50" onClick={() => setIsFilterOpen(false)}>
          <div
            className="absolute right-0 top-0 bottom-0 w-full max-w-[340px] bg-white shadow-2xl overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 bg-white border-b border-gray-200 px-4 py-4 flex items-center justify-between z-10">
              <h2 className="font-display font-semibold text-lg text-gray-900">Filtros</h2>
              <button
                onClick={() => setIsFilterOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>
            <div className="p-4">
              <MarketplaceFilters
                selectedCategory={selectedCategory}
                setSelectedCategory={setSelectedCategory}
              />
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  )
}

export default function MarketplacePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando marketplace...</p>
        </div>
      </div>
    }>
      <MarketplaceContent />
    </Suspense>
  )
}
