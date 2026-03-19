'use client'

import { useState, useEffect, useRef, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { ChatSidebar } from '@/components/chat/ChatSidebar'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
  showActions?: boolean
}

function ChatContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [isLoggedIn] = useState(false) // TODO: Integrar com sistema de auth real
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const hasInitialized = useRef(false)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    if (hasInitialized.current) return
    hasInitialized.current = true

    const initialMessage = searchParams.get('message')
    const mode = searchParams.get('mode')

    if (initialMessage) {
      handleSendMessage(initialMessage, mode === 'problem' ? 'problema' : 'serviço')
    } else {
      // Mensagem de boas-vindas
      setMessages([
        {
          id: '1',
          role: 'assistant',
          content: 'Olá! Sou a assistente virtual da Contrata. Estou aqui para ajudá-lo a encontrar o fornecedor ideal para suas necessidades. Pode me contar qual é o seu problema ou serviço que precisa?',
          timestamp: new Date()
        }
      ])
    }
  }, [])

  const handleSendMessage = async (messageText?: string, context?: string) => {
    const text = messageText || input
    if (!text.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: text,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsLoading(true)

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMessage],
          context
        })
      })

      const data = await response.json()

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.message,
        timestamp: new Date(),
        showActions: data.showActions || false
      }

      setMessages(prev => [...prev, assistantMessage])
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error)
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'Desculpe, ocorreu um erro. Por favor, tente novamente.',
        timestamp: new Date()
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value)
    // Auto-resize textarea
    e.target.style.height = 'auto'
    e.target.style.height = Math.min(e.target.scrollHeight, 128) + 'px'
  }

  useEffect(() => {
    // Garante que o scroll está habilitado
    document.body.style.overflow = 'auto'
  }, [])

  return (
    <div className="flex h-screen bg-white animate-in fade-in duration-150">
      {/* Sidebar */}
      <ChatSidebar
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
        isLoggedIn={isLoggedIn}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Botão de menu quando sidebar está fechada */}
        {!sidebarOpen && (
          <div className="absolute top-4 left-4 z-10">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 bg-white hover:bg-gray-100 rounded-lg transition-colors shadow-md border border-gray-200"
              title="Abrir menu"
            >
              <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        )}

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6 max-w-4xl w-full mx-auto">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-[85%] ${message.role === 'user' ? '' : 'w-full'}`}>
                <div
                  className={`${
                    message.role === 'user'
                      ? 'bg-gray-100 text-gray-900 rounded-2xl px-5 py-3.5 border border-gray-200'
                      : 'text-gray-900'
                  }`}
                >
                  <p className="text-[15px] leading-relaxed whitespace-pre-wrap">{message.content}</p>
                </div>

                {/* Botões de ação quando IA identificou o problema */}
                {message.role === 'assistant' && message.showActions && (
                  <div className="mt-4 flex gap-3 flex-wrap">
                    <button
                      onClick={() => router.push('/fornecedores')}
                      className="px-6 py-3 bg-purple text-white rounded-xl font-semibold hover:bg-purple-medium transition-all shadow-md hover:shadow-lg flex items-center gap-2"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                      Ver fornecedores na minha região
                    </button>
                    <button
                      onClick={() => {/* TODO: Implementar SOS */}}
                      className="px-6 py-3 bg-red-600 text-white rounded-xl font-semibold hover:bg-red-700 transition-all shadow-md hover:shadow-lg flex items-center gap-2"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                      </svg>
                      Ativar SOS Conekta para urgências
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex justify-start">
              <div className="py-2">
                <div className="flex space-x-2">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="bg-white px-6 py-4">
          <div className="max-w-4xl mx-auto">
            <div className="flex gap-3 items-end">
              <div className="flex-1 relative">
                <textarea
                  value={input}
                  onChange={handleInputChange}
                  onKeyPress={handleKeyPress}
                  placeholder="Responder..."
                  className="w-full resize-none px-4 py-3 bg-white border border-gray-300 rounded-2xl text-[15px] text-gray-900 outline-none transition-all focus:border-purple focus:shadow-[0_0_0_3px_rgba(98,57,150,0.1)] placeholder:text-gray-400"
                  rows={1}
                  disabled={isLoading}
                  style={{
                    minHeight: '48px',
                    maxHeight: '128px',
                    height: '48px'
                  }}
                />
              </div>
              <button
                onClick={() => handleSendMessage()}
                disabled={isLoading || !input.trim()}
                className="bg-purple text-white p-3 rounded-2xl hover:bg-purple-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
                title="Enviar mensagem"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-2 text-center">
              Conekta IA pode cometer erros. Por favor, verifique as respostas.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function ChatPage() {
  return (
    <Suspense fallback={
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="inline-block w-12 h-12 border-4 border-purple border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-gray-600">Carregando chat...</p>
        </div>
      </div>
    }>
      <ChatContent />
    </Suspense>
  )
}
