/**
 * Módulo de mensagens — infraestrutura de dados para o chat entre parceiro e posto.
 *
 * As tabelas `conversas` e `mensagens` ainda não existem no schema Supabase.
 * Este módulo expõe os tipos e hooks para quando forem criadas.
 * Por enquanto, os hooks retornam arrays vazios.
 */
import { useQuery } from "@tanstack/react-query";
import { useMyFornecedor } from "./onboarding";

export type MensagemTipo = "texto" | "arquivo" | "proposta";

export interface Conversa {
  id: string;
  lead_id: string | null;
  posto_nome: string;
  posto_id: string;
  ultima_mensagem: string | null;
  ultima_mensagem_em: string | null;
  nao_lidas: number;
  foto_url: string | null;
}

export interface Mensagem {
  id: string;
  conversa_id: string;
  autor: "fornecedor" | "posto";
  tipo: MensagemTipo;
  conteudo: string;
  arquivo_url: string | null;
  lida: boolean;
  created_at: string;
}

export function useMinhasConversas() {
  const { data: my } = useMyFornecedor();
  const fornecedorId = my?.fornecedor?.id ?? null;
  return useQuery<Conversa[]>({
    queryKey: ["conversas", fornecedorId],
    enabled: !!fornecedorId,
    queryFn: async () => {
      // Tabela ainda não existe — retorna vazio até migração ser aplicada
      return [];
    },
  });
}

export function useMensagens(conversaId: string | null) {
  return useQuery<Mensagem[]>({
    queryKey: ["mensagens", conversaId],
    enabled: !!conversaId,
    queryFn: async () => {
      return [];
    },
  });
}
