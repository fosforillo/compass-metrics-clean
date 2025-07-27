import { MercadoPagoConfig, Preference, Preapproval } from 'mercadopago';

// Configuración de Mercado Pago
const client = new MercadoPagoConfig({
  accessToken: import.meta.env.VITE_MERCADOPAGO_ACCESS_TOKEN || '',
  options: {
    timeout: 5000,
  }
});

export interface PaymentItem {
  title: string;
  quantity: number;
  unit_price: number;
  currency_id: string;
}

export interface PaymentData {
  items: PaymentItem[];
  payer: {
    email: string;
    name?: string;
  };
  back_urls: {
    success: string;
    failure: string;
    pending: string;
  };
  auto_return: 'approved' | 'all';
  external_reference?: string;
}

export const createPaymentPreference = async (paymentData: PaymentData) => {
  try {
    const preference = new Preference(client);
    
    const preferenceData = {
      items: paymentData.items,
      payer: paymentData.payer,
      back_urls: paymentData.back_urls,
      auto_return: paymentData.auto_return,
      external_reference: paymentData.external_reference,
      notification_url: `${window.location.origin}/api/mercadopago/webhook`,
    };

    const result = await preference.create({ body: preferenceData });
    return result;
  } catch (error) {
    throw error;
  }
};

export interface SubscriptionData {
  preapproval_plan_id: string;
  payer: {
    email: string;
    name?: string;
  };
  back_urls: {
    success: string;
    failure: string;
    pending: string;
  };
  external_reference?: string;
  reason?: string;
}

export const createSubscriptionPreapproval = async (subscriptionData: SubscriptionData) => {
  try {
    const preapproval = new Preapproval(client);
    
    const preapprovalData = {
      preapproval_plan_id: subscriptionData.preapproval_plan_id,
      reason: subscriptionData.reason || 'Suscripción mensual CompassMetrics',
      payer_email: subscriptionData.payer.email,
      back_url: subscriptionData.back_urls.success,
      external_reference: subscriptionData.external_reference,
    };
    const result = await preapproval.create({ body: preapprovalData });
    return result;
  } catch (error) {
    throw error;
  }
};

export const getPaymentStatus = async (paymentId: string) => {
  try {
    // Aquí implementarías la lógica para verificar el estado del pago
    // usando la API de Mercado Pago
    const response = await fetch(`/api/mercadopago/payment/${paymentId}`);
    return await response.json();
  } catch (error) {
    throw error;
  }
};