import { NextRequest, NextResponse } from 'next/server'
import { getChatResponse } from '@/lib/ai/chat-service'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

// Sistema de perguntas inteligentes para extrair informações
const SYSTEM_PROMPT = `Você é a assistente virtual da Contrata, uma plataforma que conecta postos de combustível a fornecedores especializados.

Sua missão é conversar com o usuário de forma natural e fazer perguntas estratégicas para entender:
1. Qual é o problema ou serviço necessário
2. Urgência (quando precisa ser resolvido)
3. Localização do posto
4. Detalhes técnicos relevantes
5. Histórico do problema (se aplicável)

Serviços disponíveis na plataforma:
- Inspeções Técnicas (NR-13, estanqueidade, etc)
- Manutenção em Tanques
- Manutenção em Bombas
- Manutenção em Dispensers
- Serviço Elétrico
- Manutenção em Automação
- Controle de Qualidade
- Serviço Civil

Diretrizes:
- Seja amigável e profissional
- Faça uma pergunta de cada vez
- Use linguagem clara e objetiva
- Quando tiver informações suficientes, resuma o que entendeu e sugira os tipos de fornecedores que podem ajudar
- Seja empático com problemas urgentes
- Não invente informações sobre fornecedores específicos (ainda não temos essa integração)

Formato das suas respostas:
- Respostas curtas e diretas
- Máximo 3-4 linhas por mensagem
- Uma pergunta por vez
- Use emojis moderadamente para tornar a conversa mais leve`

export async function POST(req: NextRequest) {
  try {
    const { messages, context } = await req.json()

    // Se há contexto (primeira mensagem), adicionar ao sistema
    let systemMessage = SYSTEM_PROMPT
    if (context) {
      systemMessage += `\n\nO usuário chegou aqui através da busca por: "${context}". Use isso como contexto inicial.`
    }

    // Usar o serviço de chat (tenta Claude API, depois OpenAI, depois fallback)
    const response = await getChatResponse(messages, systemMessage)

    // Detectar se deve mostrar botões de ação
    // Mostra botões se:
    // 1. Tem 3+ mensagens (já trocou informações suficientes)
    // 2. A resposta menciona que identificou ou entendeu o problema
    const shouldShowActions = messages.length >= 3 && (
      response.toLowerCase().includes('identifiquei') ||
      response.toLowerCase().includes('entendi') ||
      response.toLowerCase().includes('baseado no que') ||
      response.toLowerCase().includes('perfeito')
    )

    return NextResponse.json({
      message: response,
      showActions: shouldShowActions
    })

  } catch (error) {
    console.error('Erro na API de chat:', error)
    return NextResponse.json(
      { error: 'Erro ao processar mensagem' },
      { status: 500 }
    )
  }
}
