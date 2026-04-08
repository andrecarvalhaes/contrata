# Conekta

Marketplace que conecta postos de combustível a fornecedores especializados. Next.js 16 (App Router) + Supabase + Tailwind, hospedado em Firebase Hosting.

## Stack

- **Next.js 16** (App Router, TypeScript, Turbopack)
- **Tailwind CSS 4**
- **Supabase** — Auth (email + Google OAuth) e Postgres com RLS
- **React Query** para toda a camada de dados
- **Conekta** para pagamentos (integração via Edge Functions, em progresso)
- **Firebase Hosting** como alvo de deploy (`output: "export"`)

Ver [CLAUDE.md](./CLAUDE.md) para arquitetura detalhada e [DATABASE.md](./DATABASE.md) para o schema do banco.

## Começando

```bash
npm install
cp .env.example .env.local   # preencher as variáveis Supabase e Conekta
npm run dev                  # http://localhost:3000
```

### Scripts

| Comando | O que faz |
|---|---|
| `npm run dev` | Dev server (sem static export) |
| `npm run build` | Build estático para Firebase Hosting |
| `npm run lint` | ESLint |
| `npm run typecheck` | `tsc --noEmit` |

## Variáveis de ambiente

Veja `.env.example`. Obrigatórias em dev e CI:

```
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
CONEKTA_PRIVATE_KEY
NEXT_PUBLIC_CONEKTA_PUBLIC_KEY
```

Em produção, essas variáveis ficam em **GitHub Actions secrets** com o mesmo nome.

## Deploy

Deploy automático para Firebase Hosting (projeto `useconekta`) via GitHub Actions a cada push na `main`. Veja [.github/workflows/firebase-deploy.yml](.github/workflows/firebase-deploy.yml).

Pipeline: `quality` (lint + typecheck) → `deploy` (build + firebase deploy).

### Rollback rápido

Se um deploy quebrar produção, volte para a versão anterior em segundos:

**Opção 1 — via CLI (recomendado):**

```bash
firebase hosting:rollback --project useconekta
```

**Opção 2 — via console:**

1. Abra https://console.firebase.google.com/project/useconekta/hosting/sites
2. Clique na aba **Histórico de lançamentos**
3. Encontre a versão anterior e clique em **Reverter**

O Firebase mantém todas as versões anteriores automaticamente, então você pode voltar sem precisar buildar nada.

Depois do rollback, corrija o bug em uma branch separada, abra um PR e deixe o CI validar antes de re-deployar.
