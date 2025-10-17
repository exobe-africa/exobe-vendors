'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useProductStore } from '@/store/product';
import { EditProductForm } from '../../../../../components/pages/products/edit/EditProductForm';
import { useToast } from '@/hooks/useToast';
import { ToastContainer } from '@/components/ui/Toast';
import { useConfirm } from '@/hooks/useConfirm';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';

export default function EditProductPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { 
    categories, 
    fetchCategories, 
    fetchProduct, 
    updateProduct, 
    deleteProduct, 
    isLoading, 
    isSaving, 
    error, 
    clearError 
  } = useProductStore();
  const { toasts, success, error: showError, warning, removeToast } = useToast();
  const confirmDialog = useConfirm();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<'DRAFT'|'ACTIVE'|'ARCHIVED'>('DRAFT');
  const [categoryId, setCategoryId] = useState<string>('');

  useEffect(() => {
    async function load() {
      try {
        const [product] = await Promise.all([
          fetchProduct(id),
          fetchCategories(),
        ]);
        if (!product) return;
        setTitle(product.title || '');
        setDescription(product.description || '');
        setStatus((product.status as any) || 'DRAFT');
        setCategoryId(product.categoryId || '');
      } catch (err) {
        console.error(err);
      }
    }
    load();
  }, [fetchProduct, fetchCategories, id]);

  async function handleSave() {
    if (!title || !categoryId) {
      showError('Title and category are required');
      return;
    }
    clearError();
    try {
      await updateProduct(id, {
        title,
        description,
        status,
        categoryId,
      });
      success('Product updated successfully!');
      router.push('/dashboard/products');
    } catch (err) {
      console.error(err);
      showError(err instanceof Error ? err.message : 'Failed to update product. Please try again.');
    }
  }

  async function handleDelete() {
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
      router.push('/dashboard/products');
    } catch (err) {
      console.error(err);
      showError(err instanceof Error ? err.message : 'Failed to delete product. Please try again.');
    }
  }

  if (isLoading) {
    return (
      <div className="p-6">Loading...</div>
    );
  }

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
      
      <div className="space-y-6 max-w-3xl">
        <EditProductForm
          title={title}
          onTitleChange={setTitle}
          description={description}
          onDescriptionChange={setDescription}
          status={status}
          onStatusChange={setStatus}
          categoryId={categoryId}
          onCategoryChange={setCategoryId}
          categoryTree={categories}
          saving={isSaving}
          onSave={handleSave}
          onDelete={handleDelete}
        />
      </div>
    </>
  );
}


