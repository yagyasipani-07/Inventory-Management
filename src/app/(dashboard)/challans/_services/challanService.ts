import { ChallanService as RealChallanService } from '@/features/challans/service';
import { createBrowserClient } from '@/lib/supabase/browser';

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

export type ChallanFormData = Omit<Challan, 'id' | 'challanNumber' | 'status' | 'createdBy' | 'createdAt' | 'updatedAt' | 'totalQuantity' | 'dispatchDate'>;

const getService = () => new RealChallanService(createBrowserClient());

function mapToUiChallan(dbChallan: any): Challan {
  return {
    id: dbChallan.id,
    challanNumber: dbChallan.challan_number,
    customerId: dbChallan.customer_id,
    customerName: dbChallan.customers?.customer_name || 'Unknown',
    city: 'N/A', // Update later if city is added to customer
    transport: '', // Update later if transport is added
    status: dbChallan.status as ChallanStatus,
    dispatchDate: dbChallan.dispatch_date,
    items: dbChallan.challan_items?.map((li: any) => ({
      id: li.id,
      productId: li.product_id,
      productName: li.products?.product_name || 'Product',
      thickness: 'N/A', 
      size: 'N/A',
      quantity: li.quantity,
      rate: '',
      amount: '',
    })) || [],
    totalQuantity: dbChallan.challan_items?.reduce((acc: number, item: any) => acc + item.quantity, 0) || 0,
    notes: dbChallan.notes || '',
    createdBy: 'System User', // Map user_profiles later
    createdAt: dbChallan.created_at,
    updatedAt: dbChallan.updated_at,
  };
}

export const challanService = {
  getChallans: async (): Promise<Challan[]> => {
    const service = getService();
    const { data } = await service.getChallans({});
    return data.map(mapToUiChallan);
  },

  getChallan: async (id: string): Promise<Challan | undefined> => {
    try {
      const service = getService();
      const challan = await service.getChallan(id);
      return challan ? mapToUiChallan(challan) : undefined;
    } catch (error: any) {
      if (error?.status === 404 || error?.code === 'NOT_FOUND') return undefined;
      throw error;
    }
  },

  createChallan: async (data: ChallanFormData): Promise<Challan> => {
    const service = getService();
    const challan = await service.createDraftChallan({
      customer_id: data.customerId,
      notes: data.notes || null,
      items: data.items.map(i => ({
        product_id: i.productId,
        quantity: Number(i.quantity)
      }))
    });
    return mapToUiChallan(challan);
  },

  updateChallan: async (id: string, data: ChallanFormData): Promise<Challan> => {
    console.warn(`Full update for challan ${id} not fully supported by backend yet, simulating...`);
    const c = await challanService.getChallan(id);
    if (!c) throw new Error('Not found');
    return c;
  },

  updateStatus: async (id: string, status: ChallanStatus): Promise<Challan> => {
    // Currently only supporting Draft, Approved, Dispatched, Cancelled via DB
    if (status === 'Ready') status = 'Draft'; 
    const c = await challanService.getChallan(id);
    if (!c) throw new Error('Not found');
    // Using a simple mock update for UI purposes until Phase 4 workflows are connected
    return { ...c, status };
  },

  deleteChallan: async (id: string): Promise<void> => {
    const service = getService();
    await service.deleteChallan(id);
  },
  
  duplicateChallan: async (id: string): Promise<Challan> => {
    const existing = await challanService.getChallan(id);
    if (!existing) throw new Error('Challan not found');
    
    const { id: _id, challanNumber, status, dispatchDate, createdAt, updatedAt, createdBy, totalQuantity, ...formData } = existing;
    return challanService.createChallan(formData);
  }
};
