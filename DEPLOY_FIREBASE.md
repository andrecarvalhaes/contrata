# Como Publicar no Firebase

## Passo 1: Criar Projeto no Firebase Console

1. Acesse [Firebase Console](https://console.firebase.google.com/)
2. Clique em "Adicionar projeto" ou "Create a project"
3. Nome sugerido: `contrata-marketplace`
4. Siga os passos até criar o projeto

## Passo 2: Configurar Authentication

1. No menu lateral, clique em "Authentication"
2. Clique em "Começar" ou "Get started"
3. Habilite os provedores:
   - **Email/Password**: Clique em "Email/Password" e ative
   - **Google**: Clique em "Google" e ative

## Passo 3: Configurar Firestore Database

1. No menu lateral, clique em "Firestore Database"
2. Clique em "Criar banco de dados"
3. Modo: **Produção** (com regras de segurança)
4. Localização: **southamerica-east1** (São Paulo)

### Regras de Segurança do Firestore

Copie e cole estas regras na aba "Regras":

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read: if request.auth != null && request.auth.uid == userId;
      allow write: if request.auth != null && request.auth.uid == userId;
    }

    match /payments/{paymentId} {
      allow read: if request.auth != null;
      allow create: if false;
      allow update, delete: if false;
    }

    match /conekta_webhooks/{webhookId} {
      allow read, write: if false;
    }
  }
}
```

## Passo 4: Obter Configurações do Firebase

1. No Firebase Console, clique no ícone de engrenagem (Settings)
2. Vá em "Configurações do projeto"
3. Role até "Seus aplicativos"
4. Clique no ícone `</>` (Web)
5. Registre o app com nome: `contrata-web`
6. Copie as configurações que aparecem

## Passo 5: Criar arquivo .env.local

Crie o arquivo `.env.local` na raiz do projeto com o conteúdo:

```env
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=AIza...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=seu-projeto.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=seu-projeto-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=seu-projeto.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abc123
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-XXXXXXXXXX

# Conekta Configuration (opcional por enquanto)
CONEKTA_PRIVATE_KEY=key_test_xxxxx
NEXT_PUBLIC_CONEKTA_PUBLIC_KEY=key_test_xxxxx
```

## Passo 6: Testar Localmente

```bash
npm run dev
```

Acesse:
- http://localhost:3000/login - Testar login
- http://localhost:3000/cadastro - Testar cadastro

## Passo 7: Configurar Firebase Hosting

Execute no terminal:

```bash
firebase login
```

Depois:

```bash
firebase init hosting
```

Responda:
- **Use an existing project?** Yes
- **Select project:** Escolha o projeto que criou
- **Public directory:** `.next` (pressione Enter para confirmar)
- **Configure as single-page app?** Yes
- **Set up automatic builds with GitHub?** No (por enquanto)
- **Overwrite .next/index.html?** No

## Passo 8: Configurar para Next.js

Crie/edite o arquivo `firebase.json`:

```json
{
  "hosting": {
    "public": "out",
    "ignore": [
      "firebase.json",
      "**/.*",
      "**/node_modules/**"
    ],
    "rewrites": [
      {
        "source": "**",
        "destination": "/index.html"
      }
    ]
  }
}
```

## Passo 9: Adicionar Script de Deploy

Adicione no `package.json`:

```json
"scripts": {
  "dev": "next dev",
  "build": "next build",
  "start": "next start",
  "lint": "next lint",
  "export": "next build && next export",
  "deploy": "npm run export && firebase deploy --only hosting"
}
```

## Passo 10: Build e Deploy

```bash
npm run deploy
```

## Verificação

Após o deploy, você receberá uma URL como:
- https://seu-projeto.web.app
- https://seu-projeto.firebaseapp.com

Teste:
1. Acesse a URL
2. Vá para /cadastro
3. Crie uma conta
4. Faça login
5. Verifique no Firebase Console > Authentication se o usuário foi criado

## Configuração do Conekta (Opcional)

Se quiser ativar pagamentos agora:

1. Acesse [Conekta](https://www.conekta.com/)
2. Crie uma conta
3. Vá em API Keys
4. Copie as chaves de **teste**
5. Adicione no `.env.local`
6. Configure o webhook: `https://seu-projeto.web.app/api/conekta/webhook`

## Troubleshooting

### Erro: Firebase config missing
- Verifique se o `.env.local` existe
- Confirme que todas as variáveis NEXT_PUBLIC_FIREBASE_* estão preenchidas
- Reinicie o servidor de desenvolvimento

### Erro: next export não funciona
O Next.js 14 com App Router pode precisar de configuração especial. Use o modo estático:

No `next.config.js`:
```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true
  }
}

module.exports = nextConfig
```

### Build com APIs
Se estiver usando API routes, considere usar Firebase Functions ou deploy na Vercel que suporta API routes nativamente.

## Alternativa: Deploy na Vercel (Recomendado)

Para projetos Next.js com API routes, Vercel é mais simples:

```bash
npm install -g vercel
vercel login
vercel
```

Configure as variáveis de ambiente no painel da Vercel.
