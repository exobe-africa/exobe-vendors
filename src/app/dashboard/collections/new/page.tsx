'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { ArrowLeft, Upload, X, Search, Plus } from 'lucide-react';

export default function NewCollectionPage() {
  const router = useRouter();
  const [selectedProducts, setSelectedProducts] = useState<any[]>([]);

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/dashboard/collections">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="w-4 h-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Create Collection</h1>
          <p className="text-gray-600 mt-1">Group products together for better organization</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle>Collection Details</CardTitle>
            </CardHeader>
            <div className="space-y-4">
              <Input
                label="Collection Name"
                placeholder="e.g. Summer Collection 2024"
                required
              />
              <Input
                label="Slug"
                placeholder="summer-collection-2024"
                helperText="URL-friendly version of the name"
              />
              <Textarea
                label="Description"
                placeholder="Describe this collection..."
                rows={4}
              />
            </div>
          </Card>

          {/* Collection Image */}
          <Card>
            <CardHeader>
              <CardTitle>Collection Image</CardTitle>
            </CardHeader>
            <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-red-500 transition-colors cursor-pointer">
              <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-sm font-medium text-gray-700 mb-1">Click to upload or drag and drop</p>
              <p className="text-xs text-gray-500">SVG, PNG, JPG (recommended: 1200x400px)</p>
            </div>
          </Card>

          {/* Products */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Products</CardTitle>
                <Button variant="outline" size="sm">
                  <Plus className="w-4 h-4" />
                  Add Products
                </Button>
              </div>
            </CardHeader>
            
            <div className="space-y-4">
              {/* Search Products */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  placeholder="Search products to add..."
                  className="pl-10"
                />
              </div>

              {/* Selected Products */}
              {selectedProducts.length > 0 ? (
                <div className="space-y-2">
                  {selectedProducts.map((product) => (
                    <div key={product.id} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                      <img
                        src={product.image}
                        alt={product.title}
                        className="w-12 h-12 rounded object-cover"
                      />
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">{product.title}</p>
                        <p className="text-sm text-gray-500">{product.sku}</p>
                      </div>
                      <button className="text-red-600 hover:text-red-700">
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 border-2 border-dashed border-gray-200 rounded-lg">
                  <p className="text-sm text-gray-500">No products added yet</p>
                  <p className="text-xs text-gray-400 mt-1">Search and add products to this collection</p>
                </div>
              )}
            </div>
          </Card>

          {/* Collection Rules (Advanced) */}
          <Card>
            <CardHeader>
              <CardTitle>Automated Collection Rules</CardTitle>
            </CardHeader>
            <div className="space-y-4">
              <p className="text-sm text-gray-600">
                Automatically add products that match specific conditions
              </p>
              <div className="p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-800">
                  <strong>Coming Soon:</strong> Create smart collections based on product tags, categories, prices, and more.
                </p>
              </div>
            </div>
          </Card>

          {/* SEO */}
          <Card>
            <CardHeader>
              <CardTitle>Search Engine Optimization</CardTitle>
            </CardHeader>
            <div className="space-y-4">
              <Input
                label="SEO Title"
                placeholder="Collection title for search engines"
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

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Status */}
          <Card>
            <CardHeader>
              <CardTitle>Visibility</CardTitle>
            </CardHeader>
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <input type="checkbox" id="is-active" className="rounded" defaultChecked />
                <label htmlFor="is-active" className="text-sm text-gray-700">
                  Active
                </label>
              </div>
              <p className="text-xs text-gray-500">
                Active collections will be visible on your storefront
              </p>
            </div>
          </Card>

          {/* Collection Type */}
          <Card>
            <CardHeader>
              <CardTitle>Collection Type</CardTitle>
            </CardHeader>
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <input type="radio" name="type" id="manual" className="rounded-full" defaultChecked />
                <label htmlFor="manual" className="text-sm text-gray-700">
                  Manual
                </label>
              </div>
              <div className="flex items-center gap-2">
                <input type="radio" name="type" id="automated" className="rounded-full" disabled />
                <label htmlFor="automated" className="text-sm text-gray-400">
                  Automated (Coming Soon)
                </label>
              </div>
            </div>
          </Card>

          {/* Actions */}
          <div className="space-y-3">
            <Button variant="primary" size="lg" className="w-full">
              Create Collection
            </Button>
            <Button variant="outline" size="lg" className="w-full">
              Cancel
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

