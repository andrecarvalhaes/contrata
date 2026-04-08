"use client";

import { createContext, useContext, useState, type ReactNode } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuthContext } from "@/components/providers/AuthProvider";
import {
  Menu,
  X,
  LayoutDashboard,
  Megaphone,
  Target,
  MessageSquare,
  Wallet,
  UserCircle2,
  LogOut,
} from "lucide-react";

interface MenuItem {
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  desc?: string;
}

export const fornecedorMenu: MenuItem[] = [
  { href: "/parceiro", icon: LayoutDashboard, label: "Início", desc: "Visão geral" },
  { href: "/parceiro/anuncios", icon: Megaphone, label: "Meus Anúncios", desc: "Gerencie suas ofertas" },
  { href: "/parceiro/leads", icon: Target, label: "Leads", desc: "Interessados e propostas" },
  { href: "/parceiro/mensagens", icon: MessageSquare, label: "Mensagens", desc: "Chat com os postos" },
  { href: "/parceiro/financeiro", icon: Wallet, label: "Financeiro", desc: "Extrato e Conekta Lock" },
  { href: "/parceiro/perfil", icon: UserCircle2, label: "Perfil", desc: "Reputação e dados" },
];

function isActive(pathname: string, href: string) {
  if (href === "/parceiro") return pathname === "/parceiro";
  return pathname === href || pathname.startsWith(href + "/");
}

interface SidebarCtx {
  isOpen: boolean;
  open: () => void;
  close: () => void;
}

const SidebarContext = createContext<SidebarCtx | null>(null);

function useSidebar() {
  const ctx = useContext(SidebarContext);
  if (!ctx) throw new Error("useSidebar must be used inside FornecedorSidebarProvider");
  return ctx;
}

export function FornecedorSidebarProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <SidebarContext.Provider
      value={{ isOpen, open: () => setIsOpen(true), close: () => setIsOpen(false) }}
    >
      {children}
    </SidebarContext.Provider>
  );
}

export function FornecedorSidebarTrigger() {
  const { open } = useSidebar();
  return (
    <button
      onClick={open}
      className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
      aria-label="Abrir menu"
    >
      <Menu className="w-5 h-5 text-gray-700" />
    </button>
  );
}

export function FornecedorSidebar() {
  const { isOpen, close } = useSidebar();
  const pathname = usePathname();
  const router = useRouter();
  const { logout, profile } = useAuthContext();

  const handleLogout = async () => {
    await logout();
    router.push("/login");
  };

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 z-[998] bg-black/50 backdrop-blur-sm md:hidden"
          onClick={close}
        />
      )}

      <aside
        className={`fixed md:sticky top-0 left-0 bottom-0 md:h-screen z-[999] w-[280px] bg-white border-r border-gray-100 shadow-2xl md:shadow-none transform transition-transform duration-300 ease-out overflow-hidden flex flex-col ${
          isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <Link href="/parceiro" className="flex items-center gap-2" onClick={close}>
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple via-purple-medium to-purple-light flex items-center justify-center">
              <svg width="16" height="16" viewBox="0 0 18 18" fill="none">
                <path d="M3 9L9 3L15 9L9 15L3 9Z" fill="white" fillOpacity="0.9" />
                <circle cx="9" cy="9" r="2.5" fill="white" />
              </svg>
            </div>
            <div className="flex flex-col leading-tight">
              <span className="text-lg font-bold text-gray-900 tracking-tight font-display">
                cone<span className="text-purple">k</span>ta
              </span>
              <span className="text-[10px] font-semibold text-purple uppercase tracking-wider">
                Parceiro
              </span>
            </div>
          </Link>
          <button
            onClick={close}
            className="md:hidden p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
            aria-label="Fechar menu"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="p-4 border-b border-gray-100 bg-gradient-to-br from-purple/5 to-purple-light/5">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple via-purple-medium to-purple-light flex items-center justify-center text-white text-lg font-bold shadow-lg shadow-purple/20">
              {profile?.display_name?.[0]?.toUpperCase() ||
                profile?.email?.[0]?.toUpperCase() ||
                "P"}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-gray-900 truncate">
                {profile?.display_name || profile?.email?.split("@")[0] || "Parceiro"}
              </p>
              <p className="text-xs text-gray-600 truncate">{profile?.email || ""}</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto p-4">
          <div className="flex flex-col gap-1">
            {fornecedorMenu.map((item) => {
              const Icon = item.icon;
              const active = isActive(pathname, item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={close}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all ${
                    active
                      ? "bg-gradient-to-r from-purple to-purple-medium text-white shadow-lg shadow-purple/20"
                      : "text-gray-700 hover:bg-purple/5"
                  }`}
                >
                  <Icon
                    className={`w-5 h-5 flex-shrink-0 ${
                      active ? "text-white" : "text-gray-400"
                    }`}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{item.label}</p>
                    {item.desc && !active && (
                      <p className="text-xs text-gray-500 truncate">{item.desc}</p>
                    )}
                  </div>
                </Link>
              );
            })}
          </div>
        </nav>

        <div className="p-4 border-t border-gray-100">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-red-600 hover:bg-red-50 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span className="text-sm font-medium">Sair</span>
          </button>
        </div>
      </aside>
    </>
  );
}
