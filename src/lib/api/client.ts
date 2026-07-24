import axios from 'axios';
import { apiConfig } from '@/src/config';
import { setupInterceptors } from './interceptors';

// Create a configured Axios instance
export const apiClient = axios.create({
  baseURL: apiConfig.baseURL,
  timeout: apiConfig.timeout,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Apply interceptors for auth and error handling
setupInterceptors(apiClient);

export default apiClient;
