import Constants from 'expo-constants';
import { Platform } from 'react-native';

/**
 * Default Production Backend host & base URL
 */
export const DEFAULT_BACKEND_HOST = 'cashodds.devtz.com';
export const DEFAULT_API_BASE_URL = 'https://cashodds.devtz.com/api';

/**
 * Resolves the active API base URL taking into account:
 * 1. Environment variable (EXPO_PUBLIC_API_BASE_URL)
 * 2. Expo app.json extra configuration (apiBaseUrl)
 * 3. Default production URL (https://cashodds.devtz.com/api)
 */
export const getApiBaseUrl = () => {
  const envUrl = process.env.EXPO_PUBLIC_API_BASE_URL?.trim();
  if (envUrl) {
    return envUrl.replace(/\/$/, '');
  }

  const extraUrl = Constants.expoConfig?.extra?.apiBaseUrl;
  if (extraUrl && typeof extraUrl === 'string') {
    return extraUrl.replace(/\/$/, '');
  }

  return DEFAULT_API_BASE_URL;
};

export const API_CONFIG = {
  HOST: DEFAULT_BACKEND_HOST,
  BASE_URL: getApiBaseUrl(),
  TIMEOUT_MS: Number(process.env.EXPO_PUBLIC_API_TIMEOUT) || 15000,
  HEADERS: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
};
