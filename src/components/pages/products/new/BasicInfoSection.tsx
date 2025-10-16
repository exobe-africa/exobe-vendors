'use client';

import { Card, CardHeader, CardTitle } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';

interface Props {
  title: string;
  onTitleChange: (v: string) => void;
  description: string;
  onDescriptionChange: (v: string) => void;
}

export function BasicInfoSection({ title, onTitleChange, description, onDescriptionChange }: Props) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Basic Information</CardTitle>
      </CardHeader>
      <div className="space-y-4">
        <Input
          label="Product Title"
          placeholder="e.g. Premium Wireless Headphones"
          required
          value={title}
          onChange={(e) => onTitleChange(e.target.value)}
        />
        <Textarea
          label="Description"
          placeholder="Describe your product..."
          rows={6}
          helperText="Rich text editor for detailed product description"
          value={description}
          onChange={(e) => onDescriptionChange(e.target.value)}
        />
        <div className="grid grid-cols-2 gap-4">
          <Input label="SKU" placeholder="e.g. PROD-001" helperText="Stock Keeping Unit" />
          <Input label="Barcode" placeholder="e.g. 1234567890" />
        </div>
      </div>
    </Card>
  );
}


