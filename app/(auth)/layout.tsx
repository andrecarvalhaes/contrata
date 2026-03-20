import type { ReactNode } from "react";
import Link from "next/link";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="w-full py-6 px-4 flex justify-center">
        <Link href="/" className="flex flex-col items-center gap-1">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#E05C1A] flex items-center justify-center">
              <svg
                width="18"
                height="18"
                viewBox="0 0 18 18"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M3 9L9 3L15 9L9 15L3 9Z"
                  fill="white"
                  fillOpacity="0.9"
                />
                <circle cx="9" cy="9" r="2.5" fill="white" />
              </svg>
            </div>
            <span className="text-2xl font-bold text-[#1A1A2E] tracking-tight">
              Nex<span className="text-[#E05C1A]">.to</span>
            </span>
          </div>
          <p className="text-xs text-gray-500 font-medium tracking-wide">
            Você descreve. A gente conecta.
          </p>
        </Link>
      </header>

      {/* Main content */}
      <main className="flex-1 flex items-start justify-center px-4 pb-12 pt-4">
        {children}
      </main>

      {/* Footer */}
      <footer className="py-4 text-center text-xs text-gray-400">
        © {new Date().getFullYear()} Nex.to — Todos os direitos reservados
      </footer>
    </div>
  );
}
