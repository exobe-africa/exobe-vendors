'use client';

import Image from 'next/image';
import { Card, CardHeader, CardTitle } from '@/components/ui/Card';
import { Upload, X } from 'lucide-react';

interface Props {
  images: string[];
}

export function MediaSection({ images }: Props) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Product Media</CardTitle>
      </CardHeader>
      <div className="space-y-4">
        <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-red-500 transition-colors cursor-pointer">
          <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-sm font-medium text-gray-700 mb-1">Click to upload or drag and drop</p>
          <p className="text-xs text-gray-500">SVG, PNG, JPG or GIF (max. 800x400px)</p>
        </div>
        {images.length > 0 && (
          <div className="grid grid-cols-4 gap-4">
            {images.map((img, index) => (
              <div key={index} className="relative group">
                <Image src={img} alt="" width={200} height={96} className="w-full h-24 object-cover rounded-lg" />
                <button className="absolute top-2 right-2 bg-red-600 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </Card>
  );
}


