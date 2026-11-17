import apiClient from './api';

export const paymentService = {
  createRazorpayOrder: async (amount, currency = 'INR') => {
    return {
      orderId: `order_${Date.now()}`,
      amount,
      currency,
    };
  },
  requestInstantPayout: async (amount) => {
    return apiClient.post('/payouts/instant', { amount });
  },
};

export default paymentService;
