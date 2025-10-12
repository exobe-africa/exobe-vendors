/**
 * Constants used throughout the vendor dashboard
 */

export const APP_NAME = 'eXobe Vendor Portal';
export const APP_VERSION = '1.0.0';

// Product Status
export const PRODUCT_STATUS = {
  DRAFT: 'DRAFT',
  ACTIVE: 'ACTIVE',
  ARCHIVED: 'ARCHIVED',
} as const;

export const PRODUCT_STATUS_LABELS = {
  [PRODUCT_STATUS.DRAFT]: 'Draft',
  [PRODUCT_STATUS.ACTIVE]: 'Active',
  [PRODUCT_STATUS.ARCHIVED]: 'Archived',
};

// Order Status
export const ORDER_STATUS = {
  PENDING: 'PENDING',
  PAID: 'PAID',
  FULFILLED: 'FULFILLED',
  CANCELLED: 'CANCELLED',
  REFUNDED: 'REFUNDED',
} as const;

export const ORDER_STATUS_LABELS = {
  [ORDER_STATUS.PENDING]: 'Pending',
  [ORDER_STATUS.PAID]: 'Paid',
  [ORDER_STATUS.FULFILLED]: 'Fulfilled',
  [ORDER_STATUS.CANCELLED]: 'Cancelled',
  [ORDER_STATUS.REFUNDED]: 'Refunded',
};

// Payment Status
export const PAYMENT_STATUS = {
  INITIATED: 'INITIATED',
  AUTHORIZED: 'AUTHORIZED',
  PAID: 'PAID',
  FAILED: 'FAILED',
  REFUNDED: 'REFUNDED',
} as const;

// Vendor Status
export const VENDOR_STATUS = {
  PENDING: 'PENDING',
  APPROVED: 'APPROVED',
  SUSPENDED: 'SUSPENDED',
} as const;

// Discount Types
export const DISCOUNT_TYPE = {
  PRODUCT_AMOUNT: 'PRODUCT_AMOUNT',
  PRODUCT_PERCENT: 'PRODUCT_PERCENT',
  BUY_X_GET_Y: 'BUY_X_GET_Y',
  ORDER_AMOUNT: 'ORDER_AMOUNT',
  ORDER_PERCENT: 'ORDER_PERCENT',
  FREE_SHIPPING: 'FREE_SHIPPING',
} as const;

export const DISCOUNT_TYPE_LABELS = {
  [DISCOUNT_TYPE.PRODUCT_AMOUNT]: 'Product Fixed Amount',
  [DISCOUNT_TYPE.PRODUCT_PERCENT]: 'Product Percentage',
  [DISCOUNT_TYPE.BUY_X_GET_Y]: 'Buy X Get Y',
  [DISCOUNT_TYPE.ORDER_AMOUNT]: 'Order Fixed Amount',
  [DISCOUNT_TYPE.ORDER_PERCENT]: 'Order Percentage',
  [DISCOUNT_TYPE.FREE_SHIPPING]: 'Free Shipping',
};

// Discount Method
export const DISCOUNT_METHOD = {
  CODE: 'CODE',
  AUTOMATIC: 'AUTOMATIC',
} as const;

// Inventory Reasons
export const INVENTORY_REASON = {
  MANUAL_ADJUSTMENT: 'MANUAL_ADJUSTMENT',
  SALE: 'SALE',
  RETURN: 'RETURN',
  RECEIVING: 'RECEIVING',
  TRANSFER: 'TRANSFER',
} as const;

// Media Types
export const MEDIA_TYPE = {
  IMAGE: 'IMAGE',
  VIDEO: 'VIDEO',
  MODEL3D: 'MODEL3D',
} as const;

// Root Categories (from schema)
export const ROOT_CATEGORIES = {
  ANIMALS_PET_SUPPLIES: 'Animals & Pet Supplies',
  APPAREL_ACCESSORIES: 'Apparel & Accessories',
  ARTS_ENTERTAINMENT: 'Arts & Entertainment',
  BABY_TODDLER: 'Baby & Toddler',
  BUSINESS_INDUSTRIAL: 'Business & Industrial',
  CAMERAS_OPTICS: 'Cameras & Optics',
  ELECTRONICS: 'Electronics',
  FOOD_BEVERAGES_TOBACCO: 'Food, Beverages & Tobacco',
  FURNITURE: 'Furniture',
  HARDWARE: 'Hardware',
  HEALTH_BEAUTY: 'Health & Beauty',
  HOME_GARDEN: 'Home & Garden',
  LUGGAGE_BAGS: 'Luggage & Bags',
  MATURE: 'Mature',
  MEDIA: 'Media',
  OFFICE_SUPPLIES: 'Office Supplies',
  RELIGIOUS_CEREMONIAL: 'Religious & Ceremonial',
  SOFTWARE: 'Software',
  SPORTING_GOODS: 'Sporting Goods',
  TOYS_GAMES: 'Toys & Games',
  VEHICLES_PARTS: 'Vehicles & Parts',
  GIFT_CARDS: 'Gift Cards',
  UNCATEGORIZED: 'Uncategorized',
  SERVICES: 'Services',
  PRODUCT_ADD_ONS: 'Product Add-ons',
  BUNDLES: 'Bundles',
} as const;

// Pagination
export const DEFAULT_PAGE_SIZE = 20;
export const PAGE_SIZE_OPTIONS = [10, 20, 50, 100];

// File Upload
export const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
export const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];

// Currency
export const DEFAULT_CURRENCY = 'ZAR';
export const CURRENCY_SYMBOL = 'R';

// Date Formats
export const DATE_FORMAT = 'MMM dd, yyyy';
export const DATETIME_FORMAT = 'MMM dd, yyyy hh:mm a';
export const TIME_FORMAT = 'hh:mm a';

// Chart Colors
export const CHART_COLORS = {
  primary: '#dc2626',
  secondary: '#2563eb',
  success: '#16a34a',
  warning: '#ca8a04',
  danger: '#dc2626',
  info: '#0891b2',
};

