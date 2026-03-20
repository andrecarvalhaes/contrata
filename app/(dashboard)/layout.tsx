"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, ClipboardList, ShoppingCart, User, AlertTriangle } from "lucide-react";
import type { ReactNode } from "react";

const navItems = [
  { href: "/home", icon: Home, label: "Home" },
  { href: "/solicitacoes", icon: ClipboardList, label: "Solicitações" },
  { href: "/sos", icon: AlertTriangle, label: "SOS", urgent: true },
  { href: "/shop", icon: ShoppingCart, label: "Shop" },
  { href: "/perfil", icon: User, label: "Perfil" },
];

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-[#F9FAFB] flex flex-col">
      {/* Header compacto */}
      <header className="sticky top-0 z-40 bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between">
          {/* Logo compacto horizontal */}
          <Link href="/home" className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-[#E05C1A] flex items-center justify-center">
              <svg width="15" height="15" viewBox="0 0 18 18" fill="none">
                <path d="M3 9L9 3L15 9L9 15L3 9Z" fill="white" fillOpacity="0.9" />
                <circle cx="9" cy="9" r="2.5" fill="white" />
              </svg>
            </div>
            <span className="text-lg font-bold text-[#1A1A2E] tracking-tight">
              Nex<span className="text-[#E05C1A]">.to</span>
            </span>
          </Link>

          {/* Usuário + notificações */}
          <div className="flex items-center gap-3">
            {/* Sino */}
            <button className="relative p-1.5 rounded-full hover:bg-gray-100 transition-colors">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#2D2D2D]">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                <path d="M13.73 21a2 2 0 0 1-3.46 0" />
              </svg>
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-[#DC2626] text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                2
              </span>
            </button>

            {/* Avatar */}
            <div className="w-8 h-8 rounded-full bg-[#E05C1A] flex items-center justify-center text-white text-sm font-bold">
              J
            </div>
          </div>
        </div>
      </header>

      {/* Conteúdo */}
      <main className="flex-1 max-w-2xl mx-auto w-full px-4 py-4 pb-24">
        {children}
      </main>

      {/* Bottom nav */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-100 shadow-[0_-1px_8px_rgba(0,0,0,0.06)]">
        <div className="max-w-2xl mx-auto flex items-center justify-around px-2 py-1">
          {navItems.map(({ href, icon: Icon, label, urgent }) => {
            const isActive = pathname === href || pathname.startsWith(href + "/");
            return (
              <Link
                key={href}
                href={href}
                className={`flex flex-col items-center gap-0.5 px-3 py-2 rounded-xl transition-colors min-w-[56px] ${
                  isActive
                    ? urgent
                      ? "text-[#DC2626]"
                      : "text-[#E05C1A]"
                    : "text-gray-400 hover:text-gray-600"
                }`}
              >
                <Icon
                  className={`w-5 h-5 ${
                    urgent && !isActive ? "text-gray-400" : ""
                  }`}
                />
                <span className="text-[10px] font-medium">{label}</span>
                {isActive && (
                  <span
                    className={`w-1 h-1 rounded-full ${
                      urgent ? "bg-[#DC2626]" : "bg-[#E05C1A]"
                    }`}
                  />
                )}
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
