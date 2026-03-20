"use client";

import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ShoppingCart, Package, Zap, Shield, TrendingUp, Star, CheckCircle, ArrowRight, Truck, CreditCard } from "lucide-react";

const features = [
  {
    icon: Package,
    title: "Produtos Especializados",
    desc: "Equipamentos, peças e materiais específicos para postos de combustível",
  },
  {
    icon: Shield,
    title: "Vendedores Verificados",
    desc: "Todas as lojas são verificadas e avaliadas pela comunidade",
  },
  {
    icon: CreditCard,
    title: "Parcele em até 12x",
    desc: "Compre agora e pague parcelado com segurança do Conekta Pay",
  },
  {
    icon: Truck,
    title: "Entrega Garantida",
    desc: "Rastreamento completo e proteção na compra",
  },
];

const categories = [
  {
    name: "Bombas e Equipamentos",
    desc: "Bombas de combustível, medidores, filtros",
    products: 128,
  },
  {
    name: "Elétrica",
    desc: "Painéis, sensores, automação",
    products: 89,
  },
  {
    name: "Hidráulica",
    desc: "Mangueiras, conexões, válvulas",
    products: 156,
  },
  {
    name: "Segurança",
    desc: "EPIs, câmeras, extintores",
    products: 92,
  },
  {
    name: "Sinalização",
    desc: "Placas LED, adesivos, banners",
    products: 67,
  },
  {
    name: "Limpeza",
    desc: "Produtos para limpeza de tanques e equipamentos",
    products: 45,
  },
];

const featuredProducts = [
  {
    name: "Bomba Submersa 3CV",
    price: 1890,
    rating: 4.8,
    reviews: 42,
    store: "TechPosto Store",
  },
  {
    name: "Calibrador Digital Automático",
    price: 459.90,
    rating: 4.7,
    reviews: 28,
    store: "TechPosto Store",
  },
  {
    name: "Câmera de Segurança IP 4K",
    price: 599,
    rating: 4.8,
    reviews: 56,
    store: "SafetyPosto",
  },
];

const stores = [
  {
    name: "TechPosto Store",
    desc: "Equipamentos para postos",
    rating: 4.9,
    products: 128,
  },
  {
    name: "Hidra Parts",
    desc: "Peças hidráulicas",
    rating: 4.7,
    products: 89,
  },
  {
    name: "SafetyPosto",
    desc: "Segurança e EPIs",
    rating: 4.6,
    products: 45,
  },
];

export default function ShopLandingPage() {
  return (
    <div className="bg-gray-50 min-h-screen">
      <Navbar />

      {/* Hero */}
      <section className="relative bg-gradient-to-b from-[#E05C1A] to-[#c54d15] text-white pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
            backgroundSize: '40px 40px'
          }} />
        </div>

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
              <ShoppingCart className="w-5 h-5" />
              <span className="font-semibold">Shop Conekta</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black mb-6 leading-tight">
              O marketplace de<br />
              <span className="text-orange-200">produtos para postos</span>
            </h1>

            <p className="text-xl text-orange-100 mb-8 leading-relaxed">
              Tudo que você precisa para seu posto em um só lugar. Equipamentos, peças,
              materiais de segurança e muito mais. Parcele em até 12x com segurança.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                href="/login"
                className="px-8 py-4 bg-white text-[#E05C1A] rounded-xl font-bold text-lg hover:bg-gray-100 transition-colors shadow-xl flex items-center gap-2"
              >
                Começar a Comprar
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                href="/cadastro"
                className="px-8 py-4 bg-white/10 backdrop-blur-sm border-2 border-white text-white rounded-xl font-bold text-lg hover:bg-white/20 transition-colors"
              >
                Criar Conta Grátis
              </Link>
            </div>

            <p className="text-sm text-orange-200 mt-4">
              Mais de 500 produtos disponíveis
            </p>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-black text-gray-900 mb-4">
              Por que comprar no Shop Conekta?
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <div key={feature.title} className="text-center">
                  <div className="w-16 h-16 bg-orange-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Icon className="w-8 h-8 text-[#E05C1A]" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {feature.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-black text-gray-900 mb-4">
              Categorias Disponíveis
            </h2>
            <p className="text-xl text-gray-600">
              Encontre exatamente o que precisa
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category) => (
              <div
                key={category.name}
                className="bg-white rounded-2xl p-6 border border-gray-200 hover:border-[#E05C1A] transition-colors cursor-pointer group"
              >
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-lg font-bold text-gray-900 group-hover:text-[#E05C1A] transition-colors">
                    {category.name}
                  </h3>
                  <span className="text-xs bg-orange-100 text-[#E05C1A] px-2 py-1 rounded-full font-semibold">
                    {category.products}
                  </span>
                </div>
                <p className="text-sm text-gray-600">
                  {category.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-black text-gray-900 mb-4">
              Produtos em Destaque
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {featuredProducts.map((product) => (
              <div
                key={product.name}
                className="bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div className="bg-gradient-to-br from-orange-100 to-orange-50 h-48 flex items-center justify-center">
                  <Package className="w-20 h-20 text-orange-300" />
                </div>
                <div className="p-6">
                  <p className="text-xs text-gray-500 mb-1">{product.store}</p>
                  <h3 className="font-bold text-gray-900 mb-2 text-lg">
                    {product.name}
                  </h3>
                  <div className="flex items-center gap-2 mb-3">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
                      <span className="text-sm font-semibold text-gray-700">{product.rating}</span>
                    </div>
                    <span className="text-xs text-gray-500">({product.reviews} avaliações)</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="text-2xl font-black text-gray-900">
                      R$ {product.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link
              href="/login"
              className="inline-flex items-center gap-2 px-8 py-4 bg-[#E05C1A] text-white rounded-xl font-bold text-lg hover:bg-[#c54d15] transition-colors"
            >
              Ver Todos os Produtos
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Stores */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-black text-gray-900 mb-4">
              Lojas em Destaque
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {stores.map((store) => (
              <div
                key={store.name}
                className="bg-white rounded-2xl p-6 border border-gray-200 hover:border-[#E05C1A] transition-colors"
              >
                <div className="w-16 h-16 bg-orange-100 rounded-xl flex items-center justify-center mb-4">
                  <ShoppingCart className="w-8 h-8 text-[#E05C1A]" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-1">
                  {store.name}
                </h3>
                <p className="text-sm text-gray-600 mb-3">{store.desc}</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
                    <span className="text-sm font-semibold text-gray-700">{store.rating}</span>
                  </div>
                  <span className="text-xs text-gray-500">{store.products} produtos</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-20 bg-gradient-to-r from-[#E05C1A] to-[#c54d15] text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-3xl sm:text-4xl font-black mb-6">
            Pronto para equipar seu posto com os melhores produtos?
          </h2>
          <p className="text-xl text-orange-100 mb-8">
            Parcele em até 12x e receba com segurança
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/login"
              className="px-8 py-4 bg-white text-[#E05C1A] rounded-xl font-bold text-lg hover:bg-gray-100 transition-colors shadow-xl"
            >
              Começar a Comprar
            </Link>
            <Link
              href="/cadastro"
              className="px-8 py-4 bg-white/10 backdrop-blur-sm border-2 border-white text-white rounded-xl font-bold text-lg hover:bg-white/20 transition-colors"
            >
              Criar Conta Grátis
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
