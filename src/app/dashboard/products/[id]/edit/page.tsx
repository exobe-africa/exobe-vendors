'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useProductStore } from '@/store/product';
import { EditProductForm } from '../../../../../components/pages/products/edit/EditProductForm';

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
    clearError();
    try {
      await updateProduct(id, {
        title,
        description,
        status,
        categoryId,
      });
      router.push('/dashboard/products');
    } catch (err) {
      console.error(err);
    }
  }

  async function handleDelete() {
    if (!confirm('Delete this product?')) return;
    clearError();
    try {
      await deleteProduct(id);
      router.push('/dashboard/products');
    } catch (err) {
      console.error(err);
    }
  }

  if (isLoading) {
    return (
      <div className="p-6">Loading...</div>
    );
  }

  return (
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
  );
}


