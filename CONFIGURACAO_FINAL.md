# Configuração Final - Firebase + Conekta

## Status do Deploy

✅ Projeto publicado com sucesso em: **https://useconekta.web.app**

## Próximos Passos para Ativar Autenticação

### 1. Habilitar Firebase Authentication

Acesse: https://console.firebase.google.com/project/useconekta/authentication

1. Clique em "Get started" ou "Começar"
2. Habilite os seguintes provedores:

   **Email/Password:**
   - Clique em "Email/Password"
   - Toggle "Enable" (Ativar)
   - Clique em "Save" (Salvar)

   **Google Sign-in:**
   - Clique em "Google"
   - Toggle "Enable" (Ativar)
   - Configure o support email
   - Clique em "Save" (Salvar)

### 2. Criar Firestore Database

Acesse: https://console.firebase.google.com/project/useconekta/firestore

1. Clique em "Create database" (Criar banco de dados)
2. Modo: **Production mode** (Modo produção)
3. Localização: **southamerica-east1 (São Paulo)**
4. Clique em "Enable" (Ativar)

### 3. Configurar Regras de Segurança do Firestore

Após criar o Firestore, vá em "Rules" (Regras) e cole este código:

\`\`\`javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Usuários podem ler e escrever apenas seus próprios dados
    match /users/{userId} {
      allow read: if request.auth != null && request.auth.uid == userId;
      allow write: if request.auth != null && request.auth.uid == userId;
    }

    // Pagamentos são apenas leitura para usuários autenticados
    match /payments/{paymentId} {
      allow read: if request.auth != null;
      allow create, update, delete: if false;
    }

    // Webhooks do Conekta são apenas para servidor
    match /conekta_webhooks/{webhookId} {
      allow read, write: if false;
    }
  }
}
\`\`\`

Clique em "Publish" (Publicar).

### 4. Testar a Aplicação

Agora você pode testar:

1. **Página inicial**: https://useconekta.web.app
2. **Cadastro**: https://useconekta.web.app/cadastro
3. **Login**: https://useconekta.web.app/login
4. **Marketplace**: https://useconekta.web.app/marketplace
5. **Pagamento (exemplo)**: https://useconekta.web.app/pagamento

### 5. Configurar Conekta (Opcional)

Para ativar pagamentos reais:

1. Crie conta em: https://www.conekta.com/
2. Obtenha as API keys em: https://admin.conekta.com/settings/keys
3. Adicione as keys no arquivo `.env.local` local:
   \`\`\`env
   CONEKTA_PRIVATE_KEY=key_xxxxxxxxxxxxx
   NEXT_PUBLIC_CONEKTA_PUBLIC_KEY=key_xxxxxxxxxxxxx
   \`\`\`
4. Configure o webhook no painel Conekta:
   - URL: https://useconekta.web.app/api/conekta/webhook
   - Eventos: charge.paid, charge.declined, charge.refunded

**IMPORTANTE:** As API routes (webhooks e pagamentos) funcionam apenas em ambiente local (npm run dev) ou se você fizer deploy em plataforma que suporta API routes como Vercel.

## O que Foi Implementado

### Firebase Authentication
- ✅ Cadastro com email/senha
- ✅ Login com email/senha
- ✅ Login com Google
- ✅ Recuperação de senha
- ✅ Perfis de usuário (posto/fornecedor)
- ✅ Hook customizado useAuth()

### Conekta Payment
- ✅ Tokenização de cartões
- ✅ Pagamento com cartão
- ✅ Webhook para notificações
- ✅ Hook customizado useConekta()
- ✅ Integração automática com Firebase UID

### Páginas Atualizadas
- ✅ Login com Firebase
- ✅ Cadastro com Firebase
- ✅ Página de pagamento com Conekta
- ✅ Provider de autenticação global

### Configuração
- ✅ Firebase configurado (useconekta)
- ✅ Build e deploy automático
- ✅ Variáveis de ambiente configuradas

## Estrutura de Dados Firestore

### Coleção: users
\`\`\`typescript
{
  uid: string
  email: string
  displayName: string
  role: 'posto' | 'fornecedor' | 'admin'
  conektaCustomerId?: string
  createdAt: timestamp
  updatedAt: timestamp
}
\`\`\`

### Coleção: payments
\`\`\`typescript
{
  chargeId: string
  customerId: string
  amount: number
  currency: string
  status: 'paid' | 'declined' | 'refunded'
  paidAt?: timestamp
}
\`\`\`

## Deploy Futuro

Para fazer deploy de alterações futuras:

\`\`\`bash
npm run deploy
\`\`\`

Isso fará:
1. Build do projeto (npm run build)
2. Deploy para Firebase Hosting

## Comandos Úteis

\`\`\`bash
# Desenvolvimento local
npm run dev

# Build de produção
npm run build

# Deploy para Firebase
npm run deploy

# Ver logs do Firebase
firebase hosting:channel:list

# Rollback se necessário
firebase hosting:clone SOURCE_SITE_ID:SOURCE_CHANNEL_ID TARGET_SITE_ID:live
\`\`\`

## Limitações do Firebase Hosting

⚠️ Firebase Hosting serve apenas arquivos estáticos. As API routes não funcionarão em produção.

**Soluções:**

1. **Vercel (Recomendado)**: Suporta API routes nativamente
   \`\`\`bash
   npm install -g vercel
   vercel login
   vercel
   \`\`\`

2. **Firebase Functions**: Migrar API routes para Cloud Functions
3. **Backend Separado**: Hospedar APIs em servidor Node.js separado

## Monitoramento

- **Firebase Console**: https://console.firebase.google.com/project/useconekta
- **Authentication**: Ver usuários cadastrados
- **Firestore**: Ver dados salvos
- **Hosting**: Ver deploys e logs

## Suporte

- Firebase Docs: https://firebase.google.com/docs
- Conekta Docs: https://developers.conekta.com/
- Next.js Docs: https://nextjs.org/docs

## Checklist de Produção

- [ ] Habilitar Authentication no Firebase Console
- [ ] Criar Firestore Database
- [ ] Configurar regras de segurança
- [ ] Testar cadastro/login
- [ ] Configurar conta Conekta
- [ ] Configurar webhook do Conekta
- [ ] Migrar API routes para Vercel ou Firebase Functions
- [ ] Configurar domínio customizado (opcional)
- [ ] Configurar SSL/HTTPS
- [ ] Testar fluxo completo de pagamento

---

**Projeto Contrata - Marketplace de Serviços**
Desenvolvido com Next.js 14, Firebase e Conekta
