// Serviço para integração com diferentes LLMs
// Configure a API key no .env.local

interface Message {
  role: 'user' | 'assistant'
  content: string
}

export async function getChatResponse(
  messages: Message[],
  systemPrompt: string
): Promise<string> {
  const anthropicKey = process.env.ANTHROPIC_API_KEY
  const openaiKey = process.env.OPENAI_API_KEY

  // Se tiver Claude API configurada
  if (anthropicKey) {
    return await getClaudeResponse(messages, systemPrompt, anthropicKey)
  }

  // Se tiver OpenAI configurada
  if (openaiKey) {
    return await getOpenAIResponse(messages, systemPrompt, openaiKey)
  }

  // Fallback para lógica baseada em regras
  return getFallbackResponse(messages)
}

async function getClaudeResponse(
  messages: Message[],
  systemPrompt: string,
  apiKey: string
): Promise<string> {
  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 1024,
        system: systemPrompt,
        messages: messages.map(msg => ({
          role: msg.role,
          content: msg.content
        }))
      })
    })

    if (!response.ok) {
      throw new Error(`Claude API error: ${response.statusText}`)
    }

    const data = await response.json()
    return data.content[0].text
  } catch (error) {
    console.error('Erro ao chamar Claude API:', error)
    return getFallbackResponse(messages)
  }
}

async function getOpenAIResponse(
  messages: Message[],
  systemPrompt: string,
  apiKey: string
): Promise<string> {
  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          ...messages.map(msg => ({
            role: msg.role,
            content: msg.content
          }))
        ],
        max_tokens: 500,
        temperature: 0.7,
      })
    })

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.statusText}`)
    }

    const data = await response.json()
    return data.choices[0].message.content
  } catch (error) {
    console.error('Erro ao chamar OpenAI API:', error)
    return getFallbackResponse(messages)
  }
}

function getFallbackResponse(messages: Message[]): string {
  const lastMessage = messages[messages.length - 1].content.toLowerCase()

  // Lógica baseada em regras (fallback quando não há API configurada)
  if (messages.length === 1) {
    return `Entendi! Você mencionou: "${messages[0].content}"\n\nPara te ajudar melhor, me conta: isso é algo urgente? Quando você precisa resolver isso?`
  }

  if (lastMessage.includes('urgente') || lastMessage.includes('hoje') || lastMessage.includes('agora')) {
    return 'Entendo que é urgente! 🚨\n\nEm qual cidade fica o seu posto? Isso me ajuda a pensar em fornecedores da região.'
  }

  if (lastMessage.includes('bomba') || lastMessage.includes('dispenser')) {
    return 'Perfeito! Problemas em bombas e dispensers são nossa especialidade.\n\nPode me dar mais detalhes? Por exemplo: a bomba não liga, tem vazamento, erro no display?'
  }

  if (lastMessage.includes('tanque') || lastMessage.includes('combustível')) {
    return 'Questões com tanques precisam de atenção! 💧\n\nVocê notou algum cheiro forte de combustível, ou foi detectado em alguma inspeção?'
  }

  if (lastMessage.includes('elétric') || lastMessage.includes('automação')) {
    return 'Problemas elétricos podem ser sérios.\n\nÉ algo que afeta todo o posto ou apenas um equipamento específico?'
  }

  if (lastMessage.includes('inspeção') || lastMessage.includes('nr-13') || lastMessage.includes('laudo')) {
    return 'Ótimo! Inspeções e laudos são fundamentais para estar em conformidade.\n\nVocê já sabe qual tipo de laudo precisa, ou quer que eu te ajude a identificar?'
  }

  if (lastMessage.length < 20) {
    return 'Pode me contar um pouco mais sobre isso? Quanto mais detalhes você me der, melhor vou conseguir te ajudar! 😊'
  }

  // Após algumas mensagens, resumir
  if (messages.length >= 4) {
    return `Perfeito! Baseado no que você me contou, identifiquei que você precisa de:\n\n✅ ${inferServiceType(messages)}\n\nVou te conectar com fornecedores especializados nessa área. Em breve, você receberá propostas de profissionais qualificados! 🎯\n\nTem mais alguma informação que você gostaria de adicionar?`
  }

  return 'Entendi! Isso me ajuda bastante.\n\nMe conta também: qual é a localização do posto?'
}

function inferServiceType(messages: Message[]): string {
  const allContent = messages.map(m => m.content.toLowerCase()).join(' ')

  if (allContent.includes('bomba') || allContent.includes('dispenser')) {
    return 'Manutenção em Bombas e Dispensers'
  }
  if (allContent.includes('tanque')) {
    return 'Manutenção em Tanques'
  }
  if (allContent.includes('elétric') || allContent.includes('automação')) {
    return 'Serviço Elétrico e Automação'
  }
  if (allContent.includes('inspeção') || allContent.includes('nr-13') || allContent.includes('laudo')) {
    return 'Inspeção Técnica'
  }
  if (allContent.includes('vazamento') || allContent.includes('estanqueidade')) {
    return 'Laudo de Estanqueidade'
  }

  return 'Serviços Especializados para Postos'
}
