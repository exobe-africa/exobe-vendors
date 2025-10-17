'use client';

import { Card, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Select } from '@/components/ui/Select';
import { CategorySelector } from '../new/CategorySelector';

interface Props {
  title: string;
  onTitleChange: (v: string) => void;
  description: string;
  onDescriptionChange: (v: string) => void;
  status: 'DRAFT' | 'ACTIVE' | 'ARCHIVED';
  onStatusChange: (v: 'DRAFT' | 'ACTIVE' | 'ARCHIVED') => void;
  categoryId: string;
  onCategoryChange: (v: string) => void;
  categoryTree: any[];
  saving: boolean;
  onSave: () => void;
  onDelete: () => void;
}

export function EditProductForm({
  title,
  onTitleChange,
  description,
  onDescriptionChange,
  status,
  onStatusChange,
  categoryId,
  onCategoryChange,
  categoryTree,
  saving,
  onSave,
  onDelete,
}: Props) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Edit Product</CardTitle>
      </CardHeader>
      <div className="space-y-4 p-6">
        <Input 
          label="Title" 
          value={title} 
          onChange={(e) => onTitleChange(e.target.value)} 
          required 
        />
        <Textarea 
          label="Description" 
          value={description} 
          onChange={(e) => onDescriptionChange(e.target.value)} 
          rows={5} 
        />
        <Select
          options={[
            { value: 'DRAFT', label: 'Draft' }, 
            { value: 'ACTIVE', label: 'Active' }, 
            { value: 'ARCHIVED', label: 'Archived' }
          ]}
          value={status}
          onChange={(e) => onStatusChange((e.target as HTMLSelectElement).value as any)}
        />
        <CategorySelector
          categories={categoryTree}
          selectedCategoryId={categoryId}
          onSelectCategory={onCategoryChange}
        />
        <div className="flex gap-3">
          <Button onClick={onSave} disabled={saving} variant="primary">
            {saving ? 'Saving...' : 'Save'}
          </Button>
          <Button onClick={onDelete} variant="outline">
            Delete
          </Button>
        </div>
      </div>
    </Card>
  );
}
