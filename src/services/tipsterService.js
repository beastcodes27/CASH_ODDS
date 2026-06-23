import { httpRequest } from './httpClient';

export const tipsterService = {
  /**
   * Get all active tipsters
   */
  async getTipsters(token) {
    return httpRequest('/tipsters', {
      method: 'GET',
      token,
    });
  },

  /**
   * Get single tipster profile
   */
  async getTipsterProfile(id, token) {
    return httpRequest(`/tipsters/${id}`, {
      method: 'GET',
      token,
    });
  },

  /**
   * Follow tipster
   */
  async followTipster(id, token) {
    return httpRequest(`/tipsters/${id}/follow`, {
      method: 'POST',
      token,
    });
  },

  /**
   * Unfollow tipster
   */
  async unfollowTipster(id, token) {
    return httpRequest(`/tipsters/${id}/unfollow`, {
      method: 'POST',
      token,
    });
  },

  /**
   * Get list of followed tipsters
   */
  async getMyFollowing(token) {
    return httpRequest('/tipsters/my/following', {
      method: 'GET',
      token,
    });
  },

  /**
   * Submit verification application
   */
  async submitVerificationRequest(data, token) {
    return httpRequest('/verification-requests', {
      method: 'POST',
      body: data,
      token,
    });
  },

  /**
   * Get user's verification requests
   */
  async getMyVerificationRequests(token) {
    return httpRequest('/verification-requests/my', {
      method: 'GET',
      token,
    });
  },
};
