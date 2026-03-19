'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface ChatSession {
  id: string
  title: string
  date: string
  preview: string
}

interface ChatSidebarProps {
  isOpen: boolean
  onToggle: () => void
  isLoggedIn?: boolean
}

export function ChatSidebar({ isOpen, onToggle, isLoggedIn = false }: ChatSidebarProps) {
  const router = useRouter()
  const [sessions] = useState<ChatSession[]>([])

  const menuItems = [
    {
      icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>,
      label: 'Novo Chat',
      action: () => router.push('/chat')
    },
    {
      icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>,
      label: 'SOS Conekta',
      action: () => {}
    },
    {
      icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>,
      label: 'Conekta Pay',
      action: () => {}
    },
    {
      icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>,
      label: 'Shop Conekta',
      action: () => {}
    },
    {
      icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>,
      label: 'Cotar Serviço',
      action: () => {}
    },
    {
      icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>,
      label: 'Voltar a Home',
      action: () => router.push('/')
    },
  ]

  return (
    <>
      {/* Overlay para mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/20 z-40 lg:hidden"
          onClick={onToggle}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:relative top-0 left-0 h-screen bg-white border-r border-gray-200 z-50 transition-all duration-200 ${
          isOpen ? 'w-[260px]' : 'w-0 lg:w-0'
        } overflow-hidden`}
      >
        <div className="flex flex-col h-full">
          {/* Logo e Toggle */}
          <div className="p-4 flex items-center justify-between border-b border-gray-200">
            <div className="flex items-center gap-2">
              <span className="text-2xl font-black bg-gradient-to-r from-purple to-purple-medium bg-clip-text text-transparent">
                Conekta
              </span>
            </div>
            <button
              onClick={onToggle}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              title="Minimizar"
            >
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Menu Items */}
          <div className="flex-1 overflow-y-auto py-3">
            <div className="space-y-0.5 px-2">
              {menuItems.map((item, index) => (
                <button
                  key={index}
                  onClick={item.action}
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors text-left group text-gray-700 hover:text-purple"
                >
                  <span className="flex-shrink-0">{item.icon}</span>
                  <span className="text-sm font-medium">{item.label}</span>
                </button>
              ))}
            </div>

            {/* Histórico de conversas (se logado) */}
            {isLoggedIn && sessions.length > 0 && (
              <div className="mt-4 px-2">
                <h3 className="px-3 text-xs font-semibold text-gray-500 uppercase mb-2">Conversas Recentes</h3>
                <div className="space-y-0.5">
                  {sessions.map((session) => (
                    <button
                      key={session.id}
                      className="w-full text-left p-3 hover:bg-gray-100 rounded-lg transition-colors group"
                    >
                      <h4 className="text-sm font-medium truncate text-gray-900">{session.title}</h4>
                      <p className="text-xs text-gray-500 truncate mt-0.5">{session.preview}</p>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          {!isLoggedIn && (
            <div className="p-4 border-t border-gray-200">
              <p className="text-xs text-gray-600 leading-relaxed mb-3">
                Entre para receber respostas com base em chats salvos, além de criar imagens e carregar arquivos.
              </p>
              <button
                onClick={() => router.push('/login')}
                className="w-full px-4 py-2.5 bg-purple text-white rounded-lg text-sm font-semibold hover:bg-purple-medium transition-colors"
              >
                Entrar
              </button>
            </div>
          )}

          {/* Footer - Usuário Logado */}
          {isLoggedIn && (
            <div className="p-4 border-t border-gray-200">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-purple text-white rounded-full flex items-center justify-center text-sm font-semibold">
                  A
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate text-gray-900">André</p>
                  <p className="text-xs text-gray-500">Plano Básico</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </aside>
    </>
  )
}
