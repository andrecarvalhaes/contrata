# 🎤 Funcionalidade de Chat com IA

## O que foi implementado

### 1. Botão de Microfone na Home
- Ícone de microfone ao lado do botão "Buscar"
- Captura de áudio usando Web Speech API
- Transcrição automática para texto
- Indicador visual quando está gravando (botão vermelho pulsante)

### 2. Página de Chat (/chat)
- Interface de chat moderna e responsiva
- Mensagens do usuário em roxo, da IA em cinza
- Scroll automático para novas mensagens
- Indicador de digitação (loading)
- Campo de input com suporte para Enter

### 3. API de IA
- Endpoint: `/api/chat`
- Suporta múltiplos provedores:
  - Claude API (Anthropic)
  - OpenAI API
  - Fallback com lógica de regras

## Como testar

### 1. Iniciar o servidor
```bash
cd c:/Users/ClubPetro-123/Documents/contrata
npm run dev
```

### 2. Testar entrada por áudio
1. Abra http://localhost:3000
2. Clique no ícone de microfone (🎤)
3. Permita acesso ao microfone quando solicitado
4. Fale algo como: "Bomba não está funcionando"
5. O texto será transcrito automaticamente
6. Clique em "Buscar"

### 3. Testar entrada por texto
1. Digite no campo: "Preciso de manutenção em tanques"
2. Pressione Enter ou clique em "Buscar"

### 4. Testar o Chat
- Você será redirecionado para `/chat`
- A IA responderá fazendo perguntas estratégicas
- Continue a conversa respondendo às perguntas
- A IA tentará entender:
  - Tipo de serviço/problema
  - Urgência
  - Localização
  - Detalhes técnicos

## Configurar IA (Opcional)

### Usando Claude API

1. Obtenha uma API key em: https://console.anthropic.com/
2. Crie o arquivo `.env.local`:
```env
ANTHROPIC_API_KEY=sk-ant-sua-chave-aqui
```
3. Reinicie o servidor

### Usando OpenAI

1. Obtenha uma API key em: https://platform.openai.com/
2. Crie o arquivo `.env.local`:
```env
OPENAI_API_KEY=sk-sua-chave-aqui
```
3. Reinicie o servidor

### Sem API (Modo Fallback)

Se não configurar nenhuma API, o sistema usará lógica baseada em regras. Funciona bem mas não é tão inteligente quanto usar uma LLM real.

## Arquivos criados/modificados

### Criados:
- `lib/hooks/useSpeechRecognition.ts` - Hook para captura de áudio
- `lib/ai/chat-service.ts` - Serviço de integração com LLMs
- `app/chat/page.tsx` - Página de chat
- `app/api/chat/route.ts` - API endpoint
- `README.md` - Documentação completa
- `CHAT_FEATURE.md` - Este arquivo

### Modificados:
- `components/Hero.tsx` - Adicionado botão de microfone e funcionalidade
- `.env.example` - Adicionadas variáveis para APIs de IA

## Compatibilidade do Microfone

✅ Chrome (Desktop e Android)
✅ Edge
✅ Safari (iOS 14.5+)
❌ Firefox (não suporta Web Speech API)

## Próximos passos sugeridos

1. **Integrar com banco de dados**: Salvar conversas e extrair insights
2. **Conectar com fornecedores**: Base de dados real de fornecedores
3. **Sistema de matching**: Algoritmo para sugerir melhores fornecedores
4. **Notificações**: Avisar fornecedores sobre novas solicitações
5. **Dashboard**: Para acompanhar conversas e leads
6. **Análise de sentimento**: Detectar urgência e priorizar

## Demonstração rápida

```bash
# Terminal 1: Iniciar servidor
npm run dev

# Terminal 2: Abrir no navegador
# Windows
start http://localhost:3000

# Mac/Linux
open http://localhost:3000
```

## Troubleshooting

### Microfone não funciona
- Verifique se está usando HTTPS ou localhost
- Confira permissões do navegador
- Teste em Chrome/Edge (Firefox não suporta)

### IA não responde
- Verifique console do navegador (F12)
- Confirme que `/api/chat` está acessível
- Se usando API, verifique se a key está correta

### Build falha
- Limpe cache: `rm -rf .next`
- Reinstale: `rm -rf node_modules && npm install`
- Tente novamente: `npm run build`

## Suporte

Para dúvidas, verifique:
1. Console do navegador (F12)
2. Terminal onde o servidor está rodando
3. Arquivo de logs do Next.js
