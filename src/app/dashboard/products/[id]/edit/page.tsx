'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { getApolloClient } from '@/lib/apollo/client';
import { PRODUCT_BY_ID, UPDATE_PRODUCT, DELETE_PRODUCT, CATEGORY_TREE } from '@/lib/api/products';
import { slugify } from '@/lib/utils';
import { EditProductForm } from '../../../../../components/pages/products/edit/EditProductForm';

export default function EditProductPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const client = getApolloClient();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<'DRAFT'|'ACTIVE'|'ARCHIVED'>('DRAFT');
  const [categoryId, setCategoryId] = useState<string>('');
  const [categories, setCategories] = useState<{ value: string; label: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const [{ data: d1 }, { data: d2 }] = await Promise.all([
          client.query({ query: PRODUCT_BY_ID, variables: { id }, fetchPolicy: 'no-cache' }),
          client.query({ query: CATEGORY_TREE, fetchPolicy: 'no-cache' }),
        ]);
        const p = (d1 as any).productById;
        if (!p) return;
        setTitle(p.title || '');
        setDescription(p.description || '');
        setStatus((p.status as any) || 'DRAFT');
        setCategoryId(p.categoryId || '');

        const flatted: { value: string; label: string }[] = [];
        function walk(nodes: any[], prefix = '') {
          for (const n of nodes || []) {
            flatted.push({ value: n.id, label: prefix ? `${prefix} / ${n.name}` : n.name });
            if (n.children?.length) walk(n.children, prefix ? `${prefix} / ${n.name}` : n.name);
          }
        }
        walk((d2 as any).categoryTree || []);
        setCategories([{ value: '', label: 'Select a category' }, ...flatted]);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [client, id]);

  async function handleSave() {
    setSaving(true);
    try {
      await client.mutate({ mutation: UPDATE_PRODUCT, variables: { id, input: { title, slug: slugify(title), description, status, categoryId } } });
      router.push('/dashboard/products');
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!confirm('Delete this product?')) return;
    await client.mutate({ mutation: DELETE_PRODUCT, variables: { id } });
    router.push('/dashboard/products');
  }

  if (loading) {
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
        categories={categories}
        saving={saving}
        onSave={handleSave}
        onDelete={handleDelete}
      />
    </div>
  );
}


