import type { Metadata } from 'next'
import { Outfit, Montserrat } from 'next/font/google'
import './globals.css'
import { Providers } from './providers'
import { BackgroundEffects } from '@/components/BackgroundEffects'

const outfit = Outfit({
  weight: ['300', '400', '500', '600', '700', '800', '900'],
  subsets: ['latin'],
  variable: '--font-outfit',
})

const montserrat = Montserrat({
  weight: ['300', '400', '500', '600', '700', '800'],
  subsets: ['latin'],
  variable: '--font-montserrat',
})

export const metadata: Metadata = {
  title: 'Conekta — Você descreve. A gente conecta.',
  description: 'O marketplace que conecta postos de combustível aos melhores fornecedores de serviços especializados.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR" className="scroll-smooth">
      <body className={`${outfit.variable} ${montserrat.variable} font-body bg-white text-gray-900 overflow-x-hidden antialiased`}>
        <BackgroundEffects />
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}
