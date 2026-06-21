import { API_CONFIG, getApiBaseUrl } from '../config/api.config';

/**
 * Normalizes HTTP / network errors into user-friendly Error instances
 */
export const normalizeHttpError = (error, status = null) => {
  if (error?.name === 'AbortError') {
    return new Error('Request timed out. Please check your internet connection.');
  }

  if (error instanceof Error && /network request failed|fetch failed|failed to fetch/i.test(error.message)) {
    return new Error('Unable to connect to Cash Odds backend at cashodds.devtz.com. Please check your network connection.');
  }

  if (typeof error === 'string') {
    return new Error(error);
  }

  return error || new Error(`Request failed${status ? ` (Status ${status})` : ''}`);
};

/**
 * Safe JSON parser for responses
 */
const parseResponseData = async (response) => {
  const contentType = response.headers.get('content-type') || '';
  const text = await response.text();
  
  if (!text || text.trim() === '') {
    return null;
  }

  if (contentType.includes('application/json') || text.startsWith('{') || text.startsWith('[')) {
    try {
      return JSON.parse(text);
    } catch {
      // Fall back to text if json parsing fails
    }
  }

  return text;
};

/**
 * Unified HTTP Request Handler with timeout and token authorization
 */
export const httpRequest = async (endpoint, options = {}) => {
  const {
    method = 'GET',
    body,
    token,
    headers = {},
    timeoutMs = API_CONFIG.TIMEOUT_MS,
    ...restOptions
  } = options;

  const baseUrl = getApiBaseUrl();
  const url = endpoint.startsWith('http') ? endpoint : `${baseUrl}${endpoint.startsWith('/') ? '' : '/'}${endpoint}`;

  const requestHeaders = {
    ...API_CONFIG.HEADERS,
    ...headers,
  };

  if (token) {
    requestHeaders.Authorization = `Bearer ${token}`;
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  const fetchOptions = {
    method,
    headers: requestHeaders,
    signal: controller.signal,
    ...restOptions,
  };

  if (body !== undefined) {
    fetchOptions.body = typeof body === 'string' ? body : JSON.stringify(body);
  }

  try {
    const response = await fetch(url, fetchOptions);
    clearTimeout(timeoutId);

    const data = await parseResponseData(response);

    if (!response.ok) {
      const errorMessage =
        (typeof data === 'object' && data?.message) ||
        (typeof data === 'object' && data?.error) ||
        `Request failed with status ${response.status}`;
      
      const customError = new Error(errorMessage);
      customError.status = response.status;
      customError.data = data;
      throw customError;
    }

    return data;
  } catch (err) {
    clearTimeout(timeoutId);
    throw normalizeHttpError(err);
  }
};
