import { constants } from '@/src/config';

export const tokenStorage = {
  getToken: (): string | null => {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(constants.LOCAL_STORAGE_KEYS.AUTH_TOKEN);
  },
  
  setToken: (token: string): void => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(constants.LOCAL_STORAGE_KEYS.AUTH_TOKEN, token);
  },

  clearToken: (): void => {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(constants.LOCAL_STORAGE_KEYS.AUTH_TOKEN);
  }
};
