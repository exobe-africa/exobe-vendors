'use client';

import { useEffect, useMemo, useState } from 'react';
import { ProductsHeader } from '../../../components/pages/products/ProductsHeader';
import { ProductsFilters } from '../../../components/pages/products/ProductsFilters';
import { ProductsTable, UiProduct } from '../../../components/pages/products/ProductsTable';
import { useAuthStore } from '@/store/auth';
import { useProductStore } from '@/store/product';
import { useToast } from '@/hooks/useToast';
import { ToastContainer } from '@/components/ui/Toast';
import { useConfirm } from '@/hooks/useConfirm';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';

// UiProduct type imported from ProductsTable component

export default function ProductsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const { 
    products, 
    fetchProducts, 
    deleteProduct, 
    isLoading, 
    error, 
    clearError 
  } = useProductStore();
  const { user } = useAuthStore();
  const { toasts, success, error: showError, warning, removeToast } = useToast();
  const confirmDialog = useConfirm();

  const variables = useMemo(() => ({
    query: searchQuery || undefined,
    status: statusFilter === 'all' ? undefined : statusFilter,
    vendorId: undefined as string | undefined, // backend infers by user; pass if you store vendorId
    limit: 50,
  }), [searchQuery, statusFilter]);

  useEffect(() => {
    fetchProducts(variables);
  }, [fetchProducts, variables]);

  async function handleDelete(id: string) {
    const confirmed = await confirmDialog.confirm({
      title: 'Delete Product',
      message: 'Are you sure you want to delete this product? This action cannot be undone.',
      confirmText: 'Delete',
      cancelText: 'Cancel',
      variant: 'danger',
    });
    
    if (!confirmed) return;
    
    clearError();
    try {
      await deleteProduct(id);
      success('Product deleted successfully');
    } catch (err) {
      console.error(err);
      showError(err instanceof Error ? err.message : 'Failed to delete product. Please try again.');
    }
  }

  async function handleStatusChange(id: string, status: string) {
    clearError();
    try {
      // Use the updateProduct method from the store
      const { updateProduct } = useProductStore.getState();
      await updateProduct(id, { status });
      success(`Product status changed to ${status}`);
      // Refresh the products list
      await fetchProducts(variables);
    } catch (err) {
      console.error(err);
      showError(err instanceof Error ? err.message : 'Failed to update product status. Please try again.');
    }
  }

  // Transform products data for UI
  const items: UiProduct[] = products.map((r: any) => {
    // Determine price and stock from product-level fields or variants
    let price: number | undefined;
    let stock: number | undefined;

    if (r.variants && r.variants.length > 0) {
      // If variants exist, use the first variant's data
      price = r.variants[0]?.priceCents ? r.variants[0].priceCents / 100 : undefined;
      stock = r.variants[0]?.stockQuantity;
    } else {
      // If no variants, use product-level pricing
      price = r.priceInCents ? r.priceInCents / 100 : undefined;
      stock = r.stockQuantity;
    }

    return {
      id: r.id,
      title: r.title,
      category: r.category?.name,
      status: r.status,
      price,
      stock,
      image: r.media?.[0]?.url,
      featured: r.featured,
    };
  });

  return (
    <>
      <ToastContainer toasts={toasts} onRemove={removeToast} />
      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        title={confirmDialog.title}
        message={confirmDialog.message}
        confirmText={confirmDialog.confirmText}
        cancelText={confirmDialog.cancelText}
        variant={confirmDialog.variant}
        onConfirm={confirmDialog.onConfirm}
        onCancel={confirmDialog.cancel}
      />
      
      <div className="space-y-6">
        <ProductsHeader />
        <ProductsFilters
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          status={statusFilter}
          onStatusChange={setStatusFilter}
        />
        <ProductsTable items={items} loading={isLoading} onDelete={handleDelete} onStatusChange={handleStatusChange} />
      </div>
    </>
  );
}

