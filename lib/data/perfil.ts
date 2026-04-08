import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase/client";
import type { Tables } from "@/lib/supabase/types";
import { useMyFornecedor } from "./onboarding";

export type Avaliacao = Tables<"avaliacoes">;

export interface PerfilPublico {
  id: string;
  nome: string;
  razao_social: string;
  nome_fantasia: string | null;
  descricao: string | null;
  imagem_url: string | null;
  cidade: string | null;
  estado: string | null;
  telefone: string | null;
  whatsapp: string | null;
  email_contato: string | null;
  website: string | null;
  rating_medio: number;
  total_avaliacoes: number;
  tempo_resposta_horas: number | null;
  certificacoes: string[];
  verificado: boolean;
  categorias: Array<{ id: string; nome: string; slug: string }>;
  fotos: string[];
  anuncios_ativos: Array<{
    id: string;
    titulo: string;
    resumo: string | null;
    preco_modalidade: string;
    preco_centavos: number | null;
    fotos: string[];
    categoria_nome: string | null;
  }>;
}

/**
 * Carrega o perfil público do fornecedor autenticado — a mesma view que o
 * posto vê no marketplace. Junta dados do fornecedor, categorias cobertas
 * pelos anúncios ativos e a galeria consolidada.
 */
export function useMeuPerfilPublico() {
  const { data: my } = useMyFornecedor();
  const fornecedorId = my?.fornecedor?.id ?? null;
  return useQuery<PerfilPublico | null>({
    queryKey: ["meu-perfil-publico", fornecedorId],
    enabled: !!fornecedorId,
    queryFn: async () => {
      if (!fornecedorId) return null;

      const { data: f, error } = await supabase
        .from("fornecedores")
        .select("*")
        .eq("id", fornecedorId)
        .maybeSingle();
      if (error) throw new Error(error.message);
      if (!f) return null;

      const { data: anunciosData } = await supabase
        .from("fornecedor_anuncios")
        .select(
          `
          id, titulo, resumo, preco_modalidade, preco_centavos, fotos,
          categoria:categorias_servico ( id, nome, slug )
          `
        )
        .eq("fornecedor_id", fornecedorId)
        .eq("status", "ativo")
        .order("updated_at", { ascending: false });

      const anuncios = (anunciosData ?? []) as any[];

      // Consolida categorias únicas
      const categoriasMap = new Map<string, { id: string; nome: string; slug: string }>();
      for (const a of anuncios) {
        if (a.categoria) {
          categoriasMap.set(a.categoria.id, {
            id: a.categoria.id,
            nome: a.categoria.nome,
            slug: a.categoria.slug,
          });
        }
      }

      // Consolida galeria de fotos
      const fotos: string[] = [];
      for (const a of anuncios) {
        if (Array.isArray(a.fotos)) fotos.push(...a.fotos);
      }

      return {
        id: f.id,
        nome: f.nome_fantasia || f.razao_social,
        razao_social: f.razao_social,
        nome_fantasia: f.nome_fantasia,
        descricao: f.descricao,
        imagem_url: f.imagem_url,
        cidade: f.cidade,
        estado: f.estado,
        telefone: f.telefone,
        whatsapp: f.whatsapp,
        email_contato: f.email_contato,
        website: f.website,
        rating_medio: Number(f.rating_medio ?? 0),
        total_avaliacoes: f.total_avaliacoes ?? 0,
        tempo_resposta_horas: f.tempo_resposta_horas,
        certificacoes: f.certificacoes ?? [],
        verificado: f.verificado ?? false,
        categorias: Array.from(categoriasMap.values()),
        fotos,
        anuncios_ativos: anuncios.map((a) => ({
          id: a.id,
          titulo: a.titulo,
          resumo: a.resumo,
          preco_modalidade: a.preco_modalidade,
          preco_centavos: a.preco_centavos,
          fotos: a.fotos ?? [],
          categoria_nome: a.categoria?.nome ?? null,
        })),
      };
    },
  });
}

export interface AvaliacaoComPosto extends Avaliacao {
  posto_nome: string | null;
  sos_titulo: string | null;
}

/**
 * Lista avaliações recebidas pelo fornecedor autenticado, já com nome do
 * posto e título do SOS relacionado (quando houver) para exibição.
 */
export function useMinhasAvaliacoes() {
  const { data: my } = useMyFornecedor();
  const fornecedorId = my?.fornecedor?.id ?? null;
  return useQuery<AvaliacaoComPosto[]>({
    queryKey: ["minhas-avaliacoes", fornecedorId],
    enabled: !!fornecedorId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("avaliacoes")
        .select(
          `
          *,
          posto:postos ( razao_social, nome_fantasia ),
          sos:sos_disparos ( titulo )
          `
        )
        .eq("fornecedor_id", fornecedorId!)
        .order("created_at", { ascending: false });
      if (error) throw new Error(error.message);
      return (data ?? []).map((a: any): AvaliacaoComPosto => ({
        ...a,
        posto_nome:
          a.posto?.nome_fantasia || a.posto?.razao_social || null,
        sos_titulo: a.sos?.titulo ?? null,
      }));
    },
  });
}

/**
 * Responde publicamente a uma avaliação — atualiza resposta_fornecedor e
 * respondida_em. Passar string vazia remove a resposta.
 */
export function useResponderAvaliacao() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: { id: string; resposta: string }) => {
      const trimmed = input.resposta.trim();
      const { error } = await supabase
        .from("avaliacoes")
        .update({
          resposta_fornecedor: trimmed || null,
          respondida_em: trimmed ? new Date().toISOString() : null,
        })
        .eq("id", input.id);
      if (error) throw new Error(error.message);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["minhas-avaliacoes"] });
    },
  });
}

/**
 * Estatísticas derivadas das avaliações (média, distribuição por nota).
 */
export interface AvaliacaoStats {
  total: number;
  media: number;
  distribuicao: Record<1 | 2 | 3 | 4 | 5, number>;
}

export function calcularStats(avaliacoes: AvaliacaoComPosto[]): AvaliacaoStats {
  const dist: Record<1 | 2 | 3 | 4 | 5, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  let soma = 0;
  for (const a of avaliacoes) {
    const n = a.nota as 1 | 2 | 3 | 4 | 5;
    if (n >= 1 && n <= 5) {
      dist[n]++;
      soma += n;
    }
  }
  return {
    total: avaliacoes.length,
    media: avaliacoes.length > 0 ? soma / avaliacoes.length : 0,
    distribuicao: dist,
  };
}
