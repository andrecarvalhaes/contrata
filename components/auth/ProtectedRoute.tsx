"use client";

import { useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useAuthContext } from "@/components/providers/AuthProvider";
import type { Enums } from "@/lib/supabase/types";
import { getHomeForRole } from "@/lib/auth/roleRoutes";

type UserRole = Enums<"user_role">;

interface ProtectedRouteProps {
  children: React.ReactNode;
  /**
   * Restringe o acesso a um ou mais papéis. Se omitido, basta estar autenticado.
   * Usuários com papel diferente são redirecionados para `/home`.
   */
  requiredRole?: UserRole | UserRole[];
}

export function ProtectedRoute({ children, requiredRole }: ProtectedRouteProps) {
  const { isAuthenticated, loading, profile } = useAuthContext();
  const router = useRouter();

  const allowedRoles = useMemo(
    () =>
      requiredRole
        ? Array.isArray(requiredRole)
          ? requiredRole
          : [requiredRole]
        : null,
    [requiredRole]
  );

  const hasRequiredRole =
    !allowedRoles || (profile?.role ? allowedRoles.includes(profile.role) : false);

  useEffect(() => {
    if (loading) return;

    if (!isAuthenticated) {
      router.replace("/login");
      return;
    }

    if (allowedRoles && profile && !hasRequiredRole) {
      router.replace(getHomeForRole(profile.role));
    }
  }, [loading, isAuthenticated, profile, hasRequiredRole, allowedRoles, router]);

  if (loading || (allowedRoles && !profile)) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-purple border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="mt-4 text-sm text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !hasRequiredRole) {
    return null;
  }

  return <>{children}</>;
}
