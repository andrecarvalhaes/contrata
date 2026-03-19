'use client'

import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'
import { useState } from 'react'

export default function SejaFornecedorPage() {
  const [formData, setFormData] = useState({
    companyName: '',
    cnpj: '',
    responsibleName: '',
    email: '',
    phone: '',
    services: [] as string[],
    city: '',
    state: '',
  })

  const servicesList = [
    'Inspeções Técnicas',
    'Manutenção em Tanques',
    'Manutenção em Bombas',
    'Manutenção em Dispensers',
    'Serviço Elétrico',
    'Manutenção em Automação',
    'Controle de Qualidade',
    'Serviço Civil',
  ]

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: Implementar lógica de cadastro de fornecedor
    console.log('Cadastro Fornecedor:', formData)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const toggleService = (service: string) => {
    setFormData({
      ...formData,
      services: formData.services.includes(service)
        ? formData.services.filter((s) => s !== service)
        : [...formData.services, service],
    })
  }

  return (
    <>
      <Navbar />
      <main className="relative z-[1] min-h-screen pt-[120px] pb-20 px-6">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white/80 backdrop-blur-sm border border-gray-200 rounded-3xl p-8 shadow-xl">
            <h1 className="font-display text-3xl font-bold text-gray-900 mb-2">
              Seja um <span className="text-purple">Fornecedor</span>
            </h1>
            <p className="text-gray-600 mb-8">
              Cadastre sua empresa e comece a receber solicitações de serviços
            </p>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="md:col-span-2">
                  <label htmlFor="companyName" className="block text-sm font-semibold text-gray-700 mb-2">
                    Nome da Empresa
                  </label>
                  <input
                    id="companyName"
                    name="companyName"
                    type="text"
                    value={formData.companyName}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-white border border-gray-300 rounded-full text-gray-900 outline-none transition-all focus:border-purple focus:shadow-[0_0_0_4px_rgba(98,57,150,0.15)] placeholder:text-gray-400"
                    placeholder="Sua Empresa Ltda"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="cnpj" className="block text-sm font-semibold text-gray-700 mb-2">
                    CNPJ
                  </label>
                  <input
                    id="cnpj"
                    name="cnpj"
                    type="text"
                    value={formData.cnpj}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-white border border-gray-300 rounded-full text-gray-900 outline-none transition-all focus:border-purple focus:shadow-[0_0_0_4px_rgba(98,57,150,0.15)] placeholder:text-gray-400"
                    placeholder="00.000.000/0000-00"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="responsibleName" className="block text-sm font-semibold text-gray-700 mb-2">
                    Nome do Responsável
                  </label>
                  <input
                    id="responsibleName"
                    name="responsibleName"
                    type="text"
                    value={formData.responsibleName}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-white border border-gray-300 rounded-full text-gray-900 outline-none transition-all focus:border-purple focus:shadow-[0_0_0_4px_rgba(98,57,150,0.15)] placeholder:text-gray-400"
                    placeholder="João Silva"
                    required
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
                    placeholder="contato@empresa.com"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-semibold text-gray-700 mb-2">
                    Telefone
                  </label>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-white border border-gray-300 rounded-full text-gray-900 outline-none transition-all focus:border-purple focus:shadow-[0_0_0_4px_rgba(98,57,150,0.15)] placeholder:text-gray-400"
                    placeholder="(11) 99999-9999"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="city" className="block text-sm font-semibold text-gray-700 mb-2">
                    Cidade
                  </label>
                  <input
                    id="city"
                    name="city"
                    type="text"
                    value={formData.city}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-white border border-gray-300 rounded-full text-gray-900 outline-none transition-all focus:border-purple focus:shadow-[0_0_0_4px_rgba(98,57,150,0.15)] placeholder:text-gray-400"
                    placeholder="São Paulo"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="state" className="block text-sm font-semibold text-gray-700 mb-2">
                    Estado
                  </label>
                  <input
                    id="state"
                    name="state"
                    type="text"
                    value={formData.state}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-white border border-gray-300 rounded-full text-gray-900 outline-none transition-all focus:border-purple focus:shadow-[0_0_0_4px_rgba(98,57,150,0.15)] placeholder:text-gray-400"
                    placeholder="SP"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Serviços Oferecidos
                </label>
                <div className="flex flex-wrap gap-2">
                  {servicesList.map((service) => (
                    <button
                      key={service}
                      type="button"
                      onClick={() => toggleService(service)}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                        formData.services.includes(service)
                          ? 'bg-purple text-white shadow-lg shadow-purple/30'
                          : 'bg-white text-gray-600 border border-gray-300 hover:border-purple'
                      }`}
                    >
                      {service}
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-purple text-white px-6 py-3.5 rounded-full text-base font-semibold hover:bg-purple-medium transition-all shadow-lg shadow-purple/30"
              >
                Enviar Cadastro
              </button>
            </form>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
