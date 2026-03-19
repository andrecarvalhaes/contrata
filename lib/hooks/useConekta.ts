import { useState } from 'react';
import { useAuth } from './useAuth';

export interface ConektaCardData {
  number: string;
  name: string;
  exp_month: string;
  exp_year: string;
  cvc: string;
}

export interface ConektaTokenResponse {
  id: string;
  object: string;
  used: boolean;
}

export const useConekta = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const tokenizeCard = async (cardData: ConektaCardData): Promise<string> => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/conekta/tokenize', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(cardData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erro ao tokenizar cartão');
      }

      const data = await response.json();
      return data.token;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const createCharge = async (data: {
    amount: number;
    description: string;
    paymentMethod: {
      type: 'card' | 'oxxo_cash' | 'spei';
      token_id?: string;
    };
  }) => {
    if (!user) {
      throw new Error('Usuário não autenticado');
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/conekta/charge', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...data,
          firebaseUid: user.uid
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erro ao processar pagamento');
      }

      const charge = await response.json();
      return charge;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const processCardPayment = async (
    cardData: ConektaCardData,
    amount: number,
    description: string
  ) => {
    try {
      const token = await tokenizeCard(cardData);

      const charge = await createCharge({
        amount,
        description,
        paymentMethod: {
          type: 'card',
          token_id: token
        }
      });

      return charge;
    } catch (err: any) {
      throw err;
    }
  };

  const generateOxxoPayment = async (amount: number, description: string) => {
    return await createCharge({
      amount,
      description,
      paymentMethod: {
        type: 'oxxo_cash'
      }
    });
  };

  const generateSpeiPayment = async (amount: number, description: string) => {
    return await createCharge({
      amount,
      description,
      paymentMethod: {
        type: 'spei'
      }
    });
  };

  return {
    loading,
    error,
    tokenizeCard,
    createCharge,
    processCardPayment,
    generateOxxoPayment,
    generateSpeiPayment
  };
};
