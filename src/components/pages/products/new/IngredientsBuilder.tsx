'use client';
import { useState } from 'react';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Plus, X } from 'lucide-react';

interface Ingredient {
  name: string;
  value: string;
}

interface Props {
  value: string; // JSON string or empty
  onChange: (jsonString: string) => void;
}

export function IngredientsBuilder({ value, onChange }: Props) {
  // Parse existing value or start with one empty row
  const [ingredients, setIngredients] = useState<Ingredient[]>(() => {
    if (!value) return [{ name: '', value: '' }];
    try {
      const parsed = JSON.parse(value);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
      return [{ name: '', value: '' }];
    } catch {
      return [{ name: '', value: '' }];
    }
  });

  const handleAdd = () => {
    const updated = [...ingredients, { name: '', value: '' }];
    setIngredients(updated);
    updateParent(updated);
  };

  const handleRemove = (index: number) => {
    const updated = ingredients.filter((_, i) => i !== index);
    // Keep at least one row
    if (updated.length === 0) updated.push({ name: '', value: '' });
    setIngredients(updated);
    updateParent(updated);
  };

  const handleChange = (index: number, field: 'name' | 'value', val: string) => {
    const updated = [...ingredients];
    updated[index][field] = val;
    setIngredients(updated);
    updateParent(updated);
  };

  const updateParent = (items: Ingredient[]) => {
    // Filter out completely empty rows
    const filtered = items.filter(item => item.name.trim() || item.value.trim());
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
          Ingredients
        </label>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={handleAdd}
          className="text-xs"
        >
          <Plus className="w-3 h-3 mr-1" />
          Add Ingredient
        </Button>
      </div>

      <div className="space-y-2">
        {ingredients.map((ingredient, index) => (
          <div key={index} className="flex gap-2 items-start">
            <div className="flex-1">
              <Input
                placeholder="e.g. Water, Sugar, Salt"
                value={ingredient.name}
                onChange={(e) => handleChange(index, 'name', e.target.value)}
              />
            </div>
            <div className="w-32">
              <Input
                placeholder="e.g. 50%, 10g"
                value={ingredient.value}
                onChange={(e) => handleChange(index, 'value', e.target.value)}
              />
            </div>
            {ingredients.length > 1 && (
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
        Add each ingredient with its quantity or percentage (e.g., Water - 60%, Sugar - 10g)
      </p>
    </div>
  );
}

