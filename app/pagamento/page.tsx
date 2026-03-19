'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthContext } from '@/components/providers/AuthProvider';
import ConektaPaymentForm from '@/components/payment/ConektaPaymentForm';

export default function PagamentoPage() {
  const router = useRouter();
  const { isAuthenticated, loading: authLoading } = useAuthContext();
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [paymentData, setPaymentData] = useState<any>(null);

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center">
          <h1 className="text-3xl font-bold mb-4">Autenticação Necessária</h1>
          <p className="text-gray-600 mb-6">
            Você precisa estar logado para realizar um pagamento.
          </p>
          <button
            onClick={() => router.push('/login')}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Fazer Login
          </button>
        </div>
      </div>
    );
  }

  const handlePaymentSuccess = (charge: any) => {
    setPaymentData(charge);
    setPaymentSuccess(true);
  };

  const handlePaymentError = (error: string) => {
    alert(`Erro no pagamento: ${error}`);
  };

  if (paymentSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
          <div className="mb-6">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Pagamento Realizado!
            </h1>
            <p className="text-gray-600">
              Seu pagamento foi processado com sucesso.
            </p>
          </div>

          <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left">
            <h2 className="font-semibold text-gray-900 mb-3">Detalhes do Pagamento</h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">ID da Transação:</span>
                <span className="font-mono text-gray-900">{paymentData?.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Valor:</span>
                <span className="font-semibold text-gray-900">
                  R$ {(paymentData?.amount / 100).toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Status:</span>
                <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs font-medium">
                  {paymentData?.status}
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <button
              onClick={() => router.push('/marketplace')}
              className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Voltar ao Marketplace
            </button>
            <button
              onClick={() => {
                setPaymentSuccess(false);
                setPaymentData(null);
              }}
              className="w-full px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Fazer Outro Pagamento
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Finalizar Pagamento
          </h1>
          <p className="text-gray-600">
            Complete o pagamento de forma segura com Conekta
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold mb-4">Resumo do Pedido</h2>

            <div className="space-y-4">
              <div className="border-b pb-4">
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600">Serviço</span>
                  <span className="font-medium">Manutenção em Tanques</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600">Fornecedor</span>
                  <span className="font-medium">TankPro Serviços</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Prazo de entrega</span>
                  <span className="font-medium">5-7 dias úteis</span>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span>R$ 450,00</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Taxa de serviço</span>
                  <span>R$ 50,00</span>
                </div>
                <div className="flex justify-between text-lg font-bold border-t pt-2">
                  <span>Total</span>
                  <span className="text-blue-600">R$ 500,00</span>
                </div>
              </div>
            </div>

            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <h3 className="font-semibold text-blue-900 mb-2">Pagamento Seguro</h3>
              <p className="text-sm text-blue-800">
                Seus dados de pagamento são criptografados e processados de forma segura através do Conekta.
              </p>
            </div>
          </div>

          <div>
            <ConektaPaymentForm
              amount={50000}
              description="Serviço de Manutenção em Tanques - TankPro"
              onSuccess={handlePaymentSuccess}
              onError={handlePaymentError}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
