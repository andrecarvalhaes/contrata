export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      assinaturas: {
        Row: {
          cancelada_em: string | null
          conekta_subscription_id: string | null
          created_at: string
          fornecedor_id: string
          id: string
          inicio_em: string
          plano_id: string
          proximo_ciclo_em: string | null
          status: Database["public"]["Enums"]["assinatura_status"]
          updated_at: string
        }
        Insert: {
          cancelada_em?: string | null
          conekta_subscription_id?: string | null
          created_at?: string
          fornecedor_id: string
          id?: string
          inicio_em?: string
          plano_id: string
          proximo_ciclo_em?: string | null
          status?: Database["public"]["Enums"]["assinatura_status"]
          updated_at?: string
        }
        Update: {
          cancelada_em?: string | null
          conekta_subscription_id?: string | null
          created_at?: string
          fornecedor_id?: string
          id?: string
          inicio_em?: string
          plano_id?: string
          proximo_ciclo_em?: string | null
          status?: Database["public"]["Enums"]["assinatura_status"]
          updated_at?: string
        }
        Relationships: []
      }
      avaliacoes: {
        Row: {
          comentario: string | null
          created_at: string
          fornecedor_id: string
          id: string
          nota: number
          posto_id: string
          shop_pedido_id: string | null
          sos_id: string | null
        }
        Insert: {
          comentario?: string | null
          created_at?: string
          fornecedor_id: string
          id?: string
          nota: number
          posto_id: string
          shop_pedido_id?: string | null
          sos_id?: string | null
        }
        Update: {
          comentario?: string | null
          created_at?: string
          fornecedor_id?: string
          id?: string
          nota?: number
          posto_id?: string
          shop_pedido_id?: string | null
          sos_id?: string | null
        }
        Relationships: []
      }
      categorias_servico: {
        Row: {
          ativa: boolean
          created_at: string
          descricao: string | null
          icone: string | null
          id: string
          nome: string
          ordem: number
          slug: string
        }
        Insert: {
          ativa?: boolean
          created_at?: string
          descricao?: string | null
          icone?: string | null
          id?: string
          nome: string
          ordem?: number
          slug: string
        }
        Update: {
          ativa?: boolean
          created_at?: string
          descricao?: string | null
          icone?: string | null
          id?: string
          nome?: string
          ordem?: number
          slug?: string
        }
        Relationships: []
      }
      conekta_pay_historico: {
        Row: {
          created_at: string
          evento: string
          id: string
          payload: Json | null
          status_anterior: Database["public"]["Enums"]["pay_status"] | null
          status_novo: Database["public"]["Enums"]["pay_status"]
          transacao_id: string
        }
        Insert: {
          created_at?: string
          evento: string
          id?: string
          payload?: Json | null
          status_anterior?: Database["public"]["Enums"]["pay_status"] | null
          status_novo: Database["public"]["Enums"]["pay_status"]
          transacao_id: string
        }
        Update: {
          created_at?: string
          evento?: string
          id?: string
          payload?: Json | null
          status_anterior?: Database["public"]["Enums"]["pay_status"] | null
          status_novo?: Database["public"]["Enums"]["pay_status"]
          transacao_id?: string
        }
        Relationships: []
      }
      conekta_pay_transacoes: {
        Row: {
          conekta_charge_id: string | null
          conekta_lock: boolean
          conekta_order_id: string | null
          created_at: string
          fornecedor_id: string | null
          id: string
          liberado_em: string | null
          metodo: Database["public"]["Enums"]["pay_metodo"]
          moeda: string
          posto_id: string | null
          shop_pedido_id: string | null
          sos_id: string | null
          status: Database["public"]["Enums"]["pay_status"]
          updated_at: string
          valor_centavos: number
        }
        Insert: {
          conekta_charge_id?: string | null
          conekta_lock?: boolean
          conekta_order_id?: string | null
          created_at?: string
          fornecedor_id?: string | null
          id?: string
          liberado_em?: string | null
          metodo: Database["public"]["Enums"]["pay_metodo"]
          moeda?: string
          posto_id?: string | null
          shop_pedido_id?: string | null
          sos_id?: string | null
          status?: Database["public"]["Enums"]["pay_status"]
          updated_at?: string
          valor_centavos: number
        }
        Update: {
          conekta_charge_id?: string | null
          conekta_lock?: boolean
          conekta_order_id?: string | null
          created_at?: string
          fornecedor_id?: string | null
          id?: string
          liberado_em?: string | null
          metodo?: Database["public"]["Enums"]["pay_metodo"]
          moeda?: string
          posto_id?: string | null
          shop_pedido_id?: string | null
          sos_id?: string | null
          status?: Database["public"]["Enums"]["pay_status"]
          updated_at?: string
          valor_centavos?: number
        }
        Relationships: []
      }
      fornecedor_servicos: {
        Row: {
          ativo: boolean
          created_at: string
          fornecedor_id: string
          id: string
          observacoes: string | null
          preco_base: number | null
          servico_id: string
        }
        Insert: {
          ativo?: boolean
          created_at?: string
          fornecedor_id: string
          id?: string
          observacoes?: string | null
          preco_base?: number | null
          servico_id: string
        }
        Update: {
          ativo?: boolean
          created_at?: string
          fornecedor_id?: string
          id?: string
          observacoes?: string | null
          preco_base?: number | null
          servico_id?: string
        }
        Relationships: []
      }
      fornecedores: {
        Row: {
          ativo: boolean
          cep: string | null
          cidade: string | null
          cnpj: string | null
          created_at: string
          descricao: string | null
          email_contato: string | null
          endereco: string | null
          estado: string | null
          id: string
          latitude: number | null
          longitude: number | null
          nome_fantasia: string | null
          raio_atendimento_km: number | null
          rating_medio: number
          razao_social: string
          telefone: string | null
          total_avaliacoes: number
          updated_at: string
          user_id: string
          verificado: boolean
          website: string | null
          whatsapp: string | null
        }
        Insert: {
          ativo?: boolean
          cep?: string | null
          cidade?: string | null
          cnpj?: string | null
          created_at?: string
          descricao?: string | null
          email_contato?: string | null
          endereco?: string | null
          estado?: string | null
          id?: string
          latitude?: number | null
          longitude?: number | null
          nome_fantasia?: string | null
          raio_atendimento_km?: number | null
          rating_medio?: number
          razao_social: string
          telefone?: string | null
          total_avaliacoes?: number
          updated_at?: string
          user_id: string
          verificado?: boolean
          website?: string | null
          whatsapp?: string | null
        }
        Update: {
          ativo?: boolean
          cep?: string | null
          cidade?: string | null
          cnpj?: string | null
          created_at?: string
          descricao?: string | null
          email_contato?: string | null
          endereco?: string | null
          estado?: string | null
          id?: string
          latitude?: number | null
          longitude?: number | null
          nome_fantasia?: string | null
          raio_atendimento_km?: number | null
          rating_medio?: number
          razao_social?: string
          telefone?: string | null
          total_avaliacoes?: number
          updated_at?: string
          user_id?: string
          verificado?: boolean
          website?: string | null
          whatsapp?: string | null
        }
        Relationships: []
      }
      planos_fornecedor: {
        Row: {
          ativo: boolean
          created_at: string
          descricao: string | null
          id: string
          nome: string
          ordem: number
          preco_anual_centavos: number | null
          preco_mensal_centavos: number
          recursos: Json | null
          slug: string
        }
        Insert: {
          ativo?: boolean
          created_at?: string
          descricao?: string | null
          id?: string
          nome: string
          ordem?: number
          preco_anual_centavos?: number | null
          preco_mensal_centavos: number
          recursos?: Json | null
          slug: string
        }
        Update: {
          ativo?: boolean
          created_at?: string
          descricao?: string | null
          id?: string
          nome?: string
          ordem?: number
          preco_anual_centavos?: number | null
          preco_mensal_centavos?: number
          recursos?: Json | null
          slug?: string
        }
        Relationships: []
      }
      posto_lojas: {
        Row: {
          ativa: boolean
          cep: string | null
          cidade: string | null
          created_at: string
          endereco: string
          estado: string | null
          id: string
          latitude: number | null
          longitude: number | null
          nome: string
          posto_id: string
          updated_at: string
        }
        Insert: {
          ativa?: boolean
          cep?: string | null
          cidade?: string | null
          created_at?: string
          endereco: string
          estado?: string | null
          id?: string
          latitude?: number | null
          longitude?: number | null
          nome: string
          posto_id: string
          updated_at?: string
        }
        Update: {
          ativa?: boolean
          cep?: string | null
          cidade?: string | null
          created_at?: string
          endereco?: string
          estado?: string | null
          id?: string
          latitude?: number | null
          longitude?: number | null
          nome?: string
          posto_id?: string
          updated_at?: string
        }
        Relationships: []
      }
      postos: {
        Row: {
          bandeira: string | null
          cep: string | null
          cidade: string | null
          cnpj: string | null
          created_at: string
          endereco: string | null
          estado: string | null
          id: string
          latitude: number | null
          longitude: number | null
          nome_fantasia: string | null
          razao_social: string
          telefone: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          bandeira?: string | null
          cep?: string | null
          cidade?: string | null
          cnpj?: string | null
          created_at?: string
          endereco?: string | null
          estado?: string | null
          id?: string
          latitude?: number | null
          longitude?: number | null
          nome_fantasia?: string | null
          razao_social: string
          telefone?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          bandeira?: string | null
          cep?: string | null
          cidade?: string | null
          cnpj?: string | null
          created_at?: string
          endereco?: string | null
          estado?: string | null
          id?: string
          latitude?: number | null
          longitude?: number | null
          nome_fantasia?: string | null
          razao_social?: string
          telefone?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      servicos: {
        Row: {
          ativo: boolean
          categoria_id: string
          created_at: string
          descricao: string | null
          id: string
          nome: string
          slug: string
        }
        Insert: {
          ativo?: boolean
          categoria_id: string
          created_at?: string
          descricao?: string | null
          id?: string
          nome: string
          slug: string
        }
        Update: {
          ativo?: boolean
          categoria_id?: string
          created_at?: string
          descricao?: string | null
          id?: string
          nome?: string
          slug?: string
        }
        Relationships: []
      }
      shop_pedido_itens: {
        Row: {
          id: string
          pedido_id: string
          preco_unitario_centavos: number
          produto_id: string
          quantidade: number
          subtotal_centavos: number
        }
        Insert: {
          id?: string
          pedido_id: string
          preco_unitario_centavos: number
          produto_id: string
          quantidade: number
          subtotal_centavos: number
        }
        Update: {
          id?: string
          pedido_id?: string
          preco_unitario_centavos?: number
          produto_id?: string
          quantidade?: number
          subtotal_centavos?: number
        }
        Relationships: []
      }
      shop_pedidos: {
        Row: {
          created_at: string
          endereco_entrega: string | null
          fornecedor_id: string
          id: string
          observacoes: string | null
          posto_id: string
          status: Database["public"]["Enums"]["pedido_status"]
          total_centavos: number
          transacao_id: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          endereco_entrega?: string | null
          fornecedor_id: string
          id?: string
          observacoes?: string | null
          posto_id: string
          status?: Database["public"]["Enums"]["pedido_status"]
          total_centavos?: number
          transacao_id?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          endereco_entrega?: string | null
          fornecedor_id?: string
          id?: string
          observacoes?: string | null
          posto_id?: string
          status?: Database["public"]["Enums"]["pedido_status"]
          total_centavos?: number
          transacao_id?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      shop_produtos: {
        Row: {
          ativo: boolean
          created_at: string
          descricao: string | null
          estoque: number
          fornecedor_id: string
          id: string
          imagem_url: string | null
          nome: string
          preco_centavos: number
          updated_at: string
        }
        Insert: {
          ativo?: boolean
          created_at?: string
          descricao?: string | null
          estoque?: number
          fornecedor_id: string
          id?: string
          imagem_url?: string | null
          nome: string
          preco_centavos: number
          updated_at?: string
        }
        Update: {
          ativo?: boolean
          created_at?: string
          descricao?: string | null
          estoque?: number
          fornecedor_id?: string
          id?: string
          imagem_url?: string | null
          nome?: string
          preco_centavos?: number
          updated_at?: string
        }
        Relationships: []
      }
      sos_disparos: {
        Row: {
          created_at: string
          descricao: string | null
          fornecedor_aceito_id: string | null
          id: string
          latitude: number | null
          longitude: number | null
          posto_id: string
          posto_loja_id: string | null
          servico_id: string | null
          status: Database["public"]["Enums"]["sos_status"]
          titulo: string
          updated_at: string
          urgencia: number
        }
        Insert: {
          created_at?: string
          descricao?: string | null
          fornecedor_aceito_id?: string | null
          id?: string
          latitude?: number | null
          longitude?: number | null
          posto_id: string
          posto_loja_id?: string | null
          servico_id?: string | null
          status?: Database["public"]["Enums"]["sos_status"]
          titulo: string
          updated_at?: string
          urgencia?: number
        }
        Update: {
          created_at?: string
          descricao?: string | null
          fornecedor_aceito_id?: string | null
          id?: string
          latitude?: number | null
          longitude?: number | null
          posto_id?: string
          posto_loja_id?: string | null
          servico_id?: string | null
          status?: Database["public"]["Enums"]["sos_status"]
          titulo?: string
          updated_at?: string
          urgencia?: number
        }
        Relationships: []
      }
      sos_propostas: {
        Row: {
          created_at: string
          fornecedor_id: string
          id: string
          mensagem: string | null
          prazo_minutos: number | null
          preco: number
          sos_id: string
          status: Database["public"]["Enums"]["sos_proposta_status"]
          updated_at: string
        }
        Insert: {
          created_at?: string
          fornecedor_id: string
          id?: string
          mensagem?: string | null
          prazo_minutos?: number | null
          preco: number
          sos_id: string
          status?: Database["public"]["Enums"]["sos_proposta_status"]
          updated_at?: string
        }
        Update: {
          created_at?: string
          fornecedor_id?: string
          id?: string
          mensagem?: string | null
          prazo_minutos?: number | null
          preco?: number
          sos_id?: string
          status?: Database["public"]["Enums"]["sos_proposta_status"]
          updated_at?: string
        }
        Relationships: []
      }
      users: {
        Row: {
          avatar_url: string | null
          conekta_customer_id: string | null
          created_at: string
          display_name: string
          email: string
          id: string
          phone: string | null
          role: Database["public"]["Enums"]["user_role"]
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          conekta_customer_id?: string | null
          created_at?: string
          display_name: string
          email: string
          id: string
          phone?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          conekta_customer_id?: string | null
          created_at?: string
          display_name?: string
          email?: string
          id?: string
          phone?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: { [_ in never]: never }
    Functions: {
      current_fornecedor_ids: { Args: never; Returns: string[] }
      current_posto_ids: { Args: never; Returns: string[] }
      current_role_is: {
        Args: { target: Database["public"]["Enums"]["user_role"] }
        Returns: boolean
      }
      is_admin: { Args: never; Returns: boolean }
    }
    Enums: {
      assinatura_status: "ativa" | "cancelada" | "inadimplente" | "expirada"
      pay_metodo: "cartao" | "pix" | "boleto"
      pay_status:
        | "pendente"
        | "autorizada"
        | "capturada"
        | "em_garantia"
        | "liberada"
        | "reembolsada"
        | "falhou"
        | "cancelada"
      pedido_status:
        | "carrinho"
        | "aguardando_pagamento"
        | "pago"
        | "separando"
        | "enviado"
        | "entregue"
        | "cancelado"
      sos_proposta_status: "pendente" | "aceita" | "recusada" | "expirada"
      sos_status: "aberto" | "em_andamento" | "concluido" | "cancelado"
      user_role: "posto" | "fornecedor" | "admin"
    }
    CompositeTypes: { [_ in never]: never }
  }
}

export type Tables<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Row"]
export type TablesInsert<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Insert"]
export type TablesUpdate<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Update"]
export type Enums<T extends keyof Database["public"]["Enums"]> =
  Database["public"]["Enums"][T]
