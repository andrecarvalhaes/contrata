'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Search, MapPin, Menu, X, ChevronDown, AlertTriangle, CreditCard, ShoppingCart } from 'lucide-react'

interface NavbarProps {
  showSearch?: boolean
  searchQuery?: string
  onSearchChange?: (value: string) => void
  onSearch?: () => void
}

const ferramentasConekta = [
  {
    href: '/conheca/sos',
    icon: AlertTriangle,
    label: 'SOS Conekta',
    desc: 'Cotação urgente para todos os fornecedores',
    color: 'text-red-600',
    bgColor: 'bg-red-50',
  },
  {
    href: '/conheca/conekta-pay',
    icon: CreditCard,
    label: 'Conekta Pay',
    desc: 'Pagamento seguro e parcelado',
    color: 'text-orange-600',
    bgColor: 'bg-orange-50',
  },
  {
    href: '/conheca/shop',
    icon: ShoppingCart,
    label: 'Shop Conekta',
    desc: 'Marketplace de produtos',
    color: 'text-purple',
    bgColor: 'bg-purple-50',
  },
]

export function Navbar({ showSearch = false, searchQuery = '', onSearchChange, onSearch }: NavbarProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isFerramentasOpen, setIsFerramentasOpen] = useState(false)

  return (
    <nav className="fixed top-0 left-0 right-0 z-[100] backdrop-blur-[20px] bg-white/95 border-b border-gray-200 transition-all">
      <div className="px-4 sm:px-6 py-3 sm:py-4 max-w-[1600px] mx-auto">
        <div className="flex items-center justify-between gap-4">
          <Link href="/" className="font-display text-[24px] sm:text-[28px] font-bold text-purple tracking-tight hover:opacity-80 transition-opacity flex-shrink-0">
            cone<span className="text-amber-500">k</span>ta
          </Link>

          {/* Busca do Marketplace - Desktop */}
          {showSearch && (
            <div className="hidden lg:flex flex-1 max-w-[800px] mx-8 gap-3">
              {/* Campo de Busca */}
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Busque por serviço, categoria ou palavra-chave..."
                  value={searchQuery}
                  onChange={(e) => onSearchChange?.(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && onSearch?.()}
                  className="w-full pl-11 pr-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-purple focus:ring-2 focus:ring-purple/10 transition-all"
                />
              </div>

              {/* Campo de Localização */}
              <div className="relative w-[220px]">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Cidade ou CEP"
                  className="w-full pl-10 pr-3 py-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-purple focus:ring-2 focus:ring-purple/10 transition-all"
                />
              </div>

              {/* Botão de Busca */}
              <button
                onClick={onSearch}
                className="bg-purple text-white px-6 py-2.5 rounded-lg font-semibold hover:bg-purple-medium transition-all shadow-md shadow-purple/20 flex items-center gap-2"
              >
                <Search className="w-4 h-4" />
                Buscar
              </button>
            </div>
          )}

          {/* Menu Desktop */}
          <div className="hidden md:flex gap-3 lg:gap-6 items-center flex-shrink-0">
            {/* Dropdown Ferramentas */}
            <div
              className="relative"
              onMouseEnter={() => setIsFerramentasOpen(true)}
              onMouseLeave={() => setIsFerramentasOpen(false)}
            >
              <button className="flex items-center gap-1 text-sm text-gray-600 font-medium hover:text-purple transition-colors">
                Ferramentas
                <ChevronDown className="w-4 h-4" />
              </button>

              {isFerramentasOpen && (
                <div className="absolute top-full left-0 mt-2 w-72 bg-white rounded-xl shadow-2xl border border-gray-200 p-2 z-50">
                  {ferramentasConekta.map((ferramenta) => {
                    const Icon = ferramenta.icon
                    return (
                      <Link
                        key={ferramenta.href}
                        href={ferramenta.href}
                        className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <div className={`w-10 h-10 ${ferramenta.bgColor} rounded-lg flex items-center justify-center flex-shrink-0`}>
                          <Icon className={`w-5 h-5 ${ferramenta.color}`} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-gray-900">{ferramenta.label}</p>
                          <p className="text-xs text-gray-500 mt-0.5">{ferramenta.desc}</p>
                        </div>
                      </Link>
                    )
                  })}
                </div>
              )}
            </div>

            <Link href="/conheca" className="text-sm text-gray-600 font-medium hover:text-purple transition-colors">
              Conheça
            </Link>
            <Link href="/login" className="text-sm text-gray-600 font-medium hover:text-purple transition-colors">
              Login
            </Link>
            <Link
              href="/cadastro"
              className="bg-white text-purple px-4 lg:px-5 py-2 lg:py-2.5 rounded-full text-sm font-semibold border border-purple/30 hover:border-purple hover:-translate-y-px transition-all"
            >
              Cadastre-se
            </Link>
            <Link
              href="/seja-fornecedor"
              className="bg-purple text-white px-4 lg:px-6 py-2 lg:py-2.5 rounded-full text-sm font-semibold hover:bg-purple-medium hover:-translate-y-px transition-all shadow-lg shadow-purple/30 hidden lg:flex"
            >
              Seja Fornecedor
            </Link>
          </div>

          {/* Menu Mobile Hamburger */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 text-gray-600 hover:text-purple transition-colors"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Busca do Marketplace - Mobile */}
        {showSearch && (
          <div className="lg:hidden mt-3 space-y-2">
            {/* Campo de Busca */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Busque por serviço..."
                value={searchQuery}
                onChange={(e) => onSearchChange?.(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && onSearch?.()}
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-purple focus:ring-2 focus:ring-purple/10 transition-all"
              />
            </div>

            {/* Campo de Localização e Botão */}
            <div className="flex gap-2">
              <div className="flex-1 relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Localização"
                  className="w-full pl-10 pr-3 py-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-purple focus:ring-2 focus:ring-purple/10 transition-all"
                />
              </div>
              <button
                onClick={onSearch}
                className="bg-purple text-white px-5 py-2.5 rounded-lg font-semibold hover:bg-purple-medium transition-all shadow-md shadow-purple/20"
              >
                Buscar
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Menu Mobile Dropdown */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200">
          <div className="px-4 py-3 space-y-3">
            {/* Ferramentas Conekta - Mobile */}
            <div className="border-b border-gray-100 pb-3 mb-3">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">
                Ferramentas Conekta
              </p>
              {ferramentasConekta.map((ferramenta) => {
                const Icon = ferramenta.icon
                return (
                  <Link
                    key={ferramenta.href}
                    href={ferramenta.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center gap-3 py-2 hover:bg-gray-50 rounded-lg px-2 transition-colors"
                  >
                    <div className={`w-8 h-8 ${ferramenta.bgColor} rounded-lg flex items-center justify-center flex-shrink-0`}>
                      <Icon className={`w-4 h-4 ${ferramenta.color}`} />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">{ferramenta.label}</p>
                      <p className="text-xs text-gray-500">{ferramenta.desc}</p>
                    </div>
                  </Link>
                )
              })}
            </div>

            <Link
              href="/conheca"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block text-gray-600 font-medium hover:text-purple transition-colors py-2"
            >
              Conheça
            </Link>
            <Link
              href="/login"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block text-gray-600 font-medium hover:text-purple transition-colors py-2"
            >
              Login
            </Link>
            <Link
              href="/cadastro"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block text-center bg-white text-purple px-5 py-2.5 rounded-full text-sm font-semibold border border-purple/30 hover:border-purple transition-all"
            >
              Cadastre-se
            </Link>
            <Link
              href="/seja-fornecedor"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block text-center bg-purple text-white px-6 py-2.5 rounded-full text-sm font-semibold hover:bg-purple-medium transition-all shadow-lg shadow-purple/30"
            >
              Seja Fornecedor
            </Link>
          </div>
        </div>
      )}
    </nav>
  )
}
