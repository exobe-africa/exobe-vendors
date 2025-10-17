'use client';

import { useState, useMemo } from 'react';
import { Card } from '@/components/ui/Card';
import { Search, ChevronRight, Check } from 'lucide-react';

interface Category {
  id: string;
  name: string;
  children?: Category[];
}

interface Props {
  categories: Category[];
  selectedCategoryId: string;
  onSelectCategory: (categoryId: string) => void;
}

export function CategorySelector({ categories, selectedCategoryId, onSelectCategory }: Props) {
  const [searchQuery, setSearchQuery] = useState('');
  const [breadcrumb, setBreadcrumb] = useState<Category[]>([]);

  // Get current level categories
  const currentCategories = useMemo(() => {
    if (breadcrumb.length === 0) return categories;
    return breadcrumb[breadcrumb.length - 1].children || [];
  }, [breadcrumb, categories]);

  // Filter categories based on search
  const filteredCategories = useMemo(() => {
    if (!searchQuery) return currentCategories;
    
    const query = searchQuery.toLowerCase();
    return currentCategories.filter(cat => 
      cat.name.toLowerCase().includes(query)
    );
  }, [currentCategories, searchQuery]);

  // Get selected category path
  const selectedPath = useMemo(() => {
    if (!selectedCategoryId) return null;
    
    const findPath = (cats: Category[], id: string, path: string[] = []): string[] | null => {
      for (const cat of cats) {
        if (cat.id === id) return [...path, cat.name];
        if (cat.children) {
          const found = findPath(cat.children, id, [...path, cat.name]);
          if (found) return found;
        }
      }
      return null;
    };
    
    return findPath(categories, selectedCategoryId);
  }, [categories, selectedCategoryId]);

  const handleCategoryClick = (category: Category) => {
    if (category.children && category.children.length > 0) {
      // Navigate into subcategory
      setBreadcrumb([...breadcrumb, category]);
      setSearchQuery('');
    } else {
      // Select leaf category
      onSelectCategory(category.id);
    }
  };

  const handleBreadcrumbClick = (index: number) => {
    if (index === -1) {
      // Go back to root
      setBreadcrumb([]);
    } else {
      // Go to specific level
      setBreadcrumb(breadcrumb.slice(0, index + 1));
    }
    setSearchQuery('');
  };

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-gray-700">Category</label>
      
      {selectedPath && (
        <div className="p-3 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2">
          <Check className="w-4 h-4 text-green-600 flex-shrink-0" />
          <span className="text-sm text-green-800 font-medium">
            {selectedPath.join(' > ')}
          </span>
        </div>
      )}

      <Card className="p-4">
        <div className="mb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search categories..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-sm"
            />
          </div>
        </div>

        {breadcrumb.length > 0 && (
          <div className="mb-4 flex items-center gap-2 text-sm flex-wrap">
            <button
              onClick={() => handleBreadcrumbClick(-1)}
              className="text-gray-600 hover:text-gray-900 font-medium"
            >
              All Categories
            </button>
            {breadcrumb.map((cat, index) => (
              <div key={cat.id} className="flex items-center gap-2">
                <ChevronRight className="w-4 h-4 text-gray-400" />
                <button
                  onClick={() => handleBreadcrumbClick(index)}
                  className="text-gray-600 hover:text-gray-900 font-medium"
                >
                  {cat.name}
                </button>
              </div>
            ))}
          </div>
        )}

        <div className="max-h-80 overflow-y-auto space-y-1">
          {filteredCategories.length === 0 ? (
            <p className="text-sm text-gray-500 text-center py-8">
              No categories found
            </p>
          ) : (
            filteredCategories.map((category) => {
              const hasChildren = category.children && category.children.length > 0;
              const isSelected = category.id === selectedCategoryId;
              
              return (
                <button
                  key={category.id}
                  onClick={() => handleCategoryClick(category)}
                  className={`
                    w-full px-3 py-2.5 rounded-lg flex items-center justify-between
                    transition-colors text-left text-sm
                    ${isSelected 
                      ? 'bg-red-50 border border-red-200 text-red-900' 
                      : 'hover:bg-gray-50 border border-transparent'
                    }
                  `}
                >
                  <span className="font-medium">{category.name}</span>
                  <div className="flex items-center gap-2">
                    {hasChildren && (
                      <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
                        {category.children!.length} subcategories
                      </span>
                    )}
                    {isSelected ? (
                      <Check className="w-4 h-4 text-red-600" />
                    ) : hasChildren ? (
                      <ChevronRight className="w-4 h-4 text-gray-400" />
                    ) : null}
                  </div>
                </button>
              );
            })
          )}
        </div>
      </Card>
    </div>
  );
}

