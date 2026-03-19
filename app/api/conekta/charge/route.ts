import { NextRequest, NextResponse } from 'next/server';
import conektaClient from '@/lib/conekta/client';

export async function POST(request: NextRequest) {
  try {
    const { firebaseUid, amount, description, paymentMethod } = await request.json();

    if (!firebaseUid || !amount || !description || !paymentMethod) {
      return NextResponse.json(
        { error: 'Dados obrigatórios ausentes' },
        { status: 400 }
      );
    }

    const customerId = await conektaClient.getOrCreateCustomer(firebaseUid);

    const charge = await conektaClient.createCharge({
      customerId,
      amount: Math.round(amount * 100),
      description,
      paymentMethod
    });

    return NextResponse.json(charge);
  } catch (error: any) {
    console.error('Erro ao processar pagamento:', error);
    return NextResponse.json(
      { error: error.message || 'Erro ao processar pagamento' },
      { status: 500 }
    );
  }
}
