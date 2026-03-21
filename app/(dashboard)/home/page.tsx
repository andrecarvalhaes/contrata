"use client";

import Link from "next/link";
import Image from "next/image";
import { ShoppingCart, Star, ArrowRight, AlertTriangle, Tag, ChevronDown, ChevronUp, SlidersHorizontal } from "lucide-react";
import { useState, useRef } from "react";

const categoriasFornecedores = [
  {
    id: "bombas",
    label: "Bombas",
    imagem: "https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=200&h=200&fit=crop",
    novo: false,
  },
  {
    id: "eletrica",
    label: "Elétrica",
    imagem: "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=200&h=200&fit=crop",
    novo: true,
  },
  {
    id: "manutencao",
    label: "Manutenção",
    imagem: "https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=200&h=200&fit=crop",
    novo: false,
  },
  {
    id: "hidraulica",
    label: "Hidráulica",
    imagem: "https://images.unsplash.com/photo-1607400201889-565b1ee75f8e?w=200&h=200&fit=crop",
    novo: false,
  },
  {
    id: "seguranca",
    label: "Segurança",
    imagem: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=200&h=200&fit=crop",
    novo: false,
  },
  {
    id: "cameras",
    label: "Câmeras",
    imagem: "https://images.unsplash.com/photo-1557597774-9d273605dfa9?w=200&h=200&fit=crop",
    novo: true,
  },
  {
    id: "limpeza",
    label: "Limpeza Tanques",
    imagem: "https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=200&h=200&fit=crop",
    novo: false,
  },
  {
    id: "calibradores",
    label: "Calibradores",
    imagem: "https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=200&h=200&fit=crop",
    novo: true,
  },
  {
    id: "distribuidoras",
    label: "Distribuidoras",
    imagem: "https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?w=200&h=200&fit=crop",
    novo: false,
  },
  {
    id: "automacoes",
    label: "Automações",
    imagem: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=200&h=200&fit=crop",
    novo: true,
  },
  {
    id: "erps",
    label: "ERPs",
    imagem: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=200&h=200&fit=crop",
    novo: true,
  },
  {
    id: "rh",
    label: "RH",
    imagem: "https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=200&h=200&fit=crop",
    novo: false,
  },
  {
    id: "advogado",
    label: "Advogado",
    imagem: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=200&h=200&fit=crop",
    novo: false,
  },
  {
    id: "contador",
    label: "Contador",
    imagem: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=200&h=200&fit=crop",
    novo: false,
  },
];

const bannersPublicitarios = [
  {
    id: 1,
    titulo: "Super Ofertas",
    destaque: "Até 40% OFF",
    subtitulo: "em equipamentos e peças selecionadas",
    cta: "Aproveitar agora",
    imagem: "https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=1200&h=500&fit=crop",
    gradient: "from-blue-600 via-blue-500 to-cyan-500",
    badge: "Oferta Relâmpago",
  },
  {
    id: 2,
    titulo: "Conekta Pay",
    destaque: "12x sem juros",
    subtitulo: "em todos os produtos acima de R$ 500",
    cta: "Comprar agora",
    imagem: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1200&h=500&fit=crop",
    gradient: "from-emerald-600 via-green-500 to-teal-500",
    badge: "Pagamento Facilitado",
  },
  {
    id: 3,
    titulo: "Entrega Expressa",
    destaque: "24h na sua região",
    subtitulo: "para pedidos realizados até 18h",
    cta: "Ver produtos",
    imagem: "https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?w=1200&h=500&fit=crop",
    gradient: "from-orange-500 via-amber-500 to-yellow-500",
    badge: "Frete Rápido",
  },
];

const produtosDestaque = [
  {
    id: 1,
    nome: "Bomba Submersa 3CV Premium",
    loja: "TechPosto Store",
    preco: 1890.0,
    precoAntigo: 2400,
    rating: 4.8,
    avaliacoes: 42,
    desconto: 21,
    foto: "https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=400&h=400&fit=crop",
  },
  {
    id: 2,
    nome: "Calibrador Digital Automático",
    loja: "TechPosto Store",
    preco: 459.9,
    rating: 4.7,
    avaliacoes: 28,
    foto: "https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=400&h=400&fit=crop",
  },
  {
    id: 3,
    nome: "Câmera IP 4K com Visão Noturna",
    loja: "SafetyPosto",
    preco: 599.0,
    precoAntigo: 799,
    rating: 4.8,
    avaliacoes: 89,
    desconto: 25,
    foto: "https://images.unsplash.com/photo-1557597774-9d273605dfa9?w=400&h=400&fit=crop",
  },
  {
    id: 4,
    nome: "Sensor de Nível Combustível Digital",
    loja: "TechPosto Store",
    preco: 320.0,
    rating: 4.9,
    avaliacoes: 67,
    foto: "https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=400&h=400&fit=crop",
  },
  {
    id: 5,
    nome: "Mangueira Hidráulica Reforçada 1/2\"",
    loja: "Hidra Parts",
    preco: 189.0,
    precoAntigo: 250,
    rating: 4.6,
    avaliacoes: 56,
    desconto: 24,
    foto: "https://images.unsplash.com/photo-1607400201889-565b1ee75f8e?w=400&h=400&fit=crop",
  },
  {
    id: 6,
    nome: "Extintor CO2 6kg Certificado",
    loja: "SafetyPosto",
    preco: 289.0,
    rating: 4.7,
    avaliacoes: 34,
    foto: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop",
  },
  {
    id: 7,
    nome: "Painel Elétrico Bomba Completo",
    loja: "Eletro Posto SP",
    preco: 890.0,
    rating: 4.8,
    avaliacoes: 45,
    foto: "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=400&h=400&fit=crop",
  },
  {
    id: 8,
    nome: "Kit Ferramentas Automotivas 120 Peças",
    loja: "TechPosto Store",
    preco: 349.0,
    precoAntigo: 499,
    rating: 4.5,
    avaliacoes: 23,
    desconto: 30,
    foto: "https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=400&h=400&fit=crop",
  },
  {
    id: 9,
    nome: "Filtro de Combustível Universal",
    loja: "AutoPeças Pro",
    preco: 45.9,
    rating: 4.6,
    avaliacoes: 156,
    foto: "https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=400&h=400&fit=crop",
  },
  {
    id: 10,
    nome: "Lubrificante Industrial 20L",
    loja: "Eletro Posto SP",
    preco: 219.0,
    precoAntigo: 280,
    rating: 4.5,
    avaliacoes: 78,
    desconto: 22,
    foto: "https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=400&h=400&fit=crop",
  },
];

const fornecedoresDestaque = [
  {
    id: 1,
    name: "TechPetro Manutenção",
    category: "Manutenção de Bombas",
    rating: 4.8,
    reviews: 127,
    location: "São Paulo, SP",
    distance: "2.5 km",
    verified: true,
    certifications: ["NR-13", "ISO 9001"],
    responseTime: "2h",
    startingPrice: 350,
  },
  {
    id: 2,
    name: "Posto Service Pro",
    category: "Limpeza de Tanques",
    rating: 4.9,
    reviews: 203,
    location: "São Paulo, SP",
    distance: "3.8 km",
    verified: true,
    certifications: ["NR-13", "ISO 14001"],
    responseTime: "1h",
    startingPrice: 1200,
  },
  {
    id: 3,
    name: "Elétrica Industrial Santos",
    category: "Elétrica",
    rating: 4.7,
    reviews: 89,
    location: "Santos, SP",
    distance: "5.2 km",
    verified: true,
    certifications: ["NR-10", "NR-12"],
    responseTime: "3h",
    startingPrice: 280,
  },
  {
    id: 4,
    name: "AutoPosto Soluções",
    category: "Manutenção Completa",
    rating: 4.9,
    reviews: 312,
    location: "São Paulo, SP",
    distance: "1.8 km",
    verified: true,
    certifications: ["NR-13", "ISO 9001", "ISO 14001"],
    responseTime: "1h",
    startingPrice: 400,
  },
];

function formatPreco(v: number) {
  return v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export default function HomePage() {
  const [bannerAtivo, setBannerAtivo] = useState(0);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [expandedFilters, setExpandedFilters] = useState({
    categoria: true,
    preco: true,
    loja: true,
    avaliacao: true,
  });
  const categoriasRef = useRef<HTMLDivElement>(null);

  const proximoBanner = () => {
    setBannerAtivo((prev) => (prev + 1) % bannersPublicitarios.length);
  };

  const bannerAnterior = () => {
    setBannerAtivo((prev) => (prev - 1 + bannersPublicitarios.length) % bannersPublicitarios.length);
  };

  const scrollCategorias = (direction: "left" | "right") => {
    if (categoriasRef.current) {
      const scrollAmount = 300;
      categoriasRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  const toggleFilter = (filterName: keyof typeof expandedFilters) => {
    setExpandedFilters(prev => ({
      ...prev,
      [filterName]: !prev[filterName]
    }));
  };

  return (
    <div className="max-w-[1400px] mx-auto space-y-6 sm:space-y-8">
      {/* Banner Publicitário - Carrossel */}
      <div className="relative group">
        <div className="overflow-hidden rounded-3xl shadow-2xl">
          <div
            className="flex transition-transform duration-700 ease-out"
            style={{ transform: `translateX(-${bannerAtivo * 100}%)` }}
          >
            {bannersPublicitarios.map((banner) => (
              <div
                key={banner.id}
                className="w-full flex-shrink-0 relative h-[175px] sm:h-[225px] lg:h-[250px]"
              >
                {/* Imagem de fundo */}
                <Image
                  src={banner.imagem}
                  alt={banner.titulo}
                  fill
                  className="object-cover"
                  unoptimized
                  priority
                />

                {/* Overlay gradiente */}
                <div className={`absolute inset-0 bg-gradient-to-r ${banner.gradient} opacity-90`} />

                {/* Conteúdo */}
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-12">
                    <div className="max-w-2xl">
                      {/* Badge */}
                      <div className="inline-flex items-center gap-1.5 sm:gap-2 bg-white/20 backdrop-blur-md px-2 sm:px-3 py-1 sm:py-1.5 rounded-full mb-2 sm:mb-3 border border-white/30">
                        <Tag className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-white" />
                        <span className="text-[10px] sm:text-xs font-bold text-white">{banner.badge}</span>
                      </div>

                      {/* Título e Destaque - Responsivo */}
                      <div className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-4 mb-2 sm:mb-3">
                        <h2 className="text-lg sm:text-2xl lg:text-3xl font-black text-white leading-tight">
                          {banner.titulo}
                        </h2>
                        <p className="text-2xl sm:text-4xl lg:text-5xl font-black text-white leading-none">
                          {banner.destaque}
                        </p>
                      </div>

                      {/* Subtítulo e CTA - Responsivo */}
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                        <p className="text-xs sm:text-base lg:text-lg text-white/90 font-medium">
                          {banner.subtitulo}
                        </p>

                        <button className="px-4 sm:px-6 py-2 sm:py-3 bg-white text-gray-900 rounded-lg sm:rounded-xl font-bold text-xs sm:text-sm hover:scale-105 transition-transform shadow-xl hover:shadow-white/50 flex-shrink-0 w-fit">
                          {banner.cta}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Controles do carrossel */}
        <button
          onClick={bannerAnterior}
          className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/95 hover:bg-white rounded-full flex items-center justify-center shadow-xl opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm"
        >
          <svg className="w-6 h-6 text-gray-900" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <button
          onClick={proximoBanner}
          className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/95 hover:bg-white rounded-full flex items-center justify-center shadow-xl opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm"
        >
          <svg className="w-6 h-6 text-gray-900" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>

        {/* Indicadores */}
        <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
          {bannersPublicitarios.map((_, index) => (
            <button
              key={index}
              onClick={() => setBannerAtivo(index)}
              className={`transition-all ${
                bannerAtivo === index
                  ? "w-8 h-2 bg-white"
                  : "w-2 h-2 bg-white/50 hover:bg-white/75"
              } rounded-full`}
            />
          ))}
        </div>
      </div>

      {/* Contratar Fornecedor */}
      <div>
        <div className="flex items-center justify-between mb-4 sm:mb-5">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-gray-900">Contratar Fornecedor</h2>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">Profissionais certificados e bem avaliados</p>
          </div>
          <Link href="/marketplace" className="text-xs sm:text-sm text-purple font-bold hover:underline flex items-center gap-1 flex-shrink-0">
            Ver todos <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </Link>
        </div>

        <div className="relative">
          {/* Setas de Navegação - Desktop */}
          <button
            onClick={() => scrollCategorias("left")}
            className="hidden sm:flex absolute left-0 top-1/2 -translate-y-1/2 z-10 w-9 h-9 sm:w-10 sm:h-10 bg-gray-900 text-white rounded-full items-center justify-center shadow-lg hover:bg-gray-800 transition-colors"
          >
            <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <button
            onClick={() => scrollCategorias("right")}
            className="hidden sm:flex absolute right-0 top-1/2 -translate-y-1/2 z-10 w-9 h-9 sm:w-10 sm:h-10 bg-orange-500 text-white rounded-full items-center justify-center shadow-lg hover:bg-orange-600 transition-colors"
          >
            <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>

          {/* Carrossel de Categorias */}
          <div
            ref={categoriasRef}
            className="overflow-x-auto px-2 sm:px-12 scroll-smooth"
            style={{
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
            }}
          >
            <style jsx>{`
              div::-webkit-scrollbar {
                display: none;
              }
            `}</style>
            <div className="flex gap-3 sm:gap-4">
              {/* Card 1: Conekta IA */}
              <Link
                href="/nova-solicitacao"
                className="flex-shrink-0 flex flex-col items-center gap-2 group"
              >
                <div className="relative">
                  {/* Anel gradiente roxo */}
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-tr from-purple via-purple-medium to-purple-light p-[3px] group-hover:scale-105 transition-transform">
                    {/* Círculo branco interno */}
                    <div className="w-full h-full bg-white rounded-full p-[3px]">
                      {/* Ícone IA */}
                      <div className="w-full h-full rounded-full bg-gradient-to-br from-purple to-purple-medium flex items-center justify-center">
                        <svg className="w-7 h-7 sm:w-9 sm:h-9 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                        </svg>
                      </div>
                    </div>
                  </div>
                  {/* Badge NOVO */}
                  <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 bg-green-500 text-white text-[9px] sm:text-[10px] font-black px-1.5 sm:px-2 py-0.5 rounded-full shadow-lg">
                    NOVO
                  </div>
                </div>
                <p className="text-[11px] sm:text-xs font-semibold text-gray-900 text-center max-w-[70px] sm:max-w-[80px] leading-tight group-hover:text-purple transition-colors">
                  Conekta IA
                </p>
              </Link>

              {/* Card 2: SOS Conekta */}
              <Link
                href="/sos"
                className="flex-shrink-0 flex flex-col items-center gap-2 group"
              >
                <div className="relative">
                  {/* Anel gradiente vermelho */}
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-tr from-red-500 via-red-600 to-orange-500 p-[3px] group-hover:scale-105 transition-transform">
                    {/* Círculo branco interno */}
                    <div className="w-full h-full bg-white rounded-full p-[3px]">
                      {/* Ícone SOS */}
                      <div className="w-full h-full rounded-full bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center">
                        <AlertTriangle className="w-7 h-7 sm:w-9 sm:h-9 text-white" />
                      </div>
                    </div>
                  </div>
                  {/* Badge pulsante */}
                  <div className="absolute top-0 right-0">
                    <span className="flex h-2.5 w-2.5 sm:h-3 sm:w-3">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2.5 w-2.5 sm:h-3 sm:w-3 bg-red-500"></span>
                    </span>
                  </div>
                </div>
                <p className="text-[11px] sm:text-xs font-semibold text-gray-900 text-center max-w-[70px] sm:max-w-[80px] leading-tight group-hover:text-red-600 transition-colors">
                  SOS Urgente
                </p>
              </Link>

              {/* Categorias de Serviços - Estilo Stories */}
              {categoriasFornecedores.map((cat) => (
                <Link
                  key={cat.id}
                  href={`/marketplace?categoria=${cat.id}`}
                  className="flex-shrink-0 flex flex-col items-center gap-2 group"
                >
                  <div className="relative">
                    {/* Anel gradiente (borda do story) */}
                    <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-tr from-purple via-purple-medium to-purple-light p-[3px] group-hover:scale-105 transition-transform">
                      {/* Círculo branco interno */}
                      <div className="w-full h-full bg-white rounded-full p-[3px]">
                        {/* Imagem */}
                        <div className="relative w-full h-full rounded-full overflow-hidden">
                          <Image
                            src={cat.imagem}
                            alt={cat.label}
                            fill
                            className="object-cover"
                            unoptimized
                          />
                        </div>
                      </div>
                    </div>
                    {/* Badge NOVO */}
                    {cat.novo && (
                      <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 bg-green-500 text-white text-[9px] sm:text-[10px] font-black px-1.5 sm:px-2 py-0.5 rounded-full shadow-lg">
                        NOVO
                      </div>
                    )}
                  </div>
                  <p className="text-[11px] sm:text-xs font-semibold text-gray-900 text-center max-w-[70px] sm:max-w-[80px] leading-tight group-hover:text-purple transition-colors">
                    {cat.label}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>


      {/* Modal de Filtros Mobile */}
      {showMobileFilters && (
        <>
          {/* Overlay */}
          <div
            className="fixed inset-0 z-[998] bg-black/50 backdrop-blur-sm lg:hidden"
            onClick={() => setShowMobileFilters(false)}
          />

          {/* Panel de Filtros */}
          <div className="fixed inset-y-0 right-0 z-[999] w-full max-w-sm bg-white shadow-2xl transform transition-transform duration-300 ease-out overflow-y-auto lg:hidden">
            {/* Header */}
            <div className="sticky top-0 bg-white border-b border-gray-200 px-4 py-4 flex items-center justify-between z-10">
              <h3 className="font-bold text-lg text-gray-900">Filtros</h3>
              <button
                onClick={() => setShowMobileFilters(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <svg className="w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Conteúdo dos Filtros */}
            <div className="p-4 space-y-6">
              {/* Filtro: Categoria */}
              <div className="border-b border-gray-200 pb-4">
                <button
                  onClick={() => toggleFilter('categoria')}
                  className="flex items-center justify-between w-full mb-3"
                >
                  <span className="font-semibold text-sm text-gray-900">Categoria</span>
                  {expandedFilters.categoria ? (
                    <ChevronUp className="w-4 h-4 text-gray-500" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-gray-500" />
                  )}
                </button>
                {expandedFilters.categoria && (
                  <div className="space-y-2">
                    {['Bombas', 'Elétrica', 'Hidráulica', 'Segurança', 'Calibradores', 'Ferramentas'].map((cat) => (
                      <label key={cat} className="flex items-center gap-2 cursor-pointer hover:text-purple transition-colors">
                        <input type="checkbox" className="rounded border-gray-300 text-purple focus:ring-purple" />
                        <span className="text-sm text-gray-700">{cat}</span>
                      </label>
                    ))}
                  </div>
                )}
              </div>

              {/* Filtro: Preço */}
              <div className="border-b border-gray-200 pb-4">
                <button
                  onClick={() => toggleFilter('preco')}
                  className="flex items-center justify-between w-full mb-3"
                >
                  <span className="font-semibold text-sm text-gray-900">Faixa de Preço</span>
                  {expandedFilters.preco ? (
                    <ChevronUp className="w-4 h-4 text-gray-500" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-gray-500" />
                  )}
                </button>
                {expandedFilters.preco && (
                  <div className="space-y-3">
                    <div className="flex gap-2">
                      <input
                        type="number"
                        placeholder="Mín"
                        className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg outline-none focus:border-purple"
                      />
                      <input
                        type="number"
                        placeholder="Máx"
                        className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg outline-none focus:border-purple"
                      />
                    </div>
                    <div className="space-y-2">
                      {['Até R$ 100', 'R$ 100 a R$ 500', 'R$ 500 a R$ 1.000', 'Acima de R$ 1.000'].map((faixa) => (
                        <label key={faixa} className="flex items-center gap-2 cursor-pointer hover:text-purple transition-colors">
                          <input type="checkbox" className="rounded border-gray-300 text-purple focus:ring-purple" />
                          <span className="text-sm text-gray-700">{faixa}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Filtro: Loja */}
              <div className="border-b border-gray-200 pb-4">
                <button
                  onClick={() => toggleFilter('loja')}
                  className="flex items-center justify-between w-full mb-3"
                >
                  <span className="font-semibold text-sm text-gray-900">Loja</span>
                  {expandedFilters.loja ? (
                    <ChevronUp className="w-4 h-4 text-gray-500" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-gray-500" />
                  )}
                </button>
                {expandedFilters.loja && (
                  <div className="space-y-2">
                    {['TechPosto Store', 'SafetyPosto', 'Hidra Parts', 'Eletro Posto SP', 'AutoPeças Pro'].map((loja) => (
                      <label key={loja} className="flex items-center gap-2 cursor-pointer hover:text-purple transition-colors">
                        <input type="checkbox" className="rounded border-gray-300 text-purple focus:ring-purple" />
                        <span className="text-sm text-gray-700">{loja}</span>
                      </label>
                    ))}
                  </div>
                )}
              </div>

              {/* Filtro: Avaliação */}
              <div className="border-b border-gray-200 pb-4">
                <button
                  onClick={() => toggleFilter('avaliacao')}
                  className="flex items-center justify-between w-full mb-3"
                >
                  <span className="font-semibold text-sm text-gray-900">Avaliação</span>
                  {expandedFilters.avaliacao ? (
                    <ChevronUp className="w-4 h-4 text-gray-500" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-gray-500" />
                  )}
                </button>
                {expandedFilters.avaliacao && (
                  <div className="space-y-2">
                    {[5, 4, 3].map((stars) => (
                      <label key={stars} className="flex items-center gap-2 cursor-pointer hover:text-purple transition-colors">
                        <input type="checkbox" className="rounded border-gray-300 text-purple focus:ring-purple" />
                        <div className="flex items-center gap-1">
                          {Array.from({ length: stars }).map((_, i) => (
                            <Star key={i} className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                          ))}
                          <span className="text-sm text-gray-700 ml-1">ou mais</span>
                        </div>
                      </label>
                    ))}
                  </div>
                )}
              </div>

              {/* Filtro: Outros */}
              <div className="space-y-3">
                <label className="flex items-center gap-2 cursor-pointer hover:text-purple transition-colors">
                  <input type="checkbox" className="rounded border-gray-300 text-purple focus:ring-purple" />
                  <span className="text-sm text-gray-700 font-medium">Frete grátis</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer hover:text-purple transition-colors">
                  <input type="checkbox" className="rounded border-gray-300 text-purple focus:ring-purple" />
                  <span className="text-sm text-gray-700 font-medium">Com desconto</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer hover:text-purple transition-colors">
                  <input type="checkbox" className="rounded border-gray-300 text-purple focus:ring-purple" />
                  <span className="text-sm text-gray-700 font-medium">Entrega expressa</span>
                </label>
              </div>
            </div>

            {/* Footer com botões de ação */}
            <div className="sticky bottom-0 bg-white border-t border-gray-200 p-4 flex gap-3">
              <button
                onClick={() => setShowMobileFilters(false)}
                className="flex-1 px-4 py-3 border border-gray-200 rounded-xl text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Limpar Filtros
              </button>
              <button
                onClick={() => setShowMobileFilters(false)}
                className="flex-1 px-4 py-3 bg-purple text-white rounded-xl text-sm font-semibold hover:bg-purple-medium transition-colors"
              >
                Aplicar
              </button>
            </div>
          </div>
        </>
      )}

      {/* E-commerce - Grid de Produtos */}
      <div className="flex gap-6">
        {/* Sidebar de Filtros - Desktop */}
        <aside className="hidden lg:block w-64 flex-shrink-0">
          <div className="sticky top-24">
            <div className="bg-white rounded-xl border border-gray-200 p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-gray-900">Filtros</h3>
                <button className="text-sm text-purple font-semibold hover:underline">
                  Limpar
                </button>
              </div>

              {/* Filtro: Categoria */}
              <div className="border-b border-gray-200 pb-4 mb-4">
                <button
                  onClick={() => toggleFilter('categoria')}
                  className="flex items-center justify-between w-full mb-3"
                >
                  <span className="font-semibold text-sm text-gray-900">Categoria</span>
                  {expandedFilters.categoria ? (
                    <ChevronUp className="w-4 h-4 text-gray-500" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-gray-500" />
                  )}
                </button>
                {expandedFilters.categoria && (
                  <div className="space-y-2">
                    {['Bombas', 'Elétrica', 'Hidráulica', 'Segurança', 'Calibradores', 'Ferramentas'].map((cat) => (
                      <label key={cat} className="flex items-center gap-2 cursor-pointer hover:text-purple transition-colors">
                        <input type="checkbox" className="rounded border-gray-300 text-purple focus:ring-purple" />
                        <span className="text-sm text-gray-700">{cat}</span>
                      </label>
                    ))}
                  </div>
                )}
              </div>

              {/* Filtro: Preço */}
              <div className="border-b border-gray-200 pb-4 mb-4">
                <button
                  onClick={() => toggleFilter('preco')}
                  className="flex items-center justify-between w-full mb-3"
                >
                  <span className="font-semibold text-sm text-gray-900">Faixa de Preço</span>
                  {expandedFilters.preco ? (
                    <ChevronUp className="w-4 h-4 text-gray-500" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-gray-500" />
                  )}
                </button>
                {expandedFilters.preco && (
                  <div className="space-y-2">
                    <div className="flex gap-2">
                      <input
                        type="number"
                        placeholder="Mín"
                        className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg outline-none focus:border-purple"
                      />
                      <input
                        type="number"
                        placeholder="Máx"
                        className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg outline-none focus:border-purple"
                      />
                    </div>
                    <div className="space-y-2 mt-3">
                      {['Até R$ 100', 'R$ 100 a R$ 500', 'R$ 500 a R$ 1.000', 'Acima de R$ 1.000'].map((faixa) => (
                        <label key={faixa} className="flex items-center gap-2 cursor-pointer hover:text-purple transition-colors">
                          <input type="checkbox" className="rounded border-gray-300 text-purple focus:ring-purple" />
                          <span className="text-sm text-gray-700">{faixa}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Filtro: Loja */}
              <div className="border-b border-gray-200 pb-4 mb-4">
                <button
                  onClick={() => toggleFilter('loja')}
                  className="flex items-center justify-between w-full mb-3"
                >
                  <span className="font-semibold text-sm text-gray-900">Loja</span>
                  {expandedFilters.loja ? (
                    <ChevronUp className="w-4 h-4 text-gray-500" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-gray-500" />
                  )}
                </button>
                {expandedFilters.loja && (
                  <div className="space-y-2">
                    {['TechPosto Store', 'SafetyPosto', 'Hidra Parts', 'Eletro Posto SP', 'AutoPeças Pro'].map((loja) => (
                      <label key={loja} className="flex items-center gap-2 cursor-pointer hover:text-purple transition-colors">
                        <input type="checkbox" className="rounded border-gray-300 text-purple focus:ring-purple" />
                        <span className="text-sm text-gray-700">{loja}</span>
                      </label>
                    ))}
                  </div>
                )}
              </div>

              {/* Filtro: Avaliação */}
              <div className="border-b border-gray-200 pb-4 mb-4">
                <button
                  onClick={() => toggleFilter('avaliacao')}
                  className="flex items-center justify-between w-full mb-3"
                >
                  <span className="font-semibold text-sm text-gray-900">Avaliação</span>
                  {expandedFilters.avaliacao ? (
                    <ChevronUp className="w-4 h-4 text-gray-500" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-gray-500" />
                  )}
                </button>
                {expandedFilters.avaliacao && (
                  <div className="space-y-2">
                    {[5, 4, 3].map((stars) => (
                      <label key={stars} className="flex items-center gap-2 cursor-pointer hover:text-purple transition-colors">
                        <input type="checkbox" className="rounded border-gray-300 text-purple focus:ring-purple" />
                        <div className="flex items-center gap-1">
                          {Array.from({ length: stars }).map((_, i) => (
                            <Star key={i} className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                          ))}
                          <span className="text-sm text-gray-700 ml-1">ou mais</span>
                        </div>
                      </label>
                    ))}
                  </div>
                )}
              </div>

              {/* Filtro: Outros */}
              <div className="space-y-3">
                <label className="flex items-center gap-2 cursor-pointer hover:text-purple transition-colors">
                  <input type="checkbox" className="rounded border-gray-300 text-purple focus:ring-purple" />
                  <span className="text-sm text-gray-700 font-medium">Frete grátis</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer hover:text-purple transition-colors">
                  <input type="checkbox" className="rounded border-gray-300 text-purple focus:ring-purple" />
                  <span className="text-sm text-gray-700 font-medium">Com desconto</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer hover:text-purple transition-colors">
                  <input type="checkbox" className="rounded border-gray-300 text-purple focus:ring-purple" />
                  <span className="text-sm text-gray-700 font-medium">Entrega expressa</span>
                </label>
              </div>
            </div>
          </div>
        </aside>

        {/* Área Principal de Produtos */}
        <div className="flex-1 min-w-0">
          {/* Barra de Filtros e Ordenação */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0 mb-4 pb-4 border-b border-gray-200">
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <button
                onClick={() => setShowMobileFilters(true)}
                className="lg:hidden flex items-center gap-2 px-4 py-2.5 border border-gray-200 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
              >
                <SlidersHorizontal className="w-4 h-4" />
                Filtros
              </button>
              <p className="text-xs sm:text-sm text-gray-600">
                <span className="font-semibold text-gray-900">1.512</span> resultados
              </p>
            </div>
            <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto">
              <span className="text-xs sm:text-sm text-gray-600 hidden sm:inline flex-shrink-0">Ordenar por:</span>
              <select className="flex-1 sm:flex-initial text-xs sm:text-sm border border-gray-200 rounded-lg px-3 py-2 sm:py-2 outline-none focus:border-purple transition-colors bg-white">
                <option>Mais relevantes</option>
                <option>Menor preço</option>
                <option>Maior preço</option>
                <option>Mais vendidos</option>
                <option>Melhor avaliados</option>
              </select>
            </div>
          </div>

          {/* Grid de Produtos */}
          <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4">
            {produtosDestaque.map((p) => (
              <div
                key={p.id}
                className="bg-white border border-gray-100 rounded-xl overflow-hidden hover:shadow-lg hover:border-gray-200 transition-all cursor-pointer group"
              >
                <div className="h-40 sm:h-44 md:h-48 relative overflow-hidden bg-white">
                  <Image
                    src={p.foto}
                    alt={p.nome}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                    unoptimized
                  />
                  {p.desconto && (
                    <div className="absolute top-2 left-2 bg-red-500 text-white text-[10px] sm:text-xs font-bold px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-md">
                      -{p.desconto}%
                    </div>
                  )}
                </div>

                <div className="p-2.5 sm:p-3">
                  <p className="text-[10px] sm:text-xs text-gray-400 mb-1">{p.loja}</p>
                  <h3 className="text-xs sm:text-sm font-medium text-gray-900 mb-2 line-clamp-2 min-h-[2.2rem] sm:min-h-[2.5rem] leading-tight">
                    {p.nome}
                  </h3>

                  <div className="flex items-center gap-1 mb-2">
                    <Star className="w-3 h-3 sm:w-3.5 sm:h-3.5 fill-yellow-400 text-yellow-400" />
                    <span className="text-[10px] sm:text-xs font-semibold text-gray-700">{p.rating}</span>
                    <span className="text-[10px] sm:text-xs text-gray-400">({p.avaliacoes})</span>
                  </div>

                  <div>
                    {p.precoAntigo && (
                      <p className="text-[10px] sm:text-xs text-gray-400 line-through">{formatPreco(p.precoAntigo)}</p>
                    )}
                    <p className="text-base sm:text-lg font-bold text-gray-900">{formatPreco(p.preco)}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Paginação */}
          <div className="flex justify-center items-center gap-1.5 sm:gap-2 mt-8">
            <button className="px-3 sm:px-4 py-2 border border-gray-200 rounded-lg text-xs sm:text-sm text-gray-600 hover:bg-gray-50 transition-colors">
              Anterior
            </button>
            <button className="px-3 sm:px-4 py-2 bg-purple text-white rounded-lg text-xs sm:text-sm font-semibold">
              1
            </button>
            <button className="px-3 sm:px-4 py-2 border border-gray-200 rounded-lg text-xs sm:text-sm text-gray-600 hover:bg-gray-50 transition-colors">
              2
            </button>
            <button className="hidden sm:block px-3 sm:px-4 py-2 border border-gray-200 rounded-lg text-xs sm:text-sm text-gray-600 hover:bg-gray-50 transition-colors">
              3
            </button>
            <button className="px-3 sm:px-4 py-2 border border-gray-200 rounded-lg text-xs sm:text-sm text-gray-600 hover:bg-gray-50 transition-colors">
              Próximo
            </button>
          </div>
        </div>
      </div>

    </div>
  );
}
