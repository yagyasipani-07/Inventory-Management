import type { AxiosInstance, AxiosError, InternalAxiosRequestConfig, AxiosResponse } from 'axios';
import { ApiError, NetworkError, UnauthorizedError } from './errors';
import { constants } from '@/src/config';

export function setupInterceptors(axiosInstance: AxiosInstance) {
  // Request Interceptor
  axiosInstance.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
      // Setup Auth Token if we implement real auth later
      if (typeof window !== 'undefined') {
        const token = localStorage.getItem('auth_token');
        if (token && config.headers) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      }
      return config;
    },
    (error: AxiosError) => {
      return Promise.reject(error);
    }
  );

  // Response Interceptor
  axiosInstance.interceptors.response.use(
    (response: AxiosResponse) => {
      return response;
    },
    (error: AxiosError) => {
      if (!error.response) {
        // Network Error or Timeout
        throw new NetworkError(error.message);
      }

      const status = error.response.status;
      const data: any = error.response.data;
      const message = data?.error || data?.message || error.message;

      if (status === 401) {
        // Handle Unauthorized
        // e.g. dispatch event to clear local storage and redirect to login
        if (typeof window !== 'undefined') {
           localStorage.removeItem('auth_token');
           // window.location.href = '/login'; // Un-comment when auth is implemented
        }
        throw new UnauthorizedError(message);
      }

      throw new ApiError(message, status, data?.details, data?.code);
    }
  );
}
