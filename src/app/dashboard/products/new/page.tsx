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
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <div className="space-y-4">
              <Input
                label="Product Title"
                placeholder="e.g. Premium Wireless Headphones"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
              <Textarea
                label="Description"
                placeholder="Describe your product..."
                rows={6}
                helperText="Rich text editor for detailed product description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="SKU"
                  placeholder="e.g. PROD-001"
                  helperText="Stock Keeping Unit"
                />
                <Input
                  label="Barcode"
                  placeholder="e.g. 1234567890"
                />
              </div>
            </div>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Product Media</CardTitle>
            </CardHeader>
            <div className="space-y-4">
              <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-red-500 transition-colors cursor-pointer">
                <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-sm font-medium text-gray-700 mb-1">Click to upload or drag and drop</p>
                <p className="text-xs text-gray-500">SVG, PNG, JPG or GIF (max. 800x400px)</p>
              </div>
              
              {images.length > 0 && (
                <div className="grid grid-cols-4 gap-4">
                  {images.map((img, index) => (
                    <div key={index} className="relative group">
                      <Image src={img} alt="" width={200} height={96} className="w-full h-24 object-cover rounded-lg" />
                      <button className="absolute top-2 right-2 bg-red-600 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </Card>

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

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Product Options</CardTitle>
                <Button variant="outline" size="sm" onClick={handleAddOption}>
                  <Plus className="w-4 h-4" />
                  Add Option
                </Button>
              </div>
            </CardHeader>
            <div className="space-y-4">
              {options.map((option, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-start gap-4">
                    <div className="flex-1 space-y-3">
                      <Input
                        label="Option Name"
                        placeholder="e.g. Size, Color, Material"
                        value={option.name}
                        onChange={(e) => handleOptionNameChange(index, e.target.value)}
                      />
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">
                          Option Values
                        </label>
                        <div className="flex flex-wrap gap-2 mb-2">
                          {option.values.map((value: string, vIndex: number) => (
                            <span key={vIndex} className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 rounded-full text-sm">
                              {value}
                              <button className="text-gray-500 hover:text-red-600">
                                <X className="w-3 h-3" />
                              </button>
                            </span>
                          ))}
                        </div>
                        <Input placeholder="Add value and press Enter" />
                      </div>
                    </div>
                    <button
                      onClick={() => handleRemoveOption(index)}
                      className="text-red-600 hover:text-red-700 p-2"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))}
              {options.length === 0 && (
                <p className="text-sm text-gray-500 text-center py-4">
                  No options added. Click "Add Option" to create product variants.
                </p>
              )}
            </div>
          </Card>

          {options.length > 0 && (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Product Variants</CardTitle>
                  <Button variant="outline" size="sm" onClick={handleAddVariant}>
                    <Plus className="w-4 h-4" />
                    Add Variant
                  </Button>
                </div>
              </CardHeader>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Variant</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">SKU</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Price</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Stock</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {options[0].values.map((value: string, index: number) => (
                      <tr key={index} className="border-b border-gray-100">
                        <td className="py-3 px-4 text-sm text-gray-900">{value}</td>
                        <td className="py-3 px-4">
                          <Input placeholder="SKU" className="text-sm" />
                        </td>
                        <td className="py-3 px-4">
                          <Input type="number" placeholder="0.00" className="text-sm" />
                        </td>
                        <td className="py-3 px-4">
                          <Input type="number" placeholder="0" className="text-sm" />
                        </td>
                        <td className="py-3 px-4">
                          <button className="text-red-600 hover:text-red-700">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          )}

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

