'use client';

import { create } from 'zustand';
import { getApolloClient } from '@/lib/apollo/client';
import { CATEGORY_TREE, CREATE_PRODUCT, UPDATE_PRODUCT, DELETE_PRODUCT, SEARCH_PRODUCTS, PRODUCT_BY_ID } from '@/lib/api/products';
import { slugify } from '@/lib/utils';

export interface Category {
  id: string;
  name: string;
  children?: Category[];
}

export interface ProductOption {
  name: string;
  values: string[];
}

export interface ProductVariant {
  sku: string;
  price: number;
  stock: number;
  attributes: Record<string, string>;
}

export type ProductType = 
  | 'GENERAL'
  | 'BOOK'
  | 'EBOOK'
  | 'ELECTRONICS'
  | 'CLOTHING'
  | 'FOOD'
  | 'BEVERAGE'
  | 'HEALTH'
  | 'BEAUTY'
  | 'SPORTS'
  | 'TOYS'
  | 'AUTOMOTIVE'
  | 'HOME'
  | 'GARDEN'
  | 'PET'
  | 'JEWELRY'
  | 'ART'
  | 'MUSIC'
  | 'SOFTWARE'
  | 'SERVICE';

export interface ProductFormData {
  title: string;
  description: string;
  status: 'DRAFT' | 'ACTIVE' | 'ARCHIVED';
  categoryId: string;
  productType?: ProductType;
  isFeatured: boolean;
  isActive: boolean;
  trackInventory: boolean;
  allowBackorder: boolean;
  deliveryMinDays?: number;
  deliveryMaxDays?: number;
  weight?: number;
  weightUnit?: 'kg' | 'g';
  length?: number;
  width?: number;
  height?: number;
  dimensionUnit?: 'cm' | 'm';
  // Pickup location for driver collection
  pickupLocationId?: string;
  pickupLocationName?: string;
  pickupAddress?: string;
  pickupCity?: string;
  pickupProvince?: string;
  pickupPostalCode?: string;
  pickupCountry?: string;
  pickupInstructions?: string;
  // Return policy
  returnPolicyId?: string;
  returnPolicyName?: string;
  returnsAccepted?: boolean;
  returnPeriodDays?: number;
  returnConditions?: string[];
  restockingFeePct?: number;
  returnShippingPaidBy?: 'CUSTOMER' | 'VENDOR' | 'SHARED';
  // Book/eBook fields
  isbn?: string;
  author?: string;
  publisher?: string;
  publicationDate?: string;
  pages?: number;
  language?: string;
  // General fields
  brand?: string;
  model?: string;
  material?: string;
  // Food/Beverage fields
  expiryDate?: string;
  ingredients?: string;
  allergens?: string;
  // Care & warranty
  careInstructions?: string;
  // Warranty fields
  warrantyId?: string;
  warrantyName?: string;
  hasWarranty?: boolean;
  warrantyPeriod?: number;
  warrantyUnit?: 'months' | 'years';
  warrantyDetails?: string;
  // Electronics
  energyRating?: string;
  // Toys
  ageRating?: string;
  // Media
  artist?: string;
  genre?: string;
  format?: string;
  // Software
  platform?: string;
  licenseType?: string;
  // Service
  serviceDuration?: string;
  certification?: string;
  // Tags
  tags?: string[];
  // Available locations
  availableLocations?: string[];
  // Options & variants
  options: ProductOption[];
  variants: ProductVariant[];
  images: string[];
}

interface ProductState {
  // Data
  categories: Category[];
  products: any[];
  
  // Loading states
  isLoading: boolean;
  isSubmitting: boolean;
  isSaving: boolean;
  isDeleting: boolean;
  
  // Error state
  error: string | null;
  
  // Actions
  fetchCategories: () => Promise<void>;
  fetchProducts: (variables?: any) => Promise<void>;
  fetchProduct: (id: string) => Promise<any>;
  createProduct: (data: Partial<ProductFormData>) => Promise<string>;
  updateProduct: (id: string, data: Partial<ProductFormData>) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  clearError: () => void;
  clearProducts: () => void;
}

export const useProductStore = create<ProductState>((set, get) => ({
  // Initial state
  categories: [],
  products: [],
  isLoading: false,
  isSubmitting: false,
  isSaving: false,
  isDeleting: false,
  error: null,

  // Fetch categories
  async fetchCategories() {
    set({ isLoading: true, error: null });
    try {
      const client = getApolloClient();
      const { data } = await client.query({ 
        query: CATEGORY_TREE, 
        fetchPolicy: 'no-cache' 
      });
      set({ 
        categories: (data as any).categoryTree || [],
        isLoading: false 
      });
    } catch (e: any) {
      set({ 
        error: e?.message || 'Failed to fetch categories',
        isLoading: false 
      });
      throw e;
    }
  },

  // Fetch products
  async fetchProducts(variables = {}) {
    set({ isLoading: true, error: null, products: [] });
    try {
      const client = getApolloClient();
      const { data } = await client.query({ 
        query: SEARCH_PRODUCTS, 
        variables,
        fetchPolicy: 'no-cache' 
      });
      
      const payload = JSON.parse((data as any).searchProducts || '{}');
      const rows = Array.isArray(payload.items) ? payload.items : [];
      
      set({ 
        products: rows,
        isLoading: false 
      });
    } catch (e: any) {
      set({ 
        error: e?.message || 'Failed to fetch products',
        isLoading: false 
      });
      throw e;
    }
  },

  // Fetch single product
  async fetchProduct(id: string) {
    set({ isLoading: true, error: null });
    try {
      const client = getApolloClient();
      const { data } = await client.query({ 
        query: PRODUCT_BY_ID, 
        variables: { id },
        fetchPolicy: 'no-cache' 
      });
      
      const product = (data as any).productById;
      set({ isLoading: false });
      return product;
    } catch (e: any) {
      set({ 
        error: e?.message || 'Failed to fetch product',
        isLoading: false 
      });
      throw e;
    }
  },

  // Create product
  async createProduct(data: Partial<ProductFormData>) {
    set({ isSubmitting: true, error: null });
    try {
      const client = getApolloClient();
      // Build media uploads from base64 images (data URLs)
      const mediaUploads = Array.isArray(data.images)
        ? data.images
            .map((src, index) => {
              if (!src || typeof src !== 'string') return null;
              if (!src.startsWith('data:image')) return null; // skip existing URLs
              const [meta, base64] = src.split(',');
              const match = /data:(image\/[a-zA-Z0-9.+-]+);base64/.exec(meta || '');
              const contentType = match?.[1] || 'image/png';
              const ext = contentType.split('/')[1] || 'png';
              const safeTitle = slugify(data.title || 'product');
              const filename = `products/${safeTitle}/${Date.now()}-${index}.${ext}`;
              return { base64, filename, contentType, type: 'IMAGE', position: index };
            })
            .filter(Boolean)
        : undefined;

      const input = {
        vendorId: '',
        categoryId: data.categoryId,
        title: data.title,
        slug: slugify(data.title || ''),
        description: data.description,
        status: data.status,
        productType: data.productType,
        isActive: data.isActive ?? true,
        deliveryMinDays: data.deliveryMinDays,
        deliveryMaxDays: data.deliveryMaxDays,
        weight: data.weight,
        weightUnit: data.weightUnit,
        length: data.length,
        width: data.width,
        height: data.height,
        dimensionUnit: data.dimensionUnit,
        pickupLocationId: data.pickupLocationId,
        pickupLocationName: data.pickupLocationName,
        pickupAddress: data.pickupAddress,
        pickupCity: data.pickupCity,
        pickupProvince: data.pickupProvince,
        pickupPostalCode: data.pickupPostalCode,
        pickupCountry: data.pickupCountry || 'South Africa',
        pickupInstructions: data.pickupInstructions,
        returnPolicyId: data.returnPolicyId,
        returnPolicyName: data.returnPolicyName,
        returnsAccepted: data.returnsAccepted,
        returnPeriodDays: data.returnPeriodDays,
        returnConditions: data.returnConditions,
        restockingFeePct: data.restockingFeePct,
        returnShippingPaidBy: data.returnShippingPaidBy,
        tags: data.tags,
        availableLocations: data.availableLocations,
        isbn: data.isbn,
        author: data.author,
        publisher: data.publisher,
        publicationDate: data.publicationDate,
        pages: data.pages,
        language: data.language,
        brand: data.brand,
        model: data.model,
        material: data.material,
        expiryDate: data.expiryDate,
        ingredients: data.ingredients,
        allergens: data.allergens,
        careInstructions: data.careInstructions,
        warrantyId: data.warrantyId,
        warrantyName: data.warrantyName,
        hasWarranty: data.hasWarranty,
        warrantyPeriod: data.warrantyPeriod,
        warrantyUnit: data.warrantyUnit,
        warrantyDetails: data.warrantyDetails,
        energyRating: data.energyRating,
        ageRating: data.ageRating,
        artist: data.artist,
        genre: data.genre,
        format: data.format,
        platform: data.platform,
        licenseType: data.licenseType,
        serviceDuration: data.serviceDuration,
        certification: data.certification,
        priceInCents: (data as any).priceInCents,
        compareAtPriceInCents: (data as any).compareAtPriceInCents,
        mediaUploads,
      };

      const { data: result } = await client.mutate({ 
        mutation: CREATE_PRODUCT, 
        variables: { input } 
      });
      
      set({ isSubmitting: false });
      return (result as any).createProduct?.id;
    } catch (e: any) {
      set({ 
        error: e?.message || 'Failed to create product',
        isSubmitting: false 
      });
      throw e;
    }
  },

  // Update product
  async updateProduct(id: string, data: Partial<ProductFormData>) {
    set({ isSubmitting: true, error: null });
    try {
      const client = getApolloClient();
      const mediaUploads = Array.isArray(data.images)
        ? data.images
            .map((src, index) => {
              if (!src || typeof src !== 'string') return null;
              if (!src.startsWith('data:image')) return null; // only new selections
              const [meta, base64] = src.split(',');
              const match = /data:(image\/[a-zA-Z0-9.+-]+);base64/.exec(meta || '');
              const contentType = match?.[1] || 'image/png';
              const ext = contentType.split('/')[1] || 'png';
              const safeTitle = slugify(data.title || 'product');
              const filename = `products/${safeTitle}/${Date.now()}-${index}.${ext}`;
              return { base64, filename, contentType, type: 'IMAGE', position: index };
            })
            .filter(Boolean)
        : undefined;

      const input: any = {
        title: data.title,
        slug: data.title ? slugify(data.title) : undefined,
        description: data.description,
        status: data.status,
        productType: data.productType,
        categoryId: data.categoryId,
        deliveryMinDays: data.deliveryMinDays,
        deliveryMaxDays: data.deliveryMaxDays,
        weight: data.weight,
        weightUnit: data.weightUnit,
        length: data.length,
        width: data.width,
        height: data.height,
        dimensionUnit: data.dimensionUnit,
        pickupAddress: data.pickupAddress,
        pickupCity: data.pickupCity,
        pickupProvince: data.pickupProvince,
        pickupPostalCode: data.pickupPostalCode,
        pickupCountry: data.pickupCountry,
        pickupInstructions: data.pickupInstructions,
        isbn: data.isbn,
        author: data.author,
        publicationDate: data.publicationDate,
        pages: data.pages,
        language: data.language,
        brand: data.brand,
        model: data.model,
        material: data.material,
        expiryDate: data.expiryDate,
        ingredients: data.ingredients,
        allergens: data.allergens,
        careInstructions: data.careInstructions,
        warrantyPeriod: data.warrantyPeriod,
        energyRating: data.energyRating,
        ageRating: data.ageRating,
        platform: data.platform,
        licenseType: data.licenseType,
        serviceDuration: data.serviceDuration,
        certification: data.certification,
        tags: data.tags,
        availableLocations: data.availableLocations,
        priceInCents: (data as any).priceInCents,
        compareAtPriceInCents: (data as any).compareAtPriceInCents,
        mediaUploads,
      };

      // Only include optional type-specific fields if present (and not null)
      if (typeof data.publisher === 'string' && data.publisher) (input as any).publisher = data.publisher;
      if (typeof data.artist === 'string' && data.artist) (input as any).artist = data.artist;
      if (typeof data.genre === 'string' && data.genre) (input as any).genre = data.genre;
      if (typeof data.format === 'string' && data.format) (input as any).format = data.format;

      // Remove null/undefined values so GraphQL doesn't reject non-nullable fields with null
      Object.keys(input).forEach((key) => {
        const value = (input as any)[key];
        if (value === null || value === undefined) {
          delete (input as any)[key];
        }
      });

      await client.mutate({ 
        mutation: UPDATE_PRODUCT, 
        variables: { id, input } 
      });
      
      set({ isSubmitting: false });
    } catch (e: any) {
      set({ 
        error: e?.message || 'Failed to update product',
        isSubmitting: false 
      });
      throw e;
    }
  },

  // Delete product
  async deleteProduct(id: string) {
    set({ isDeleting: true, error: null });
    try {
      const client = getApolloClient();
      await client.mutate({ 
        mutation: DELETE_PRODUCT, 
        variables: { id } 
      });
      
      // Remove from local state
      set(state => ({
        products: state.products.filter(p => p.id !== id),
        isDeleting: false
      }));
    } catch (e: any) {
      set({ 
        error: e?.message || 'Failed to delete product',
        isDeleting: false 
      });
      throw e;
    }
  },

  // Clear error
  clearError() {
    set({ error: null });
  },

  // Clear products (e.g., when user logs out or switches)
  clearProducts() {
    set({ products: [] });
  },
}));
