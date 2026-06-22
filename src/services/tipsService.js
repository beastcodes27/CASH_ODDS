import { httpRequest } from './httpClient';

export const tipsService = {
  /**
   * Fetch all tips with optional filters (e.g. { is_premium: true, sport: 'football' })
   */
  async getTips(params = {}) {
    const query = new URLSearchParams();
    Object.entries(params).forEach(([key, val]) => {
      if (val !== undefined && val !== null) {
        query.append(key, val);
      }
    });
    const queryString = query.toString();
    const endpoint = `/tips${queryString ? `?${queryString}` : ''}`;
    return httpRequest(endpoint);
  },

  /**
   * Get single tip by ID
   */
  async getTipById(id, token) {
    return httpRequest(`/tips/${id}`, {
      method: 'GET',
      token,
    });
  },

  /**
   * Create a new tip (for verified tipsters)
   */
  async createTip(tipData, token) {
    return httpRequest('/tips', {
      method: 'POST',
      body: tipData,
      token,
    });
  },

  /**
   * Update tip status (won, lost, pending)
   */
  async updateTipStatus(id, status, token) {
    return httpRequest(`/tips/${id}/status`, {
      method: 'PATCH',
      body: { status },
      token,
    });
  },

  /**
   * Delete tip
   */
  async deleteTip(id, token) {
    return httpRequest(`/tips/${id}`, {
      method: 'DELETE',
      token,
    });
  },

  /**
   * Get current tipster's posted tips
   */
  async getMyTips(filter = 'all', token) {
    return httpRequest(`/my-tips?status=${filter}`, {
      method: 'GET',
      token,
    });
  },
};
