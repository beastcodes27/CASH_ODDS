import { httpRequest } from './httpClient';

export const authService = {
  /**
   * User login
   */
  async login(credentials) {
    return httpRequest('/login', {
      method: 'POST',
      body: credentials,
    });
  },

  /**
   * User registration
   */
  async register(userData) {
    return httpRequest('/register', {
      method: 'POST',
      body: userData,
    });
  },

  /**
   * Get authenticated user profile
   */
  async getProfile(token) {
    return httpRequest('/users/profile', {
      method: 'GET',
      token,
    });
  },

  /**
   * Change user password
   */
  async changePassword(passwords, token) {
    return httpRequest('/users/change-password', {
      method: 'POST',
      body: passwords,
      token,
    });
  },

  /**
   * Delete user account
   */
  async deleteAccount(token) {
    return httpRequest('/users/delete', {
      method: 'DELETE',
      token,
    });
  },
};
