'use client'

import { useState } from "react";
import { Star, CheckCircle2, Clock, Phone, MessageCircle } from "lucide-react";

interface Service {
  name: string;
  price: number;
  duration: string;
}

interface Review {
  id: number;
  name: string;
  rating: number;
  date: string;
  comment: string;
  service: string;
}

interface ProviderDetailClientProps {
  services: Service[];
  reviews: Review[];
  provider: {
    name: string;
    phone: string;
    email: string;
  };
}

function StarRating({ value }: { value: number }) {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          className={`w-4 h-4 ${
            i <= Math.round(value)
              ? 'fill-amber-500 text-amber-500'
              : 'text-gray-300'
          }`}
        />
      ))}
    </div>
  )
}

export function ProviderDetailClient({ services, reviews, provider }: ProviderDetailClientProps) {
  const [selectedService, setSelectedService] = useState<number | null>(null)
  const [showContactModal, setShowContactModal] = useState(false)

  return (
    <>
      {/* Serviços */}
      <div className="bg-white rounded-2xl p-5 sm:p-6 shadow-sm border border-gray-200">
        <h2 className="text-xl font-display font-bold text-gray-900 mb-4">
          Serviços Oferecidos
        </h2>
        <div className="space-y-3">
          {services.map((service, index) => (
            <div
              key={index}
              className={`border rounded-xl p-4 transition-all cursor-pointer ${
                selectedService === index
                  ? 'border-purple bg-purple/5'
                  : 'border-gray-200 hover:border-purple/50'
              }`}
              onClick={() => setSelectedService(selectedService === index ? null : index)}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 mb-1">{service.name}</h3>
                  <div className="flex items-center gap-3 text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {service.duration}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs text-gray-500 mb-1">A partir de</div>
                  <div className="text-xl font-bold text-purple">
                    R$ {service.price}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Avaliações */}
      <div className="bg-white rounded-2xl p-5 sm:p-6 shadow-sm border border-gray-200">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-display font-bold text-gray-900">
            Avaliações de Clientes
          </h2>
        </div>

        <div className="space-y-4">
          {reviews.map((review) => (
            <div key={review.id} className="border-b border-gray-100 pb-4 last:border-0 last:pb-0">
              <div className="flex items-start justify-between gap-4 mb-2">
                <div>
                  <div className="font-semibold text-gray-900">{review.name}</div>
                  <div className="text-xs text-gray-500">{review.date}</div>
                </div>
                <StarRating value={review.rating} />
              </div>
              <p className="text-gray-700 text-sm leading-relaxed mb-2">{review.comment}</p>
              <div className="text-xs text-purple font-medium">Serviço: {review.service}</div>
            </div>
          ))}
        </div>

        <button className="w-full mt-4 py-2 text-purple font-medium hover:bg-purple/5 rounded-lg transition-colors">
          Ver todas as avaliações
        </button>
      </div>

      {/* Sidebar Actions */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <button
          onClick={() => setShowContactModal(true)}
          className="w-full py-3 bg-purple text-white rounded-lg font-medium hover:bg-purple-medium transition-colors mb-2"
        >
          Solicitar Orçamento
        </button>
        <button className="w-full py-3 border-2 border-purple text-purple rounded-lg font-medium hover:bg-purple/5 transition-colors">
          Agendar Visita
        </button>
      </div>

      {/* CTAs Mobile/Desktop */}
      <div className="flex sm:flex-col gap-2 mb-4">
        <button
          onClick={() => setShowContactModal(true)}
          className="flex-1 sm:flex-initial px-6 py-3 bg-purple text-white rounded-lg font-medium hover:bg-purple-medium transition-colors flex items-center justify-center gap-2"
        >
          <MessageCircle className="w-5 h-5" />
          Solicitar Orçamento
        </button>
        <button className="px-6 py-3 border-2 border-purple text-purple rounded-lg font-medium hover:bg-purple/5 transition-colors flex items-center justify-center gap-2">
          <Phone className="w-5 h-5" />
          Ligar
        </button>
      </div>

      {/* Modal de Contato */}
      {showContactModal && (
        <div className="fixed inset-0 z-[200] bg-black/50 flex items-center justify-center p-4" onClick={() => setShowContactModal(false)}>
          <div
            className="bg-white rounded-2xl p-6 max-w-md w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-xl font-display font-bold text-gray-900 mb-4">
              Solicitar Orçamento
            </h3>
            <p className="text-gray-600 mb-6">
              Preencha os dados abaixo para receber um orçamento de {provider.name}
            </p>

            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Serviço desejado
                </label>
                <select className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-purple">
                  <option>Selecione um serviço</option>
                  {services.map((service, index) => (
                    <option key={index} value={service.name}>{service.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Descrição do problema
                </label>
                <textarea
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-purple resize-none"
                  placeholder="Descreva o que precisa..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Data preferencial
                </label>
                <input
                  type="date"
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-purple"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowContactModal(false)}
                  className="flex-1 py-3 border-2 border-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 bg-purple text-white rounded-lg font-medium hover:bg-purple-medium transition-colors"
                >
                  Enviar Solicitação
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}
