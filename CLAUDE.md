# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Conekta** is a marketplace platform that connects gas stations (postos) to specialized service providers (fornecedores). The system enables service discovery, procurement, and payments.

## Tech Stack

- **Framework**: Next.js 16 (App Router) with TypeScript
- **Styling**: Tailwind CSS 4
- **State Management**: React Query (@tanstack/react-query)
- **Authentication**: Supabase Auth (email/password + Google OAuth via PKCE)
- **Database**: Supabase Postgres (com RLS por papel posto/fornecedor/admin)
- **Payments**: Conekta API (processamento virá via Supabase Edge Functions)
- **Hosting**: Firebase Hosting (static export)
- **Fonts**: Outfit (display), Montserrat (body)
- **Icons**: lucide-react only (never use emojis)

## Development Commands

```bash
# Development server
npm run dev              # Runs on http://localhost:3000

# Production build
npm run build            # Creates static export for Firebase Hosting
npm start                # Serves production build locally

npm run lint             # ESLint
npm run typecheck        # tsc --noEmit
```

Production builds use static export (`output: "export"` em produção) para Firebase Hosting. Desenvolvimento (`npm run dev`) roda sem essa restrição.

## Architecture

### Route Groups

- **`(auth)/`** — Autenticação (login, cadastro, recuperar-senha). Layout compartilhado em `app/(auth)/layout.tsx`.
- **`(dashboard)/`** — Páginas autenticadas (home, marketplace interno, shop, sos, conekta-pay, solicitacoes). Protegidas por `ProtectedRoute`.
- **Rotas públicas** — Landing, marketplace público, páginas institucionais (`conheca/`, `seja-fornecedor`, `chat`), e `app/auth/callback` para OAuth PKCE.

### Authentication Flow

Supabase Auth via `createClient` (@supabase/supabase-js) com storage em `localStorage` (o projeto é SPA estática — não usa cookies SSR).

1. **Client**: `lib/supabase/client.ts` expõe um proxy lazy para o Supabase client (singleton). `detectSessionInUrl` está **desligado** porque `/auth/callback` faz o exchange manualmente.
2. **Helpers de auth**: `lib/supabase/auth.ts` expõe `signUp`, `signIn`, `signInWithGoogle`, `signOut`, `resetPassword`, `getUserProfile`, `onAuthChange`.
3. **Hook**: `lib/hooks/useAuth.ts` escuta `onAuthStateChange` e carrega o perfil de `public.users`.
4. **Provider**: `components/providers/AuthProvider.tsx` expõe `useAuthContext()`.
5. **Trigger do banco**: `auth.users` inserts disparam `public.handle_new_auth_user()` que cria o perfil em `public.users` com o `role` do `raw_user_meta_data`.
6. **Roles**: `posto`, `fornecedor`, `admin`.

### Data Layer (Supabase)

Tabelas principais em `public`:

- **Identidade**: `users`, `postos`, `posto_lojas`
- **Catálogo**: `categorias_servico`, `servicos`, `fornecedores`, `fornecedor_servicos`
- **SOS**: `sos_disparos`, `sos_propostas`
- **Pagamentos**: `conekta_pay_transacoes`, `conekta_pay_historico`
- **Shop**: `shop_produtos`, `shop_pedidos`, `shop_pedido_itens`
- **Avaliações**: `avaliacoes` (trigger recalcula `fornecedores.rating_medio`)
- **Assinaturas**: `planos_fornecedor`, `assinaturas`
- **View**: `v_categorias_com_contagem` (categoria + contagem de fornecedores para o filtro lateral)

Todas as tabelas têm **RLS habilitado** com policies baseadas em helpers:
`is_admin()`, `current_posto_ids()`, `current_fornecedor_ids()`.

### Query patterns

Todas as leituras de dados vão por `lib/data/queries.ts` usando React Query:

- `useCategorias()`
- `useFornecedores({ search, categoriaSlug, estado })`
- `useFornecedor(id)`
- `useMinhasLojas()`
- `useMinhasSolicitacoes(status?)`
- `useContagemFornecedoresDisponiveis({ cidade, categoriaSlug })`
- `useMinhasTransacoes()`
- `useCriarSosDisparo()` (mutation)

Tipos gerados em `lib/supabase/types.ts` (a partir do schema Supabase). Use `Tables<'nome_tabela'>`, `TablesInsert<>`, `Enums<>` para tipagem forte.

### Payment Integration

A integração Conekta está **parcial**: o formulário de cartão existe em `components/payment/ConektaPaymentForm.tsx` mas o submit ainda mostra um aviso de "em construção" até a Edge Function da Conekta ser publicada no Supabase.

Histórico de transações lido de `conekta_pay_transacoes` via `useMinhasTransacoes()` na página `/conekta-pay`.

## Design System

### Brand Colors (Tailwind)

```typescript
purple: {
  DEFAULT: '#623996',  // Primary brand color
  medium: '#913E97',
  light: '#BE85BB',
  glow: 'rgba(98, 57, 150, 0.15)'
}
```

Use `text-purple`, `bg-purple`, `border-purple` para elementos da marca.

### Typography

- **Display Text**: `font-display` (Outfit) — headings, hero text
- **Body Text**: `font-body` (Montserrat) — paragraphs, UI

### Component Patterns

- UI components em `components/ui/` (wavy-background, text-loop)
- Feature components organizados por domínio (auth/, marketplace/, chat/, payment/)
- Icons exclusivamente de `lucide-react` — nunca emojis

## Environment Variables

Ver `.env.example`. Obrigatórias:

```bash
# Supabase (Auth + Database)
NEXT_PUBLIC_SUPABASE_URL=https://<project-ref>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<publishable-or-anon-key>
SUPABASE_SERVICE_ROLE_KEY=<só em edge functions, nunca no client>

# Conekta
CONEKTA_PRIVATE_KEY=
NEXT_PUBLIC_CONEKTA_PUBLIC_KEY=

# Opcional — AI Chat
# ANTHROPIC_API_KEY=
# OPENAI_API_KEY=
```

## Key Files to Reference

- **Next.js Config**: `next.config.ts` — static export em produção
- **Supabase client**: `lib/supabase/client.ts` — singleton lazy com PKCE
- **Auth helpers**: `lib/supabase/auth.ts`
- **Queries**: `lib/data/queries.ts` — todas as leituras/escritas de dados
- **Types gerados**: `lib/supabase/types.ts`
- **Route Protection**: `components/auth/ProtectedRoute.tsx`
- **OAuth callback**: `app/auth/callback/page.tsx`
- **Deploy workflow**: `.github/workflows/firebase-deploy.yml`

## Next.js Version Notes

This project uses Next.js 16 which may have breaking changes from earlier versions. When working with Next.js APIs:

1. Check `node_modules/next/dist/docs/` for current documentation
2. Heed deprecation warnings in the console
3. Use App Router conventions (not Pages Router)

## Static Export Caveats

O projeto usa `output: 'export'` em produção. Isso tem implicações importantes:

- **API routes não funcionam** — toda lógica server-side tem que ir para Supabase Edge Functions
- **Rotas dinâmicas** (`[param]`) exigem `generateStaticParams` — prefira query params (`/route?id=...`) quando o id é desconhecido em build time
- **Cookies** não persistem de forma confiável em redirects cross-site — por isso usamos localStorage para a sessão Supabase
- **useSearchParams** precisa estar dentro de `<Suspense>` para não quebrar o prerender

@AGENTS.md
