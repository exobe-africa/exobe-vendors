'use client';
import { Card, CardHeader, CardTitle } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Select } from '@/components/ui/Select';
import { getFieldsForProductType, type ProductType } from '@/lib/productTypeConfig';
import { IngredientsBuilder } from './IngredientsBuilder';
import { AllergensBuilder } from './AllergensBuilder';

interface Props {
  productType: ProductType;
  values: Record<string, any>;
  onChange: (name: string, value: any) => void;
}

export function TypeSpecificFields({ productType, values, onChange }: Props) {
  const fields = getFieldsForProductType(productType);
  
  if (fields.length === 0) return null;
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>{productType.charAt(0) + productType.slice(1).toLowerCase().replace('_', ' ')} Information</CardTitle>
        <p className="text-sm text-gray-500 mt-1">
          Additional details specific to this product type
        </p>
      </CardHeader>
      <div className="space-y-4">
        {fields.map((field) => {
          const value = values?.[field.name];
          
          // Special handling for ingredients field
          if (field.name === 'ingredients') {
            return (
              <IngredientsBuilder
                key={field.name}
                value={value || ''}
                onChange={(val) => onChange(field.name, val)}
              />
            );
          }
          // Special handling for allergens field
          if (field.name === 'allergens') {
            return (
              <AllergensBuilder
                key={field.name}
                value={value || ''}
                onChange={(val) => onChange(field.name, val)}
              />
            );
          }
          
          if (field.type === 'textarea') {
            return (
              <Textarea
                key={field.name}
                label={field.label + (field.required ? ' *' : '')}
                placeholder={field.placeholder}
                value={value || ''}
                onChange={(e) => onChange(field.name, e.target.value)}
                helperText={field.helperText}
                rows={3}
              />
            );
          }
          
          if (field.type === 'select' && field.options) {
            return (
              <div key={field.name}>
                <Select
                  label={field.label + (field.required ? ' *' : '')}
                  options={field.options}
                  value={value || ''}
                  onChange={(e) => onChange(field.name, e.target.value)}
                />
                {field.helperText && (
                  <p className="text-xs text-gray-500 mt-1">{field.helperText}</p>
                )}
              </div>
            );
          }
          
          return (
            <Input
              key={field.name}
              label={field.label + (field.required ? ' *' : '')}
              type={field.type}
              min={field.type === 'number' ? '0' : undefined}
              step={field.type === 'number' ? (field.name === 'pages' ? '1' : '0.01') : undefined}
              placeholder={field.placeholder}
              value={value || ''}
              onChange={(e) => {
                const val = field.type === 'number' 
                  ? parseFloat(e.target.value) || 0 
                  : e.target.value;
                onChange(field.name, val);
              }}
              helperText={field.helperText}
            />
          );
        })}
      </div>
    </Card>
  );
}

