'use client';

import { useState } from 'react';
import { Card, CardHeader, CardTitle } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Plus, X, Info } from 'lucide-react';

interface ProductOption { 
  name: string; 
  values: string[] 
}

interface Props {
  options: ProductOption[];
  onAddOption: () => void;
  onRemoveOption: (index: number) => void;
  onOptionNameChange: (index: number, name: string) => void;
  onAddOptionValue: (optionIndex: number, value: string) => void;
  onRemoveOptionValue: (optionIndex: number, valueIndex: number) => void;
}

export function OptionsSection({ 
  options, 
  onAddOption, 
  onRemoveOption, 
  onOptionNameChange,
  onAddOptionValue,
  onRemoveOptionValue
}: Props) {
  const [inputValues, setInputValues] = useState<Record<number, string>>({});

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, optionIndex: number) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const value = inputValues[optionIndex]?.trim() || '';
      if (value) {
        onAddOptionValue(optionIndex, value);
        setInputValues(prev => ({ ...prev, [optionIndex]: '' }));
      }
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CardTitle>Product Options</CardTitle>
            <div className="group relative">
              <Info className="w-4 h-4 text-gray-400 cursor-help" />
              <div className="absolute left-0 top-6 w-80 p-4 bg-gray-900 text-white text-xs rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10">
                <p className="font-semibold mb-2">How it works:</p>
                <ol className="list-decimal list-inside space-y-1 mb-2">
                  <li>Add an option (e.g., "Size")</li>
                  <li>Add values (e.g., "Small", "Medium", "Large")</li>
                  <li>Variants are auto-generated below</li>
                  <li>Set price & stock for each variant</li>
                </ol>
                <p className="text-gray-300 italic">Example: Adding Colour (Red, Blue) and Size (S, M) creates 4 variants.</p>
              </div>
            </div>
          </div>
          <Button variant="outline" size="sm" onClick={onAddOption}>
            <Plus className="w-4 h-4" />
            Add Option
          </Button>
        </div>
      </CardHeader>
      
      {options.length > 0 && (
        <div className="px-6 pb-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex gap-3">
              <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm">
                <p className="text-blue-900 font-medium mb-1">Quick Guide:</p>
                <ul className="text-blue-800 space-y-1">
                  <li>• Type option values and press <kbd className="px-1.5 py-0.5 bg-white border border-blue-300 rounded text-xs font-mono">Enter</kbd> to add them</li>
                  <li>• Click the <X className="w-3 h-3 inline" /> icon to remove values or options</li>
                  <li>• Variants will appear below automatically as you add values</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
      <div className="space-y-4">
        {options.map((option, index) => (
          <div key={`${index}-${option.name || 'option'}`} className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-start gap-4">
              <div className="flex-1 space-y-3">
                <Input
                  label="Option Name"
                  placeholder="e.g. Size, Colour, Material"
                  value={option.name}
                  onChange={(e) => onOptionNameChange(index, e.target.value)}
                />
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Option Values
                    <span className="text-xs text-gray-500 font-normal ml-2">
                      (Press Enter to add)
                    </span>
                  </label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {option.values.map((value, vIndex) => (
                      <span 
                        key={`${index}-${value}-${vIndex}`} 
                        className="inline-flex items-center gap-1 px-3 py-1 bg-red-50 border border-red-200 text-red-700 rounded-full text-sm"
                      >
                        {value}
                        <button 
                          type="button"
                          onClick={() => onRemoveOptionValue(index, vIndex)}
                          className="text-red-500 hover:text-red-700 transition-colors"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                  <div className="relative">
                    <Input 
                      placeholder="Type a value and press Enter" 
                      value={inputValues[index] || ''}
                      onChange={(e) => setInputValues(prev => ({ ...prev, [index]: e.target.value }))}
                      onKeyDown={(e) => handleKeyDown(e, index)}
                      className={inputValues[index] ? 'border-green-300 focus:border-green-500 focus:ring-green-500' : ''}
                    />
                    {inputValues[index] && (
                      <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
                        <kbd className="px-2 py-1 bg-green-100 border border-green-300 rounded text-xs font-mono text-green-700">
                          Enter ↵
                        </kbd>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <button 
                type="button"
                onClick={() => onRemoveOption(index)} 
                className="text-red-600 hover:text-red-700 p-2 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        ))}
        {options.length === 0 && (
          <div className="text-center py-8 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg border-2 border-dashed border-gray-300">
            <div className="mx-auto w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-3">
              <Plus className="w-6 h-6 text-red-600" />
            </div>
            <p className="text-sm font-medium text-gray-900 mb-1">No options added yet</p>
            <p className="text-xs text-gray-600 mb-4 max-w-md mx-auto">
              Add options like Size, Colour, or Material to create product variants with different prices and stock levels
            </p>
            
            <div className="bg-white border border-gray-200 rounded-lg p-4 mb-4 max-w-md mx-auto text-left">
              <p className="text-xs font-semibold text-gray-700 mb-2">💡 Example Setup:</p>
              <div className="space-y-2 text-xs text-gray-600">
                <div className="flex items-start gap-2">
                  <span className="font-medium text-gray-900 min-w-[60px]">Option 1:</span>
                  <span>Size → Small, Medium, Large</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="font-medium text-gray-900 min-w-[60px]">Option 2:</span>
                  <span>Colour → Red, Blue, Black</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="font-medium text-gray-900 min-w-[60px]">Result:</span>
                  <span className="text-green-700 font-medium">9 variants auto-generated ✓</span>
                </div>
              </div>
            </div>
            
            <Button variant="primary" size="md" onClick={onAddOption}>
              <Plus className="w-4 h-4" />
              Add Your First Option
            </Button>
          </div>
        )}
      </div>
    </Card>
  );
}
