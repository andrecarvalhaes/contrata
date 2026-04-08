"use client";

import { useEffect, type ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useMyFornecedor } from "@/lib/data/onboarding";

/**
 * Bloqueia o acesso às rotas internas da área do parceiro enquanto o
 * cadastro não estiver aprovado. Usuários com status diferente de
 * `aprovado` (incluindo quem ainda não tem registro em `fornecedores`)
 * são redirecionados para `/parceiro/onboarding`.
 *
 * Quando o próprio `pathname` já é `/parceiro/onboarding`, o gate deixa
 * a página renderizar para permitir o fluxo de envio de documentos.
 */
export function OnboardingGate({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { data, isLoading } = useMyFornecedor();

  const isOnboardingRoute = pathname?.startsWith("/parceiro/onboarding");
  const status = data?.status ?? null;

  useEffect(() => {
    if (isLoading) return;
    if (!status) return;

    if (status === "aprovado" && isOnboardingRoute) {
      router.replace("/parceiro");
      return;
    }
    if (status !== "aprovado" && !isOnboardingRoute) {
      router.replace("/parceiro/onboarding");
    }
  }, [isLoading, status, isOnboardingRoute, router]);

  if (isLoading || !status) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-purple border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="mt-3 text-sm text-gray-600">Carregando sua área...</p>
        </div>
      </div>
    );
  }

  if (status !== "aprovado" && !isOnboardingRoute) return null;
  if (status === "aprovado" && isOnboardingRoute) return null;

  return <>{children}</>;
}
