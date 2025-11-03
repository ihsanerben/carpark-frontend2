
import axios from 'axios';

// Eski: const API_BASE_URL = "http://localhost:8080/api/v1/parking";

// YENİ VE DOĞRU YAKLAŞIM: Ortam değişkenini kullan
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8080/api/v1/parking";


const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const parkingApiService = {
  
  getDashboardStats() {
    return apiClient.get('/dashboard');
  },

  checkIn(licensePlate) {
    return apiClient.post('/checkin', { licensePlate: licensePlate });
  },

  checkOut(licensePlate) {
    return apiClient.put(`/checkout/${licensePlate}`);
  },

  getCurrentlyParked() {
    return apiClient.get('/current');
  }
};
