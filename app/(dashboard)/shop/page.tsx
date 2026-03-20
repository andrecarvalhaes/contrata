"use client";

import { useState } from "react";
import { Search, ShoppingCart, Star, ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";

const categorias = [
  {
    id: "todos",
    label: "Todos",
    // Substituir por URL real da imagem
    imagem: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=200&h=200&fit=crop",
  },
  {
    id: "bombas",
    label: "Bombas",
    imagem: "https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=200&h=200&fit=crop",
  },
  {
    id: "eletrica",
    label: "Elétrica",
    imagem: "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=200&h=200&fit=crop",
  },
  {
    id: "hidraulica",
    label: "Hidráulica",
    imagem: "https://images.unsplash.com/photo-1607400201889-565b1ee75f8e?w=200&h=200&fit=crop",
  },
  {
    id: "seguranca",
    label: "Segurança",
    imagem: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=200&h=200&fit=crop",
  },
  {
    id: "calibradores",
    label: "Calibradores",
    imagem: "https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=200&h=200&fit=crop",
  },
  {
    id: "epis",
    label: "EPIs",
    imagem: "https://images.unsplash.com/photo-1585435557343-3b092031a831?w=200&h=200&fit=crop",
  },
  {
    id: "sinalizacao",
    label: "Sinalização",
    imagem: "https://images.unsplash.com/photo-1519003300449-424ad0405076?w=200&h=200&fit=crop",
  },
];

const banners = [
  {
    id: 1,
    titulo: "Ofertas da Semana",
    subtitulo: "Até 30% OFF em equipamentos",
    // Substituir por imagem real do banner
    imagem: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&h=400&fit=crop",
    cor: "from-[#E05C1A] to-[#c54d15]",
    cta: "Ver ofertas",
  },
  {
    id: 2,
    titulo: "Parcele em até 12x",
    subtitulo: "Com Conekta Pay sem juros",
    imagem: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1200&h=400&fit=crop",
    cor: "from-purple-600 to-purple-800",
    cta: "Saiba mais",
  },
  {
    id: 3,
    titulo: "Entrega Expressa",
    subtitulo: "Receba em até 24h na sua região",
    imagem: "https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?w=1200&h=400&fit=crop",
    cor: "from-green-600 to-green-800",
    cta: "Confira",
  },
];

const lojas = [
  {
    id: 1,
    nome: "TechPosto Store",
    rating: 4.9,
    produtos: 128,
    entregas: "2.1k",
    // Substituir por logo real da loja
    logo: "https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=100&h=100&fit=crop",
  },
  {
    id: 2,
    nome: "Hidra Parts",
    rating: 4.7,
    produtos: 89,
    entregas: "1.5k",
    logo: "https://images.unsplash.com/photo-1607400201889-565b1ee75f8e?w=100&h=100&fit=crop",
  },
  {
    id: 3,
    nome: "Eletro Posto SP",
    rating: 4.8,
    produtos: 64,
    entregas: "980",
    logo: "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=100&h=100&fit=crop",
  },
  {
    id: 4,
    nome: "SafetyPosto",
    rating: 4.6,
    produtos: 45,
    entregas: "750",
    logo: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=100&h=100&fit=crop",
  },
];

const produtos = [
  {
    id: 1,
    nome: "Bomba Submersa 3CV Premium",
    loja: "TechPosto Store",
    preco: 1890.0,
    precoAntigo: 2400,
    rating: 4.8,
    avaliacoes: 42,
    desconto: 21,
    // Substituir por foto real do produto
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
    nome: "Lubrificante Industrial 20L",
    loja: "Eletro Posto SP",
    preco: 219.0,
    precoAntigo: 280,
    rating: 4.5,
    avaliacoes: 23,
    desconto: 22,
    foto: "https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=400&h=400&fit=crop",
  },
  {
    id: 8,
    nome: "Painel Elétrico Bomba Completo",
    loja: "Eletro Posto SP",
    preco: 890.0,
    rating: 4.8,
    avaliacoes: 45,
    foto: "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=400&h=400&fit=crop",
  },
];

function formatPreco(v: number) {
  return v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export default function ShopPage() {
  const [categoriaAtiva, setCategoriaAtiva] = useState("todos");
  const [busca, setBusca] = useState("");
  const [cartCount] = useState(3);
  const [bannerAtivo, setBannerAtivo] = useState(0);

  const proximoBanner = () => {
    setBannerAtivo((prev) => (prev + 1) % banners.length);
  };

  const bannerAnterior = () => {
    setBannerAtivo((prev) => (prev - 1 + banners.length) % banners.length);
  };

  return (
    <div className="max-w-[1400px] mx-auto">
      {/* Header */}
      <div className="bg-white rounded-2xl p-4 sm:p-6 mb-5 shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-gray-900">Shop Conekta</h1>
            <p className="text-sm text-gray-500 mt-0.5">Tudo para seu posto em um só lugar</p>
          </div>
          <button className="relative px-4 py-2.5 sm:px-5 sm:py-3 bg-purple hover:bg-purple-medium rounded-xl transition-colors flex items-center gap-2 text-white font-semibold shadow-md">
            <ShoppingCart className="w-5 h-5" />
            <span className="hidden sm:inline">Carrinho</span>
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 w-5 h-5 bg-[#E05C1A] text-white text-xs font-black rounded-full flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </button>
        </div>

        {/* Busca */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            placeholder="Busque por item ou loja"
            className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm text-gray-900 placeholder-gray-400 outline-none focus:border-purple focus:bg-white focus:ring-2 focus:ring-purple/20 transition-all"
          />
        </div>
      </div>

      {/* Categorias com imagens reais */}
      <div className="mb-6">
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-none px-1">
          {categorias.map((c) => (
            <button
              key={c.id}
              onClick={() => setCategoriaAtiva(c.id)}
              className="flex flex-col items-center gap-2 flex-shrink-0 group"
            >
              <div
                className={`w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden shadow-md transition-all relative ${
                  categoriaAtiva === c.id ? "ring-4 ring-purple/40 scale-105" : "hover:scale-105"
                }`}
              >
                <Image
                  src={c.imagem}
                  alt={c.label}
                  width={80}
                  height={80}
                  className="w-full h-full object-cover"
                  unoptimized
                />
                {categoriaAtiva === c.id && (
                  <div className="absolute inset-0 bg-purple/20" />
                )}
              </div>
              <span
                className={`text-xs sm:text-sm font-medium transition-colors ${
                  categoriaAtiva === c.id ? "text-purple font-semibold" : "text-gray-600"
                }`}
              >
                {c.label}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Carrossel de Banners com imagens reais */}
      <div className="mb-8 relative group">
        <div className="overflow-hidden rounded-2xl">
          <div
            className="flex transition-transform duration-500 ease-out"
            style={{ transform: `translateX(-${bannerAtivo * 100}%)` }}
          >
            {banners.map((banner) => (
              <div
                key={banner.id}
                className="w-full flex-shrink-0 relative h-[300px] sm:h-[400px] rounded-2xl overflow-hidden"
              >
                <Image
                  src={banner.imagem}
                  alt={banner.titulo}
                  fill
                  className="object-cover"
                  unoptimized
                />
                <div className={`absolute inset-0 bg-gradient-to-r ${banner.cor} opacity-90`} />
                <div className="absolute inset-0 flex items-center">
                  <div className="max-w-xl px-8 sm:px-12 text-white">
                    <h2 className="text-2xl sm:text-4xl font-black mb-2">{banner.titulo}</h2>
                    <p className="text-base sm:text-lg text-white/90 mb-6">{banner.subtitulo}</p>
                    <button className="px-6 py-3 bg-white text-gray-900 rounded-xl font-bold hover:bg-gray-100 transition-colors shadow-lg">
                      {banner.cta}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Controles do carrossel */}
        <button
          onClick={bannerAnterior}
          className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <ChevronLeft className="w-6 h-6 text-gray-900" />
        </button>
        <button
          onClick={proximoBanner}
          className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <ChevronRight className="w-6 h-6 text-gray-900" />
        </button>

        {/* Indicadores */}
        <div className="flex justify-center gap-2 mt-4">
          {banners.map((_, index) => (
            <button
              key={index}
              onClick={() => setBannerAtivo(index)}
              className={`w-2 h-2 rounded-full transition-all ${
                bannerAtivo === index ? "bg-purple w-6" : "bg-gray-300"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Lojas Populares com logos reais */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg sm:text-xl font-bold text-gray-900">Lojas Populares</h2>
          <button className="text-sm text-purple hover:text-purple-medium font-semibold">Ver todas</button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          {lojas.map((loja) => (
            <div
              key={loja.id}
              className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-md hover:border-purple/30 transition-all cursor-pointer"
            >
              <div className="w-12 h-12 rounded-xl overflow-hidden mb-3 border border-gray-100">
                <Image
                  src={loja.logo}
                  alt={loja.nome}
                  width={48}
                  height={48}
                  className="w-full h-full object-cover"
                  unoptimized
                />
              </div>
              <p className="font-bold text-sm text-gray-900 mb-1 line-clamp-1">{loja.nome}</p>
              <div className="flex items-center gap-1 mb-1">
                <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                <span className="text-xs font-semibold text-gray-700">{loja.rating}</span>
                <span className="text-xs text-gray-400">({loja.entregas})</span>
              </div>
              <p className="text-xs text-gray-500">{loja.produtos} produtos</p>
            </div>
          ))}
        </div>
      </div>

      {/* Produtos com fotos reais */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg sm:text-xl font-bold text-gray-900">Desconto até 35% OFF</h2>
          <button className="text-sm text-purple hover:text-purple-medium font-semibold">Ver mais</button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4">
          {produtos.map((p) => (
            <div
              key={p.id}
              className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg hover:border-purple/30 transition-all cursor-pointer group"
            >
              {/* Imagem real do produto */}
              <div className="h-40 sm:h-48 relative overflow-hidden bg-gray-100">
                <Image
                  src={p.foto}
                  alt={p.nome}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                  unoptimized
                />
                {p.desconto && (
                  <div className="absolute top-2 left-2 bg-[#E05C1A] text-white text-xs font-bold px-2 py-1 rounded-lg shadow-md z-10">
                    -{p.desconto}%
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="p-3 sm:p-4">
                <p className="text-xs text-gray-500 mb-1">{p.loja}</p>
                <h3 className="text-sm font-semibold text-gray-900 mb-2 line-clamp-2 min-h-[2.5rem] leading-tight">
                  {p.nome}
                </h3>

                {/* Rating */}
                <div className="flex items-center gap-1 mb-2">
                  <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                  <span className="text-xs font-semibold text-gray-700">{p.rating}</span>
                  <span className="text-xs text-gray-400">({p.avaliacoes})</span>
                </div>

                {/* Preço */}
                <div className="mb-3">
                  {p.precoAntigo && (
                    <p className="text-xs text-gray-400 line-through">{formatPreco(p.precoAntigo)}</p>
                  )}
                  <p className="text-lg font-black text-gray-900">{formatPreco(p.preco)}</p>
                </div>

                {/* Botão */}
                <button className="w-full py-2 bg-purple hover:bg-purple-medium text-white text-sm font-semibold rounded-lg transition-colors group-hover:shadow-md">
                  Adicionar
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
