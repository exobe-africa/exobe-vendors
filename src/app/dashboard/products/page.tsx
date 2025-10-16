'use client';

import { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Plus, Search, Filter, Edit, Trash2, Eye, MoreVertical } from 'lucide-react';
import { useAuthStore } from '@/store/auth';
import { getApolloClient } from '@/lib/apollo/client';
import { SEARCH_PRODUCTS, DELETE_PRODUCT } from '@/lib/api/products';

interface UiProduct {
  id: string;
  title: string;
  category?: string;
  status?: string;
  price?: number;
  stock?: number;
  image?: string;
  featured?: boolean;
}

export default function ProductsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [items, setItems] = useState<UiProduct[]>([]);
  const [loading, setLoading] = useState(false);
  const client = getApolloClient();
  const { user } = useAuthStore();

  const variables = useMemo(() => ({
    query: searchQuery || undefined,
    status: statusFilter === 'all' ? undefined : statusFilter,
    vendorId: undefined as string | undefined, // backend infers by user; pass if you store vendorId
    limit: 50,
  }), [searchQuery, statusFilter]);

  useEffect(() => {
    let ignore = false;
    const run = async () => {
      setLoading(true);
      try {
        const { data } = await client.query({ query: SEARCH_PRODUCTS, variables, fetchPolicy: 'no-cache' });
        const payload = JSON.parse((data as any).searchProducts || '{}');
        const rows = Array.isArray(payload.items) ? payload.items : [];
        const mapped: UiProduct[] = rows.map((r: any) => ({
          id: r.id,
          title: r.title,
          category: r.category?.name,
          status: r.status,
          price: r.defaultVariant?.priceCents ? r.defaultVariant.priceCents / 100 : undefined,
          stock: r.defaultVariant?.stockQuantity,
          image: r.media?.[0]?.url,
          featured: r.featured,
        }));
        if (!ignore) setItems(mapped);
      } finally {
        if (!ignore) setLoading(false);
      }
    };
    run();
    return () => { ignore = true; };
  }, [client, variables]);

  async function handleDelete(id: string) {
    if (!confirm('Delete this product?')) return;
    await client.mutate({ mutation: DELETE_PRODUCT, variables: { id } });
    setItems(prev => prev.filter(p => p.id !== id));
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Products</h1>
          <p className="text-gray-600 mt-1">Manage your product inventory</p>
        </div>
        <Link href="/dashboard/products/new">
          <Button variant="primary" size="lg">
            <Plus className="w-5 h-5" />
            Add Product
          </Button>
        </Link>
      </div>

      {/* Filters */}
      <Card>
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <div className="w-full md:w-48">
            <Select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              options={[
                { value: 'all', label: 'All Status' },
                { value: 'ACTIVE', label: 'Active' },
                { value: 'DRAFT', label: 'Draft' },
                { value: 'ARCHIVED', label: 'Archived' },
              ]}
            />
          </div>
          <Button variant="outline">
            <Filter className="w-5 h-5" />
            More Filters
          </Button>
        </div>
      </Card>

      {/* Products Table */}
      <Card padding={false}>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">
                  <input type="checkbox" className="rounded" />
                </th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">Product</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">Category</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">Status</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">Price</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">Stock</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {(loading ? [] : items).map((product) => (
                <tr key={product.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-4 px-6">
                    <input type="checkbox" className="rounded" />
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-4">
                      <Image src={product.image || 'https://via.placeholder.com/80'} alt={product.title} width={48} height={48} className="w-12 h-12 rounded-lg object-cover bg-gray-100" />
                      <div>
                        <p className="font-medium text-gray-900">{product.title}</p>
                        {product.featured && (
                          <span className="text-xs text-red-600 font-medium">Featured</span>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-sm text-gray-600">{product.category}</td>
                  <td className="py-4 px-6">
                    <span className={`
                      inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                      ${product.status === 'ACTIVE' ? 'bg-green-100 text-green-800' : ''}
                      ${product.status === 'DRAFT' ? 'bg-gray-100 text-gray-800' : ''}
                      ${product.status === 'ARCHIVED' ? 'bg-red-100 text-red-800' : ''}
                    `}>
                      {product.status}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-sm font-medium text-gray-900">
                    {product.price !== undefined ? `R ${product.price.toFixed(2)}` : '—'}
                  </td>
                  <td className="py-4 px-6">
                    <span className={`text-sm font-medium ${product.stock > 0 ? 'text-gray-900' : 'text-red-600'}`}>
                      {product.stock > 0 ? `${product.stock} units` : 'Out of stock'}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-2">
                      <Link href={`/dashboard/products/${product.id}`}>
                        <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
                          <Eye className="w-4 h-4" />
                        </button>
                      </Link>
                      <Link href={`/dashboard/products/${product.id}/edit`}>
                        <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
                          <Edit className="w-4 h-4" />
                        </button>
                      </Link>
                      <button onClick={() => handleDelete(product.id)} className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200">
          <p className="text-sm text-gray-600">
            Showing <span className="font-medium">1</span> to <span className="font-medium">4</span> of{' '}
            <span className="font-medium">4</span> products
          </p>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" disabled>
              Previous
            </Button>
            <Button variant="outline" size="sm" disabled>
              Next
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}

