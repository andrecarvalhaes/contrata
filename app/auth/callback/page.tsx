"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabase/client";

function LoadingState() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-purple border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="mt-4 text-sm text-gray-600">Concluindo autenticação...</p>
      </div>
    </div>
  );
}

function CallbackHandler() {
  const router = useRouter();
  const params = useSearchParams();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function handle() {
      try {
        const code = params.get("code");
        const next = params.get("next") || "/home";

        if (code) {
          const { error } = await supabase.auth.exchangeCodeForSession(code);
          if (error) throw error;
        } else {
          await supabase.auth.getSession();
        }

        if (!cancelled) router.replace(next);
      } catch (e: any) {
        if (!cancelled) setError(e?.message || "Falha ao concluir autenticação.");
      }
    }

    handle();
    return () => {
      cancelled = true;
    };
  }, [params, router]);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={() => router.replace("/login")}
            className="text-purple font-semibold hover:underline"
          >
            Voltar ao login
          </button>
        </div>
      </div>
    );
  }

  return <LoadingState />;
}

/**
 * Página de callback OAuth/email confirmation.
 * Recebe `?code=...` (PKCE) ou `#access_token=...` (implicit) e troca pela sessão.
 */
export default function AuthCallbackPage() {
  return (
    <Suspense fallback={<LoadingState />}>
      <CallbackHandler />
    </Suspense>
  );
}
