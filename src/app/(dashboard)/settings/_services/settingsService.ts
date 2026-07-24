import { constants } from '@/src/config';

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

// Default initial state
const defaultCompanySettings: CompanySettings = {
  companyName: "Paras Plywoods",
  businessName: "Paras Plywoods Pvt Ltd",
  gstNumber: "29ABCDE1234F1Z5",
  email: "admin@parasplywoods.com",
  website: "www.parasplywoods.com",
  city: "Bangalore",
  state: "Karnataka",
  country: "India",
  postalCode: "560001",
};

const defaultWarehouseSettings: WarehouseSettings = {
  warehouseName: "Main Warehouse",
  warehouseCode: "WH-MAIN-01",
  defaultLocation: "Zone A",
  workingHours: "09:00 AM - 06:00 PM",
  timezone: "Asia/Kolkata",
  defaultStockUnit: "Sheets",
  enableLowStockAlerts: true,
  enableStockReservation: false,
};

const defaultPrintSettings: PrintSettings = {
  companyLogo: true,
  companyFooter: true,
  authorizedSignature: true,
  defaultPrinterName: "Network Printer 1",
  paperSize: "A4",
  margins: "Standard",
  printHeader: true,
  printFooter: true,
  showCompanyStampArea: true,
};

const defaultUserProfile: UserProfile = {
  name: "Admin User",
  email: "admin@parasplywoods.com",
  role: "Administrator",
  department: "Management",
  lastLogin: new Date().toISOString(),
};

// Local storage helpers
const STORAGE_KEY = constants.LOCAL_STORAGE_KEYS.USER_SETTINGS;

function getStoredSettings() {
  if (typeof window === 'undefined') return null;
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored ? JSON.parse(stored) : null;
}

function saveSettings(key: string, data: any) {
  if (typeof window === 'undefined') return;
  const current = getStoredSettings() || {};
  current[key] = { ...(current[key] || {}), ...data };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(current));
  return current[key];
}

export const settingsService = {
  getCompanySettings: async (): Promise<CompanySettings> => {
    const stored = getStoredSettings();
    return stored?.company || defaultCompanySettings;
  },
  
  updateCompanySettings: async (data: Partial<CompanySettings>): Promise<CompanySettings> => {
    return saveSettings('company', data);
  },

  getWarehouseSettings: async (): Promise<WarehouseSettings> => {
    const stored = getStoredSettings();
    return stored?.warehouse || defaultWarehouseSettings;
  },
  
  updateWarehouseSettings: async (data: Partial<WarehouseSettings>): Promise<WarehouseSettings> => {
    return saveSettings('warehouse', data);
  },

  getPrintSettings: async (): Promise<PrintSettings> => {
    const stored = getStoredSettings();
    return stored?.print || defaultPrintSettings;
  },
  
  updatePrintSettings: async (data: Partial<PrintSettings>): Promise<PrintSettings> => {
    return saveSettings('print', data);
  },

  getUserProfile: async (): Promise<UserProfile> => {
    const stored = getStoredSettings();
    return stored?.profile || defaultUserProfile;
  },
  
  updateUserProfile: async (data: Partial<UserProfile>): Promise<UserProfile> => {
    return saveSettings('profile', data);
  },
};
