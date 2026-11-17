// ============================================
// API CLIENT – Placeholder for future backend
// ============================================
// This file is a clearly marked placeholder.
// Replace these mock functions with real API calls
// when the backend is ready.
//
// IMPORTANT: Do not put secrets or API keys here.
// Real authentication, payments, notifications,
// and data persistence must be handled by the backend.
// ============================================

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

// Simulates network delay for demo realism
function simulateDelay(ms = 500) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Placeholder API client
const apiClient = {
  async get(endpoint) {
    await simulateDelay();
    console.log(`[Mock API] GET ${API_BASE_URL}${endpoint}`);
    return { data: null, status: 200 };
  },

  async post(endpoint, data) {
    await simulateDelay();
    console.log(`[Mock API] POST ${API_BASE_URL}${endpoint}`, data);
    return { data: null, status: 201 };
  },

  async put(endpoint, data) {
    await simulateDelay();
    console.log(`[Mock API] PUT ${API_BASE_URL}${endpoint}`, data);
    return { data: null, status: 200 };
  },

  async delete(endpoint) {
    await simulateDelay();
    console.log(`[Mock API] DELETE ${API_BASE_URL}${endpoint}`);
    return { data: null, status: 200 };
  },
};

export default apiClient;

