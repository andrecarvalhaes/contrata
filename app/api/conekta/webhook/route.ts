import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebase/config';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

export async function POST(request: NextRequest) {
  try {
    const payload = await request.json();

    console.log('Webhook Conekta recebido:', payload.type);

    await addDoc(collection(db, 'conekta_webhooks'), {
      type: payload.type,
      data: payload.data,
      receivedAt: serverTimestamp()
    });

    switch (payload.type) {
      case 'charge.paid':
        await handleChargePaid(payload.data.object);
        break;
      case 'charge.declined':
        await handleChargeDeclined(payload.data.object);
        break;
      case 'charge.refunded':
        await handleChargeRefunded(payload.data.object);
        break;
      default:
        console.log('Evento não tratado:', payload.type);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Erro ao processar webhook:', error);
    return NextResponse.json(
      { error: 'Erro ao processar webhook' },
      { status: 500 }
    );
  }
}

async function handleChargePaid(charge: any) {
  console.log('Pagamento confirmado:', charge.id);

  await addDoc(collection(db, 'payments'), {
    chargeId: charge.id,
    customerId: charge.customer_info?.customer_id,
    amount: charge.amount / 100,
    currency: charge.currency,
    status: 'paid',
    paidAt: serverTimestamp()
  });
}

async function handleChargeDeclined(charge: any) {
  console.log('Pagamento recusado:', charge.id);

  await addDoc(collection(db, 'payments'), {
    chargeId: charge.id,
    customerId: charge.customer_info?.customer_id,
    amount: charge.amount / 100,
    currency: charge.currency,
    status: 'declined',
    declinedAt: serverTimestamp(),
    declineReason: charge.failure_message
  });
}

async function handleChargeRefunded(charge: any) {
  console.log('Pagamento reembolsado:', charge.id);

  await addDoc(collection(db, 'payments'), {
    chargeId: charge.id,
    customerId: charge.customer_info?.customer_id,
    amount: charge.amount / 100,
    currency: charge.currency,
    status: 'refunded',
    refundedAt: serverTimestamp()
  });
}
