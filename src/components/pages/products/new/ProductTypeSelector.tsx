'use client';
import { Card, CardHeader, CardTitle } from '@/components/ui/Card';
import { Select } from '@/components/ui/Select';
import { PRODUCT_TYPE_OPTIONS, type ProductType } from '@/lib/productTypeConfig';

interface Props {
  selectedType: ProductType;
  onSelect: (type: ProductType) => void;
}

// Simplified dropdown-based selector (prevents squashing in side panel)
export function ProductTypeSelector({ selectedType, onSelect }: Props) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Product Type</CardTitle>
        <p className="text-sm text-gray-500 mt-1">
          Select the category that best describes your product
        </p>
      </CardHeader>
      <Select
        options={PRODUCT_TYPE_OPTIONS.map(o => ({ value: o.value, label: o.label }))}
        value={selectedType}
        onChange={(e) => onSelect((e.target as HTMLSelectElement).value as ProductType)}
      />
    </Card>
  );
}

