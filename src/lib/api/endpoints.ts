export const endpoints = {
  products: {
    list: '/products',
    detail: (id: string) => `/products/${id}`,
  },
  customers: {
    list: '/customers',
    detail: (id: string) => `/customers/${id}`,
  },
  challans: {
    list: '/challans',
    detail: (id: string) => `/challans/${id}`,
  },
  import: {
    products: '/import',
  },
  audit: {
    list: '/audit',
  },
  suppliers: {
    list: '/suppliers',
    detail: (id: string) => `/suppliers/${id}`,
  },
  purchases: {
    list: '/purchases',
    detail: (id: string) => `/purchases/${id}`,
  }
} as const;
