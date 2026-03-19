'use client'

import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { signUp, signInWithGoogle } from '@/lib/firebase/auth'

export default function CadastroPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'posto' as 'posto' | 'fornecedor'
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    if (formData.password !== formData.confirmPassword) {
      setError('As senhas não coincidem')
      setLoading(false)
      return
    }

    if (formData.password.length < 6) {
      setError('A senha deve ter no mínimo 6 caracteres')
      setLoading(false)
      return
    }

    try {
      await signUp(formData.email, formData.password, formData.name, formData.role)
      router.push('/marketplace')
    } catch (err: any) {
      setError(err.message || 'Erro ao criar conta')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleGoogleSignUp = async () => {
    setLoading(true)
    setError('')

    try {
      await signInWithGoogle(formData.role)
      router.push('/marketplace')
    } catch (err: any) {
      setError(err.message || 'Erro ao criar conta com Google')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Navbar />
      <main className="relative z-[1] min-h-screen pt-[120px] pb-20 px-6 flex items-center justify-center">
        <div className="w-full max-w-md">
          <div className="bg-white/80 backdrop-blur-sm border border-gray-200 rounded-3xl p-8 shadow-xl">
            <h1 className="font-display text-3xl font-bold text-gray-900 mb-2">
              Criar conta
            </h1>
            <p className="text-gray-600 mb-8">
              Cadastre-se para começar a usar a plataforma
            </p>

            {error && (
              <div className="mb-6 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Tipo de Conta
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, role: 'posto' })}
                    className={`py-2 px-4 rounded-full border transition-all ${
                      formData.role === 'posto'
                        ? 'bg-purple text-white border-purple'
                        : 'bg-white text-gray-700 border-gray-300 hover:border-purple'
                    }`}
                    disabled={loading}
                  >
                    Posto
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, role: 'fornecedor' })}
                    className={`py-2 px-4 rounded-full border transition-all ${
                      formData.role === 'fornecedor'
                        ? 'bg-purple text-white border-purple'
                        : 'bg-white text-gray-700 border-gray-300 hover:border-purple'
                    }`}
                    disabled={loading}
                  >
                    Fornecedor
                  </button>
                </div>
              </div>

              <div>
                <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">
                  Nome completo
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white border border-gray-300 rounded-full text-gray-900 outline-none transition-all focus:border-purple focus:shadow-[0_0_0_4px_rgba(98,57,150,0.15)] placeholder:text-gray-400"
                  placeholder="João Silva"
                  required
                  disabled={loading}
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white border border-gray-300 rounded-full text-gray-900 outline-none transition-all focus:border-purple focus:shadow-[0_0_0_4px_rgba(98,57,150,0.15)] placeholder:text-gray-400"
                  placeholder="seu@email.com"
                  required
                  disabled={loading}
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
                  Senha
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white border border-gray-300 rounded-full text-gray-900 outline-none transition-all focus:border-purple focus:shadow-[0_0_0_4px_rgba(98,57,150,0.15)] placeholder:text-gray-400"
                  placeholder="••••••••"
                  required
                  minLength={6}
                  disabled={loading}
                />
                <p className="text-xs text-gray-500 mt-1">Mínimo de 6 caracteres</p>
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-semibold text-gray-700 mb-2">
                  Confirmar senha
                </label>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white border border-gray-300 rounded-full text-gray-900 outline-none transition-all focus:border-purple focus:shadow-[0_0_0_4px_rgba(98,57,150,0.15)] placeholder:text-gray-400"
                  placeholder="••••••••"
                  required
                  disabled={loading}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-purple text-white px-6 py-3.5 rounded-full text-base font-semibold hover:bg-purple-medium transition-all shadow-lg shadow-purple/30 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Criando conta...' : 'Criar conta'}
              </button>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white/80 text-gray-500">Ou continue com</span>
                </div>
              </div>

              <button
                type="button"
                onClick={handleGoogleSignUp}
                disabled={loading}
                className="w-full py-3 px-4 border border-gray-300 rounded-full flex items-center justify-center gap-2 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                <span className="font-medium text-gray-700">Google</span>
              </button>

              <p className="text-center text-sm text-gray-600">
                Já tem uma conta?{' '}
                <Link href="/login" className="text-purple font-semibold hover:text-purple-medium">
                  Fazer login
                </Link>
              </p>
            </form>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
