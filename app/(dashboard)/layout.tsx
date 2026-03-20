"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, ClipboardList, ShoppingCart, User, AlertTriangle } from "lucide-react";
import type { ReactNode } from "react";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { DashboardSidebar } from "@/components/DashboardSidebar";

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
    <ProtectedRoute>
      <div className="min-h-screen bg-[#F9FAFB] flex flex-col">
      {/* Header compacto */}
      <header className="sticky top-0 z-40 bg-white border-b border-gray-100 shadow-sm">
        <div className="w-full px-6 py-3 flex items-center justify-between">
          {/* Menu + Logo */}
          <div className="flex items-center gap-3">
            <DashboardSidebar />
            <Link href="/home" className="flex items-center gap-1">
              <span className="text-xl font-bold text-purple tracking-tight">
                cone<span className="text-amber-500">k</span>ta
              </span>
            </Link>
          </div>

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
      <main className="flex-1 w-full px-6 py-6">
        {children}
      </main>
    </div>
    </ProtectedRoute>
  );
}
