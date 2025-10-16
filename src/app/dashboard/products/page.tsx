'use client';

import { useEffect, useMemo, useState } from 'react';
import { ProductsHeader } from '../../../components/pages/products/ProductsHeader';
import { ProductsFilters } from '../../../components/pages/products/ProductsFilters';
import { ProductsTable, UiProduct } from '../../../components/pages/products/ProductsTable';
import { useAuthStore } from '@/store/auth';
import { getApolloClient } from '@/lib/apollo/client';
import { SEARCH_PRODUCTS, DELETE_PRODUCT } from '@/lib/api/products';

// UiProduct type imported from ProductsTable component

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
      <ProductsHeader />
      <ProductsFilters
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        status={statusFilter}
        onStatusChange={setStatusFilter}
      />
      <ProductsTable items={items} loading={loading} onDelete={handleDelete} />
    </div>
  );
}

