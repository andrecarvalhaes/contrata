"use client";

import { useState } from "react";
import { Search, ShoppingCart, Star, Plus, Zap, Shield, Droplets, Wrench, Wind, Package, HardHat, TriangleAlert, Waves, Sparkles } from "lucide-react";

const categorias = [
  { id: "todos", label: "Todos" },
  { id: "bombas", label: "Bombas e Equipamentos" },
  { id: "eletrica", label: "Elétrica" },
  { id: "hidraulica", label: "Hidráulica" },
  { id: "seguranca", label: "Segurança" },
  { id: "calibradores", label: "Calibradores" },
  { id: "lubrificantes", label: "Lubrificantes" },
  { id: "epis", label: "EPIs" },
  { id: "sinalizacao", label: "Sinalização" },
  { id: "limpeza", label: "Limpeza" },
];

const lojas = [
  { nome: "TechPosto Store", desc: "Equipamentos para postos", rating: 4.9, produtos: 128, cor: "bg-orange-100", textCor: "text-[#E05C1A]" },
  { nome: "Hidra Parts", desc: "Peças hidráulicas", rating: 4.7, produtos: 89, cor: "bg-blue-100", textCor: "text-blue-600" },
  { nome: "Eletro Posto SP", desc: "Materiais elétricos", rating: 4.8, produtos: 64, cor: "bg-yellow-100", textCor: "text-yellow-700" },
  { nome: "SafetyPosto", desc: "Segurança e EPIs", rating: 4.6, produtos: 45, cor: "bg-green-100", textCor: "text-green-600" },
];

const produtos = [
  { nome: "Bomba Submersa 3CV", loja: "TechPosto Store", preco: 1890.0, rating: 4.8, icon: Zap, iconBg: "bg-orange-100", iconColor: "text-[#E05C1A]" },
  { nome: "Calibrador Digital Automático", loja: "TechPosto Store", preco: 459.9, rating: 4.7, icon: Wrench, iconBg: "bg-orange-50", iconColor: "text-[#E05C1A]" },
  { nome: "Mangueira Hidráulica 1/2\" (5m)", loja: "Hidra Parts", preco: 189.0, rating: 4.6, icon: Waves, iconBg: "bg-blue-100", iconColor: "text-blue-600" },
  { nome: "Sensor de Nível de Combustível", loja: "TechPosto Store", preco: 320.0, rating: 4.9, icon: Droplets, iconBg: "bg-teal-100", iconColor: "text-teal-600" },
  { nome: "Câmera de Segurança IP 4K", loja: "SafetyPosto", preco: 599.0, rating: 4.8, icon: Shield, iconBg: "bg-green-100", iconColor: "text-green-600" },
  { nome: "Extintor CO2 6kg", loja: "SafetyPosto", preco: 289.0, rating: 4.7, icon: Wind, iconBg: "bg-red-100", iconColor: "text-red-600" },
  { nome: "Lubrificante Industrial 20L", loja: "Eletro Posto SP", preco: 219.0, rating: 4.5, icon: Droplets, iconBg: "bg-yellow-100", iconColor: "text-yellow-600" },
  { nome: "Painel Elétrico para Bomba", loja: "Eletro Posto SP", preco: 890.0, rating: 4.8, icon: Zap, iconBg: "bg-yellow-50", iconColor: "text-yellow-600" },
  { nome: "EPI Kit Completo", loja: "SafetyPosto", preco: 149.0, rating: 4.6, icon: HardHat, iconBg: "bg-green-50", iconColor: "text-green-600" },
  { nome: "Filtro Separador Água/Combustível", loja: "Hidra Parts", preco: 420.0, rating: 4.7, icon: Package, iconBg: "bg-blue-50", iconColor: "text-blue-600" },
  { nome: "Mangote de Descarga 4\" (10m)", loja: "Hidra Parts", preco: 380.0, rating: 4.6, icon: Waves, iconBg: "bg-blue-100", iconColor: "text-blue-600" },
  { nome: "Placa LED \"Combustível\"", loja: "TechPosto Store", preco: 520.0, rating: 4.9, icon: TriangleAlert, iconBg: "bg-orange-100", iconColor: "text-[#E05C1A]" },
];

function StarRating({ value }: { value: number }) {
  return (
    <div className="flex items-center gap-0.5">
      <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
      <span className="text-xs font-semibold text-gray-600">{value}</span>
    </div>
  );
}

function formatPreco(v: number) {
  return v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export default function ShopPage() {
  const [categoriaAtiva, setCategoriaAtiva] = useState("todos");
  const [busca, setBusca] = useState("");
  const [cartCount] = useState(3);

  return (
    <div className="flex flex-col gap-5 -mx-4 -mt-4">
      {/* Header da loja */}
      <div className="bg-white px-4 pt-5 pb-4 border-b border-gray-100">
        <div className="flex items-start justify-between mb-1">
          <div>
            <h1 className="text-xl font-black text-[#1A1A2E]">🛒 Shop Conekta</h1>
            <p className="text-xs text-gray-500 mt-0.5">Produtos e peças para postos de combustível</p>
          </div>
          <button className="relative p-2.5 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
            <ShoppingCart className="w-5 h-5 text-[#1A1A2E]" />
            <span className="absolute -top-1 -right-1 w-4.5 h-4.5 min-w-[18px] bg-[#E05C1A] text-white text-[10px] font-black rounded-full flex items-center justify-center leading-none px-1">
              {cartCount}
            </span>
          </button>
        </div>

        {/* Busca */}
        <div className="relative mt-3">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            placeholder="Buscar produtos, marcas ou lojas..."
            className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-sm text-[#2D2D2D] placeholder-gray-400 outline-none focus:border-[#E05C1A] focus:bg-white transition-all"
          />
        </div>
      </div>

      {/* Categorias scroll */}
      <div className="flex gap-2 overflow-x-auto pb-1 px-4 scrollbar-none">
        {categorias.map((c) => (
          <button
            key={c.id}
            onClick={() => setCategoriaAtiva(c.id)}
            className={`flex-shrink-0 px-3.5 py-2 rounded-full text-xs font-semibold transition-all ${
              categoriaAtiva === c.id
                ? "bg-[#E05C1A] text-white shadow-sm"
                : "bg-white border border-gray-200 text-gray-600 hover:border-[#E05C1A] hover:text-[#E05C1A]"
            }`}
          >
            {c.label}
          </button>
        ))}
      </div>

      <div className="px-4 flex flex-col gap-5">
        {/* Banner destaque */}
        <div className="bg-gradient-to-r from-[#E05C1A] to-[#c54d15] rounded-2xl p-5 flex items-center justify-between">
          <div>
            <p className="text-white font-black text-base leading-tight">
              🔥 Ofertas da semana
            </p>
            <p className="text-orange-100 text-xs mt-1">
              Até 30% OFF em equipamentos selecionados
            </p>
          </div>
          <button className="bg-white text-[#E05C1A] text-xs font-bold px-4 py-2 rounded-xl hover:bg-orange-50 transition-colors flex-shrink-0">
            Ver ofertas
          </button>
        </div>

        {/* Lojas em destaque */}
        <div>
          <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wide mb-3">
            Lojas em destaque
          </h2>
          <div className="flex gap-3 overflow-x-auto pb-1 -mx-4 px-4 scrollbar-none">
            {lojas.map((loja) => (
              <div
                key={loja.nome}
                className="flex-shrink-0 bg-white border border-gray-100 rounded-2xl p-3.5 shadow-sm w-44 cursor-pointer hover:border-[#E05C1A]/40 transition-colors"
              >
                <div className={`w-10 h-10 ${loja.cor} rounded-xl flex items-center justify-center mb-2`}>
                  <Sparkles className={`w-5 h-5 ${loja.textCor}`} />
                </div>
                <p className="text-sm font-bold text-[#1A1A2E] leading-tight">{loja.nome}</p>
                <p className="text-xs text-gray-500 mt-0.5 mb-2">{loja.desc}</p>
                <div className="flex items-center justify-between">
                  <StarRating value={loja.rating} />
                  <span className="text-[10px] text-gray-400">{loja.produtos} prod.</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Produtos em destaque */}
        <div>
          <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wide mb-3">
            Produtos em destaque
          </h2>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {produtos.map((p) => {
              const Icon = p.icon;
              return (
                <div
                  key={p.nome}
                  className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                >
                  {/* Foto placeholder */}
                  <div className={`${p.iconBg} flex items-center justify-center h-24`}>
                    <Icon className={`w-10 h-10 ${p.iconColor} opacity-70`} />
                  </div>
                  <div className="p-3 flex flex-col gap-1.5">
                    <p className="text-xs font-bold text-[#1A1A2E] leading-tight line-clamp-2">
                      {p.nome}
                    </p>
                    <p className="text-[10px] text-gray-400">{p.loja}</p>
                    <div className="flex items-center justify-between mt-0.5">
                      <StarRating value={p.rating} />
                    </div>
                    <p className="text-sm font-black text-[#1A1A2E]">{formatPreco(p.preco)}</p>
                    <button className="w-full flex items-center justify-center gap-1.5 py-2 bg-[#E05C1A] hover:bg-[#c54d15] text-white text-xs font-bold rounded-xl transition-colors mt-1">
                      <Plus className="w-3.5 h-3.5" />
                      Adicionar
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Espaço pro bottom nav */}
        <div className="h-2" />
      </div>
    </div>
  );
}
