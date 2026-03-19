'use client';

import { useState } from 'react';
import { useConekta } from '@/lib/hooks/useConekta';
import { useAuthContext } from '@/components/providers/AuthProvider';

interface PaymentFormProps {
  amount: number;
  description: string;
  onSuccess?: (charge: any) => void;
  onError?: (error: string) => void;
}

export default function ConektaPaymentForm({
  amount,
  description,
  onSuccess,
  onError
}: PaymentFormProps) {
  const { isAuthenticated } = useAuthContext();
  const { processCardPayment, generateOxxoPayment, generateSpeiPayment, loading, error } = useConekta();

  const [paymentMethod, setPaymentMethod] = useState<'card' | 'oxxo' | 'spei'>('card');
  const [cardData, setCardData] = useState({
    number: '',
    name: '',
    exp_month: '',
    exp_year: '',
    cvc: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isAuthenticated) {
      onError?.('Você precisa estar autenticado para realizar um pagamento');
      return;
    }

    try {
      let charge;

      if (paymentMethod === 'card') {
        charge = await processCardPayment(cardData, amount, description);
      } else if (paymentMethod === 'oxxo') {
        charge = await generateOxxoPayment(amount, description);
      } else {
        charge = await generateSpeiPayment(amount, description);
      }

      onSuccess?.(charge);
    } catch (err: any) {
      onError?.(err.message);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6">Pagamento</h2>

      <div className="mb-4">
        <p className="text-gray-600">Valor: <span className="font-bold">R$ {(amount / 100).toFixed(2)}</span></p>
        <p className="text-gray-600">{description}</p>
      </div>

      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Método de Pagamento
        </label>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setPaymentMethod('card')}
            className={`flex-1 py-2 px-4 rounded ${
              paymentMethod === 'card'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700'
            }`}
          >
            Cartão
          </button>
          <button
            type="button"
            onClick={() => setPaymentMethod('oxxo')}
            className={`flex-1 py-2 px-4 rounded ${
              paymentMethod === 'oxxo'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700'
            }`}
          >
            OXXO
          </button>
          <button
            type="button"
            onClick={() => setPaymentMethod('spei')}
            className={`flex-1 py-2 px-4 rounded ${
              paymentMethod === 'spei'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700'
            }`}
          >
            SPEI
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        {paymentMethod === 'card' && (
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
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Mês
                </label>
                <input
                  type="text"
                  value={cardData.exp_month}
                  onChange={(e) => setCardData({ ...cardData, exp_month: e.target.value })}
                  placeholder="12"
                  maxLength={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Ano
                </label>
                <input
                  type="text"
                  value={cardData.exp_year}
                  onChange={(e) => setCardData({ ...cardData, exp_year: e.target.value })}
                  placeholder="26"
                  maxLength={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  CVV
                </label>
                <input
                  type="text"
                  value={cardData.cvc}
                  onChange={(e) => setCardData({ ...cardData, cvc: e.target.value })}
                  placeholder="123"
                  maxLength={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            </div>
          </div>
        )}

        {paymentMethod === 'oxxo' && (
          <div className="text-center py-4">
            <p className="text-gray-600">
              Você receberá um código de pagamento para pagar em qualquer loja OXXO.
            </p>
          </div>
        )}

        {paymentMethod === 'spei' && (
          <div className="text-center py-4">
            <p className="text-gray-600">
              Você receberá as instruções para realizar uma transferência bancária via SPEI.
            </p>
          </div>
        )}

        {error && (
          <div className="mt-4 p-3 bg-red-100 text-red-700 rounded">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full mt-6 py-3 bg-blue-600 text-white rounded font-medium hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? 'Processando...' : 'Pagar'}
        </button>
      </form>
    </div>
  );
}
