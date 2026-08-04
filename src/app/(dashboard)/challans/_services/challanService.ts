import { ChallanService as RealChallanService } from '@/features/challans/service';
import { createBrowserClient } from '@/lib/supabase/browser';

export type ChallanStatus = 'Draft' | 'Approved' | 'Ready' | 'Dispatched' | 'Cancelled';

export interface ChallanItem {
  id: string;
  productId: string;
  productName: string;
  productCode: string;
  productImagePath?: string | null;
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
  transportName?: string;
  vehicleNumber?: string;
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

export function encodeNotesAndTransport(notes?: string | null, transport?: string | null): string | null {
  const n = (notes || '').trim();
  const t = (transport || '').trim();
  if (!n && !t) return null;
  if (!t) return n;
  return JSON.stringify({ notes: n, transport: t });
}

export function decodeNotesAndTransport(dbNotes: string | null): { notes: string; transport: string } {
  if (!dbNotes) return { notes: '', transport: '' };
  const trimmed = dbNotes.trim();
  if (trimmed.startsWith('{') && trimmed.endsWith('}')) {
    try {
      const parsed = JSON.parse(trimmed);
      if (typeof parsed === 'object' && parsed !== null && ('notes' in parsed || 'transport' in parsed)) {
        return {
          notes: parsed.notes || '',
          transport: parsed.transport || '',
        };
      }
    } catch {
      // Not JSON, return as plain text notes
    }
  }
  return { notes: dbNotes, transport: '' };
}

function mapToUiChallan(dbChallan: any): Challan {
  const { notes, transport } = decodeNotesAndTransport(dbChallan.notes);
  const displayTransport = dbChallan.transport || transport || '';
  return {
    id: dbChallan.id,
    challanNumber: dbChallan.challan_number,
    customerId: dbChallan.customer_id,
    customerName: dbChallan.customers?.customer_name || 'Unknown',
    city: 'N/A', // Update later if city is added to customer
    transport: displayTransport,
    transportName: dbChallan.transport_name || '',
    vehicleNumber: dbChallan.vehicle_number || '',
    status: dbChallan.status as ChallanStatus,
    dispatchDate: dbChallan.dispatch_date,
    items: dbChallan.challan_items?.map((li: any) => ({
      id: li.id,
      productId: li.product_id,
      productName: li.products?.product_name || 'Product',
      productCode: li.products?.product_code || '',
      productImagePath: li.products?.product_image_path || null,
      // thickness and size are stored in products table numeric columns;
      // build a human-readable string for display in the print template
      thickness: li.products?.thickness != null ? `${li.products.thickness} mm` : '',
      size:
        li.products?.length != null && li.products?.width != null
          ? `${li.products.length} × ${li.products.width}`
          : '',
      quantity: li.quantity,
      rate: '',
      amount: '',
    })) || [],
    totalQuantity: dbChallan.challan_items?.reduce((acc: number, item: any) => acc + item.quantity, 0) || 0,
    notes,
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
      notes: encodeNotesAndTransport(data.notes, data.transport),
      items: data.items.map(i => ({
        product_id: i.productId,
        quantity: Number(i.quantity)
      }))
    });
    return mapToUiChallan(challan);
  },

  updateChallan: async (id: string, data: ChallanFormData): Promise<Challan> => {
    const service = getService();
    await service.updateChallan(id, {
      customer_id: data.customerId,
      notes: encodeNotesAndTransport(data.notes, data.transport),
      items: data.items.map(i => ({
        product_id: i.productId,
        quantity: Number(i.quantity)
      }))
    });
    const updated = await challanService.getChallan(id);
    if (!updated) throw new Error('Not found');
    return updated;
  },

  updateStatus: async (id: string, status: ChallanStatus, dispatchDate?: string | null): Promise<Challan> => {
    if (status === 'Ready') status = 'Approved';
    const service = getService();
    await service.updateChallanStatus(id, status, dispatchDate);
    const updated = await challanService.getChallan(id);
    if (!updated) throw new Error('Not found');
    return updated;
  },

  updateDispatchInfo: async (
    id: string,
    dispatchDate: string | null,
    transport: string,
    status?: ChallanStatus,
    transportName?: string,
    vehicleNumber?: string
  ): Promise<Challan> => {
    const existing = await challanService.getChallan(id);
    if (!existing) throw new Error('Challan not found');

    const newNotes = encodeNotesAndTransport(existing.notes, transport);
    const service = getService();
    await service.updateChallanDispatchInfo(id, {
      dispatch_date: dispatchDate,
      notes: newNotes,
      status: status || existing.status,
      transport,
      transport_name: transportName,
      vehicle_number: vehicleNumber,
    });
    const updated = await challanService.getChallan(id);
    if (!updated) throw new Error('Not found');
    return updated;
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

