'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Plus, Search, Edit, Trash2, Eye, Package, FolderOpen } from 'lucide-react';

// Mock data
const collections = [
  {
    id: '1',
    name: 'Summer Collection 2024',
    slug: 'summer-collection-2024',
    products_count: 24,
    is_active: true,
    image: 'https://via.placeholder.com/200',
    description: 'Fresh summer styles and essentials',
  },
  {
    id: '2',
    name: 'Best Sellers',
    slug: 'best-sellers',
    products_count: 18,
    is_active: true,
    image: 'https://via.placeholder.com/200',
    description: 'Our most popular products',
  },
  {
    id: '3',
    name: 'New Arrivals',
    slug: 'new-arrivals',
    products_count: 12,
    is_active: true,
    image: 'https://via.placeholder.com/200',
    description: 'Latest products in stock',
  },
  {
    id: '4',
    name: 'Sale Items',
    slug: 'sale-items',
    products_count: 35,
    is_active: false,
    image: 'https://via.placeholder.com/200',
    description: 'Discounted products and clearance',
  },
];

export default function CollectionsPage() {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Collections</h1>
          <p className="text-gray-600 mt-1">Organize your products into collections</p>
        </div>
        <Link href="/dashboard/collections/new">
          <Button variant="primary" size="lg">
            <Plus className="w-5 h-5" />
            Create Collection
          </Button>
        </Link>
      </div>

      {/* Search */}
      <Card>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <Input
            placeholder="Search collections..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </Card>

      {/* Collections Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {collections.map((collection) => (
          <Card key={collection.id} padding={false} className="overflow-hidden group hover:shadow-lg transition-shadow">
            {/* Image */}
            <div className="relative h-48 bg-gray-100">
              <img
                src={collection.image}
                alt={collection.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                <Link href={`/dashboard/collections/${collection.id}`}>
                  <button className="p-2 bg-white rounded-lg hover:bg-gray-100 transition-colors">
                    <Eye className="w-5 h-5 text-gray-700" />
                  </button>
                </Link>
                <Link href={`/dashboard/collections/${collection.id}/edit`}>
                  <button className="p-2 bg-white rounded-lg hover:bg-gray-100 transition-colors">
                    <Edit className="w-5 h-5 text-gray-700" />
                  </button>
                </Link>
              </div>
            </div>

            {/* Content */}
            <div className="p-6">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{collection.name}</h3>
                  <p className="text-sm text-gray-500 mt-1">{collection.description}</p>
                </div>
                <span className={`
                  inline-flex items-center px-2 py-1 rounded-full text-xs font-medium
                  ${collection.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}
                `}>
                  {collection.is_active ? 'Active' : 'Inactive'}
                </span>
              </div>

              <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
                <Package className="w-4 h-4" />
                <span>{collection.products_count} products</span>
              </div>

              <div className="flex items-center gap-2">
                <Link href={`/dashboard/collections/${collection.id}/edit`} className="flex-1">
                  <Button variant="outline" size="sm" className="w-full">
                    <Edit className="w-4 h-4" />
                    Edit
                  </Button>
                </Link>
                <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {collections.length === 0 && (
        <Card>
          <div className="text-center py-12">
            <FolderOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No collections yet</h3>
            <p className="text-gray-600 mb-6">Get started by creating your first collection</p>
            <Link href="/dashboard/collections/new">
              <Button variant="primary">
                <Plus className="w-5 h-5" />
                Create Collection
              </Button>
            </Link>
          </div>
        </Card>
      )}
    </div>
  );
}

