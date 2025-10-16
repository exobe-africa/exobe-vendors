'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Eye, Edit, Trash2, MoreVertical } from 'lucide-react';

export interface UiProduct {
  id: string;
  title: string;
  category?: string;
  status?: string;
  price?: number;
  stock?: number;
  image?: string;
  featured?: boolean;
}

interface Props {
  items: UiProduct[];
  loading: boolean;
  onDelete: (id: string) => void;
}

export function ProductsTable({ items, loading, onDelete }: Props) {
  return (
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
                  <span className={`text-sm font-medium ${(product.stock ?? 0) > 0 ? 'text-gray-900' : 'text-red-600'}`}>
                    {product.stock !== undefined ? (product.stock > 0 ? `${product.stock} units` : 'Out of stock') : '—'}
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
                    <button onClick={() => onDelete(product.id)} className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
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
          {/* Placeholder; wire after API provides total */}
          Showing <span className="font-medium">1</span> to <span className="font-medium">{items.length}</span> of{' '}
          <span className="font-medium">{items.length}</span> products
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
  );
}


