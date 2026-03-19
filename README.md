# Contrata - Marketplace de Serviços para Postos de Combustível

Plataforma que conecta postos de combustível aos melhores fornecedores de serviços especializados.

## 🚀 Funcionalidades

### 🎤 Assistente Virtual com Entrada por Áudio
A plataforma conta com um assistente virtual inteligente que ajuda os usuários a encontrar o fornecedor ideal para suas necessidades.

**Características:**
- **Entrada por voz**: Botão de microfone na home para descrever problemas por áudio
- **Entrada por texto**: Campo de busca tradicional
- **Chat inteligente**: IA conversacional que faz perguntas estratégicas para entender:
  - O problema ou serviço necessário
  - Urgência do atendimento
  - Localização do posto
  - Detalhes técnicos relevantes
  - Histórico do problema

**Serviços disponíveis:**
- Inspeções Técnicas (NR-13, estanqueidade, etc)
- Manutenção em Tanques
- Manutenção em Bombas
- Manutenção em Dispensers
- Serviço Elétrico
- Manutenção em Automação
- Controle de Qualidade
- Serviço Civil

## 🛠️ Stack Tecnológico

- **Framework**: Next.js 14
- **Linguagem**: TypeScript
- **Estilização**: Tailwind CSS
- **Gerenciamento de Estado**: React Query
- **Animações**: Framer Motion
- **Reconhecimento de Voz**: Web Speech API

## 📦 Instalação

\`\`\`bash
# Instalar dependências
npm install

# Executar em desenvolvimento
npm run dev

# Build para produção
npm run build

# Iniciar em produção
npm start
\`\`\`

## 🤖 Configuração da IA

A funcionalidade de chat suporta diferentes provedores de IA. Configure as chaves de API no arquivo \`.env.local\`:

### Opção 1: Claude API (Anthropic)

\`\`\`env
ANTHROPIC_API_KEY=sk-ant-xxxxx
\`\`\`

### Opção 2: OpenAI API

\`\`\`env
OPENAI_API_KEY=sk-xxxxx
\`\`\`

### Opção 3: Sem API (Fallback)

Se nenhuma API key for configurada, o sistema usará lógica baseada em regras para responder às perguntas. Funciona bem para casos básicos, mas recomendamos usar uma API de IA para melhor experiência.

## 🎯 Como Usar

### Para Usuários Finais (Postos)

1. **Na Home Page:**
   - Escolha entre "Descrever meu problema" ou "Cotar serviço"
   - Digite ou clique no microfone para falar sobre sua necessidade
   - Clique em "Buscar" ou pressione Enter

2. **No Chat:**
   - A IA fará perguntas para entender melhor sua necessidade
   - Responda às perguntas naturalmente
   - A IA identificará os melhores fornecedores para você

### Para Desenvolvedores

#### Estrutura de Arquivos

\`\`\`
app/
├── chat/
│   └── page.tsx          # Página de chat
├── api/
│   └── chat/
│       └── route.ts      # API endpoint para processar mensagens
components/
├── Hero.tsx              # Componente da home com busca e microfone
lib/
├── hooks/
│   └── useSpeechRecognition.ts  # Hook para captura de áudio
└── ai/
    └── chat-service.ts   # Serviço de integração com LLMs
\`\`\`

#### Adicionar Novos Provedores de IA

Edite \`lib/ai/chat-service.ts\` e adicione um novo caso no método \`getChatResponse\`:

\`\`\`typescript
if (newProviderKey) {
  return await getNewProviderResponse(messages, systemPrompt, newProviderKey)
}
\`\`\`

## 🔒 Segurança

- Nunca commite arquivos \`.env.local\` com API keys
- Use variáveis de ambiente para chaves sensíveis
- As API keys nunca são expostas ao cliente

## 📱 Compatibilidade

- **Reconhecimento de Voz**: Chrome, Edge, Safari (iOS 14.5+)
- **Navegadores**: Todos os navegadores modernos
- **Dispositivos**: Desktop e Mobile

## 🚧 Roadmap

- [ ] Integração com base de dados de fornecedores
- [ ] Sistema de cotações e propostas
- [ ] Dashboard para fornecedores
- [ ] Sistema de avaliações
- [ ] Notificações por email/SMS
- [ ] Histórico de serviços

## 📄 Licença

Privado - © 2024 Contrata

## 🤝 Contato

Para dúvidas ou sugestões, entre em contato com a equipe de desenvolvimento.
