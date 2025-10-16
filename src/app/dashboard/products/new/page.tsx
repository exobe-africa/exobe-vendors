'use client';

import { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Card, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Select } from '@/components/ui/Select';
import { getApolloClient } from '@/lib/apollo/client';
import { CATEGORY_TREE, CREATE_PRODUCT } from '@/lib/api/products';
import { slugify } from '@/lib/utils';
import { X, Plus, Upload, ArrowLeft, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { BasicInfoSection } from '../../../../components/pages/products/new/BasicInfoSection';
import { MediaSection } from '../../../../components/pages/products/new/MediaSection';
import { OptionsSection } from '../../../../components/pages/products/new/OptionsSection';
import { VariantsSection } from '../../../../components/pages/products/new/VariantsSection';

export default function NewProductPage() {
  const router = useRouter();
  const client = getApolloClient();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<'DRAFT'|'ACTIVE'|'ARCHIVED'>('DRAFT');
  const [categoryId, setCategoryId] = useState<string>('');
  const [categories, setCategories] = useState<{ value: string; label: string }[]>([]);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    client.query({ query: CATEGORY_TREE, fetchPolicy: 'no-cache' }).then(({ data }: { data: any }) => {
      const flatted: { value: string; label: string }[] = [];
      function walk(nodes: any[], prefix = '') {
        for (const n of nodes || []) {
          flatted.push({ value: n.id, label: prefix ? `${prefix} / ${n.name}` : n.name });
          if (n.children?.length) walk(n.children, prefix ? `${prefix} / ${n.name}` : n.name);
        }
      }
      walk((data as any).categoryTree || []);
      setCategories([{ value: '', label: 'Select a category' }, ...flatted]);
    }).catch(() => setCategories([{ value: '', label: 'Select a category' }]));
  }, [client]);

  async function handleCreate() {
    if (!title || !categoryId) return alert('Title and category are required');
    setSubmitting(true);
    try {
      const input = {
        vendorId: '',
        categoryId,
        title,
        slug: slugify(title),
        description,
        status,
        isActive: status !== 'ARCHIVED',
      } as any;
      await client.mutate({ mutation: CREATE_PRODUCT, variables: { input } });
      router.push('/dashboard/products');
    } finally {
      setSubmitting(false);
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
              <div className="flex items-center gap-2">
                <input type="checkbox" id="track-inventory" className="rounded" defaultChecked />
                <label htmlFor="track-inventory" className="text-sm text-gray-700">
                  Track inventory
                </label>
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" id="allow-backorder" className="rounded" />
                <label htmlFor="allow-backorder" className="text-sm text-gray-700">
                  Allow backorders
                </label>
              </div>
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

          <Card>
            <CardHeader>
              <CardTitle>Category</CardTitle>
            </CardHeader>
            <Select
              options={categories}
              value={categoryId}
              onChange={(e) => setCategoryId((e.target as HTMLSelectElement).value)}
            />
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Product Settings</CardTitle>
            </CardHeader>
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <input type="checkbox" id="featured" className="rounded" />
                <label htmlFor="featured" className="text-sm text-gray-700">
                  Featured product
                </label>
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" id="active" className="rounded" defaultChecked />
                <label htmlFor="active" className="text-sm text-gray-700">
                  Active
                </label>
              </div>
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
            <Button onClick={handleCreate} disabled={submitting} variant="primary" size="lg" className="w-full">
              {submitting ? 'Creating...' : 'Create Product'}
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

