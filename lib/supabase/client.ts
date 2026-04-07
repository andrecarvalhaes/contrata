import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import type { Database } from './types';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? '';

let browserClient: SupabaseClient<Database> | null = null;

/**
 * Retorna o client Supabase do navegador (singleton).
 *
 * O projeto roda como SPA estática (output: 'export'), então usamos
 * createClient do @supabase/supabase-js (NÃO createBrowserClient do
 * @supabase/ssr), porque precisamos que o PKCE code verifier seja
 * guardado em localStorage e não em cookies — cookies não são
 * confiáveis em redirects cross-site para hosting estático.
 *
 * As envs são validadas só na primeira chamada para não quebrar
 * prerender estático.
 */
export function getSupabase(): SupabaseClient<Database> {
  if (!browserClient) {
    if (!supabaseUrl || !supabaseAnonKey) {
      throw new Error(
        'Variáveis NEXT_PUBLIC_SUPABASE_URL e NEXT_PUBLIC_SUPABASE_ANON_KEY são obrigatórias.'
      );
    }
    browserClient = createClient<Database>(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
        flowType: 'pkce',
        storage: typeof window !== 'undefined' ? window.localStorage : undefined,
      },
    });
  }
  return browserClient;
}

/**
 * Proxy lazy: só instancia o client real quando alguma propriedade é acessada.
 * Permite importar `supabase` sem disparar erro durante prerender estático
 * de páginas que não chamam auth/db.
 */
export const supabase = new Proxy({} as SupabaseClient<Database>, {
  get(_target, prop, receiver) {
    const client = getSupabase();
    const value = Reflect.get(client, prop, receiver);
    return typeof value === 'function' ? value.bind(client) : value;
  },
});
