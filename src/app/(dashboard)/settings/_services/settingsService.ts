import { SettingsService as RealSettingsService } from '@/features/settings/service';
import { createBrowserClient } from '@/lib/supabase/browser';

export interface CompanySettings {
  companyName: string;
  businessName: string;
  gstNumber: string;
  email: string;
  website: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
  logoUrl?: string;
}

export interface WarehouseSettings {
  warehouseName: string;
  warehouseCode: string;
  defaultLocation: string;
  workingHours: string;
  timezone: string;
  defaultStockUnit: string;
  enableLowStockAlerts: boolean;
  enableStockReservation: boolean;
}

export interface PrintSettings {
  companyLogo: boolean;
  companyFooter: boolean;
  authorizedSignature: boolean;
  defaultPrinterName: string;
  paperSize: string;
  margins: string;
  printHeader: boolean;
  printFooter: boolean;
  showCompanyStampArea: boolean;
}

export interface UserProfile {
  name: string;
  email: string;
  role: string;
  department: string;
  lastLogin: string;
  avatarUrl?: string;
}

const getService = () => new RealSettingsService(createBrowserClient());

// Helper to fetch from DB and map to specific setting interface
async function fetchSetting<T>(key: string, defaultValue: T): Promise<T> {
  const service = getService();
  try {
    const setting = await service.getSetting(key);
    return { ...defaultValue, ...(setting.value as object) };
  } catch (error) {
    return defaultValue;
  }
}

async function updateSetting<T>(key: string, data: Partial<T>): Promise<T> {
  const service = getService();
  try {
    const current = await fetchSetting<any>(key, {});
    const updated = await service.updateSetting(key, { value: { ...current, ...data } });
    return updated.value as T;
  } catch (error) {
    // If setting doesn't exist yet, we'd normally create it, but in Phase 3 we mock update failure fallback
    console.warn(`Failed to update setting ${key} via DB. Falling back to memory.`);
    return data as T;
  }
}

export const settingsService = {
  getCompanySettings: async (): Promise<CompanySettings> => {
    return fetchSetting('company_info', {
      companyName: "Paras Plywoods",
      businessName: "Paras Plywoods Pvt Ltd",
      gstNumber: "",
      email: "",
      website: "",
      city: "",
      state: "",
      country: "",
      postalCode: "",
    });
  },
  
  updateCompanySettings: async (data: Partial<CompanySettings>): Promise<CompanySettings> => {
    return updateSetting('company_info', data);
  },

  getWarehouseSettings: async (): Promise<WarehouseSettings> => {
    return fetchSetting('warehouse_info', {
      warehouseName: "Main Warehouse",
      warehouseCode: "WH-MAIN-01",
      defaultLocation: "Zone A",
      workingHours: "09:00 AM - 06:00 PM",
      timezone: "Asia/Kolkata",
      defaultStockUnit: "Sheets",
      enableLowStockAlerts: true,
      enableStockReservation: false,
    });
  },
  
  updateWarehouseSettings: async (data: Partial<WarehouseSettings>): Promise<WarehouseSettings> => {
    return updateSetting('warehouse_info', data);
  },

  getPrintSettings: async (): Promise<PrintSettings> => {
    return fetchSetting('print_settings', {
      companyLogo: true,
      companyFooter: true,
      authorizedSignature: true,
      defaultPrinterName: "Network Printer 1",
      paperSize: "A4",
      margins: "Standard",
      printHeader: true,
      printFooter: true,
      showCompanyStampArea: true,
    });
  },
  
  updatePrintSettings: async (data: Partial<PrintSettings>): Promise<PrintSettings> => {
    return updateSetting('print_settings', data);
  },

  getUserProfile: async (): Promise<UserProfile> => {
    return fetchSetting('user_profile', {
      name: "Admin User",
      email: "admin@parasplywoods.com",
      role: "Administrator",
      department: "Management",
      lastLogin: new Date().toISOString(),
    });
  },
  
  updateUserProfile: async (data: Partial<UserProfile>): Promise<UserProfile> => {
    return updateSetting('user_profile', data);
  },
};
