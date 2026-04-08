import type { Enums } from "@/lib/supabase/types";

type UserRole = Enums<"user_role">;

/**
 * Rota inicial padrão de cada papel após login.
 *
 * - `posto`: dashboard de solicitações de serviço
 * - `fornecedor`: área do parceiro (dashboard, anúncios, leads, etc.)
 * - `admin`: usa o mesmo dashboard do posto por enquanto
 */
export const ROLE_HOME: Record<UserRole, string> = {
  posto: "/home",
  fornecedor: "/parceiro",
  admin: "/home",
};

/** Fallback quando não sabemos o papel ainda. */
export const DEFAULT_HOME = "/home";

export function getHomeForRole(role: UserRole | null | undefined): string {
  if (!role) return DEFAULT_HOME;
  return ROLE_HOME[role] ?? DEFAULT_HOME;
}
