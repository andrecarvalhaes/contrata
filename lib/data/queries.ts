import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase/client';
import type { Enums, Tables } from '@/lib/supabase/types';

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
        id: fAny.id as string,
        nome: (fAny.nome_fantasia || fAny.razao_social) as string,
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

// ─── Lojas do posto do usuário atual ───────────────────────────────────────

export interface MinhaLoja {
  id: string;
  nome: string;
  posto_id: string;
  posto_nome: string;
  cidade: string | null;
  estado: string | null;
}

export function useMinhasLojas() {
  return useQuery<MinhaLoja[]>({
    queryKey: ['minhas-lojas'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('posto_lojas')
        .select(
          `
          id,
          nome,
          posto_id,
          cidade,
          estado,
          ativa,
          posto:postos ( razao_social, nome_fantasia )
        `
        )
        .eq('ativa', true)
        .order('nome');
      if (error) throw new Error(error.message);
      return (data ?? []).map((l: any) => ({
        id: l.id,
        nome: l.nome,
        posto_id: l.posto_id,
        posto_nome: l.posto?.nome_fantasia || l.posto?.razao_social || 'Posto',
        cidade: l.cidade,
        estado: l.estado,
      }));
    },
  });
}

// ─── SOS: minhas solicitações ──────────────────────────────────────────────

export type SosStatus = Enums<'sos_status'>;

export interface MinhaSolicitacao {
  id: string;
  titulo: string;
  descricao: string | null;
  status: SosStatus;
  urgencia: number;
  created_at: string;
  loja_nome: string | null;
  cidade: string | null;
  estado: string | null;
  categoria_nome: string | null;
  propostas_count: number;
}

export function useMinhasSolicitacoes(status?: SosStatus | 'todas') {
  return useQuery<MinhaSolicitacao[]>({
    queryKey: ['minhas-solicitacoes', status ?? 'todas'],
    queryFn: async () => {
      let query = supabase
        .from('sos_disparos')
        .select(
          `
          id,
          titulo,
          descricao,
          status,
          urgencia,
          created_at,
          loja:posto_lojas ( nome, cidade, estado ),
          servico:servicos (
            categoria:categorias_servico ( nome )
          ),
          sos_propostas ( id )
        `
        )
        .order('created_at', { ascending: false });

      if (status && status !== 'todas') {
        query = query.eq('status', status);
      }

      const { data, error } = await query;
      if (error) throw new Error(error.message);

      return (data ?? []).map((s: any): MinhaSolicitacao => ({
        id: s.id,
        titulo: s.titulo,
        descricao: s.descricao,
        status: s.status,
        urgencia: s.urgencia ?? 1,
        created_at: s.created_at,
        loja_nome: s.loja?.nome ?? null,
        cidade: s.loja?.cidade ?? null,
        estado: s.loja?.estado ?? null,
        categoria_nome: s.servico?.categoria?.nome ?? null,
        propostas_count: s.sos_propostas?.length ?? 0,
      }));
    },
  });
}

// ─── SOS: contagem de fornecedores para disparo ────────────────────────────

export function useContagemFornecedoresDisponiveis(params: {
  cidade?: string | null;
  categoriaSlug?: string | null;
  enabled?: boolean;
}) {
  return useQuery<{ total: number; amostra: FornecedorListItem[] }>({
    queryKey: ['sos-fornecedores-disponiveis', params.cidade, params.categoriaSlug],
    enabled: params.enabled !== false && !!params.cidade,
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
          fornecedor_servicos (
            servico:servicos (
              categoria:categorias_servico ( slug, nome )
            )
          )
        `
        )
        .eq('ativo', true);

      if (params.cidade) {
        query = query.eq('cidade', params.cidade);
      }

      const { data, error } = await query;
      if (error) throw new Error(error.message);

      let items = (data ?? []).map((f: any): FornecedorListItem => {
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

      if (params.categoriaSlug) {
        items = items.filter((i) => i.categoria_slug === params.categoriaSlug);
      }

      return {
        total: items.length,
        amostra: items.slice(0, 3),
      };
    },
  });
}

// ─── Conekta Pay: minhas transações ────────────────────────────────────────

export type PayStatus = Enums<'pay_status'>;
export type PayMetodo = Enums<'pay_metodo'>;

export interface MinhaTransacao {
  id: string;
  valor_centavos: number;
  moeda: string;
  metodo: PayMetodo;
  status: PayStatus;
  conekta_lock: boolean;
  liberado_em: string | null;
  created_at: string;
  referencia: string | null;
  contraparte: string | null;
}

export function useMinhasTransacoes() {
  return useQuery<MinhaTransacao[]>({
    queryKey: ['minhas-transacoes'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('conekta_pay_transacoes')
        .select(
          `
          id,
          valor_centavos,
          moeda,
          metodo,
          status,
          conekta_lock,
          liberado_em,
          created_at,
          sos:sos_disparos ( titulo ),
          posto:postos ( razao_social, nome_fantasia ),
          fornecedor:fornecedores ( razao_social, nome_fantasia )
        `
        )
        .order('created_at', { ascending: false });
      if (error) throw new Error(error.message);
      return (data ?? []).map((t: any): MinhaTransacao => ({
        id: t.id,
        valor_centavos: t.valor_centavos,
        moeda: t.moeda,
        metodo: t.metodo,
        status: t.status,
        conekta_lock: t.conekta_lock,
        liberado_em: t.liberado_em,
        created_at: t.created_at,
        referencia: t.sos?.titulo ?? null,
        contraparte:
          t.fornecedor?.nome_fantasia ||
          t.fornecedor?.razao_social ||
          t.posto?.nome_fantasia ||
          t.posto?.razao_social ||
          null,
      }));
    },
  });
}

// ─── SOS: criar disparo ────────────────────────────────────────────────────

export interface CriarSosInput {
  titulo: string;
  descricao: string;
  posto_loja_id: string;
  categoria_slug: string;
  urgencia?: number;
}

export function useCriarSosDisparo() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: CriarSosInput) => {
      // Descobre posto_id a partir da loja
      const { data: loja, error: lojaErr } = await supabase
        .from('posto_lojas')
        .select('posto_id')
        .eq('id', input.posto_loja_id)
        .maybeSingle();
      if (lojaErr) throw new Error(lojaErr.message);
      if (!loja) throw new Error('Loja não encontrada.');

      // Descobre um servico_id da categoria escolhida (qualquer um serve só para ligar categoria)
      const { data: cat } = await supabase
        .from('categorias_servico')
        .select('id')
        .eq('slug', input.categoria_slug)
        .maybeSingle();

      let servico_id: string | null = null;
      if (cat?.id) {
        const { data: svc } = await supabase
          .from('servicos')
          .select('id')
          .eq('categoria_id', cat.id)
          .limit(1)
          .maybeSingle();
        servico_id = svc?.id ?? null;
      }

      const { data, error } = await supabase
        .from('sos_disparos')
        .insert({
          posto_id: loja.posto_id,
          posto_loja_id: input.posto_loja_id,
          servico_id,
          titulo: input.titulo,
          descricao: input.descricao,
          urgencia: input.urgencia ?? 1,
          status: 'aberto',
        })
        .select('id')
        .single();
      if (error) throw new Error(error.message);
      return data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['minhas-solicitacoes'] });
    },
  });
}
