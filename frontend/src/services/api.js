const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://api.zorevi.com/v1';

export const apiClient = {
  get: async (endpoint) => {
    console.log(`[API GET] ${API_BASE_URL}${endpoint}`);
    return { success: true };
  },
  post: async (endpoint, data) => {
    console.log(`[API POST] ${API_BASE_URL}${endpoint}`, data);
    return { success: true, data };
  },
  put: async (endpoint, data) => {
    console.log(`[API PUT] ${API_BASE_URL}${endpoint}`, data);
    return { success: true, data };
  },
  delete: async (endpoint) => {
    console.log(`[API DELETE] ${API_BASE_URL}${endpoint}`);
    return { success: true };
  },
};

export default apiClient;
