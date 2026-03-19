import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'

export default function ConhecaPage() {
  return (
    <>
      <Navbar />
      <main className="relative z-[1] min-h-screen pt-[120px] pb-20 px-6">
        <div className="max-w-4xl mx-auto">
          <h1 className="font-display text-[clamp(36px,6vw,64px)] font-extrabold text-gray-900 mb-8">
            Conheça a <span className="text-purple">cone<span className="text-amber-500">k</span>ta</span>
          </h1>

          <div className="prose prose-lg max-w-none">
            <p className="text-xl text-gray-600 leading-relaxed mb-6">
              A plataforma que conecta postos de combustível aos melhores fornecedores de serviços especializados.
            </p>

            <h2 className="font-display text-3xl font-bold text-gray-900 mt-12 mb-4">
              Como funciona?
            </h2>
            <p className="text-gray-600 leading-relaxed mb-6">
              Simples e rápido. Você descreve o problema ou escolhe o serviço que precisa,
              e nós conectamos você aos fornecedores mais qualificados da sua região.
            </p>

            <h2 className="font-display text-3xl font-bold text-gray-900 mt-12 mb-4">
              Por que escolher a Conekta?
            </h2>
            <ul className="space-y-4 text-gray-600">
              <li className="flex items-start">
                <span className="text-purple font-bold mr-2">✓</span>
                <span>Fornecedores certificados e qualificados</span>
              </li>
              <li className="flex items-start">
                <span className="text-purple font-bold mr-2">✓</span>
                <span>Cotações rápidas e transparentes</span>
              </li>
              <li className="flex items-start">
                <span className="text-purple font-bold mr-2">✓</span>
                <span>Especialização em postos de combustível</span>
              </li>
              <li className="flex items-start">
                <span className="text-purple font-bold mr-2">✓</span>
                <span>Suporte em todas as etapas</span>
              </li>
            </ul>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
