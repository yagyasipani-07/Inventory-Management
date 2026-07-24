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

// Mock data store
let customers: Customer[] = [
  {
    id: 'CUST-001',
    name: 'Sharma Builders',
    city: 'Delhi',
    preferredTransport: 'Delhi Freight Carriers',
    status: 'Active',
    totalChallans: 15,
    lastDispatch: new Date(Date.now() - 2 * 86400000).toISOString(), // 2 days ago
    notes: 'Prioritize morning deliveries',
    createdAt: new Date('2023-01-15').toISOString(),
  },
  {
    id: 'CUST-002',
    name: 'Apex Constructions',
    city: 'Gurugram',
    preferredTransport: 'Haryana Logistics',
    status: 'Active',
    totalChallans: 8,
    lastDispatch: new Date(Date.now() - 5 * 86400000).toISOString(),
    notes: 'Gate pass required',
    createdAt: new Date('2023-03-20').toISOString(),
  },
  {
    id: 'CUST-003',
    name: 'National Timber',
    city: 'Noida',
    preferredTransport: 'FastTrack Transport',
    status: 'Inactive',
    totalChallans: 42,
    lastDispatch: new Date(Date.now() - 45 * 86400000).toISOString(), // 45 days ago
    createdAt: new Date('2022-11-10').toISOString(),
  },
  {
    id: 'CUST-004',
    name: 'Greenleaf Projects',
    city: 'Jaipur',
    preferredTransport: 'Rajasthan Roadways',
    status: 'New',
    totalChallans: 0,
    lastDispatch: null,
    notes: 'First order pending',
    createdAt: new Date().toISOString(),
  }
];

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const customerService = {
  async getCustomers(): Promise<Customer[]> {
    await delay(600);
    return [...customers];
  },

  async getCustomer(id: string): Promise<Customer> {
    await delay(300);
    const customer = customers.find((c) => c.id === id);
    if (!customer) {
      throw new Error(`Customer with id ${id} not found`);
    }
    return { ...customer };
  },

  async createCustomer(data: CustomerFormData): Promise<Customer> {
    await delay(800);
    const newCustomer: Customer = {
      ...data,
      id: `CUST-${String(customers.length + 1).padStart(3, '0')}`,
      totalChallans: 0,
      lastDispatch: null,
      createdAt: new Date().toISOString(),
    };
    customers = [newCustomer, ...customers];
    return { ...newCustomer };
  },

  async updateCustomer(id: string, data: CustomerFormData): Promise<Customer> {
    await delay(800);
    const index = customers.findIndex((c) => c.id === id);
    if (index === -1) {
      throw new Error(`Customer with id ${id} not found`);
    }
    const updatedCustomer = { ...customers[index], ...data };
    customers[index] = updatedCustomer;
    return { ...updatedCustomer };
  },

  async deleteCustomer(id: string): Promise<void> {
    await delay(800);
    const index = customers.findIndex((c) => c.id === id);
    if (index === -1) {
      throw new Error(`Customer with id ${id} not found`);
    }
    customers = customers.filter((c) => c.id !== id);
  },
};
