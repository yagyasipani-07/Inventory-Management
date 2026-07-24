import { apiClient, endpoints } from '@/src/lib/api';

export type CustomerStatus = 'Active' | 'Inactive' | 'New';

export interface Customer {
  id: string;
  name: string;
  city: string;
  preferredTransport: string;
  status: CustomerStatus;
  totalChallans: number;
  lastDispatch: string | null;
  notes?: string;
  createdAt: string;
}

export type CustomerFormData = Omit<Customer, 'id' | 'totalChallans' | 'lastDispatch' | 'createdAt'>;

function mapToUiCustomer(dbCustomer: any): Customer {
  return {
    id: dbCustomer.id,
    name: dbCustomer.name || 'Unknown',
    city: dbCustomer.city || 'N/A',
    preferredTransport: dbCustomer.preferredTransport || 'N/A',
    status: 'Active', // Mocked as DB doesn't have status yet
    totalChallans: 0, // Mocked as DB doesn't return count directly yet
    lastDispatch: null, // Mocked
    notes: dbCustomer.address || '',
    createdAt: dbCustomer.createdAt,
  };
}

export const customerService = {
  async getCustomers(): Promise<Customer[]> {
    const response = await apiClient.get(endpoints.customers.list);
    return response.data.map(mapToUiCustomer);
  },

  async getCustomer(id: string): Promise<Customer> {
    // Backend lacks a GET /api/customers/:id endpoint, so we fetch all and filter
    const response = await apiClient.get(endpoints.customers.list);
    const customer = response.data.find((c: any) => c.id === id);
    if (!customer) throw new Error(`Customer with id ${id} not found`);
    return mapToUiCustomer(customer);
  },

  async createCustomer(data: CustomerFormData): Promise<Customer> {
    const payload = {
      name: data.name,
      city: data.city,
      preferredTransport: data.preferredTransport,
      address: data.notes,
    };
    const response = await apiClient.post(endpoints.customers.list, payload);
    return mapToUiCustomer(response.data);
  },

  async updateCustomer(id: string, data: CustomerFormData): Promise<Customer> {
    console.warn(`Update customer ${id} is not supported by backend yet, simulating...`);
    const c = await this.getCustomer(id);
    return { ...c, ...data };
  },

  async deleteCustomer(id: string): Promise<void> {
    console.warn(`Delete customer ${id} is not supported by backend yet, simulating...`);
  },
};
