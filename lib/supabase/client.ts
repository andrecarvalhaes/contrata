import { createBrowserClient } from '@supabase/ssr';
import type { Database } from './types';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Variáveis NEXT_PUBLIC_SUPABASE_URL e NEXT_PUBLIC_SUPABASE_ANON_KEY são obrigatórias.'
  );
}

let browserClient: ReturnType<typeof createBrowserClient<Database>> | null = null;

/**
 * Retorna o client Supabase do navegador (singleton).
 * O projeto roda como SPA estática (output: 'export'), então
 * só temos client-side. Auth persiste em localStorage via @supabase/ssr.
 */
export function getSupabase() {
  if (!browserClient) {
    browserClient = createBrowserClient<Database>(supabaseUrl!, supabaseAnonKey!);
  }
  return browserClient;
}

export const supabase = getSupabase();
