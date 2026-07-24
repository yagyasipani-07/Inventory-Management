import { v4 as uuidv4 } from 'uuid';
import { Customer } from '../../customers/_services/customerService';
import { Product } from '../../inventory/_services/inventoryService';

export type ChallanStatus = 'Draft' | 'Approved' | 'Ready' | 'Dispatched' | 'Cancelled';

export interface ChallanItem {
  id: string;
  productId: string;
  productName: string;
  thickness: string;
  size: string;
  quantity: number;
  rate?: number | string;
  amount?: number | string;
}

export interface Challan {
  id: string;
  challanNumber: string;
  customerId: string;
  customerName: string;
  city: string;
  transport: string;
  status: ChallanStatus;
  dispatchDate: string | null;
  items: ChallanItem[];
  totalQuantity: number;
  notes?: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export type ChallanFormData = Omit<Challan, 'id' | 'challanNumber' | 'status' | 'createdBy' | 'createdAt' | 'updatedAt' | 'totalQuantity'>;

let challans: Challan[] = [
  {
    id: '1',
    challanNumber: 'CH-2023-001',
    customerId: 'CUST-001',
    customerName: 'Sharma Builders',
    city: 'Delhi',
    transport: 'Delhi Freight Carriers',
    status: 'Dispatched',
    dispatchDate: new Date(Date.now() - 2 * 86400000).toISOString(),
    items: [
      {
        id: 'i1',
        productId: '1',
        productName: 'MR Grade Plywood',
        thickness: '18mm',
        size: '8x4',
        quantity: 50,
        rate: '',
        amount: ''
      }
    ],
    totalQuantity: 50,
    notes: 'Prioritize morning delivery',
    createdBy: 'Admin',
    createdAt: new Date(Date.now() - 3 * 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 2 * 86400000).toISOString(),
  },
  {
    id: '2',
    challanNumber: 'CH-2023-002',
    customerId: 'CUST-002',
    customerName: 'A-One Interiors',
    city: 'Gurgaon',
    transport: 'Haryana Roadways',
    status: 'Draft',
    dispatchDate: null,
    items: [
      {
        id: 'i2',
        productId: '2',
        productName: 'BWR Grade Plywood',
        thickness: '12mm',
        size: '8x4',
        quantity: 100,
        rate: '',
        amount: ''
      }
    ],
    totalQuantity: 100,
    notes: 'Call before delivery',
    createdBy: 'Admin',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
];

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
let nextChallanNum = 3;

export const challanService = {
  getChallans: async (): Promise<Challan[]> => {
    await delay(600);
    return [...challans];
  },

  getChallan: async (id: string): Promise<Challan | undefined> => {
    await delay(400);
    return challans.find(c => c.id === id);
  },

  createChallan: async (data: ChallanFormData): Promise<Challan> => {
    await delay(800);
    
    const totalQuantity = data.items.reduce((sum, item) => sum + Number(item.quantity), 0);
    const numStr = nextChallanNum.toString().padStart(3, '0');
    nextChallanNum++;

    const newChallan: Challan = {
      id: uuidv4(),
      challanNumber: `CH-2023-${numStr}`,
      status: 'Draft',
      totalQuantity,
      createdBy: 'Current User',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      ...data,
    };

    challans = [newChallan, ...challans];
    return newChallan;
  },

  updateChallan: async (id: string, data: ChallanFormData): Promise<Challan> => {
    await delay(800);
    const index = challans.findIndex(c => c.id === id);
    if (index === -1) throw new Error('Challan not found');

    const totalQuantity = data.items.reduce((sum, item) => sum + Number(item.quantity), 0);

    const updatedChallan = {
      ...challans[index],
      ...data,
      totalQuantity,
      updatedAt: new Date().toISOString(),
    };

    challans = [
      ...challans.slice(0, index),
      updatedChallan,
      ...challans.slice(index + 1)
    ];

    return updatedChallan;
  },

  updateStatus: async (id: string, status: ChallanStatus): Promise<Challan> => {
    await delay(600);
    const index = challans.findIndex(c => c.id === id);
    if (index === -1) throw new Error('Challan not found');

    const updatedChallan = {
      ...challans[index],
      status,
      dispatchDate: status === 'Dispatched' ? new Date().toISOString() : challans[index].dispatchDate,
      updatedAt: new Date().toISOString(),
    };

    challans = [
      ...challans.slice(0, index),
      updatedChallan,
      ...challans.slice(index + 1)
    ];

    return updatedChallan;
  },

  deleteChallan: async (id: string): Promise<void> => {
    await delay(600);
    challans = challans.filter(c => c.id !== id);
  },
  
  duplicateChallan: async (id: string): Promise<Challan> => {
    await delay(800);
    const existing = challans.find(c => c.id === id);
    if (!existing) throw new Error('Challan not found');
    
    const numStr = nextChallanNum.toString().padStart(3, '0');
    nextChallanNum++;

    const newChallan: Challan = {
      ...existing,
      id: uuidv4(),
      challanNumber: `CH-2023-${numStr}`,
      status: 'Draft',
      dispatchDate: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    challans = [newChallan, ...challans];
    return newChallan;
  }
};
