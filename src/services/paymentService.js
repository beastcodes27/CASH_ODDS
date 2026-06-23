import { httpRequest } from './httpClient';

export const paymentService = {
  /**
   * Create FastLipa payment transaction
   */
  async createFastLipaTransaction(number, amount) {
    return httpRequest('/payments/fastlipa/create-transaction', {
      method: 'POST',
      body: {
        number,
        amount,
        name: 'Connection Client',
      },
    });
  },

  /**
   * Check status of FastLipa transaction
   */
  async checkFastLipaStatus(tranId) {
    return httpRequest(`/payments/fastlipa/status/${encodeURIComponent(tranId)}`, {
      method: 'GET',
    });
  },

  /**
   * Record tip purchase
   */
  async recordPurchase(purchaseData, token) {
    return httpRequest('/purchases', {
      method: 'POST',
      body: purchaseData,
      token,
    });
  },

  /**
   * Get purchases for logged in user
   */
  async getMyPurchases(token) {
    return httpRequest('/purchases/my', {
      method: 'GET',
      token,
    });
  },

  /**
   * Check if a specific tip is purchased
   */
  async checkPurchase(tipId, token) {
    return httpRequest(`/purchases/check/${tipId}`, {
      method: 'GET',
      token,
    });
  },
};
