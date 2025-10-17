'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { Card, CardHeader, CardTitle } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Info, Upload, X, Image as ImageIcon } from 'lucide-react';

interface ProductOption { 
  name: string; 
  values: string[] 
}

interface ProductVariant { 
  sku: string; 
  price: number; 
  stock: number; 
  attributes: Record<string, string>;
  images?: string[];
}

interface Props {
  options: ProductOption[];
  variants: ProductVariant[];
  onVariantsChange: (variants: ProductVariant[]) => void;
}

export function VariantsSection({ options, variants, onVariantsChange }: Props) {
  useEffect(() => {
    if (options.length === 0 || options.some(opt => opt.values.length === 0)) {
      onVariantsChange([]);
      return;
    }

    const generateCombinations = (opts: ProductOption[]): Record<string, string>[] => {
      if (opts.length === 0) return [{}];
      if (opts.length === 1) {
        return opts[0].values.map(val => ({ [opts[0].name]: val }));
      }

      const [first, ...rest] = opts;
      const restCombinations = generateCombinations(rest);
      const combinations: Record<string, string>[] = [];

      for (const value of first.values) {
        for (const combo of restCombinations) {
          combinations.push({ [first.name]: value, ...combo });
        }
      }

      return combinations;
    };

    const newCombinations = generateCombinations(options);
    
    const updatedVariants = newCombinations.map(attributes => {
      const existing = variants.find(v => {
        return Object.keys(attributes).every(key => v.attributes[key] === attributes[key]);
      });

      return existing || {
        sku: '',
        price: 0,
        stock: 0,
        attributes,
        images: [],
      };
    });

    onVariantsChange(updatedVariants);
  }, [options]);

  const handleVariantChange = (index: number, field: keyof ProductVariant, value: any) => {
    const updated = [...variants];
    if (field === 'price' || field === 'stock') {
      updated[index] = { ...updated[index], [field]: parseFloat(value) || 0 };
    } else {
      updated[index] = { ...updated[index], [field]: value };
    }
    onVariantsChange(updated);
  };

  const handleImageUpload = (variantIndex: number) => {
    const newImageUrl = `https://via.placeholder.com/150?text=Variant+${variantIndex + 1}`;
    const updated = [...variants];
    const currentImages = updated[variantIndex].images || [];
    
    if (currentImages.length < 4) {
      updated[variantIndex] = {
        ...updated[variantIndex],
        images: [...currentImages, newImageUrl],
      };
      onVariantsChange(updated);
    }
  };

  const handleRemoveImage = (variantIndex: number, imageIndex: number) => {
    const updated = [...variants];
    const currentImages = updated[variantIndex].images || [];
    updated[variantIndex] = {
      ...updated[variantIndex],
      images: currentImages.filter((_, i) => i !== imageIndex),
    };
    onVariantsChange(updated);
  };

  const [expandedVariants, setExpandedVariants] = useState<Set<number>>(new Set());

  const toggleVariantExpanded = (index: number) => {
    const newExpanded = new Set(expandedVariants);
    if (newExpanded.has(index)) {
      newExpanded.delete(index);
    } else {
      newExpanded.add(index);
    }
    setExpandedVariants(newExpanded);
  };

  if (options.length === 0 || options.some(opt => opt.values.length === 0)) {
    return null;
  }

  const getVariantLabel = (attributes: Record<string, string>) => {
    return Object.entries(attributes).map(([key, value]) => `${value}`).join(' / ');
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <CardTitle>Product Variants</CardTitle>
              <div className="group relative">
                <Info className="w-4 h-4 text-gray-400 cursor-help" />
                <div className="absolute left-0 top-6 w-64 p-3 bg-gray-900 text-white text-xs rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10">
                  Variants are automatically generated from your options. Set unique SKU, price, and stock for each variant.
                </div>
              </div>
            </div>
            <p className="text-sm text-gray-500 mt-1">
              {variants.length} variant{variants.length !== 1 ? 's' : ''} generated from your options
            </p>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 bg-green-50 border border-green-200 rounded-full">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-xs font-medium text-green-700">Auto-generated</span>
          </div>
        </div>
      </CardHeader>
      
      <div className="px-6 pb-4 space-y-3">
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
          <p className="text-xs text-amber-900">
            <span className="font-semibold">💰 Tip:</span> Set competitive prices and accurate stock levels for each variant to improve sales.
          </p>
        </div>
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
          <p className="text-xs text-purple-900">
            <span className="font-semibold">📸 Images:</span> Click the "Images" button on any variant to upload up to 4 unique photos for that specific variant.
          </p>
        </div>
      </div>
      <div className="px-6 pb-6">
        <div className="grid grid-cols-12 gap-4 px-4 pb-2 border-b border-gray-200 mb-3">
          <div className="col-span-3">
            <span className="text-xs font-semibold text-gray-600 uppercase tracking-wider">Variant</span>
          </div>
          <div className="col-span-3">
            <span className="text-xs font-semibold text-gray-600 uppercase tracking-wider">SKU</span>
          </div>
          <div className="col-span-2">
            <span className="text-xs font-semibold text-gray-600 uppercase tracking-wider">Price (ZAR)</span>
          </div>
          <div className="col-span-2">
            <span className="text-xs font-semibold text-gray-600 uppercase tracking-wider">Stock</span>
          </div>
          <div className="col-span-2">
          </div>
        </div>

        <div className="space-y-3">
        {variants.map((variant, index) => {
          const isExpanded = expandedVariants.has(index);
          const variantImages = variant.images || [];
          
          return (
            <div key={index} className="border border-gray-200 rounded-lg overflow-hidden">
              <div className="bg-white hover:bg-gray-50 transition-colors">
                <div className="grid grid-cols-12 gap-4 p-4 items-center">
                  <div className="col-span-3">
                    <div className="flex items-center gap-2">
                      <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-red-600 rounded-lg flex items-center justify-center text-white font-semibold text-sm">
                        {index + 1}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {getVariantLabel(variant.attributes)}
                        </p>
                        <p className="text-xs text-gray-500">
                          {variantImages.length}/4 images
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="col-span-3">
                    <Input 
                      placeholder="e.g. PROD-S-BLK" 
                      className="text-sm w-full"
                      value={variant.sku}
                      onChange={(e) => handleVariantChange(index, 'sku', e.target.value)}
                    />
                  </div>

                  {/* Price */}
                  <div className="col-span-2">
                    <Input 
                      type="number" 
                      placeholder="0.00" 
                      step="0.01"
                      min="0"
                      className="text-sm w-full"
                      value={variant.price || ''}
                      onChange={(e) => handleVariantChange(index, 'price', e.target.value)}
                    />
                  </div>

                  {/* Stock */}
                  <div className="col-span-2">
                    <Input 
                      type="number" 
                      placeholder="0" 
                      min="0"
                      className="text-sm w-full"
                      value={variant.stock || ''}
                      onChange={(e) => handleVariantChange(index, 'stock', e.target.value)}
                    />
                  </div>

                  {/* Expand Button */}
                  <div className="col-span-2 flex justify-end">
                    <button
                      type="button"
                      onClick={() => toggleVariantExpanded(index)}
                      className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <ImageIcon className="w-4 h-4" />
                      <span className="hidden sm:inline">
                        {isExpanded ? 'Hide' : 'Images'}
                      </span>
                      <svg
                        className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>

              {/* Expanded Image Section */}
              {isExpanded && (
                <div className="bg-gray-50 border-t border-gray-200 p-4">
                  <div className="flex items-start gap-3">
                    <ImageIcon className="w-5 h-5 text-gray-400 mt-1 flex-shrink-0" />
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <p className="text-sm font-medium text-gray-900">Variant Images</p>
                          <p className="text-xs text-gray-500">
                            Upload up to 4 images for this variant (PNG, JPG, or WEBP)
                          </p>
                        </div>
                        <span className="text-xs font-medium text-gray-600 bg-white px-2 py-1 rounded border border-gray-200">
                          {variantImages.length}/4
                        </span>
                      </div>

                      <div className="grid grid-cols-4 gap-3">
                        {/* Existing Images */}
                        {variantImages.map((img, imgIndex) => (
                          <div key={imgIndex} className="relative group aspect-square">
                            <Image
                              src={img}
                              alt={`Variant ${index + 1} - Image ${imgIndex + 1}`}
                              width={150}
                              height={150}
                              className="w-full h-full object-cover rounded-lg border border-gray-200"
                            />
                            <button
                              type="button"
                              onClick={() => handleRemoveImage(index, imgIndex)}
                              className="absolute -top-2 -right-2 bg-red-600 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg hover:bg-red-700"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        ))}

                        {/* Upload Button (show if less than 4 images) */}
                        {variantImages.length < 4 && (
                          <button
                            type="button"
                            onClick={() => handleImageUpload(index)}
                            className="aspect-square border-2 border-dashed border-gray-300 rounded-lg hover:border-red-400 hover:bg-red-50 transition-all flex flex-col items-center justify-center gap-2 group"
                          >
                            <Upload className="w-6 h-6 text-gray-400 group-hover:text-red-600 transition-colors" />
                            <span className="text-xs text-gray-500 group-hover:text-red-600 transition-colors">
                              Upload
                            </span>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
        </div>
      </div>
    </Card>
  );
}
