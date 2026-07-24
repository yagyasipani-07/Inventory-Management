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

// Mock initial state
let mockCompanySettings: CompanySettings = {
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

let mockWarehouseSettings: WarehouseSettings = {
  warehouseName: "Main Warehouse",
  warehouseCode: "WH-MAIN-01",
  defaultLocation: "Zone A",
  workingHours: "09:00 AM - 06:00 PM",
  timezone: "Asia/Kolkata",
  defaultStockUnit: "Sheets",
  enableLowStockAlerts: true,
  enableStockReservation: false,
};

let mockPrintSettings: PrintSettings = {
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

let mockUserProfile: UserProfile = {
  name: "Admin User",
  email: "admin@parasplywoods.com",
  role: "Administrator",
  department: "Management",
  lastLogin: new Date().toISOString(),
};

// Simulate network delay
const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

export const settingsService = {
  getCompanySettings: async (): Promise<CompanySettings> => {
    await delay(300);
    return { ...mockCompanySettings };
  },
  
  updateCompanySettings: async (data: Partial<CompanySettings>): Promise<CompanySettings> => {
    await delay(500);
    mockCompanySettings = { ...mockCompanySettings, ...data };
    return { ...mockCompanySettings };
  },

  getWarehouseSettings: async (): Promise<WarehouseSettings> => {
    await delay(300);
    return { ...mockWarehouseSettings };
  },
  
  updateWarehouseSettings: async (data: Partial<WarehouseSettings>): Promise<WarehouseSettings> => {
    await delay(500);
    mockWarehouseSettings = { ...mockWarehouseSettings, ...data };
    return { ...mockWarehouseSettings };
  },

  getPrintSettings: async (): Promise<PrintSettings> => {
    await delay(300);
    return { ...mockPrintSettings };
  },
  
  updatePrintSettings: async (data: Partial<PrintSettings>): Promise<PrintSettings> => {
    await delay(500);
    mockPrintSettings = { ...mockPrintSettings, ...data };
    return { ...mockPrintSettings };
  },

  getUserProfile: async (): Promise<UserProfile> => {
    await delay(300);
    return { ...mockUserProfile };
  },
  
  updateUserProfile: async (data: Partial<UserProfile>): Promise<UserProfile> => {
    await delay(500);
    mockUserProfile = { ...mockUserProfile, ...data };
    return { ...mockUserProfile };
  },
};
