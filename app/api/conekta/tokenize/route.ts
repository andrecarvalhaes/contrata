import { NextRequest, NextResponse } from 'next/server';

const CONEKTA_API_URL = 'https://api.conekta.io';
const CONEKTA_API_VERSION = '2.0.0';

export async function POST(request: NextRequest) {
  try {
    const cardData = await request.json();

    const privateKey = process.env.CONEKTA_PRIVATE_KEY;
    if (!privateKey) {
      return NextResponse.json(
        { error: 'Configuração do Conekta não encontrada' },
        { status: 500 }
      );
    }

    const authToken = Buffer.from(privateKey + ':').toString('base64');

    const response = await fetch(`${CONEKTA_API_URL}/tokens`, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${authToken}`,
        'Accept': `application/vnd.conekta-v${CONEKTA_API_VERSION}+json`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        card: cardData
      })
    });

    if (!response.ok) {
      const error = await response.json();
      return NextResponse.json(
        { error: error.details?.[0]?.message || 'Erro ao tokenizar cartão' },
        { status: response.status }
      );
    }

    const token = await response.json();
    return NextResponse.json({ token: token.id });
  } catch (error: any) {
    console.error('Erro ao tokenizar cartão:', error);
    return NextResponse.json(
      { error: 'Erro interno ao processar solicitação' },
      { status: 500 }
    );
  }
}
