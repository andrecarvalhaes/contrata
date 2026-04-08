"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import {
  FornecedorSidebar,
  FornecedorSidebarProvider,
  FornecedorSidebarTrigger,
} from "@/components/fornecedor/FornecedorSidebar";
import { OnboardingGate } from "@/components/fornecedor/OnboardingGate";

export default function FornecedorLayout({ children }: { children: ReactNode }) {
  return (
    <ProtectedRoute requiredRole="fornecedor">
      <FornecedorSidebarProvider>
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-purple/[0.02] to-purple-light/[0.05] flex">
          <FornecedorSidebar />
          <div className="flex-1 min-w-0 flex flex-col">
            <header className="md:hidden sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-purple/10 shadow-sm">
              <div className="px-4 py-3 flex items-center gap-3">
                <FornecedorSidebarTrigger />
                <Link href="/parceiro" className="flex items-center gap-1.5">
                  <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-purple via-purple-medium to-purple-light flex items-center justify-center">
                    <svg width="14" height="14" viewBox="0 0 18 18" fill="none">
                      <path d="M3 9L9 3L15 9L9 15L3 9Z" fill="white" fillOpacity="0.9" />
                      <circle cx="9" cy="9" r="2.5" fill="white" />
                    </svg>
                  </div>
                  <span className="text-base font-bold text-gray-900 font-display">
                    cone<span className="text-purple">k</span>ta
                  </span>
                  <span className="ml-1 text-[10px] font-semibold text-purple uppercase tracking-wider">
                    Parceiro
                  </span>
                </Link>
              </div>
            </header>
            <main className="flex-1 w-full px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
              <OnboardingGate>{children}</OnboardingGate>
            </main>
          </div>
        </div>
      </FornecedorSidebarProvider>
    </ProtectedRoute>
  );
}
