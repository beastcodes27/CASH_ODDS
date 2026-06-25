import Constants from 'expo-constants';
import { Platform } from 'react-native';
import { DEFAULT_API_BASE_URL, getApiBaseUrl as configGetApiBaseUrl } from '../config/api.config';

/**
 * Resolve active API Base URL.
 * Defaults to production https://cashodds.devtz.com/api
 */
export const resolveApiBaseUrl = () => {
  return configGetApiBaseUrl();
};

export const API_BASE_URL = resolveApiBaseUrl();

// API Endpoints wired to cashodds.devtz.com backend
export const API_ENDPOINTS = {
  // Auth
  LOGIN: `${API_BASE_URL}/login`,
  REGISTER: `${API_BASE_URL}/register`,
  
  // Tips
  TIPS: `${API_BASE_URL}/tips`,
  TIP_DETAILS: (id) => `${API_BASE_URL}/tips/${id}`,
  TIP_STATUS: (id) => `${API_BASE_URL}/tips/${id}/status`,
  
  // Verification
  VERIFICATION_REQUESTS: `${API_BASE_URL}/verification-requests`,
  MY_VERIFICATION_REQUESTS: `${API_BASE_URL}/verification-requests/my`,
  VERIFICATION_REQUEST_STATUS: (id) => `${API_BASE_URL}/verification-requests/${id}/status`,
  
  // Tipsters
  TIPSTERS: `${API_BASE_URL}/tipsters`,
  TIPSTER_PROFILE: (id) => `${API_BASE_URL}/tipsters/${id}`,
  
  // Notifications
  NOTIFICATIONS: `${API_BASE_URL}/notifications`,
  NOTIFICATION_READ: (id) => `${API_BASE_URL}/notifications/${id}/read`,
  NOTIFICATIONS_READ_ALL: `${API_BASE_URL}/notifications/read-all`,
  NOTIFICATION_BROADCAST: `${API_BASE_URL}/notifications/broadcast`,
  
  // User
  USER_PROFILE: `${API_BASE_URL}/users/profile`,
  CHANGE_PASSWORD: `${API_BASE_URL}/users/change-password`,
  DELETE_ACCOUNT: `${API_BASE_URL}/users/delete`,
  
  // Purchases / Tips History
  PURCHASES: `${API_BASE_URL}/purchases`,
  MY_PURCHASES: `${API_BASE_URL}/purchases/my`,
  CHECK_PURCHASE: (tipId) => `${API_BASE_URL}/purchases/check/${tipId}`,
  FASTLIPA_CREATE_TRANSACTION: `${API_BASE_URL}/payments/fastlipa/create-transaction`,
  FASTLIPA_STATUS: (tranId) => `${API_BASE_URL}/payments/fastlipa/status/${encodeURIComponent(tranId)}`,
  
  // Tipster extension
  MY_TIPS: `${API_BASE_URL}/my-tips`,
  FOLLOW_TIPSTER: (id) => `${API_BASE_URL}/tipsters/${id}/follow`,
  UNFOLLOW_TIPSTER: (id) => `${API_BASE_URL}/tipsters/${id}/unfollow`,
  MY_FOLLOWING: `${API_BASE_URL}/tipsters/my/following`,
};

const parseJsonSafely = async (response) => {
  const text = await response.text();
  if (!text || text.trim() === '') {
    return null;
  }

  try {
    return JSON.parse(text);
  } catch (error) {
    throw new Error(`Invalid server response (${response.status})`);
  }
};

// Helper function for API calls
export const apiCall = async (endpoint, options = {}) => {
  const { token, ...fetchOptions } = options;
  
  const headers = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    ...fetchOptions.headers,
  };
  
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  
  try {
    const response = await fetch(endpoint, {
      ...fetchOptions,
      headers,
    });

    const data = await parseJsonSafely(response);
    
    if (!response.ok) {
      throw new Error(data?.message || data?.error || `Request failed with status ${response.status}`);
    }
    
    return data;
  } catch (error) {
    if (error instanceof Error && /network request failed|fetch failed|failed to fetch/i.test(error.message)) {
      throw new Error('Unable to connect to Cash Odds server at cashodds.devtz.com. Please check your internet connection.');
    }
    throw error;
  }
};

// Imgbb Upload Configuration
export const IMGBB_CONFIG = {
  API_KEY: process.env.EXPO_PUBLIC_IMGBB_API_KEY || '',
  UPLOAD_URL: 'https://api.imgbb.com/1/upload',
};

// Upload image to imgbb
export const uploadToImgbb = async (imageUri) => {
  if (!IMGBB_CONFIG.API_KEY) {
    throw new Error('Image upload is not configured');
  }

  const formData = new FormData();
  formData.append('image', {
    uri: imageUri,
    type: 'image/jpeg',
    name: `upload_${Date.now()}.jpg`,
  });
  formData.append('key', IMGBB_CONFIG.API_KEY);

  try {
    const response = await fetch(IMGBB_CONFIG.UPLOAD_URL, {
      method: 'POST',
      body: formData,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    const result = await parseJsonSafely(response);
    
    if (result && result.success) {
      return result.data.url;
    } else {
      throw new Error(result?.error?.message || 'Upload failed');
    }
  } catch (error) {
    throw error;
  }
};
