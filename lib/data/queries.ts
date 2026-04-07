import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase/client';
import type { Tables } from '@/lib/supabase/types';

// ─── Tipos expostos ────────────────────────────────────────────────────────

export type Fornecedor = Tables<'fornecedores'>;

export interface CategoriaComContagem {
  id: string;
  slug: string;
  nome: string;
  descricao: string | null;
  icone: string | null;
  ordem: number;
  fornecedores_count: number;
}

export interface FornecedorListItem {
  id: string;
  nome: string;
  categoria_nome: string | null;
  categoria_slug: string | null;
  rating: number;
  total_avaliacoes: number;
  cidade: string | null;
  estado: string | null;
  imagem_url: string | null;
  verificado: boolean;
  certificacoes: string[];
  descricao: string | null;
  tempo_resposta_horas: number | null;
  preco_inicial_centavos: number | null;
}

export interface FornecedorDetalhe extends FornecedorListItem {
  razao_social: string;
  nome_fantasia: string | null;
  telefone: string | null;
  email_contato: string | null;
  endereco: string | null;
  website: string | null;
  whatsapp: string | null;
  servicos: Array<{
    id: string;
    nome: string;
    preco_base: number | null;
    categoria_nome: string | null;
  }>;
  avaliacoes: Array<{
    id: string;
    nota: number;
    comentario: string | null;
    created_at: string;
    autor_nome: string | null;
  }>;
}

// ─── Categorias ────────────────────────────────────────────────────────────

export function useCategorias() {
  return useQuery<CategoriaComContagem[]>({
    queryKey: ['categorias'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('v_categorias_com_contagem')
        .select('*')
        .eq('ativa', true)
        .order('ordem', { ascending: true });
      if (error) throw new Error(error.message);
      return (data ?? [])
        .filter(
          (c): c is NonNullable<typeof c> & { id: string; slug: string; nome: string } =>
            !!c.id && !!c.slug && !!c.nome
        )
        .map((c) => ({
          id: c.id,
          slug: c.slug,
          nome: c.nome,
          descricao: c.descricao,
          icone: c.icone,
          ordem: c.ordem ?? 0,
          fornecedores_count: c.fornecedores_count ?? 0,
        }));
    },
  });
}

// ─── Fornecedores (lista) ──────────────────────────────────────────────────

export interface UseFornecedoresFilters {
  search?: string;
  categoriaSlug?: string;
  estado?: string;
}

export function useFornecedores(filters: UseFornecedoresFilters = {}) {
  return useQuery<FornecedorListItem[]>({
    queryKey: ['fornecedores', filters],
    queryFn: async () => {
      let query = supabase
        .from('fornecedores')
        .select(
          `
          id,
          razao_social,
          nome_fantasia,
          descricao,
          cidade,
          estado,
          imagem_url,
          verificado,
          certificacoes,
          rating_medio,
          total_avaliacoes,
          tempo_resposta_horas,
          preco_inicial_centavos,
          ativo,
          fornecedor_servicos (
            servico:servicos (
              nome,
              categoria:categorias_servico (
                nome,
                slug
              )
            )
          )
        `
        )
        .eq('ativo', true);

      if (filters.search) {
        query = query.or(
          `razao_social.ilike.%${filters.search}%,nome_fantasia.ilike.%${filters.search}%,descricao.ilike.%${filters.search}%`
        );
      }
      if (filters.estado) {
        query = query.eq('estado', filters.estado);
      }

      const { data, error } = await query.order('rating_medio', { ascending: false });
      if (error) throw new Error(error.message);

      const items = (data ?? []).map((f: any): FornecedorListItem => {
        const primeiraCategoria = f.fornecedor_servicos?.[0]?.servico?.categoria;
        return {
          id: f.id,
          nome: f.nome_fantasia || f.razao_social,
          categoria_nome: primeiraCategoria?.nome ?? null,
          categoria_slug: primeiraCategoria?.slug ?? null,
          rating: Number(f.rating_medio ?? 0),
          total_avaliacoes: f.total_avaliacoes ?? 0,
          cidade: f.cidade,
          estado: f.estado,
          imagem_url: f.imagem_url,
          verificado: f.verificado ?? false,
          certificacoes: f.certificacoes ?? [],
          descricao: f.descricao,
          tempo_resposta_horas: f.tempo_resposta_horas,
          preco_inicial_centavos: f.preco_inicial_centavos,
        };
      });

      // Filtro por categoria (client-side porque vem do join)
      if (filters.categoriaSlug && filters.categoriaSlug !== 'all') {
        return items.filter((i) => i.categoria_slug === filters.categoriaSlug);
      }
      return items;
    },
  });
}

// ─── Fornecedor (detalhe) ──────────────────────────────────────────────────

export function useFornecedor(id: string | null | undefined) {
  return useQuery<FornecedorDetalhe | null>({
    queryKey: ['fornecedor', id],
    enabled: !!id,
    queryFn: async () => {
      if (!id) return null;
      const { data: f, error } = await supabase
        .from('fornecedores')
        .select(
          `
          *,
          fornecedor_servicos (
            servico:servicos (
              id,
              nome,
              categoria:categorias_servico ( nome )
            ),
            preco_base
          ),
          avaliacoes (
            id,
            nota,
            comentario,
            created_at,
            posto:postos (
              user:users ( display_name )
            )
          )
        `
        )
        .eq('id', id)
        .maybeSingle();

      if (error) throw new Error(error.message);
      if (!f) return null;

      const fAny = f as any;
      const primeiraCategoria = fAny.fornecedor_servicos?.[0]?.servico?.categoria;

      return {
        id: fAny.id,
        nome: fAny.nome_fantasia || fAny.razao_social,
        razao_social: fAny.razao_social,
        nome_fantasia: fAny.nome_fantasia,
        categoria_nome: primeiraCategoria?.nome ?? null,
        categoria_slug: primeiraCategoria?.slug ?? null,
        rating: Number(fAny.rating_medio ?? 0),
        total_avaliacoes: fAny.total_avaliacoes ?? 0,
        cidade: fAny.cidade,
        estado: fAny.estado,
        imagem_url: fAny.imagem_url,
        verificado: fAny.verificado ?? false,
        certificacoes: fAny.certificacoes ?? [],
        descricao: fAny.descricao,
        tempo_resposta_horas: fAny.tempo_resposta_horas,
        preco_inicial_centavos: fAny.preco_inicial_centavos,
        telefone: fAny.telefone,
        email_contato: fAny.email_contato,
        endereco: fAny.endereco,
        website: fAny.website,
        whatsapp: fAny.whatsapp,
        servicos: (fAny.fornecedor_servicos ?? [])
          .filter((fs: any) => fs.servico)
          .map((fs: any) => ({
            id: fs.servico.id,
            nome: fs.servico.nome,
            preco_base: fs.preco_base,
            categoria_nome: fs.servico.categoria?.nome ?? null,
          })),
        avaliacoes: (fAny.avaliacoes ?? []).map((av: any) => ({
          id: av.id,
          nota: av.nota,
          comentario: av.comentario,
          created_at: av.created_at,
          autor_nome: av.posto?.user?.display_name ?? null,
        })),
      };
    },
  });
}
