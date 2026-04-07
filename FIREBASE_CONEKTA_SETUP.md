# Configuração Firebase + Conekta

Este guia explica como configurar a integração entre Firebase Authentication e Conekta para pagamentos.

## 1. Instalação das Dependências

Execute o comando para instalar as dependências necessárias:

```bash
npm install firebase
```

## 2. Configuração do Firebase

### 2.1 Criar Projeto no Firebase

1. Acesse [Firebase Console](https://console.firebase.google.com/)
2. Clique em "Adicionar projeto"
3. Siga os passos para criar seu projeto

### 2.2 Habilitar Authentication

1. No painel do Firebase, vá em "Authentication"
2. Clique em "Começar"
3. Habilite os métodos de autenticação desejados:
   - Email/Senha
   - Google

### 2.3 Criar Firestore Database

1. No painel do Firebase, vá em "Firestore Database"
2. Clique em "Criar banco de dados"
3. Escolha o modo de produção
4. Selecione a localização (recomendado: southamerica-east1)

### 2.4 Regras de Segurança do Firestore

Configure as regras de segurança no Firestore:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Regras para coleção de usuários
    match /users/{userId} {
      allow read: if request.auth != null && request.auth.uid == userId;
      allow write: if request.auth != null && request.auth.uid == userId;
    }

    // Regras para coleção de pagamentos
    match /payments/{paymentId} {
      allow read: if request.auth != null;
      allow write: if false; // Apenas via servidor
    }

    // Regras para webhooks do Conekta
    match /conekta_webhooks/{webhookId} {
      allow read: if false;
      allow write: if false; // Apenas via servidor
    }
  }
}
```

### 2.5 Obter Credenciais do Firebase

1. No painel do Firebase, vá em "Configurações do projeto" (ícone de engrenagem)
2. Na aba "Geral", role até "Seus aplicativos"
3. Clique no ícone "</>" para adicionar um app web
4. Registre o app e copie as configurações

### 2.6 Configurar Variáveis de Ambiente

Crie um arquivo `.env.local` na raiz do projeto com as credenciais do Firebase:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=sua-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=seu-projeto.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=seu-projeto-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=seu-projeto.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=seu-sender-id
NEXT_PUBLIC_FIREBASE_APP_ID=seu-app-id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-XXXXXXXXXX
```

## 3. Configuração do Conekta

### 3.1 Criar Conta no Conekta

1. Acesse [Conekta](https://www.conekta.com/)
2. Crie sua conta
3. Complete o processo de verificação

### 3.2 Obter Chaves de API

1. Acesse o painel do Conekta
2. Vá em "Configuración" > "API Keys"
3. Copie as chaves:
   - **Chave Privada**: para uso no servidor
   - **Chave Pública**: para uso no cliente

### 3.3 Configurar Variáveis de Ambiente

Adicione as chaves do Conekta no arquivo `.env.local`:

```env
CONEKTA_PRIVATE_KEY=key_xxxxxxxxxxxxxxxxxxxxx
NEXT_PUBLIC_CONEKTA_PUBLIC_KEY=key_xxxxxxxxxxxxxxxxxxxxx
```

### 3.4 Configurar Webhook

1. No painel do Conekta, vá em "Configuración" > "Webhooks"
2. Adicione um novo webhook com a URL:
   ```
   https://seu-dominio.com/api/conekta/webhook
   ```
3. Selecione os eventos que deseja receber:
   - charge.paid
   - charge.declined
   - charge.refunded

## 4. Uso da Integração

### 4.1 Autenticação com Firebase

```tsx
import { signUp, signIn, signInWithGoogle } from '@/lib/firebase/auth';

// Cadastro com email/senha
const { user, profile } = await signUp(
  'email@example.com',
  'senha123',
  'Nome do Usuário',
  'posto' // ou 'fornecedor'
);

// Login com email/senha
const { user, profile } = await signIn('email@example.com', 'senha123');

// Login com Google
const { user, profile } = await signInWithGoogle('posto');
```

### 4.2 Hook de Autenticação

```tsx
import { useAuthContext } from '@/components/providers/AuthProvider';

function MyComponent() {
  const { user, profile, loading, logout, isAuthenticated } = useAuthContext();

  if (loading) return <div>Carregando...</div>;

  if (!isAuthenticated) {
    return <div>Faça login</div>;
  }

  return (
    <div>
      <p>Olá, {profile?.displayName}</p>
      <button onClick={logout}>Sair</button>
    </div>
  );
}
```

### 4.3 Processar Pagamento com Conekta

```tsx
import { useConekta } from '@/lib/hooks/useConekta';

function PaymentComponent() {
  const { processCardPayment, loading } = useConekta();

  const handlePayment = async () => {
    try {
      // Pagamento com cartão
      const charge = await processCardPayment(
        {
          number: '4242424242424242',
          name: 'João Silva',
          exp_month: '12',
          exp_year: '26',
          cvc: '123'
        },
        10000, // valor em centavos (R$ 100.00)
        'Descrição do pagamento'
      );

      console.log('Pagamento aprovado:', charge);
    } catch (error) {
      console.error('Erro no pagamento:', error);
    }
  };

  return (
    <button onClick={handlePayment} disabled={loading}>
      {loading ? 'Processando...' : 'Pagar'}
    </button>
  );
}
```

### 4.4 Componente de Pagamento Pronto

Use o componente `ConektaPaymentForm` para uma solução completa:

```tsx
import ConektaPaymentForm from '@/components/payment/ConektaPaymentForm';

function CheckoutPage() {
  const handleSuccess = (charge: any) => {
    console.log('Pagamento realizado com sucesso!', charge);
    // Redirecionar para página de confirmação
  };

  const handleError = (error: string) => {
    console.error('Erro no pagamento:', error);
    // Mostrar mensagem de erro
  };

  return (
    <ConektaPaymentForm
      amount={10000} // R$ 100.00 em centavos
      description="Serviço de manutenção"
      onSuccess={handleSuccess}
      onError={handleError}
    />
  );
}
```

## 5. Métodos de Pagamento Suportados

### 5.1 Cartão de Crédito/Débito

Pagamento instantâneo com tokenização segura.

## 6. Testando a Integração

### 6.1 Cartões de Teste Conekta

Use estes cartões para testar em ambiente de desenvolvimento:

- **Aprovado**: 4242 4242 4242 4242
- **Recusado**: 4000 0000 0000 0002
- **Erro**: 4000 0000 0000 0341

Use qualquer CVV válido (3 dígitos) e data de expiração futura.

## 7. Segurança

### 7.1 Boas Práticas

1. Nunca exponha suas chaves privadas no cliente
2. Use HTTPS em produção
3. Valide todos os dados no servidor
4. Implemente rate limiting nas rotas de pagamento
5. Monitore webhooks para detectar atividades suspeitas

### 7.2 Validação de Webhooks

Para produção, adicione verificação de assinatura nos webhooks:

```typescript
// Verificar assinatura do webhook
const signature = request.headers.get('x-conekta-signature');
// Implementar verificação conforme documentação do Conekta
```

## 8. Deploy

### 8.1 Variáveis de Ambiente em Produção

Configure todas as variáveis de ambiente no seu provedor de hospedagem:

- Vercel: Settings > Environment Variables
- Netlify: Site settings > Build & deploy > Environment
- Heroku: Settings > Config Vars

### 8.2 Webhook em Produção

Atualize a URL do webhook no painel do Conekta para o domínio de produção.

## 9. Troubleshooting

### Erro: Firebase App not initialized

Verifique se todas as variáveis de ambiente do Firebase estão configuradas corretamente.

### Erro: Conekta API key invalid

Certifique-se de usar a chave privada no servidor e a pública no cliente.

### Webhook não está funcionando

1. Verifique se a URL está acessível publicamente
2. Certifique-se de que a rota retorna status 200
3. Verifique os logs no painel do Conekta

## 10. Recursos Adicionais

- [Documentação Firebase](https://firebase.google.com/docs)
- [Documentação Conekta](https://developers.conekta.com/)
- [Conekta API Reference](https://developers.conekta.com/api)
