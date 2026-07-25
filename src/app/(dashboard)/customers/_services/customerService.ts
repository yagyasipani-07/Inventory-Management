import { CustomerService as RealCustomerService } from '@/features/customers/service';
import { createBrowserClient } from '@/lib/supabase/browser';
import { Customer as DBCustomer } from '@/features/customers/types';

export interface Customer {
  id: string;
  customerNumber: string;
  name: string;
  city: string;
  phone: string;
  totalChallans: number;
  lastDispatch: string | null;
  notes?: string;
  createdAt: string;
}

export type CustomerFormData = Omit<Customer, 'id' | 'totalChallans' | 'lastDispatch' | 'createdAt'>;

// Map DB model to UI model
function mapToUiCustomer(dbCustomer: DBCustomer): Customer {
  return {
    id: dbCustomer.id,
    customerNumber: dbCustomer.customer_number,
    name: dbCustomer.customer_name,
    city: 'N/A', // Assuming city isn't in DB yet or derived from address
    phone: dbCustomer.phone || '',
    totalChallans: 0, // Should be computed using a DB aggregation later
    lastDispatch: null,
    notes: dbCustomer.notes || '',
    createdAt: dbCustomer.created_at,
  };
}

const getService = () => new RealCustomerService(createBrowserClient());

export const customerService = {
  async getCustomers(): Promise<Customer[]> {
    const service = getService();
    const { data } = await service.getCustomers({});
    return data.map(mapToUiCustomer);
  },

  async getCustomer(id: string): Promise<Customer> {
    const service = getService();
    const customer = await service.getCustomer(id);
    return mapToUiCustomer(customer);
  },

  async createCustomer(data: CustomerFormData): Promise<Customer> {
    const service = getService();
    const customer = await service.createCustomer({
      customer_number: data.customerNumber,
      customer_name: data.name,
      phone: data.phone || null,
      notes: data.notes || null,
      contact_person: null,
      email: null,
      gst: null,
    });
    return mapToUiCustomer(customer);
  },

  async updateCustomer(id: string, data: CustomerFormData): Promise<Customer> {
    const service = getService();
    const customer = await service.updateCustomer(id, {
      customer_number: data.customerNumber,
      customer_name: data.name,
      phone: data.phone || null,
      notes: data.notes || null,
      contact_person: null,
      email: null,
      gst: null,
    });
    return mapToUiCustomer(customer);
  },

  async deleteCustomer(id: string): Promise<void> {
    const service = getService();
    await service.deleteCustomer(id);
  },
};
