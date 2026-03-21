"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuthContext } from "@/components/providers/AuthProvider";
import {
  Menu,
  X,
  Home,
  AlertTriangle,
  ShoppingCart,
  CreditCard,
  User,
  Settings,
  LogOut,
  ChevronRight,
  ChevronDown,
  Wrench,
  Building2,
  ClipboardList,
  HelpCircle,
} from "lucide-react";

interface MenuItem {
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  desc?: string;
  highlight?: boolean;
}

interface MenuSection {
  title: string;
  collapsible?: boolean;
  items: MenuItem[];
}

const menuSections: MenuSection[] = [
  {
    title: "Principal",
    items: [
      { href: "/home", icon: Home, label: "Início" },
      { href: "/solicitacoes", icon: ClipboardList, label: "Minhas Solicitações" },
      { href: "/perfil", icon: User, label: "Meu Perfil" },
    ],
  },
  {
    title: "Ferramentas Conekta",
    collapsible: true,
    items: [
      {
        href: "/sos",
        icon: AlertTriangle,
        label: "SOS Conekta",
        desc: "Cotação urgente",
        highlight: true,
      },
      {
        href: "/conekta-pay",
        icon: CreditCard,
        label: "Conekta Pay",
        desc: "Pagamento seguro",
      },
    ],
  },
  {
    title: "Configurações",
    items: [
      { href: "/lojas", icon: Building2, label: "Minhas Lojas" },
      { href: "/configuracoes", icon: Settings, label: "Configurações" },
      { href: "/ajuda", icon: HelpCircle, label: "Ajuda e Suporte" },
    ],
  },
];

export function DashboardSidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const [expandedSections, setExpandedSections] = useState<string[]>(["Ferramentas Conekta"]);
  const pathname = usePathname();
  const router = useRouter();
  const { logout, profile } = useAuthContext();

  const toggleSection = (title: string) => {
    setExpandedSections((prev) =>
      prev.includes(title)
        ? prev.filter((t) => t !== title)
        : [...prev, title]
    );
  };

  return (
    <>
      {/* Botão Hamburguer */}
      <button
        onClick={() => setIsOpen(true)}
        className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
      >
        <Menu className="w-5 h-5 text-gray-700" />
      </button>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-[998] bg-black/50 backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 bottom-0 z-[999] w-[280px] !bg-white opacity-100 shadow-2xl transform transition-transform duration-300 ease-out overflow-hidden ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        style={{ backgroundColor: '#ffffff' }}
      >
        {/* Header do Sidebar */}
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <Link href="/home" className="flex items-center gap-2" onClick={() => setIsOpen(false)}>
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple via-purple-medium to-purple-light flex items-center justify-center">
              <svg width="16" height="16" viewBox="0 0 18 18" fill="none">
                <path d="M3 9L9 3L15 9L9 15L3 9Z" fill="white" fillOpacity="0.9" />
                <circle cx="9" cy="9" r="2.5" fill="white" />
              </svg>
            </div>
            <span className="text-lg font-bold text-gray-900 tracking-tight">
              cone<span className="text-purple">k</span>ta
            </span>
          </Link>
          <button
            onClick={() => setIsOpen(false)}
            className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* User Info */}
        <div className="p-4 border-b border-gray-100 bg-gradient-to-br from-purple/5 to-purple-light/5">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple via-purple-medium to-purple-light flex items-center justify-center text-white text-lg font-bold shadow-lg shadow-purple/20">
              {profile?.displayName?.[0]?.toUpperCase() || profile?.email?.[0]?.toUpperCase() || 'U'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-gray-900 truncate">
                {profile?.displayName || profile?.email?.split('@')[0] || 'Usuário'}
              </p>
              <p className="text-xs text-gray-600 truncate">{profile?.email || ''}</p>
            </div>
          </div>
        </div>

        {/* Menu Items */}
        <nav className="flex-1 overflow-y-auto p-4">
          {menuSections.map((section) => {
            const isExpanded = expandedSections.includes(section.title);
            const isCollapsible = section.collapsible;

            return (
              <div key={section.title} className="mb-6 last:mb-0">
                {/* Section Title */}
                {isCollapsible ? (
                  <button
                    onClick={() => toggleSection(section.title)}
                    className="w-full flex items-center justify-between text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2 hover:text-gray-600 transition-colors"
                  >
                    <span>{section.title}</span>
                    {isExpanded ? (
                      <ChevronDown className="w-4 h-4" />
                    ) : (
                      <ChevronRight className="w-4 h-4" />
                    )}
                  </button>
                ) : (
                  <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">
                    {section.title}
                  </h3>
                )}

                {/* Items */}
                {(!isCollapsible || isExpanded) && (
                  <div className="flex flex-col gap-1">
                    {section.items.map((item) => {
                      const Icon = item.icon;
                      const isActive = pathname === item.href || pathname.startsWith(item.href + "/");

                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          onClick={() => setIsOpen(false)}
                          className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all ${
                            isActive
                              ? "bg-gradient-to-r from-purple to-purple-medium text-white shadow-lg shadow-purple/20"
                              : item.highlight
                              ? "bg-red-50 text-[#DC2626] hover:bg-red-100"
                              : "text-gray-700 hover:bg-purple/5"
                          }`}
                        >
                          <Icon className={`w-5 h-5 flex-shrink-0 ${
                            isActive ? "text-white" : item.highlight ? "text-[#DC2626]" : "text-gray-400"
                          }`} />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">{item.label}</p>
                            {item.desc && !isActive && (
                              <p className={`text-xs truncate ${
                                item.highlight ? "text-red-600/70" : "text-gray-500"
                              }`}>
                                {item.desc}
                              </p>
                            )}
                          </div>
                          {item.highlight && !isActive && (
                            <span className="flex-shrink-0 w-2 h-2 bg-[#DC2626] rounded-full animate-pulse" />
                          )}
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-gray-100">
          <button
            onClick={async () => {
              await logout();
              router.push('/login');
            }}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-red-600 hover:bg-red-50 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span className="text-sm font-medium">Sair</span>
          </button>
        </div>
      </div>
    </>
  );
}
