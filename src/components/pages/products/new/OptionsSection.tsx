'use client';

import { Card, CardHeader, CardTitle } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Plus, X } from 'lucide-react';

interface ProductOption { name: string; values: string[] }

interface Props {
  options: ProductOption[];
  onAddOption: () => void;
  onRemoveOption: (index: number) => void;
  onOptionNameChange: (index: number, name: string) => void;
}

export function OptionsSection({ options, onAddOption, onRemoveOption, onOptionNameChange }: Props) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Product Options</CardTitle>
          <Button variant="outline" size="sm" onClick={onAddOption}>
            <Plus className="w-4 h-4" />
            Add Option
          </Button>
        </div>
      </CardHeader>
      <div className="space-y-4">
        {options.map((option, index) => (
          <div key={index} className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-start gap-4">
              <div className="flex-1 space-y-3">
                <Input
                  label="Option Name"
                  placeholder="e.g. Size, Color, Material"
                  value={option.name}
                  onChange={(e) => onOptionNameChange(index, (e.target as HTMLInputElement).value)}
                />
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Option Values</label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {option.values.map((value, vIndex) => (
                      <span key={vIndex} className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 rounded-full text-sm">
                        {value}
                        <button className="text-gray-500 hover:text-red-600">
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                  <Input placeholder="Add value and press Enter" />
                </div>
              </div>
              <button onClick={() => onRemoveOption(index)} className="text-red-600 hover:text-red-700 p-2">
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        ))}
        {options.length === 0 && (
          <p className="text-sm text-gray-500 text-center py-4">No options added. Click "Add Option" to create product variants.</p>
        )}
      </div>
    </Card>
  );
}


