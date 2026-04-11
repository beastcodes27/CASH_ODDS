// API Configuration
// Change this to your backend URL when deployed
const API_BASE_URL = 'http://localhost:3000/api';
// For production, use:
// const API_BASE_URL = 'https://your-domain.com/api';

// API Endpoints
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
  
  // User
  USER_PROFILE: `${API_BASE_URL}/users/profile`,
  
  // Purchases / Tips History
  PURCHASES: `${API_BASE_URL}/purchases`,
  MY_PURCHASES: `${API_BASE_URL}/purchases/my`,
  CHECK_PURCHASE: (tipId) => `${API_BASE_URL}/purchases/check/${tipId}`,
};

// Helper function for API calls
export const apiCall = async (endpoint, options = {}) => {
  const { token, ...fetchOptions } = options;
  
  const headers = {
    'Content-Type': 'application/json',
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
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Something went wrong');
    }
    
    return data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

// Imgbb Upload Configuration
export const IMGBB_CONFIG = {
  API_KEY: '3aa324878a27b8ebaea52aaa9b5aa01d',
  UPLOAD_URL: 'https://api.imgbb.com/1/upload',
};

// Upload image to imgbb
export const uploadToImgbb = async (imageUri) => {
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

    const result = await response.json();
    
    if (result.success) {
      return result.data.url;
    } else {
      throw new Error(result.error?.message || 'Upload failed');
    }
  } catch (error) {
    console.error('Imgbb upload error:', error);
    throw error;
  }
};
