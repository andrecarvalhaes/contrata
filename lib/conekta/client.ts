import { doc, updateDoc, getDoc } from 'firebase/firestore';
import { db } from '../firebase/config';

const CONEKTA_API_URL = 'https://api.conekta.io';
const CONEKTA_API_VERSION = '2.0.0';

interface ConektaConfig {
  privateKey: string;
  publicKey: string;
}

export interface ConektaCustomer {
  id: string;
  name: string;
  email: string;
  phone?: string;
  payment_sources?: any[];
}

export interface ConektaCharge {
  id: string;
  amount: number;
  currency: string;
  status: string;
  payment_method: any;
}

class ConektaClient {
  private privateKey: string;
  public publicKey: string;

  constructor(config: ConektaConfig) {
    this.privateKey = config.privateKey;
    this.publicKey = config.publicKey;
  }

  private getHeaders() {
    const authToken = Buffer.from(this.privateKey + ':').toString('base64');
    return {
      'Authorization': `Basic ${authToken}`,
      'Accept': `application/vnd.conekta-v${CONEKTA_API_VERSION}+json`,
      'Content-Type': 'application/json'
    };
  }

  async createCustomer(data: {
    name: string;
    email: string;
    phone?: string;
    firebaseUid: string;
  }): Promise<ConektaCustomer> {
    try {
      const response = await fetch(`${CONEKTA_API_URL}/customers`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          phone: data.phone,
          metadata: {
            firebase_uid: data.firebaseUid
          }
        })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.details?.[0]?.message || 'Erro ao criar cliente Conekta');
      }

      const customer = await response.json();

      await updateDoc(doc(db, 'users', data.firebaseUid), {
        conektaCustomerId: customer.id,
        updatedAt: new Date()
      });

      return customer;
    } catch (error: any) {
      console.error('Erro ao criar cliente Conekta:', error);
      throw error;
    }
  }

  async getCustomer(customerId: string): Promise<ConektaCustomer> {
    try {
      const response = await fetch(`${CONEKTA_API_URL}/customers/${customerId}`, {
        method: 'GET',
        headers: this.getHeaders()
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.details?.[0]?.message || 'Erro ao buscar cliente');
      }

      return await response.json();
    } catch (error: any) {
      console.error('Erro ao buscar cliente Conekta:', error);
      throw error;
    }
  }

  async createCharge(data: {
    customerId: string;
    amount: number;
    currency?: string;
    description: string;
    paymentMethod: {
      type: 'card';
      token_id?: string;
    };
  }): Promise<ConektaCharge> {
    try {
      const response = await fetch(`${CONEKTA_API_URL}/charges`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify({
          amount: data.amount,
          currency: data.currency || 'BRL',
          description: data.description,
          customer_info: {
            customer_id: data.customerId
          },
          payment_method: data.paymentMethod
        })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.details?.[0]?.message || 'Erro ao processar pagamento');
      }

      return await response.json();
    } catch (error: any) {
      console.error('Erro ao criar cobrança:', error);
      throw error;
    }
  }

  async getOrCreateCustomer(firebaseUid: string): Promise<string> {
    try {
      const userDoc = await getDoc(doc(db, 'users', firebaseUid));
      const userData = userDoc.data();

      if (userData?.conektaCustomerId) {
        try {
          await this.getCustomer(userData.conektaCustomerId);
          return userData.conektaCustomerId;
        } catch (error) {
          console.log('Cliente Conekta não encontrado, criando novo...');
        }
      }

      const customer = await this.createCustomer({
        name: userData?.displayName || 'Usuário',
        email: userData?.email || '',
        phone: userData?.phone,
        firebaseUid
      });

      return customer.id;
    } catch (error: any) {
      console.error('Erro ao obter/criar cliente:', error);
      throw error;
    }
  }
}

const conektaClient = new ConektaClient({
  privateKey: process.env.CONEKTA_PRIVATE_KEY || '',
  publicKey: process.env.NEXT_PUBLIC_CONEKTA_PUBLIC_KEY || ''
});

export default conektaClient;
