This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

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
