import axios from 'axios';
import { appConfig } from '@/src/config';
import { setupInterceptors } from './interceptors';

// Create a configured Axios instance
export const apiClient = axios.create({
  baseURL: appConfig.apiUrl || '/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Apply interceptors for auth and error handling
setupInterceptors(apiClient);

export default apiClient;
