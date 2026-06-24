import { API_CONFIG, getApiBaseUrl } from '../config/api.config';

export const healthService = {
  /**
   * Ping backend to verify connectivity with cashodds.devtz.com
   */
  async checkBackendHealth(timeoutMs = 5000) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);

    try {
      const response = await fetch(getApiBaseUrl(), {
        method: 'HEAD',
        signal: controller.signal,
      });
      clearTimeout(timer);
      return response.ok || response.status < 500;
    } catch {
      clearTimeout(timer);
      return false;
    }
  },

  /**
   * Get current backend host name
   */
  getBackendHost() {
    return API_CONFIG.HOST;
  },

  /**
   * Get configured API base URL
   */
  getApiBaseUrl() {
    return getApiBaseUrl();
  },
};
