'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Plus, X } from 'lucide-react';

interface AllergenItem {
  name: string;
  note: string;
}

interface Props {
  value: string; // JSON string or empty
  onChange: (jsonString: string) => void;
}

export function AllergensBuilder({ value, onChange }: Props) {
  // Parse existing value or start with one empty row
  const [items, setItems] = useState<AllergenItem[]>(() => {
    if (!value) return [{ name: '', note: '' }];
    try {
      const parsed = JSON.parse(value);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
      return [{ name: '', note: '' }];
    } catch {
      return [{ name: '', note: '' }];
    }
  });

  const handleAdd = () => {
    const updated = [...items, { name: '', note: '' }];
    setItems(updated);
    updateParent(updated);
  };

  const handleRemove = (index: number) => {
    const updated = items.filter((_, i) => i !== index);
    // Keep at least one row
    if (updated.length === 0) updated.push({ name: '', note: '' });
    setItems(updated);
    updateParent(updated);
  };

  const handleChange = (index: number, field: 'name' | 'note', val: string) => {
    const updated = [...items];
    updated[index][field] = val;
    setItems(updated);
    updateParent(updated);
  };

  const updateParent = (list: AllergenItem[]) => {
    // Filter out completely empty rows
    const filtered = list.filter(item => item.name.trim() || item.note.trim());
    if (filtered.length === 0) {
      onChange('');
    } else {
      onChange(JSON.stringify(filtered));
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="block text-sm font-medium text-gray-700">
          Allergens
        </label>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={handleAdd}
          className="text-xs"
        >
          <Plus className="w-3 h-3 mr-1" />
          Add Allergen
        </Button>
      </div>

      <div className="space-y-2">
        {items.map((item, index) => (
          <div key={index} className="flex gap-2 items-start">
            <div className="flex-1">
              <Input
                placeholder="e.g. Nuts, Gluten, Soy, Sulfates"
                value={item.name}
                onChange={(e) => handleChange(index, 'name', e.target.value)}
              />
            </div>
            <div className="w-48">
              <Input
                placeholder="Optional note (e.g. may contain traces)"
                value={item.note}
                onChange={(e) => handleChange(index, 'note', e.target.value)}
              />
            </div>
            {items.length > 1 && (
              <button
                type="button"
                onClick={() => handleRemove(index)}
                className="p-2 text-gray-400 hover:text-red-600 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        ))}
      </div>

      <p className="text-xs text-gray-500">
        List known allergens that may cause reactions (e.g., contains nuts, gluten). For personal care, include common irritants (e.g., fragrances, parabens, sulfates).
      </p>
    </div>
  );
}


