export const constants = {
  PAGINATION: {
    DEFAULT_PAGE_SIZE: 10,
    MAX_PAGE_SIZE: 100,
  },
  DATE_FORMAT: 'MMM dd, yyyy',
  DATETIME_FORMAT: 'MMM dd, yyyy HH:mm',
  CURRENCY: {
    symbol: '₹',
    code: 'INR',
  },
  LOCAL_STORAGE_KEYS: {
    AUTH_TOKEN: 'pp_auth_token',
    USER_SETTINGS: 'pp_user_settings',
    SIDEBAR_STATE: 'pp_sidebar_state',
  }
} as const;
