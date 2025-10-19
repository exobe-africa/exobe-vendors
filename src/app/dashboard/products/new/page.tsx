'use client';

import { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Card, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Select } from '@/components/ui/Select';
import { Checkbox } from '@/components/ui/Checkbox';
import { useProductStore, type ProductType } from '@/store/product';
import { X, Plus, Upload, ArrowLeft, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { BasicInfoSection } from '../../../../components/pages/products/new/BasicInfoSection';
import { MediaSection } from '../../../../components/pages/products/new/MediaSection';
import { OptionsSection } from '../../../../components/pages/products/new/OptionsSection';
import { VariantsSection } from '../../../../components/pages/products/new/VariantsSection';
import { CategorySelector } from '../../../../components/pages/products/new/CategorySelector';
import { ProductTypeSelector } from '../../../../components/pages/products/new/ProductTypeSelector';
import { TypeSpecificFields } from '../../../../components/pages/products/new/TypeSpecificFields';
import { PickupAddressSection } from '../../../../components/pages/products/new/PickupAddressSection';
import { ReturnPolicySection } from '../../../../components/pages/products/new/ReturnPolicySection';
import { WarrantySection } from '../../../../components/pages/products/new/WarrantySection';
import { TagsSection } from '../../../../components/pages/products/new/TagsSection';
import { useToast } from '@/hooks/useToast';
import { ToastContainer } from '@/components/ui/Toast';

export default function NewProductPage() {
  const router = useRouter();
  const { 
    categories, 
    fetchCategories, 
    createProduct, 
    isSubmitting,
    isLoading,
    error, 
    clearError 
  } = useProductStore();
  const { toasts, success, error: showError, warning, removeToast } = useToast();
  
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

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const handleTypeSpecificChange = (name: string, value: any) => {
    setTypeSpecificData(prev => ({ ...prev, [name]: value }));
  };

  async function handleCreate() {
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
      await createProduct({
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
        ...typeSpecificData, // Include all type-specific fields
        options,
        variants,
        images,
      });
      success('Product created successfully!');
      router.push('/dashboard/products');
    } catch (err) {
      console.error(err);
      showError(err instanceof Error ? err.message : 'Failed to create product. Please try again.');
    }
  }
  interface ProductOption { name: string; values: string[] }
  interface ProductVariant { sku: string; price: number; stock: number; attributes: Record<string, string>; images?: string[] }

  const [variants, setVariants] = useState<ProductVariant[]>([]);
  const [options, setOptions] = useState<ProductOption[]>([]);
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

  return (
    <>
      <ToastContainer toasts={toasts} onRemove={removeToast} />
      
    <div className="space-y-6 max-w-7xl">
      <div className="flex items-center gap-4">
        <Link href="/dashboard/products">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="w-4 h-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Add New Product</h1>
          <p className="text-gray-600 mt-1">Create a new product in your catalog</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6 pb-6">
          <BasicInfoSection
            title={title}
            onTitleChange={setTitle}
            description={description}
            onDescriptionChange={setDescription}
          />

          <MediaSection images={images} onImagesChange={setImages} />

          <Card>
            <CardHeader>
              <CardTitle>Pricing</CardTitle>
            </CardHeader>
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Price"
                type="number"
                min="0"
                step="0.01"
                placeholder="0.00"
                helperText="In ZAR"
              />
              <Input
                label="Compare at Price"
                type="number"
                min="0"
                step="0.01"
                placeholder="0.00"
                helperText="Original price for sale display"
              />
            </div>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Inventory</CardTitle>
            </CardHeader>
            <div className="space-y-4">
              <Input
                label="Stock Quantity"
                type="number"
                min="0"
                placeholder="0"
              />
              <Checkbox
                id="track-inventory"
                label="Track inventory"
                checked={trackInventory}
                onChange={setTrackInventory}
              />
              <Checkbox
                id="allow-backorder"
                label="Allow backorders"
                checked={allowBackorder}
                onChange={setAllowBackorder}
              />
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
              <div className="flex items-center gap-2">
                <CardTitle>Delivery Timeframe</CardTitle>
                <div className="group relative">
                  <svg className="w-4 h-4 text-gray-400 cursor-help" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div className="absolute left-0 top-6 w-64 p-3 bg-gray-900 text-white text-xs rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10">
                    Set the estimated delivery time for this product. This will be displayed to customers at checkout.
                  </div>
                </div>
              </div>
              <p className="text-sm text-gray-500 mt-1">
                Estimated delivery time displayed to customers
              </p>
            </CardHeader>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Quick Presets
                </label>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => { setDeliveryMinDays(1); setDeliveryMaxDays(2); }}
                    className="px-3 py-1.5 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    1-2 days (Express)
                  </button>
                  <button
                    type="button"
                    onClick={() => { setDeliveryMinDays(2); setDeliveryMaxDays(5); }}
                    className="px-3 py-1.5 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    2-5 days (Standard)
                  </button>
                  <button
                    type="button"
                    onClick={() => { setDeliveryMinDays(5); setDeliveryMaxDays(7); }}
                    className="px-3 py-1.5 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    5-7 days (Economy)
                  </button>
                  <button
                    type="button"
                    onClick={() => { setDeliveryMinDays(7); setDeliveryMaxDays(14); }}
                    className="px-3 py-1.5 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    1-2 weeks
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Minimum Days"
                  type="number"
                  min="1"
                  placeholder="1"
                  value={deliveryMinDays}
                  onChange={(e) => setDeliveryMinDays(Math.max(1, parseInt(e.target.value) || 1))}
                  helperText="Shortest delivery time"
                />
                <Input
                  label="Maximum Days"
                  type="number"
                  min="1"
                  placeholder="3"
                  value={deliveryMaxDays}
                  onChange={(e) => setDeliveryMaxDays(Math.max(1, parseInt(e.target.value) || 3))}
                  helperText="Longest delivery time"
                />
              </div>
              
              {/* Preview */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div>
                    <p className="text-sm font-medium text-blue-900 mb-1">Customer will see:</p>
                    <div className="flex items-center gap-2 text-sm text-blue-800">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                      </svg>
                      <span className="font-medium">
                        Delivery: {deliveryMinDays === deliveryMaxDays 
                          ? `${deliveryMinDays} ${deliveryMinDays === 1 ? 'day' : 'days'}`
                          : `${deliveryMinDays}-${deliveryMaxDays} days`
                        }
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <CardTitle>Shipping Dimensions & Weight</CardTitle>
                <div className="group relative">
                  <svg className="w-4 h-4 text-gray-400 cursor-help" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div className="absolute left-0 top-6 w-72 p-3 bg-gray-900 text-white text-xs rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10">
                    These measurements are crucial for logistics planning, shipping cost calculation, and route optimization. Accurate dimensions help carriers determine vehicle capacity and packaging requirements.
                  </div>
                </div>
              </div>
              <p className="text-sm text-gray-500 mt-1">
                Required for logistics, shipping costs, and supply chain planning
              </p>
            </CardHeader>
            <div className="space-y-6">
              {/* Weight Section */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Product Weight
                </label>
                <div className="grid grid-cols-3 gap-3">
                  <div className="col-span-2">
                      <Input
                      type="number"
                      min="0"
                      step="0.01"
                      placeholder="0.00"
                      value={weight || ''}
                      onChange={(e) => setWeight(Math.max(0, parseFloat(e.target.value) || 0))}
                    />
                  </div>
                  <Select
                    options={[
                      { value: 'kg', label: 'Kilograms (kg)' },
                      { value: 'g', label: 'Grams (g)' },
                    ]}
                    value={weightUnit}
                    onChange={(e) => setWeightUnit(e.target.value as 'kg' | 'g')}
                  />
                </div>
              </div>

              {/* Dimensions Section */}
                      <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Package Dimensions
                  <span className="text-xs text-gray-500 font-normal ml-2">(Length × Width × Height)</span>
                        </label>
                <div className="space-y-3">
                  <div className="grid grid-cols-3 gap-3">
                    <Input
                      label="Length"
                      type="number"
                      min="0"
                      step="0.1"
                      placeholder="0"
                      value={length || ''}
                      onChange={(e) => setLength(Math.max(0, parseFloat(e.target.value) || 0))}
                    />
                    <Input
                      label="Width"
                      type="number"
                      min="0"
                      step="0.1"
                      placeholder="0"
                      value={width || ''}
                      onChange={(e) => setWidth(Math.max(0, parseFloat(e.target.value) || 0))}
                    />
                    <Input
                      label="Height"
                      type="number"
                      min="0"
                      step="0.1"
                      placeholder="0"
                      value={height || ''}
                      onChange={(e) => setHeight(Math.max(0, parseFloat(e.target.value) || 0))}
                    />
                  </div>
                  <div>
                    <Select
                      label="Unit"
                      options={[
                        { value: 'cm', label: 'Centimeters (cm)' },
                        { value: 'm', label: 'Meters (m)' },
                      ]}
                      value={dimensionUnit}
                      onChange={(e) => setDimensionUnit(e.target.value as 'cm' | 'm')}
                    />
                  </div>
                </div>
                        </div>

              {/* Calculated Volume Display */}
              {(length > 0 && width > 0 && height > 0) && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-green-900 mb-1">Calculated Volume</p>
                      <div className="space-y-1">
                        <p className="text-sm text-green-800">
                          <span className="font-semibold">{(length * width * height).toFixed(2)}</span> {dimensionUnit === 'cm' ? 'cm³' : 'm³'}
                        </p>
                        {dimensionUnit === 'cm' && (
                          <p className="text-xs text-green-700">
                            ≈ {((length * width * height) / 1000000).toFixed(4)} m³
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Info Banner */}
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                <div className="flex items-start gap-2">
                  <svg className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div className="text-xs text-amber-900">
                    <p className="font-semibold mb-1">💡 Measurement Tips:</p>
                    <ul className="space-y-1 ml-2">
                      <li>• Measure the packaged product (including box/packaging)</li>
                      <li>• Use the longest side as Length, shortest as Height</li>
                      <li>• Round up to the nearest unit for accuracy</li>
                      <li>• Include weight of packaging materials</li>
                    </ul>
                  </div>
                </div>
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
            options={options}
            variants={variants}
            onVariantsChange={setVariants}
            productType={productType}
          />

          <Card>
            <CardHeader>
              <CardTitle>Search Engine Optimization</CardTitle>
            </CardHeader>
            <div className="space-y-4">
              <Input
                label="SEO Title"
                placeholder="Product title for search engines"
                helperText="70 characters max"
              />
              <Textarea
                label="SEO Description"
                placeholder="Description for search engines"
                rows={3}
                helperText="160 characters max"
              />
            </div>
          </Card>
        </div>

        <div className="space-y-6 lg:sticky lg:top-6 lg:self-start">
          <Card>
            <CardHeader>
              <CardTitle>Status</CardTitle>
            </CardHeader>
            <Select
              options={[
                { value: 'DRAFT', label: 'Draft' },
                { value: 'ACTIVE', label: 'Active' },
                { value: 'ARCHIVED', label: 'Archived' },
              ]}
              value={status}
              onChange={(e) => setStatus((e.target as HTMLSelectElement).value as any)}
            />
          </Card>

          <ProductTypeSelector
            selectedType={productType}
            onSelect={setProductType}
          />

          <TypeSpecificFields
            productType={productType}
            values={typeSpecificData}
            onChange={handleTypeSpecificChange}
          />

          <CategorySelector
            categories={categories}
            selectedCategoryId={categoryId}
            onSelectCategory={setCategoryId}
            isLoading={isLoading}
          />

          <Card>
            <CardHeader>
              <CardTitle>Product Settings</CardTitle>
            </CardHeader>
            <div className="space-y-3">
              <Checkbox
                id="featured"
                label="Featured product"
                checked={isFeatured}
                onChange={setIsFeatured}
              />
              <Checkbox
                id="active"
                label="Active"
                checked={isActive}
                onChange={setIsActive}
              />
            </div>
          </Card>

          <TagsSection
            tags={tags}
            onTagsChange={setTags}
          />

          <div className="space-y-3">
            <Button onClick={handleCreate} disabled={isSubmitting} variant="primary" size="lg" className="w-full">
              {isSubmitting ? 'Creating...' : 'Create Product'}
            </Button>
            <Button variant="outline" size="lg" className="w-full">
              Save as Draft
            </Button>
          </div>
        </div>
      </div>
    </div>
    </>
  );
}

