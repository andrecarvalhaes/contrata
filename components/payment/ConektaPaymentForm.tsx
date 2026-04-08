'use client';

import { useState } from 'react';
import { CreditCard, Info } from 'lucide-react';
import { useAuthContext } from '@/components/providers/AuthProvider';

interface PaymentFormProps {
  amount: number;
  description: string;
  onSuccess?: (charge: unknown) => void;
  onError?: (error: string) => void;
}

/**
 * Formulário de pagamento Conekta.
 *
 * Nota: o processamento real do pagamento vai acontecer via Supabase
 * Edge Function (em construção). Enquanto isso, o submit apenas coleta
 * os dados e exibe aviso de "em breve".
 */
export default function ConektaPaymentForm({
  amount,
  description,
  onError,
}: PaymentFormProps) {
  const { isAuthenticated } = useAuthContext();
  const [cardData, setCardData] = useState({
    number: '',
    name: '',
    exp_month: '',
    exp_year: '',
    cvc: '',
  });
  const [aviso, setAviso] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated) {
      onError?.('Você precisa estar autenticado para realizar um pagamento');
      return;
    }
    setAviso(
      'O processamento de pagamentos estará disponível assim que a Edge Function da Conekta for publicada.'
    );
  };

  return (
    <div className="w-full max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <div className="flex items-center gap-2 mb-6">
        <CreditCard className="w-6 h-6 text-purple" />
        <h2 className="text-2xl font-bold text-gray-900">Pagamento</h2>
      </div>

      <div className="mb-4">
        <p className="text-gray-600">
          Valor: <span className="font-bold">R$ {(amount / 100).toFixed(2)}</span>
        </p>
        <p className="text-gray-600">{description}</p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Número do Cartão
            </label>
            <input
              type="text"
              value={cardData.number}
              onChange={(e) => setCardData({ ...cardData, number: e.target.value })}
              placeholder="1234 5678 9012 3456"
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-purple"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nome no Cartão
            </label>
            <input
              type="text"
              value={cardData.name}
              onChange={(e) => setCardData({ ...cardData, name: e.target.value })}
              placeholder="João Silva"
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-purple"
              required
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Mês</label>
              <input
                type="text"
                value={cardData.exp_month}
                onChange={(e) => setCardData({ ...cardData, exp_month: e.target.value })}
                placeholder="12"
                maxLength={2}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-purple"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Ano</label>
              <input
                type="text"
                value={cardData.exp_year}
                onChange={(e) => setCardData({ ...cardData, exp_year: e.target.value })}
                placeholder="26"
                maxLength={2}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-purple"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">CVV</label>
              <input
                type="text"
                value={cardData.cvc}
                onChange={(e) => setCardData({ ...cardData, cvc: e.target.value })}
                placeholder="123"
                maxLength={4}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-purple"
                required
              />
            </div>
          </div>
        </div>

        {aviso && (
          <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded flex items-start gap-2 text-sm text-amber-800">
            <Info className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <span>{aviso}</span>
          </div>
        )}

        <button
          type="submit"
          className="w-full mt-6 py-3 bg-purple text-white rounded font-medium hover:bg-purple-medium transition-colors"
        >
          Pagar
        </button>
      </form>
    </div>
  );
}
