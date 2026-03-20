import type { ReactNode } from "react";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Navbar */}
      <Navbar />

      {/* Main content */}
      <main className="flex-1 flex items-center justify-center px-4 py-12 pt-24">
        {children}
      </main>

      {/* Footer */}
      <footer className="py-6 text-center text-xs text-gray-500">
        <p>Você descreve. A gente conecta.</p>
        <p className="mt-1">
          © {new Date().getFullYear()} Conekta — Todos os direitos reservados
        </p>
      </footer>
    </div>
  );
}
