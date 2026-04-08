"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Home, ClipboardList, User, AlertTriangle, CreditCard, ChevronDown, LogOut, Settings, HelpCircle, Search } from "lucide-react";
import type { ReactNode } from "react";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { useAuthContext } from "@/components/providers/AuthProvider";
import { useState } from "react";
import { DashboardSidebar } from "@/components/DashboardSidebar";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { logout, profile } = useAuthContext();
  const [showFerramentasMenu, setShowFerramentasMenu] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showMobileSearch, setShowMobileSearch] = useState(false);

  const handleLogout = async () => {
    await logout();
    router.push('/login');
  };

  const handleSearch = () => {
    if (searchQuery.trim()) {
      // Implementar lógica de busca ou redirecionar
      console.log('Buscando:', searchQuery);
    }
  };

  return (
    <ProtectedRoute requiredRole={["posto", "admin"]}>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-purple/[0.02] to-purple-light/[0.05] flex flex-col">
      {/* Header com navegação */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-purple/10 shadow-sm">
        <div className="w-full px-4 sm:px-6 py-3 flex items-center justify-between gap-3 sm:gap-6">
          {/* Menu Hamburguer Mobile */}
          <div className="md:hidden">
            <DashboardSidebar />
          </div>

          {/* Logo */}
          <Link href="/home" className="flex items-center gap-1 flex-shrink-0">
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-gradient-to-br from-purple via-purple-medium to-purple-light flex items-center justify-center">
              <svg width="14" height="14" viewBox="0 0 18 18" fill="none" className="sm:w-4 sm:h-4">
                <path d="M3 9L9 3L15 9L9 15L3 9Z" fill="white" fillOpacity="0.9" />
                <circle cx="9" cy="9" r="2.5" fill="white" />
              </svg>
            </div>
            <span className="text-lg sm:text-xl font-bold text-gray-900 tracking-tight">
              cone<span className="bg-gradient-to-r from-purple to-purple-medium bg-clip-text text-transparent">k</span>ta
            </span>
          </Link>

          {/* Menu Principal - Desktop */}
          <nav className="hidden md:flex items-center gap-1 flex-1">
            <Link
              href="/home"
              className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold transition-all relative ${
                pathname === "/home"
                  ? "text-purple"
                  : "text-gray-700 hover:text-gray-900"
              }`}
            >
              <Home className="w-4 h-4" />
              <span>Início</span>
              {pathname === "/home" && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-purple rounded-full" />
              )}
            </Link>

            <Link
              href="/solicitacoes"
              className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold transition-all relative ${
                pathname === "/solicitacoes"
                  ? "text-purple"
                  : "text-gray-700 hover:text-gray-900"
              }`}
            >
              <ClipboardList className="w-4 h-4" />
              <span>Solicitações</span>
              {pathname === "/solicitacoes" && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-purple rounded-full" />
              )}
            </Link>

            {/* Dropdown Ferramentas */}
            <div className="relative">
              <button
                onClick={() => setShowFerramentasMenu(!showFerramentasMenu)}
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-purple/5 transition-all"
              >
                <span>Ferramentas</span>
                <ChevronDown className="w-4 h-4" />
              </button>

              {showFerramentasMenu && (
                <>
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setShowFerramentasMenu(false)}
                  />
                  <div className="absolute top-full left-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-20">
                    <Link
                      href="/sos"
                      onClick={() => setShowFerramentasMenu(false)}
                      className="flex items-center gap-3 px-4 py-2.5 hover:bg-red-50 text-gray-700 hover:text-red-600 transition-colors"
                    >
                      <AlertTriangle className="w-4 h-4" />
                      <div>
                        <p className="text-sm font-semibold">SOS Conekta</p>
                        <p className="text-xs text-gray-500">Cotação urgente</p>
                      </div>
                    </Link>
                    <Link
                      href="/conekta-pay"
                      onClick={() => setShowFerramentasMenu(false)}
                      className="flex items-center gap-3 px-4 py-2.5 hover:bg-purple/5 transition-colors"
                    >
                      <CreditCard className="w-4 h-4" />
                      <div>
                        <p className="text-sm font-semibold text-gray-700">Conekta Pay</p>
                        <p className="text-xs text-gray-500">Pagamento seguro</p>
                      </div>
                    </Link>
                  </div>
                </>
              )}
            </div>
          </nav>

          {/* Busca Global - Desktop */}
          <div className="hidden lg:flex flex-1 max-w-md">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                placeholder="Buscar produtos ou serviços..."
                className="w-full pl-10 pr-4 py-2 rounded-lg bg-gray-50 text-gray-900 text-sm placeholder-gray-400 outline-none focus:ring-2 focus:ring-purple/20 focus:bg-white transition-all border border-gray-200"
              />
            </div>
          </div>

          {/* Direita: Busca Mobile + Notificações + Avatar */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Botão Busca Mobile */}
            <button
              onClick={() => setShowMobileSearch(!showMobileSearch)}
              className="lg:hidden p-2 rounded-full hover:bg-purple/5 transition-colors"
            >
              <Search className="w-5 h-5 text-gray-600" />
            </button>

            {/* Sino */}
            <button className="relative p-2 rounded-full hover:bg-purple/5 transition-colors">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-600 sm:w-5 sm:h-5">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                <path d="M13.73 21a2 2 0 0 1-3.46 0" />
              </svg>
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-gradient-to-br from-purple to-purple-medium text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow-lg shadow-purple/30">
                2
              </span>
            </button>

            {/* Avatar + Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="flex items-center gap-1.5 sm:gap-2 hover:opacity-80 transition-opacity"
              >
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gradient-to-br from-purple via-purple-medium to-purple-light flex items-center justify-center text-white text-xs sm:text-sm font-bold shadow-lg shadow-purple/20">
                  {profile?.display_name?.[0]?.toUpperCase() || profile?.email?.[0]?.toUpperCase() || 'U'}
                </div>
                <ChevronDown className="w-4 h-4 text-gray-600 hidden sm:block" />
              </button>

              {showProfileMenu && (
                <>
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setShowProfileMenu(false)}
                  />
                  <div className="absolute top-full right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-20">
                    <div className="px-4 py-3 border-b border-gray-100">
                      <p className="text-sm font-bold text-gray-900 truncate">
                        {profile?.display_name || profile?.email?.split('@')[0] || 'Usuário'}
                      </p>
                      <p className="text-xs text-gray-500 truncate">{profile?.email || ''}</p>
                    </div>
                    <Link
                      href="/perfil"
                      onClick={() => setShowProfileMenu(false)}
                      className="flex items-center gap-3 px-4 py-2.5 hover:bg-purple/5 transition-colors"
                    >
                      <User className="w-4 h-4 text-gray-600" />
                      <span className="text-sm text-gray-700">Meu Perfil</span>
                    </Link>
                    <Link
                      href="/configuracoes"
                      onClick={() => setShowProfileMenu(false)}
                      className="flex items-center gap-3 px-4 py-2.5 hover:bg-purple/5 transition-colors"
                    >
                      <Settings className="w-4 h-4 text-gray-600" />
                      <span className="text-sm text-gray-700">Configurações</span>
                    </Link>
                    <Link
                      href="/ajuda"
                      onClick={() => setShowProfileMenu(false)}
                      className="flex items-center gap-3 px-4 py-2.5 hover:bg-purple/5 transition-colors"
                    >
                      <HelpCircle className="w-4 h-4 text-gray-600" />
                      <span className="text-sm text-gray-700">Ajuda</span>
                    </Link>
                    <div className="border-t border-gray-100 mt-2 pt-2">
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-red-50 text-red-600 transition-colors"
                      >
                        <LogOut className="w-4 h-4" />
                        <span className="text-sm font-medium">Sair</span>
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Busca Mobile - Barra Expansível */}
        {showMobileSearch && (
          <div className="lg:hidden px-4 pb-3 animate-in slide-in-from-top">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                placeholder="Buscar produtos ou serviços..."
                className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-gray-50 text-gray-900 text-sm placeholder-gray-400 outline-none focus:ring-2 focus:ring-purple/20 focus:bg-white transition-all border border-gray-200"
                autoFocus
              />
            </div>
          </div>
        )}
      </header>

      {/* Conteúdo */}
      <main className="flex-1 w-full px-4 sm:px-6 py-6 sm:py-8">
        {children}
      </main>
    </div>
    </ProtectedRoute>
  );
}
