'use client';
import { useState } from 'react';
import { Card, CardHeader, CardTitle } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Tag, X } from 'lucide-react';

interface Props {
  tags: string[];
  onTagsChange: (tags: string[]) => void;
}

export function TagsSection({ tags, onTagsChange }: Props) {
  const [inputValue, setInputValue] = useState('');

  const handleAddTag = () => {
    const trimmedValue = inputValue.trim();
    if (trimmedValue && !tags.includes(trimmedValue.toLowerCase())) {
      onTagsChange([...tags, trimmedValue.toLowerCase()]);
      setInputValue('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTag();
    } else if (e.key === ',' || e.key === ' ') {
      e.preventDefault();
      handleAddTag();
    }
  };

  const handleRemoveTag = (index: number) => {
    onTagsChange(tags.filter((_, i) => i !== index));
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Tag className="w-5 h-5 text-blue-600" />
          <CardTitle>Tags</CardTitle>
        </div>
        <p className="text-sm text-gray-500 mt-1">
          Add keywords to help customers find your product
        </p>
      </CardHeader>
      <div className="space-y-4">
        {/* Tag Pills Display */}
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {tags.map((tag, index) => (
              <div
                key={index}
                className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-50 text-blue-700 rounded-full text-sm font-medium"
              >
                <span>{tag}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveTag(index)}
                  className="hover:text-blue-900 transition-colors"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Input for Adding Tags */}
        <div>
          <div className="relative">
            <Input
              placeholder="Add tags separated by comma or space"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              onBlur={handleAddTag}
            />
            {inputValue && (
              <div className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400 bg-green-50 px-2 py-1 rounded">
                Press Enter ↵
              </div>
            )}
          </div>
          <p className="text-xs text-gray-500 mt-2">
            Examples: wireless, bluetooth, premium, bestseller, eco-friendly
          </p>
        </div>

        {/* Tips */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <p className="text-xs text-blue-900">
            <span className="font-semibold">💡 Tag Tips:</span> Use relevant keywords that customers might search for. 
            Tags improve product discoverability and help with SEO.
          </p>
        </div>
      </div>
    </Card>
  );
}

