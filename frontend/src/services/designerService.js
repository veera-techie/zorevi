import apiClient from './api';
import { DESIGNER_PROFILE } from '../constants';

export const designerService = {
  getProfile: async () => DESIGNER_PROFILE,
  updateProfile: async (data) => apiClient.put('/designer/profile', data),
  getEarnings: async () => apiClient.get('/designer/earnings'),
};

export default designerService;
