'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Select } from '@/components/ui/Select';
import { Checkbox } from '@/components/ui/Checkbox';
import { useProductStore, type ProductType } from '@/store/product';
import { X, Plus, Upload, ArrowLeft, Trash2, Save } from 'lucide-react';
import Link from 'next/link';
import { BasicInfoSection } from '../../../../../components/pages/products/new/BasicInfoSection';
import { MediaSection } from '../../../../../components/pages/products/new/MediaSection';
import { OptionsSection } from '../../../../../components/pages/products/new/OptionsSection';
import { VariantsSection } from '../../../../../components/pages/products/new/VariantsSection';
import { CategorySelector } from '../../../../../components/pages/products/new/CategorySelector';
import { ProductTypeSelector } from '../../../../../components/pages/products/new/ProductTypeSelector';
import { TypeSpecificFields } from '../../../../../components/pages/products/new/TypeSpecificFields';
import { PickupAddressSection } from '../../../../../components/pages/products/new/PickupAddressSection';
import { ReturnPolicySection } from '../../../../../components/pages/products/new/ReturnPolicySection';
import { WarrantySection } from '../../../../../components/pages/products/new/WarrantySection';
import { TagsSection } from '../../../../../components/pages/products/new/TagsSection';
import { useToast } from '@/hooks/useToast';
import { ToastContainer } from '@/components/ui/Toast';
import { useConfirm } from '@/hooks/useConfirm';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';

export default function EditProductPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { 
    categories, 
    fetchCategories, 
    fetchProduct,
    updateProduct, 
    deleteProduct,
    isSubmitting,
    isLoading,
    error, 
    clearError 
  } = useProductStore();
  const { toasts, success, error: showError, warning, removeToast } = useToast();
  const confirmDialog = useConfirm();
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<'DRAFT'|'ACTIVE'|'ARCHIVED'>('DRAFT');
  const [productType, setProductType] = useState<ProductType>('GENERAL');
  const [categoryId, setCategoryId] = useState<string>('');
  const [isFeatured, setIsFeatured] = useState(false);
  const [isActive, setIsActive] = useState(true);
  const [trackInventory, setTrackInventory] = useState(true);
  const [allowBackorder, setAllowBackorder] = useState(false);
  const [deliveryMinDays, setDeliveryMinDays] = useState<number>(1);
  const [deliveryMaxDays, setDeliveryMaxDays] = useState<number>(3);
  const [weight, setWeight] = useState<number>(0);
  const [weightUnit, setWeightUnit] = useState<'kg' | 'g'>('kg');
  const [length, setLength] = useState<number>(0);
  const [width, setWidth] = useState<number>(0);
  const [height, setHeight] = useState<number>(0);
  const [dimensionUnit, setDimensionUnit] = useState<'cm' | 'm'>('cm');
  
  // Pickup location
  const [pickupLocationName, setPickupLocationName] = useState<string>('');
  const [pickupAddress, setPickupAddress] = useState<string>('');
  const [pickupCity, setPickupCity] = useState<string>('');
  const [pickupProvince, setPickupProvince] = useState<string>('');
  const [pickupPostalCode, setPickupPostalCode] = useState<string>('');
  const [pickupCountry, setPickupCountry] = useState<string>('South Africa');
  const [pickupInstructions, setPickupInstructions] = useState<string>('');
  
  // Return policy
  const [returnPolicyName, setReturnPolicyName] = useState<string>('');
  const [returnsAccepted, setReturnsAccepted] = useState<boolean>(true);
  const [returnPeriodDays, setReturnPeriodDays] = useState<number>(30);
  const [returnConditions, setReturnConditions] = useState<string[]>([]);
  const [restockingFeePct, setRestockingFeePct] = useState<number>(0);
  const [returnShippingPaidBy, setReturnShippingPaidBy] = useState<'CUSTOMER' | 'VENDOR' | 'SHARED'>('CUSTOMER');
  
  // Warranty
  const [hasWarranty, setHasWarranty] = useState<boolean>(false);
  const [warrantyPeriod, setWarrantyPeriod] = useState<number>(12);
  const [warrantyUnit, setWarrantyUnit] = useState<'months' | 'years'>('months');
  const [warrantyDetails, setWarrantyDetails] = useState<string>('');
  
  const [tags, setTags] = useState<string[]>([]);

  const [typeSpecificData, setTypeSpecificData] = useState<Record<string, any>>({});
  const [salesCount, setSalesCount] = useState<number>(0);
  const [isDataReady, setIsDataReady] = useState(false);

  useEffect(() => {
    async function load() {
      setIsDataReady(false);
      try {
        const [product] = await Promise.all([
          fetchProduct(id),
          fetchCategories(),
        ]);
        
        if (!product) {
          showError('Product not found');
          router.push('/dashboard/products');
          return;
        }

        // Basic info
        setTitle(product.title || '');
        setDescription(product.description || '');
        setStatus((product.status as any) || 'DRAFT');
        setCategoryId(product.categoryId || '');
        setProductType((product.productType as any) || 'GENERAL');
        setIsFeatured(product.featured || false);
        setIsActive(product.isActive ?? true);
        setSalesCount(product.salesCount ?? 0);

        // Delivery & dimensions
        setDeliveryMinDays(product.delivery_min_days || 1);
        setDeliveryMaxDays(product.delivery_max_days || 3);
        setWeight(product.weight || 0);
        setWeightUnit(product.weight_unit || 'kg');
        setLength(product.length || 0);
        setWidth(product.width || 0);
        setHeight(product.height || 0);
        setDimensionUnit(product.dimension_unit || 'cm');

        // Pickup location
        const pl = product.pickupLocation || product.pickup_location;
        if (pl) {
          setPickupLocationName(pl.name || '');
          setPickupAddress(pl.address || '');
          setPickupCity(pl.city || '');
          setPickupProvince(pl.province || '');
          setPickupPostalCode(pl.postalCode || pl.postal_code || '');
          setPickupCountry(pl.country || 'South Africa');
          setPickupInstructions(pl.instructions || '');
        }

        // Return policy
        const rp = product.returnPolicy || product.return_policy;
        if (rp) {
          setReturnPolicyName(rp.name || '');
          setReturnsAccepted((rp.returnsAccepted ?? rp.returns_accepted) ?? true);
          setReturnPeriodDays(rp.returnPeriodDays ?? rp.return_period_days ?? 30);
          setReturnConditions(rp.returnConditions ?? rp.return_conditions ?? []);
          setRestockingFeePct(rp.restockingFeePct ?? rp.restocking_fee_pct ?? 0);
          setReturnShippingPaidBy((rp.returnShippingPaidBy ?? rp.return_shipping_paid_by) || 'CUSTOMER');
        }

        // Warranty
        const wt = product.warranty;
        if (wt) {
          setHasWarranty((wt.hasWarranty ?? wt.has_warranty) || false);
          setWarrantyPeriod(wt.warrantyPeriod ?? wt.warranty_period ?? 12);
          setWarrantyUnit((wt.warrantyUnit ?? wt.warranty_unit) || 'months');
          setWarrantyDetails(wt.warrantyDetails ?? wt.warranty_details ?? '');
        }

        // Tags
        setTags(product.tags || []);

        // Media
        if (Array.isArray((product as any).media) && (product as any).media.length > 0) {
          setImages((product as any).media.map((m: any) => m.url).filter(Boolean));
        } else {
          setImages([]);
        }

        // Type-specific data - populate from related detail tables
        const specificData: Record<string, any> = {};
        
        const bd = product.bookDetails || product.book_details;
        if (bd) {
          specificData.isbn = bd.isbn;
          specificData.author = bd.author;
          specificData.publisher = bd.publisher;
          specificData.publicationDate = bd.publicationDate ?? bd.publication_date;
          specificData.pages = bd.pages;
          specificData.language = bd.language;
          specificData.genre = bd.genre;
          specificData.format = bd.format;
        }

        const cd = product.consumableDetails || product.consumable_details;
        if (cd) {
          specificData.expiryDate = cd.expiryDate ?? cd.expiry_date;
          specificData.ingredients = cd.ingredients;
          specificData.allergens = cd.allergens;
          specificData.nutritionalInfo = cd.nutritionalInfo ?? cd.nutritional_info;
        }

        const ed = product.electronicsDetails || product.electronics_details;
        if (ed) {
          specificData.energyRating = ed.energyRating ?? ed.energy_rating;
        }

        const md = product.mediaDetails || product.media_details;
        if (md) {
          specificData.artist = md.artist;
          specificData.genre = md.genre;
          specificData.format = md.format;
        }

        const sd = product.softwareDetails || product.software_details;
        if (sd) {
          specificData.platform = sd.platform;
          specificData.licenseType = sd.licenseType ?? sd.license_type;
        }

        const svd = product.serviceDetails || product.service_details;
        if (svd) {
          specificData.serviceDuration = svd.serviceDuration ?? svd.service_duration;
        }

        const cmp = product.complianceDetails || product.compliance_details;
        if (cmp) {
          specificData.ageRating = cmp.ageRating ?? cmp.age_rating;
          specificData.certification = cmp.certification;
        }

        setTypeSpecificData(specificData);

        // Prefill options/variants if present
        if (Array.isArray(product.options) && product.options.length > 0) {
          setOptions(product.options.map((o:any)=>({ name:o.name, values:o.values?.map((v:any)=>v.value) || [] })));
        }
        if (Array.isArray(product.variants) && product.variants.length > 0) {
          const mapped = product.variants.map((v:any)=>({ 
            sku:v.sku, 
            price: (v.priceCents ?? v.price_cents ?? 0)/100, 
            stock: v.stockQuantity ?? v.stock_quantity ?? 0, 
            attributes: v.attributes || {},
            images: v.images || []
          }));
          setVariants(mapped);
          // If there's a single default variant, also set base price/stock/sku
          if (mapped.length === 1 && Object.keys(mapped[0].attributes).length === 0) {
            setBasePrice(mapped[0].price);
            setStockQuantity(mapped[0].stock);
            setBaseSku(mapped[0].sku);
          }
        }

      } catch (err) {
        console.error(err);
        showError('Failed to load product');
      } finally {
        // Ensure all state updates have completed before showing content
        setTimeout(() => setIsDataReady(true), 100);
      }
    }
    load();
  }, [fetchProduct, fetchCategories, id, router, showError]);

  const handleTypeSpecificChange = (name: string, value: any) => {
    setTypeSpecificData(prev => ({ ...prev, [name]: value }));
  };

  async function handleUpdate() {
    if (!title || !categoryId) {
      showError('Title and category are required');
      return;
    }
    if (!pickupAddress || !pickupCity || !pickupProvince || !pickupPostalCode) {
      showError('Pickup address is required. Please provide the full address where the product will be collected.');
      return;
    }
    clearError();
    
    try {
      await updateProduct(id, {
        title,
        description,
        status,
        productType,
        categoryId,
        isFeatured,
        isActive,
        trackInventory,
        allowBackorder,
        deliveryMinDays,
        deliveryMaxDays,
        weight,
        weightUnit,
        length,
        width,
        height,
        dimensionUnit,
        pickupLocationName,
        pickupAddress,
        pickupCity,
        pickupProvince,
        pickupPostalCode,
        pickupCountry,
        pickupInstructions,
        returnPolicyName: returnsAccepted ? returnPolicyName : undefined,
        returnsAccepted,
        returnPeriodDays: returnsAccepted ? returnPeriodDays : undefined,
        returnConditions: returnsAccepted ? returnConditions : undefined,
        restockingFeePct: returnsAccepted ? restockingFeePct : undefined,
        returnShippingPaidBy: returnsAccepted ? returnShippingPaidBy : undefined,
        hasWarranty,
        warrantyPeriod: hasWarranty ? warrantyPeriod : undefined,
        warrantyUnit: hasWarranty ? warrantyUnit : undefined,
        warrantyDetails: hasWarranty ? warrantyDetails : undefined,
        tags,
        ...typeSpecificData,
        options,
        variants,
        images,
      });
      success('Product updated successfully!');
      router.push('/dashboard/products');
    } catch (err) {
      console.error(err);
      showError(err instanceof Error ? err.message : 'Failed to update product. Please try again.');
    }
  }

  async function handleDelete() {
    const confirmed = await confirmDialog.confirm({
      title: 'Delete Product',
      message: 'Are you sure you want to delete this product? This action cannot be undone.',
      confirmText: 'Delete',
      cancelText: 'Cancel',
      variant: 'danger',
    });
    
    if (!confirmed) return;
    
    clearError();
    try {
      await deleteProduct(id);
      success('Product deleted successfully');
      router.push('/dashboard/products');
    } catch (err) {
      console.error(err);
      showError(err instanceof Error ? err.message : 'Failed to delete product. Please try again.');
    }
  }

  interface ProductOption { name: string; values: string[] }
  interface ProductVariant { sku: string; price: number; stock: number; attributes: Record<string, string>; images?: string[] }

  const [variants, setVariants] = useState<ProductVariant[]>([]);
  const [options, setOptions] = useState<ProductOption[]>([]);
  const [basePrice, setBasePrice] = useState(0);
  const [compareAtPrice, setCompareAtPrice] = useState(0);
  const [baseSku, setBaseSku] = useState('');
  const [stockQuantity, setStockQuantity] = useState(0);
  const [images, setImages] = useState<string[]>([]);

  const handleAddOption = () => {
    setOptions([...options, { name: '', values: [] }]);
  };

  const handleRemoveOption = (index: number) => {
    setOptions(options.filter((_, i) => i !== index));
  };

  const handleOptionNameChange = (index: number, name: string) => {
    const updatedOptions = [...options];
    updatedOptions[index] = { ...updatedOptions[index], name };
    setOptions(updatedOptions);
  };

  const handleAddOptionValue = (optionIndex: number, value: string) => {
    const updatedOptions = [...options];
    if (!updatedOptions[optionIndex].values.includes(value)) {
      updatedOptions[optionIndex].values.push(value);
      setOptions(updatedOptions);
    }
  };

  const handleRemoveOptionValue = (optionIndex: number, valueIndex: number) => {
    const updatedOptions = [...options];
    updatedOptions[optionIndex].values = updatedOptions[optionIndex].values.filter((_, i) => i !== valueIndex);
    setOptions(updatedOptions);
  };

  if (isLoading || !isDataReady) {
    return (
      <div className="space-y-6 max-w-7xl">
        {/* Header Skeleton */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-gray-200 rounded-lg animate-pulse"></div>
            <div>
              <div className="h-8 w-48 bg-gray-200 rounded animate-pulse mb-2"></div>
              <div className="h-4 w-64 bg-gray-200 rounded animate-pulse"></div>
            </div>
          </div>
          <div className="flex gap-3">
            <div className="w-24 h-10 bg-gray-200 rounded-lg animate-pulse"></div>
            <div className="w-32 h-10 bg-gray-200 rounded-lg animate-pulse"></div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content Skeleton */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Info Card */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="h-6 w-40 bg-gray-200 rounded animate-pulse mb-4"></div>
              <div className="space-y-4">
                <div className="h-10 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-32 bg-gray-200 rounded animate-pulse"></div>
              </div>
            </div>

            {/* Media Card */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="h-6 w-32 bg-gray-200 rounded animate-pulse mb-4"></div>
              <div className="h-48 bg-gray-200 rounded animate-pulse"></div>
            </div>

            {/* Pricing Card */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="h-6 w-24 bg-gray-200 rounded animate-pulse mb-4"></div>
              <div className="grid grid-cols-2 gap-4">
                <div className="h-10 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-10 bg-gray-200 rounded animate-pulse"></div>
              </div>
            </div>

            {/* Additional Cards */}
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="h-6 w-32 bg-gray-200 rounded animate-pulse mb-4"></div>
                <div className="space-y-3">
                  <div className="h-10 bg-gray-200 rounded animate-pulse"></div>
                  <div className="h-10 bg-gray-200 rounded animate-pulse"></div>
                </div>
              </div>
            ))}
          </div>

          {/* Sidebar Skeleton */}
          <div className="space-y-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="h-6 w-32 bg-gray-200 rounded animate-pulse mb-4"></div>
                <div className="space-y-3">
                  <div className="h-10 bg-gray-200 rounded animate-pulse"></div>
                  <div className="h-10 bg-gray-200 rounded animate-pulse"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <ToastContainer toasts={toasts} onRemove={removeToast} />
      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        title={confirmDialog.title}
        message={confirmDialog.message}
        confirmText={confirmDialog.confirmText}
        cancelText={confirmDialog.cancelText}
        variant={confirmDialog.variant}
        onConfirm={confirmDialog.onConfirm}
        onCancel={confirmDialog.cancel}
      />
      
    <div className="space-y-6 max-w-7xl">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/products">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Edit Product</h1>
            <p className="text-gray-600 mt-1">Update your product details</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {/* Hide delete button if product has sales */}
          {(!isLoading && (isDataReady && (salesCount === 0))) ? (
            <Button 
              variant="outline" 
              onClick={handleDelete}
              disabled={isSubmitting}
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Delete
            </Button>
          ) : null}
          <Button 
            onClick={handleUpdate}
            disabled={isSubmitting || !title || !categoryId}
          >
            <Save className="w-4 h-4 mr-2" />
            {isSubmitting ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <BasicInfoSection
            title={title}
            onTitleChange={setTitle}
            description={description}
            onDescriptionChange={setDescription}
          />

          <MediaSection 
            images={images}
            onImagesChange={setImages}
          />

          <Card>
            <CardHeader>
              <CardTitle>Pricing</CardTitle>
            </CardHeader>
            <div className="space-y-4">
              {options.length > 0 && options.some(opt => opt.values.length > 0) ? (
                <VariantsSection
                  variants={variants}
                  options={options}
                  onVariantsChange={(v)=>setVariants(v)}
                  productType={productType as any}
                />
              ) : (
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="Price"
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="0.00"
                    helperText="In ZAR"
                    value={basePrice || ''}
                    onChange={(e) => setBasePrice(parseFloat(e.target.value) || 0)}
                  />
                  <Input
                    label="Compare at Price"
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="0.00"
                    helperText="Original price for sale display"
                    value={compareAtPrice || ''}
                    onChange={(e) => setCompareAtPrice(parseFloat(e.target.value) || 0)}
                  />
                </div>
              )}
            </div>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Inventory</CardTitle>
            </CardHeader>
            <div className="space-y-4">
              <Checkbox
                id="track-inventory"
                label="Track inventory"
                checked={trackInventory}
                onChange={setTrackInventory}
              />
              {trackInventory && (
                <Checkbox
                  id="allow-backorder"
                  label="Allow backorders"
                  checked={allowBackorder}
                  onChange={setAllowBackorder}
                />
              )}
            </div>
          </Card>

          <OptionsSection
            options={options}
            onAddOption={handleAddOption}
            onRemoveOption={handleRemoveOption}
            onOptionNameChange={handleOptionNameChange}
            onAddOptionValue={handleAddOptionValue}
            onRemoveOptionValue={handleRemoveOptionValue}
          />

          <Card>
            <CardHeader>
              <CardTitle>Delivery Timeframe</CardTitle>
              <p className="text-sm text-gray-500 mt-1">Estimated delivery time for this product</p>
            </CardHeader>
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Minimum Days"
                type="number"
                min="0"
                value={deliveryMinDays}
                onChange={(e) => setDeliveryMinDays(parseInt(e.target.value) || 0)}
              />
              <Input
                label="Maximum Days"
                type="number"
                min="0"
                value={deliveryMaxDays}
                onChange={(e) => setDeliveryMaxDays(parseInt(e.target.value) || 0)}
              />
            </div>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Shipping Dimensions & Weight</CardTitle>
              <p className="text-sm text-gray-500 mt-1">Required for accurate shipping calculations</p>
            </CardHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Weight"
                  type="number"
                  min="0"
                  step="0.01"
                  value={weight}
                  onChange={(e) => setWeight(parseFloat(e.target.value) || 0)}
                />
                <Select
                  label="Unit"
                  options={[
                    { value: 'kg', label: 'Kilograms (kg)' },
                    { value: 'g', label: 'Grams (g)' },
                  ]}
                  value={weightUnit}
                  onChange={(e) => setWeightUnit(e.target.value as 'kg' | 'g')}
                />
              </div>
              <div className="grid grid-cols-4 gap-4">
                <Input
                  label="Length"
                  type="number"
                  min="0"
                  step="0.01"
                  value={length}
                  onChange={(e) => setLength(parseFloat(e.target.value) || 0)}
                />
                <Input
                  label="Width"
                  type="number"
                  min="0"
                  step="0.01"
                  value={width}
                  onChange={(e) => setWidth(parseFloat(e.target.value) || 0)}
                />
                <Input
                  label="Height"
                  type="number"
                  min="0"
                  step="0.01"
                  value={height}
                  onChange={(e) => setHeight(parseFloat(e.target.value) || 0)}
                />
                <Select
                  label="Unit"
                  options={[
                    { value: 'cm', label: 'Centimeters' },
                    { value: 'm', label: 'Meters' },
                  ]}
                  value={dimensionUnit}
                  onChange={(e) => setDimensionUnit(e.target.value as 'cm' | 'm')}
                />
              </div>
            </div>
          </Card>

          <PickupAddressSection
            pickupLocationName={pickupLocationName}
            pickupAddress={pickupAddress}
            pickupCity={pickupCity}
            pickupProvince={pickupProvince}
            pickupPostalCode={pickupPostalCode}
            pickupCountry={pickupCountry}
            pickupInstructions={pickupInstructions}
            onPickupLocationNameChange={setPickupLocationName}
            onPickupAddressChange={setPickupAddress}
            onPickupCityChange={setPickupCity}
            onPickupProvinceChange={setPickupProvince}
            onPickupPostalCodeChange={setPickupPostalCode}
            onPickupCountryChange={setPickupCountry}
            onPickupInstructionsChange={setPickupInstructions}
          />

          <ReturnPolicySection
            returnPolicyName={returnPolicyName}
            returnsAccepted={returnsAccepted}
            returnPeriodDays={returnPeriodDays}
            returnConditions={returnConditions}
            restockingFeePct={restockingFeePct}
            returnShippingPaidBy={returnShippingPaidBy}
            onReturnPolicyNameChange={setReturnPolicyName}
            onReturnsAcceptedChange={setReturnsAccepted}
            onReturnPeriodDaysChange={setReturnPeriodDays}
            onReturnConditionsChange={setReturnConditions}
            onRestockingFeePctChange={setRestockingFeePct}
            onReturnShippingPaidByChange={setReturnShippingPaidBy}
          />

          <WarrantySection
            hasWarranty={hasWarranty}
            warrantyPeriod={warrantyPeriod}
            warrantyUnit={warrantyUnit}
            warrantyDetails={warrantyDetails}
            onHasWarrantyChange={setHasWarranty}
            onWarrantyPeriodChange={setWarrantyPeriod}
            onWarrantyUnitChange={setWarrantyUnit}
            onWarrantyDetailsChange={setWarrantyDetails}
          />

          <VariantsSection
            variants={variants}
            options={options}
            onVariantsChange={setVariants}
          />

          <Card>
            <CardHeader>
              <CardTitle>SEO</CardTitle>
              <p className="text-sm text-gray-500 mt-1">
                Optimize your product for search engines
              </p>
            </CardHeader>
            <div className="space-y-4">
              <Input
                label="Meta Title"
                placeholder="Leave empty to use product title"
                helperText="Recommended: 50-60 characters"
              />
              <Textarea
                label="Meta Description"
                placeholder="Leave empty to use product description"
                rows={3}
                helperText="Recommended: 150-160 characters"
              />
            </div>
          </Card>
        </div>

        <div className="space-y-6">
          <CategorySelector
            categories={categories || []}
            selectedCategoryId={categoryId}
            onSelectCategory={setCategoryId}
            isLoading={isLoading}
          />

          <ProductTypeSelector
            selectedType={productType}
            onSelect={setProductType}
          />

          <TypeSpecificFields
            productType={productType}
            values={typeSpecificData}
            onChange={handleTypeSpecificChange}
          />

          <TagsSection
            tags={tags}
            onTagsChange={setTags}
          />

          <Card>
            <CardHeader>
              <CardTitle>Product Status</CardTitle>
            </CardHeader>
            <div className="space-y-4">
              <div className="space-y-3">
                <Checkbox
                  id="is-active"
                  label="Active"
                  checked={isActive}
                  onChange={setIsActive}
                />
                <p className="text-xs text-gray-500 -mt-2 ml-6">Make this product visible on your store</p>
              </div>
              <div className="space-y-3">
                <Checkbox
                  id="is-featured"
                  label="Featured"
                  checked={isFeatured}
                  onChange={setIsFeatured}
                />
                <p className="text-xs text-gray-500 -mt-2 ml-6">Highlight this product on your homepage</p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
    </>
  );
}
