/**
 * Product Type Configuration
 * Defines which fields are relevant for each product type
 */

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

export interface ProductTypeOption {
  value: ProductType;
  label: string;
  icon: string;
  description: string;
  usesSku: boolean;
  usesIsbn: boolean;
}

export interface FieldConfig {
  name: string;
  label: string;
  type: 'text' | 'textarea' | 'number' | 'date' | 'select';
  placeholder?: string;
  helperText?: string;
  required?: boolean;
  options?: { value: string; label: string }[];
}

export const PRODUCT_TYPE_OPTIONS: ProductTypeOption[] = [
  {
    value: 'GENERAL',
    label: 'General Product',
    icon: '📦',
    description: 'Standard product with basic attributes',
    usesSku: true,
    usesIsbn: false,
  },
  {
    value: 'BOOK',
    label: 'Book (Physical)',
    icon: '📚',
    description: 'Physical books with ISBN',
    usesSku: false,
    usesIsbn: true,
  },
  {
    value: 'EBOOK',
    label: 'eBook (Digital)',
    icon: '📱',
    description: 'Digital books and publications',
    usesSku: false,
    usesIsbn: true,
  },
  {
    value: 'ELECTRONICS',
    label: 'Electronics',
    icon: '💻',
    description: 'Electronic devices and gadgets',
    usesSku: true,
    usesIsbn: false,
  },
  {
    value: 'CLOTHING',
    label: 'Clothing & Apparel',
    icon: '👕',
    description: 'Clothing, shoes, and accessories',
    usesSku: true,
    usesIsbn: false,
  },
  {
    value: 'FOOD',
    label: 'Food',
    icon: '🍕',
    description: 'Food products and groceries',
    usesSku: true,
    usesIsbn: false,
  },
  {
    value: 'BEVERAGE',
    label: 'Beverage',
    icon: '🥤',
    description: 'Drinks and beverages',
    usesSku: true,
    usesIsbn: false,
  },
  {
    value: 'HEALTH',
    label: 'Health & Wellness',
    icon: '💊',
    description: 'Health products and supplements',
    usesSku: true,
    usesIsbn: false,
  },
  {
    value: 'BEAUTY',
    label: 'Beauty & Personal Care',
    icon: '💄',
    description: 'Cosmetics and personal care',
    usesSku: true,
    usesIsbn: false,
  },
  {
    value: 'SPORTS',
    label: 'Sports & Outdoors',
    icon: '⚽',
    description: 'Sports equipment and outdoor gear',
    usesSku: true,
    usesIsbn: false,
  },
  {
    value: 'TOYS',
    label: 'Toys & Games',
    icon: '🎮',
    description: 'Toys, games, and entertainment',
    usesSku: true,
    usesIsbn: false,
  },
  {
    value: 'AUTOMOTIVE',
    label: 'Automotive',
    icon: '🚗',
    description: 'Auto parts and accessories',
    usesSku: true,
    usesIsbn: false,
  },
  {
    value: 'HOME',
    label: 'Home & Furniture',
    icon: '🏠',
    description: 'Home decor and furniture',
    usesSku: true,
    usesIsbn: false,
  },
  {
    value: 'GARDEN',
    label: 'Garden & Outdoor',
    icon: '🌱',
    description: 'Gardening and outdoor living',
    usesSku: true,
    usesIsbn: false,
  },
  {
    value: 'PET',
    label: 'Pet Supplies',
    icon: '🐾',
    description: 'Pet food, toys, and accessories',
    usesSku: true,
    usesIsbn: false,
  },
  {
    value: 'JEWELRY',
    label: 'Jewelry & Watches',
    icon: '💍',
    description: 'Jewelry, watches, and accessories',
    usesSku: true,
    usesIsbn: false,
  },
  {
    value: 'ART',
    label: 'Art & Collectibles',
    icon: '🎨',
    description: 'Art, prints, and collectibles',
    usesSku: true,
    usesIsbn: false,
  },
  {
    value: 'MUSIC',
    label: 'Music',
    icon: '🎵',
    description: 'Music albums and instruments',
    usesSku: true,
    usesIsbn: false,
  },
  {
    value: 'SOFTWARE',
    label: 'Software',
    icon: '💿',
    description: 'Software and digital licenses',
    usesSku: true,
    usesIsbn: false,
  },
  {
    value: 'SERVICE',
    label: 'Service',
    icon: '🛠️',
    description: 'Professional services',
    usesSku: true,
    usesIsbn: false,
  },
];

// Field configurations for each product type
export const PRODUCT_TYPE_FIELDS: Record<ProductType, FieldConfig[]> = {
  GENERAL: [
    { name: 'brand', label: 'Brand', type: 'text', placeholder: 'e.g. Samsung' },
    { name: 'model', label: 'Model', type: 'text', placeholder: 'e.g. Galaxy S21' },
  ],
  
  BOOK: [
    { name: 'isbn', label: 'ISBN', type: 'text', placeholder: 'e.g. 978-3-16-148410-0', helperText: 'ISBN-10 or ISBN-13', required: true },
    { name: 'author', label: 'Author', type: 'text', placeholder: 'e.g. J.K. Rowling', required: true },
    { name: 'publisher', label: 'Publisher', type: 'text', placeholder: 'e.g. Penguin Random House' },
    { name: 'publicationDate', label: 'Publication Date', type: 'date' },
    { name: 'pages', label: 'Pages', type: 'number', placeholder: '0' },
    { name: 'language', label: 'Language', type: 'text', placeholder: 'e.g. English' },
    { name: 'genre', label: 'Genre', type: 'text', placeholder: 'e.g. Fiction, Biography' },
  ],
  
  EBOOK: [
    { name: 'isbn', label: 'ISBN', type: 'text', placeholder: 'e.g. 978-3-16-148410-0', helperText: 'ISBN-10 or ISBN-13', required: true },
    { name: 'author', label: 'Author', type: 'text', placeholder: 'e.g. J.K. Rowling', required: true },
    { name: 'publisher', label: 'Publisher', type: 'text', placeholder: 'e.g. Penguin Random House' },
    { name: 'publicationDate', label: 'Publication Date', type: 'date' },
    { name: 'pages', label: 'Pages', type: 'number', placeholder: '0' },
    { name: 'language', label: 'Language', type: 'text', placeholder: 'e.g. English' },
    { name: 'format', label: 'Format', type: 'select', options: [
      { value: 'PDF', label: 'PDF' },
      { value: 'EPUB', label: 'EPUB' },
      { value: 'MOBI', label: 'MOBI' },
      { value: 'AZW', label: 'AZW (Kindle)' },
    ]},
    { name: 'genre', label: 'Genre', type: 'text', placeholder: 'e.g. Fiction, Biography' },
  ],
  
  ELECTRONICS: [
    { name: 'brand', label: 'Brand', type: 'text', placeholder: 'e.g. Samsung', required: true },
    { name: 'model', label: 'Model', type: 'text', placeholder: 'e.g. Galaxy S21', required: true },
    { name: 'warrantyPeriod', label: 'Warranty (months)', type: 'number', placeholder: '12' },
    { name: 'energyRating', label: 'Energy Rating', type: 'select', options: [
      { value: 'A+++', label: 'A+++' },
      { value: 'A++', label: 'A++' },
      { value: 'A+', label: 'A+' },
      { value: 'A', label: 'A' },
      { value: 'B', label: 'B' },
      { value: 'C', label: 'C' },
      { value: 'D', label: 'D' },
    ]},
  ],
  
  CLOTHING: [
    { name: 'brand', label: 'Brand', type: 'text', placeholder: 'e.g. Nike' },
    { name: 'material', label: 'Material', type: 'text', placeholder: 'e.g. 100% Cotton' },
    { name: 'careInstructions', label: 'Care Instructions', type: 'textarea', placeholder: 'e.g. Machine wash cold, tumble dry low' },
  ],
  
  FOOD: [
    { name: 'brand', label: 'Brand', type: 'text', placeholder: 'e.g. Nestlé' },
    { name: 'expiryDate', label: 'Expiry Date', type: 'date', required: true },
    { name: 'ingredients', label: 'Ingredients', type: 'textarea', placeholder: 'List all ingredients' },
    { name: 'nutritionalInfo', label: 'Nutritional Info (JSON)', type: 'textarea', placeholder: '{"calories": 250, "protein": "10g"}', helperText: 'JSON format' },
  ],
  
  BEVERAGE: [
    { name: 'brand', label: 'Brand', type: 'text', placeholder: 'e.g. Coca-Cola' },
    { name: 'expiryDate', label: 'Expiry Date', type: 'date', required: true },
    { name: 'ingredients', label: 'Ingredients', type: 'textarea', placeholder: 'List all ingredients' },
    { name: 'nutritionalInfo', label: 'Nutritional Info (JSON)', type: 'textarea', placeholder: '{"calories": 140, "sugar": "39g"}', helperText: 'JSON format' },
  ],
  
  HEALTH: [
    { name: 'brand', label: 'Brand', type: 'text', placeholder: 'e.g. Vital' },
    { name: 'expiryDate', label: 'Expiry Date', type: 'date', required: true },
    { name: 'ingredients', label: 'Active Ingredients', type: 'textarea', placeholder: 'List active ingredients' },
    { name: 'certification', label: 'Certifications', type: 'text', placeholder: 'e.g. FDA Approved, MCC Approved' },
  ],
  
  BEAUTY: [
    { name: 'brand', label: 'Brand', type: 'text', placeholder: 'e.g. L\'Oréal' },
    { name: 'ingredients', label: 'Ingredients', type: 'textarea', placeholder: 'List ingredients' },
    { name: 'expiryDate', label: 'Expiry Date', type: 'date' },
  ],
  
  SPORTS: [
    { name: 'brand', label: 'Brand', type: 'text', placeholder: 'e.g. Adidas' },
    { name: 'material', label: 'Material', type: 'text', placeholder: 'e.g. Synthetic leather' },
  ],
  
  TOYS: [
    { name: 'brand', label: 'Brand', type: 'text', placeholder: 'e.g. LEGO' },
    { name: 'ageRating', label: 'Age Rating', type: 'text', placeholder: 'e.g. 3+, 7+, 12+', required: true },
    { name: 'material', label: 'Material', type: 'text', placeholder: 'e.g. Plastic, Wood' },
  ],
  
  AUTOMOTIVE: [
    { name: 'brand', label: 'Brand', type: 'text', placeholder: 'e.g. Bosch' },
    { name: 'model', label: 'Compatible Models', type: 'text', placeholder: 'e.g. Toyota Hilux 2020+' },
    { name: 'warrantyPeriod', label: 'Warranty (months)', type: 'number', placeholder: '12' },
  ],
  
  HOME: [
    { name: 'brand', label: 'Brand', type: 'text', placeholder: 'e.g. IKEA' },
    { name: 'material', label: 'Material', type: 'text', placeholder: 'e.g. Solid Oak' },
    { name: 'colour', label: 'Colour', type: 'text', placeholder: 'e.g. Natural Wood' },
    { name: 'careInstructions', label: 'Care Instructions', type: 'textarea', placeholder: 'e.g. Wipe with damp cloth' },
  ],
  
  GARDEN: [
    { name: 'brand', label: 'Brand', type: 'text', placeholder: 'e.g. Gardena' },
    { name: 'material', label: 'Material', type: 'text', placeholder: 'e.g. Stainless steel' },
    { name: 'careInstructions', label: 'Care Instructions', type: 'textarea', placeholder: 'e.g. Clean after use, store in dry place' },
  ],
  
  PET: [
    { name: 'brand', label: 'Brand', type: 'text', placeholder: 'e.g. Royal Canin' },
    { name: 'expiryDate', label: 'Expiry Date', type: 'date' },
    { name: 'ingredients', label: 'Ingredients', type: 'textarea', placeholder: 'List ingredients' },
  ],
  
  JEWELRY: [
    { name: 'brand', label: 'Brand', type: 'text', placeholder: 'e.g. Tiffany & Co.' },
    { name: 'material', label: 'Material', type: 'text', placeholder: 'e.g. 18K Gold, Sterling Silver', required: true },
    { name: 'colour', label: 'Colour', type: 'text', placeholder: 'e.g. Rose Gold' },
    { name: 'certification', label: 'Certification', type: 'text', placeholder: 'e.g. GIA Certified' },
  ],
  
  ART: [
    { name: 'artist', label: 'Artist', type: 'text', placeholder: 'e.g. Vincent van Gogh', required: true },
    { name: 'material', label: 'Medium', type: 'text', placeholder: 'e.g. Oil on canvas' },
    { name: 'format', label: 'Format', type: 'text', placeholder: 'e.g. Original, Print, Reproduction' },
    { name: 'certification', label: 'Authenticity', type: 'text', placeholder: 'e.g. Certificate of Authenticity included' },
  ],
  
  MUSIC: [
    { name: 'artist', label: 'Artist/Band', type: 'text', placeholder: 'e.g. The Beatles', required: true },
    { name: 'genre', label: 'Genre', type: 'text', placeholder: 'e.g. Rock, Pop, Jazz' },
    { name: 'format', label: 'Format', type: 'select', options: [
      { value: 'CD', label: 'CD' },
      { value: 'Vinyl', label: 'Vinyl' },
      { value: 'Digital', label: 'Digital Download' },
      { value: 'Cassette', label: 'Cassette' },
    ]},
    { name: 'publicationDate', label: 'Release Date', type: 'date' },
  ],
  
  SOFTWARE: [
    { name: 'brand', label: 'Developer', type: 'text', placeholder: 'e.g. Microsoft' },
    { name: 'platform', label: 'Platform', type: 'text', placeholder: 'e.g. Windows, macOS, Linux', required: true },
    { name: 'licenseType', label: 'License Type', type: 'select', options: [
      { value: 'Single', label: 'Single User' },
      { value: 'Multi', label: 'Multi User' },
      { value: 'Enterprise', label: 'Enterprise' },
      { value: 'Subscription', label: 'Subscription' },
    ], required: true},
    { name: 'format', label: 'Format', type: 'select', options: [
      { value: 'Download', label: 'Digital Download' },
      { value: 'Physical', label: 'Physical Media' },
      { value: 'Cloud', label: 'Cloud-based' },
    ]},
  ],
  
  SERVICE: [
    { name: 'serviceDuration', label: 'Service Duration', type: 'text', placeholder: 'e.g. 1 hour, 1 day, ongoing', required: true },
    { name: 'certification', label: 'Certifications', type: 'text', placeholder: 'e.g. Licensed Plumber, Certified Electrician' },
  ],
};

// Helper function to get product type option
export function getProductTypeOption(type: ProductType): ProductTypeOption | undefined {
  return PRODUCT_TYPE_OPTIONS.find(opt => opt.value === type);
}

// Helper function to get fields for a product type
export function getFieldsForProductType(type: ProductType): FieldConfig[] {
  return PRODUCT_TYPE_FIELDS[type] || [];
}

// Helper function to check if product type uses ISBN
export function usesIsbn(type: ProductType): boolean {
  const option = getProductTypeOption(type);
  return option?.usesIsbn || false;
}

// Helper function to check if product type uses SKU
export function usesSku(type: ProductType): boolean {
  const option = getProductTypeOption(type);
  return option?.usesSku ?? true;
}

