'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Plus } from 'lucide-react';

export function ProductsHeader() {
  return (
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
  );
}


