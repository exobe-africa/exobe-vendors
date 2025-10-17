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
import { useProductStore } from '@/store/product';
import { X, Plus, Upload, ArrowLeft, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { BasicInfoSection } from '../../../../components/pages/products/new/BasicInfoSection';
import { MediaSection } from '../../../../components/pages/products/new/MediaSection';
import { OptionsSection } from '../../../../components/pages/products/new/OptionsSection';
import { VariantsSection } from '../../../../components/pages/products/new/VariantsSection';
import { CategorySelector } from '../../../../components/pages/products/new/CategorySelector';

export default function NewProductPage() {
  const router = useRouter();
  const { 
    categories, 
    fetchCategories, 
    createProduct, 
    isSubmitting, 
    error, 
    clearError 
  } = useProductStore();
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<'DRAFT'|'ACTIVE'|'ARCHIVED'>('DRAFT');
  const [categoryId, setCategoryId] = useState<string>('');
  const [isFeatured, setIsFeatured] = useState(false);
  const [isActive, setIsActive] = useState(true);
  const [trackInventory, setTrackInventory] = useState(true);
  const [allowBackorder, setAllowBackorder] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  async function handleCreate() {
    if (!title || !categoryId) return alert('Title and category are required');
    clearError();
    
    try {
      await createProduct({
        title,
        description,
        status,
        categoryId,
        isFeatured,
        isActive,
        trackInventory,
        allowBackorder,
        options,
        variants,
        images,
      });
      router.push('/dashboard/products');
    } catch (err) {
      console.error(err);
    }
  }
  interface ProductOption { name: string; values: string[] }
  interface ProductVariant { sku: string; price: number; stock: number; attributes: Record<string, string> }

  const [variants, setVariants] = useState<ProductVariant[]>([]);
  const [options, setOptions] = useState<ProductOption[]>([
    { name: 'Size', values: ['Small', 'Medium', 'Large'] },
  ]);
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

  const handleAddVariant = () => {
    setVariants([...variants, { sku: '', price: 0, stock: 0, attributes: {} }]);
  };

  return (
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

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Error</h3>
              <div className="mt-2 text-sm text-red-700">
                <p>{error}</p>
              </div>
              <div className="mt-4">
                <div className="-mx-2 -my-1.5 flex">
                  <button
                    type="button"
                    onClick={clearError}
                    className="bg-red-50 px-2 py-1.5 rounded-md text-sm font-medium text-red-800 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-red-50 focus:ring-red-600"
                  >
                    Dismiss
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <BasicInfoSection
            title={title}
            onTitleChange={setTitle}
            description={description}
            onDescriptionChange={setDescription}
          />

          <MediaSection images={images} />

          <Card>
            <CardHeader>
              <CardTitle>Pricing</CardTitle>
            </CardHeader>
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Price"
                type="number"
                placeholder="0.00"
                helperText="In ZAR"
              />
              <Input
                label="Compare at Price"
                type="number"
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
          />

          <VariantsSection variantLabels={options[0]?.values ?? []} />

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

        <div className="space-y-6">
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

          <CategorySelector
            categories={categories}
            selectedCategoryId={categoryId}
            onSelectCategory={setCategoryId}
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

          <Card>
            <CardHeader>
              <CardTitle>Tags</CardTitle>
            </CardHeader>
            <Input placeholder="Add tags separated by comma" />
            <p className="text-xs text-gray-500 mt-2">e.g. wireless, bluetooth, premium</p>
          </Card>

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
  );
}

