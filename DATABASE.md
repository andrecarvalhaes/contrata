# Database — Supabase (Postgres)

Este documento descreve o schema do banco Conekta no Supabase. Ele é a referência viva da estrutura — os tipos TypeScript em `lib/supabase/types.ts` são gerados a partir daqui.

- **Projeto Supabase**: `conekta` (ref `oqvljwhiiwxmoeyikwyq`)
- **URL**: https://oqvljwhiiwxmoeyikwyq.supabase.co
- **Postgres**: 17

## Migrations aplicadas

| # | Nome | Descrição |
|---|---|---|
| 001 | `create_users_and_postos` | users, postos, posto_lojas + trigger updated_at |
| 002 | `create_fornecedores_and_servicos` | categorias_servico, servicos, fornecedores, fornecedor_servicos |
| 003 | `create_sos_and_pay` | sos_disparos, sos_propostas, conekta_pay_transacoes, conekta_pay_historico |
| 004 | `create_shop_avaliacoes_planos` | shop_*, avaliacoes (com trigger de rating), planos_fornecedor, assinaturas |
| 005 | `enable_rls_and_policies` | RLS em todas as tabelas + helpers de autorização |
| 006 | `user_signup_trigger` | `handle_new_auth_user()` cria perfil em `public.users` ao cadastro |
| 007 | `seed_categorias_servicos_planos` | seed inicial (substituído pelo 009) |
| 008 | `fix_function_search_path` | correção de advisor: `SET search_path = public` nas funções |
| 009 | `reseed_categorias_and_fornecedor_columns` | reseed com 16 categorias reais + colunas imagem_url/certificacoes/tempo_resposta_horas/preco_inicial_centavos em fornecedores + view `v_categorias_com_contagem` |
| 010 | `performance_and_security_fixes` | view como SECURITY INVOKER, índices de FK faltando, policies com `(select auth.uid())` para evitar re-avaliação por linha, consolidação de policies `FOR ALL` em INSERT/UPDATE/DELETE específicos |
| 011 | `storage_and_realtime` | buckets de storage (avatares, fornecedor-docs, shop-produtos) com policies; publica sos_disparos, sos_propostas e conekta_pay_transacoes no `supabase_realtime` |

Para aplicar novas migrations, use o MCP do Supabase (`apply_migration`) ou o CLI.

## Tabelas

### `users`
Perfis de usuário vinculados 1:1 com `auth.users`. Criado automaticamente pelo trigger `handle_new_auth_user` no signup.

| Coluna | Tipo | Observação |
|---|---|---|
| id | uuid (PK, FK → auth.users) | |
| email | text unique | |
| display_name | text | |
| role | `user_role` enum | posto, fornecedor, admin |
| conekta_customer_id | text | id do customer na Conekta |
| avatar_url | text | |
| phone | text | |
| created_at / updated_at | timestamptz | |

### `postos` / `posto_lojas`
Perfil empresarial do posto e suas lojas/filiais. Um usuário `posto` pode ter vários postos, cada posto pode ter várias lojas.

### `categorias_servico` / `servicos` / `fornecedores` / `fornecedor_servicos`
Catálogo do marketplace. `fornecedor_servicos` liga fornecedor a serviços com `preco_base` opcional.

View útil: **`v_categorias_com_contagem`** — categorias com contagem de fornecedores distintos, usada no filtro lateral do marketplace.

### `sos_disparos` / `sos_propostas`
SOS Conekta: o posto abre um chamado emergencial, fornecedores enviam propostas, posto aceita uma.

- `sos_disparos.status`: `aberto` | `em_andamento` | `concluido` | `cancelado`
- `sos_propostas.status`: `pendente` | `aceita` | `recusada` | `expirada`

### `conekta_pay_transacoes` / `conekta_pay_historico`
Conekta Pay e Conekta Lock (retenção). Toda mudança de status é registrada no histórico.

- `status`: `pendente` | `autorizada` | `capturada` | `em_garantia` | `liberada` | `reembolsada` | `falhou` | `cancelada`
- `metodo`: `cartao` | `pix` | `boleto`
- `conekta_lock` (bool): se true, o valor fica em custódia até liberação manual/automática

### `shop_produtos` / `shop_pedidos` / `shop_pedido_itens`
Shop Conekta (marketplace de produtos dos fornecedores).

### `avaliacoes`
Ratings 1–5. Trigger `recalc_fornecedor_rating` mantém `fornecedores.rating_medio` e `total_avaliacoes` sincronizados.

### `planos_fornecedor` / `assinaturas`
Planos de assinatura para fornecedores (Free, Starter, Pro, Enterprise).

## Row Level Security

Todas as tabelas têm RLS habilitado. Helpers de autorização (SECURITY DEFINER, `search_path = public`):

- `is_admin()` — true se o user atual é admin
- `current_posto_ids()` — ids dos postos do usuário atual
- `current_fornecedor_ids()` — ids dos fornecedores do usuário atual
- `current_role_is(role)` — checa role específico

### Padrões de policy

| Tabela | Leitura | Escrita |
|---|---|---|
| `users` | próprio ou admin | próprio |
| `postos`, `posto_lojas` | dono ou admin | dono |
| `fornecedores` | **público** (marketplace) | dono (via `user_id`) |
| `categorias_servico`, `servicos`, `planos_fornecedor` | **público** | (só admin via service role) |
| `fornecedor_servicos` | **público** | dono do fornecedor |
| `sos_disparos` | dono do posto + todos os abertos + fornecedor aceito | dono do posto |
| `sos_propostas` | fornecedor que criou + dono do SOS | fornecedor que criou |
| `conekta_pay_*` | posto/fornecedor envolvido | **apenas edge functions** (service role) |
| `shop_produtos` | **público** | dono do fornecedor |
| `shop_pedidos` | posto e fornecedor envolvidos | posto cria; ambos atualizam |
| `avaliacoes` | **público** | posto envolvido |
| `assinaturas` | fornecedor dono | fornecedor dono |

## Índices

Índices principais criados (além dos índices únicos automáticos de PK/FK):

- `users_role_idx`
- `postos_user_id_idx`, `postos_cidade_estado_idx`
- `posto_lojas_posto_id_idx`
- `fornecedores_user_id_idx`, `fornecedores_cidade_estado_idx`
- `servicos_categoria_idx`
- `fornecedor_servicos_servico_idx`
- `sos_disparos_status_idx`, `sos_disparos_posto_idx`
- `sos_propostas_sos_idx`, `sos_propostas_fornecedor_idx`
- `conekta_pay_status_idx`, `conekta_pay_posto_idx`, `conekta_pay_fornecedor_idx`
- `conekta_pay_historico_transacao_idx`
- `shop_*` por fornecedor/posto/status
- `avaliacoes_fornecedor_idx`, `avaliacoes_posto_idx`
- `assinaturas_fornecedor_idx`, `assinaturas_status_idx`

## Enums

| Enum | Valores |
|---|---|
| `user_role` | posto, fornecedor, admin |
| `sos_status` | aberto, em_andamento, concluido, cancelado |
| `sos_proposta_status` | pendente, aceita, recusada, expirada |
| `pay_status` | pendente, autorizada, capturada, em_garantia, liberada, reembolsada, falhou, cancelada |
| `pay_metodo` | cartao, pix, boleto |
| `pedido_status` | carrinho, aguardando_pagamento, pago, separando, enviado, entregue, cancelado |
| `assinatura_status` | ativa, cancelada, inadimplente, expirada |

## Funções / Triggers

- `set_updated_at()` — trigger BEFORE UPDATE em users, postos, posto_lojas, fornecedores, sos_*, conekta_pay_transacoes, shop_*, assinaturas
- `handle_new_auth_user()` — trigger AFTER INSERT em `auth.users`, cria perfil em `public.users`
- `recalc_fornecedor_rating()` — trigger AFTER INSERT/UPDATE/DELETE em `avaliacoes`, mantém `rating_medio` sincronizado
- `is_admin()`, `current_role_is()`, `current_posto_ids()`, `current_fornecedor_ids()` — helpers de RLS

## Seed inicial

- **16 categorias** de serviço (inspeções, tanques, bombas, elétrica, etc.)
- **40 serviços** base distribuídos entre as categorias
- **4 planos** de fornecedor: Free, Starter, Pro, Enterprise

## Regerar types do TS

Após aplicar migrations que mudem o schema:

```bash
# Via MCP (dentro do Claude Code)
mcp__claude_ai_Supabase__generate_typescript_types project_id=oqvljwhiiwxmoeyikwyq
```

Atualize `lib/supabase/types.ts` manualmente se houver mudança. Os hooks em `lib/data/queries.ts` vão falhar no typecheck se os tipos estiverem desatualizados — é o sinal para regerar.

## Storage

Buckets configurados (migration 011):

| Bucket | Público | Finalidade | Convenção de path |
|---|---|---|---|
| `avatares` | sim (leitura) | Avatares de usuário | `<user_id>/arquivo.ext` |
| `fornecedor-docs` | não | Documentos do fornecedor (alvará, CNPJ, etc.) | `<fornecedor_id>/arquivo.ext` |
| `shop-produtos` | sim (leitura) | Imagens dos produtos do shop | `<fornecedor_id>/<produto_id>/foto.ext` |

Policies:
- **avatares**: leitura pública; insert/update/delete apenas para o próprio user (path `<auth.uid()>/*`)
- **fornecedor-docs**: leitura/escrita apenas para quem é dono do fornecedor (path `<fornecedor_id>/*`)
- **shop-produtos**: leitura pública; escrita apenas para quem é dono do fornecedor

## Realtime

Tabelas publicadas em `supabase_realtime` (migration 011):

- `sos_disparos` — mudanças de status do SOS ao vivo
- `sos_propostas` — propostas chegando em tempo real para o posto
- `conekta_pay_transacoes` — status de pagamento ao vivo

Use `supabase.channel(...).on('postgres_changes', ...)` no cliente para assinar eventos.

## Edge Functions

3 funções deployadas (skeletons — precisam integração real com a API da Conekta e provider de notificação):

| Nome | JWT | Finalidade |
|---|---|---|
| `conekta-webhook` | **não** (webhook externo) | Recebe eventos da Conekta (`charge.paid`, `charge.declined`, etc.), atualiza `conekta_pay_transacoes` e registra em `conekta_pay_historico` |
| `sos-dispatch` | sim | Dado um `sos_id`, busca fornecedores ativos na cidade/categoria e notifica (hoje só loga — TODO integrar email/WhatsApp) |
| `conekta-lock` | sim | Gerencia custódia do Conekta Lock: `hold` → `em_garantia`, `release` → `liberada`, `refund` → `reembolsada`. Atualiza status e grava histórico |

URLs: `https://oqvljwhiiwxmoeyikwyq.supabase.co/functions/v1/<nome>`

## Backups

- Backups diários automáticos do Supabase (ativados por padrão em todos os tiers)
- No tier gratuito: retenção de 7 dias
- Para restore: painel Supabase → **Database → Backups → Restore**
- Para backup manual ad-hoc: `pg_dump` via connection string (ver **Settings → Database**)

## Advisors / Monitoramento

Rode `mcp__claude_ai_Supabase__get_advisors` periodicamente (ou via painel **Database → Advisors**) para detectar regressões de performance/segurança. Issues não resolvidos atualmente:

- **`auth_leaked_password_protection`** (WARN): liga em **Auth → Policies → Password Protection** no painel Supabase para checar senhas contra HaveIBeenPwned
- **`unused_index`** (INFO): vários índices criados mas ainda sem uso — normal enquanto o app não tem tráfego real, ignorar
