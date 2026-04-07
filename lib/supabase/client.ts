import { createBrowserClient } from '@supabase/ssr';
import type { Database } from './types';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? '';

let browserClient: ReturnType<typeof createBrowserClient<Database>> | null = null;

/**
 * Retorna o client Supabase do navegador (singleton).
 * O projeto roda como SPA estática (output: 'export'), então
 * só temos client-side. Auth persiste em localStorage via @supabase/ssr.
 *
 * IMPORTANTE: as variáveis são lidas no init, mas a validação acontece
 * só na primeira chamada para não quebrar prerender / build estático
 * caso as envs não estejam presentes no ambiente de build.
 */
export function getSupabase() {
  if (!browserClient) {
    if (!supabaseUrl || !supabaseAnonKey) {
      throw new Error(
        'Variáveis NEXT_PUBLIC_SUPABASE_URL e NEXT_PUBLIC_SUPABASE_ANON_KEY são obrigatórias.'
      );
    }
    browserClient = createBrowserClient<Database>(supabaseUrl, supabaseAnonKey);
  }
  return browserClient;
}

/**
 * Proxy lazy: só instancia o client real quando alguma propriedade é acessada.
 * Isso permite que módulos importem `supabase` sem disparar erro durante
 * prerender estático de páginas que não chamam auth/db.
 */
export const supabase = new Proxy({} as ReturnType<typeof createBrowserClient<Database>>, {
  get(_target, prop, receiver) {
    const client = getSupabase();
    const value = Reflect.get(client, prop, receiver);
    return typeof value === 'function' ? value.bind(client) : value;
  },
});
