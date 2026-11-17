import apiClient from './api';
import { RECENT_BOOKINGS } from '../constants';

export const bookingService = {
  getBookings: async () => RECENT_BOOKINGS,
  updateStatus: async (id, status) => apiClient.put(`/bookings/${id}/status`, { status }),
  createBooking: async (data) => apiClient.post('/bookings', data),
};

export default bookingService;
