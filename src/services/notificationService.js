import { httpRequest } from './httpClient';

export const notificationService = {
  /**
   * Get user notifications
   */
  async getNotifications(token) {
    return httpRequest('/notifications', {
      method: 'GET',
      token,
    });
  },

  /**
   * Mark a single notification as read
   */
  async markAsRead(id, token) {
    return httpRequest(`/notifications/${id}/read`, {
      method: 'PATCH',
      token,
    });
  },

  /**
   * Mark all notifications as read
   */
  async markAllAsRead(token) {
    return httpRequest('/notifications/read-all', {
      method: 'POST',
      token,
    });
  },

  /**
   * Broadcast notification to followers
   */
  async broadcastNotification(data, token) {
    return httpRequest('/notifications/broadcast', {
      method: 'POST',
      body: data,
      token,
    });
  },
};
