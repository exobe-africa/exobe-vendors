'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Edit, Trash2, MoreVertical, CheckCircle, XCircle, FileText, Archive } from 'lucide-react';

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
  onDelete: (id: string) => Promise<void>;
  onStatusChange?: (id: string, status: string) => Promise<void>;
}

export function ProductsTable({ items, loading, onDelete, onStatusChange }: Props) {
  const router = useRouter();
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [menuPosition, setMenuPosition] = useState<{ top: number; left: number }>({ top: 0, left: 0 });
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateMessage, setUpdateMessage] = useState('');

  const handleRowClick = (productId: string, e: React.MouseEvent) => {
    // Don't navigate if clicking on interactive elements
    const target = e.target as HTMLElement;
    if (
      target.closest('button') || 
      target.closest('input') || 
      target.closest('a')
    ) {
      return;
    }
    router.push(`/dashboard/products/${productId}/edit`);
  };

  const toggleMenu = (productId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (openMenuId === productId) {
      setOpenMenuId(null);
    } else {
      const buttonRect = (e.currentTarget as HTMLButtonElement).getBoundingClientRect();
      setMenuPosition({
        top: buttonRect.bottom + 8,
        left: buttonRect.right - 192 // 192px is the menu width
      });
      setOpenMenuId(productId);
    }
  };

  const handleStatusChange = async (productId: string, status: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setOpenMenuId(null);
    
    // Show loading overlay
    const statusText = status === 'ACTIVE' ? 'Active' : status === 'DRAFT' ? 'Draft' : 'Archived';
    setUpdateMessage(`Updating product status to ${statusText}...`);
    setIsUpdating(true);
    
    try {
      if (onStatusChange) {
        await onStatusChange(productId, status);
      }
    } catch (error) {
      console.error('Error updating product status:', error);
    } finally {
      // Hide loading overlay after operation completes
      setIsUpdating(false);
    }
  };

  const handleDelete = async (productId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setOpenMenuId(null);
    
    // Show loading overlay
    setUpdateMessage('Deleting product...');
    setIsUpdating(true);
    
    try {
      await onDelete(productId);
    } catch (error) {
      console.error('Error deleting product:', error);
    } finally {
      // Hide loading overlay after operation completes
      setIsUpdating(false);
    }
  };
  if (loading) {
    return (
      <Card padding={false}>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">
                  <input type="checkbox" className="rounded" disabled />
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
              {/* Skeleton rows */}
              {[1, 2, 3, 4, 5].map((i) => (
                <tr key={i} className="border-b border-gray-100">
                  <td className="py-4 px-6">
                    <div className="w-4 h-4 bg-gray-200 rounded animate-pulse"></div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gray-200 rounded-lg animate-pulse"></div>
                      <div className="space-y-2">
                        <div className="h-4 w-48 bg-gray-200 rounded animate-pulse"></div>
                        <div className="h-3 w-20 bg-gray-200 rounded animate-pulse"></div>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="h-4 w-24 bg-gray-200 rounded animate-pulse"></div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="h-6 w-16 bg-gray-200 rounded-full animate-pulse"></div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="h-4 w-20 bg-gray-200 rounded animate-pulse"></div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="h-4 w-16 bg-gray-200 rounded animate-pulse"></div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-gray-200 rounded-lg animate-pulse"></div>
                      <div className="w-8 h-8 bg-gray-200 rounded-lg animate-pulse"></div>
                      <div className="w-8 h-8 bg-gray-200 rounded-lg animate-pulse"></div>
                      <div className="w-8 h-8 bg-gray-200 rounded-lg animate-pulse"></div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Skeleton Pagination */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200">
          <div className="h-4 w-48 bg-gray-200 rounded animate-pulse"></div>
          <div className="flex items-center gap-2">
            <div className="h-9 w-20 bg-gray-200 rounded-lg animate-pulse"></div>
            <div className="h-9 w-16 bg-gray-200 rounded-lg animate-pulse"></div>
          </div>
        </div>
      </Card>
    );
  }

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
            {items.map((product) => (
              <tr 
                key={product.id} 
                onClick={(e) => handleRowClick(product.id, e)}
                className="border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors"
              >
                <td className="py-4 px-6" onClick={(e) => e.stopPropagation()}>
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
                <td className="py-4 px-6 text-sm text-gray-600">{product.category || '—'}</td>
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
                    <Link href={`/dashboard/products/${product.id}/edit`} onClick={(e) => e.stopPropagation()}>
                      <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
                        <Edit className="w-4 h-4" />
                      </button>
                    </Link>
                    <button 
                      onClick={(e) => toggleMenu(product.id, e)}
                      className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
                    >
                      <MoreVertical className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Dropdown Menu - Rendered outside table with fixed positioning */}
      {openMenuId && (
        <>
          {/* Backdrop to close menu when clicking outside */}
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setOpenMenuId(null)}
          />
          <div 
            className="fixed z-50 w-48 bg-white rounded-lg shadow-xl border border-gray-200 py-1"
            style={{
              top: `${menuPosition.top}px`,
              left: `${menuPosition.left}px`
            }}
          >
            {(() => {
              const currentProduct = items.find(p => p.id === openMenuId);
              const currentStatus = currentProduct?.status;
              
              return (
                <>
                  {currentStatus !== 'ACTIVE' && (
                    <button
                      onClick={(e) => handleStatusChange(openMenuId, 'ACTIVE', e)}
                      className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors text-left cursor-pointer"
                    >
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      Mark as Active
                    </button>
                  )}
                  {currentStatus !== 'DRAFT' && (
                    <button
                      onClick={(e) => handleStatusChange(openMenuId, 'DRAFT', e)}
                      className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors text-left cursor-pointer"
                    >
                      <FileText className="w-4 h-4 text-gray-600" />
                      Mark as Draft
                    </button>
                  )}
                  {currentStatus !== 'ARCHIVED' && (
                    <button
                      onClick={(e) => handleStatusChange(openMenuId, 'ARCHIVED', e)}
                      className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors text-left cursor-pointer"
                    >
                      <Archive className="w-4 h-4 text-orange-600" />
                      Archive
                    </button>
                  )}
                  <div className="border-t border-gray-200 my-1"></div>
                  <button
                    onClick={(e) => handleDelete(openMenuId, e)}
                    className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors text-left cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete Product
                  </button>
                </>
              );
            })()}
          </div>
        </>
      )}

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

      {/* Loading Overlay */}
      {isUpdating && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-2xl p-8 flex flex-col items-center gap-4 min-w-[300px]">
            <div className="relative">
              <div className="w-16 h-16 border-4 border-gray-200 rounded-full"></div>
              <div className="absolute top-0 left-0 w-16 h-16 border-4 border-red-600 rounded-full border-t-transparent animate-spin"></div>
            </div>
            <p className="text-lg font-medium text-gray-900">{updateMessage}</p>
            <p className="text-sm text-gray-500">Please wait...</p>
          </div>
        </div>
      )}
    </Card>
  );
}


