import { create } from 'zustand';

interface Vendor {
  id: string;
  name: string;
  slug: string;
  description?: string;
  status: 'PENDING' | 'APPROVED' | 'SUSPENDED';
  seller_type: 'RETAILER' | 'WHOLESALER';
  is_active: boolean;
}

interface VendorStore {
  vendor: Vendor | null;
  setVendor: (vendor: Vendor | null) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}

export const useVendorStore = create<VendorStore>((set) => ({
  vendor: null,
  setVendor: (vendor) => set({ vendor }),
  isLoading: false,
  setIsLoading: (isLoading) => set({ isLoading }),
}));

