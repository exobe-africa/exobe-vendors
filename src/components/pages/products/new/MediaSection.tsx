'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';
import { Card, CardHeader, CardTitle } from '@/components/ui/Card';
import { Upload, X, Image as ImageIcon, GripVertical } from 'lucide-react';

interface Props {
  images: string[];
  onImagesChange: (images: string[]) => void;
}

export function MediaSection({ images, onImagesChange }: Props) {
  const [isDragging, setIsDragging] = useState(false);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const newImages: string[] = [];
    const fileArray = Array.from(files);
    let processedCount = 0;

    fileArray.forEach((file) => {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert(`${file.name} is not an image file`);
        processedCount++;
        return;
      }

      // Validate file size (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        alert(`${file.name} is too large. Maximum file size is 5MB`);
        processedCount++;
        return;
      }

      // Create preview URL
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          newImages.push(e.target.result as string);
          processedCount++;
          if (processedCount === fileArray.length) {
            onImagesChange([...images, ...newImages]);
          }
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFileSelect(e.dataTransfer.files);
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const removeImage = (index: number) => {
    onImagesChange(images.filter((_, i) => i !== index));
  };

  // Drag to reorder functions
  const handleImageDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleImageDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOverIndex(index);
  };

  const handleImageDragEnd = () => {
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  const handleImageDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (draggedIndex === null || draggedIndex === dropIndex) {
      setDraggedIndex(null);
      setDragOverIndex(null);
      return;
    }

    const newImages = [...images];
    const [draggedImage] = newImages.splice(draggedIndex, 1);
    newImages.splice(dropIndex, 0, draggedImage);
    
    onImagesChange(newImages);
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Product Media</CardTitle>
        <p className="text-sm text-gray-500 mt-1">
          Add images to showcase your product. First image will be the main product image.
        </p>
      </CardHeader>
      <div className="space-y-4">
        {/* Upload Area */}
        <div
          onClick={handleClick}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`
            border-2 border-dashed rounded-xl p-8 text-center transition-all cursor-pointer
            ${isDragging 
              ? 'border-red-500 bg-red-50' 
              : 'border-gray-300 hover:border-red-400 hover:bg-gray-50'
            }
          `}
        >
          <Upload className={`w-12 h-12 mx-auto mb-4 ${isDragging ? 'text-red-500' : 'text-gray-400'}`} />
          <p className="text-sm font-medium text-gray-700 mb-1">
            {isDragging ? 'Drop images here' : 'Click to upload or drag and drop'}
          </p>
          <p className="text-xs text-gray-500">SVG, PNG, JPG or GIF (max. 5MB per file)</p>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={(e) => handleFileSelect(e.target.files)}
            className="hidden"
          />
        </div>

        {/* Image Previews */}
        {images.length > 0 && (
          <div>
            <p className="text-sm font-medium text-gray-700 mb-3">
              {images.length} {images.length === 1 ? 'image' : 'images'} uploaded
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {images.map((img, index) => (
                <div
                  key={`${img}-${index}`}
                  draggable
                  onDragStart={(e) => handleImageDragStart(e, index)}
                  onDragOver={(e) => handleImageDragOver(e, index)}
                  onDragEnd={handleImageDragEnd}
                  onDrop={(e) => handleImageDrop(e, index)}
                  className={`
                    relative group aspect-square cursor-move
                    ${draggedIndex === index ? 'opacity-50' : ''}
                    ${dragOverIndex === index && draggedIndex !== index ? 'scale-95' : ''}
                    transition-all duration-200
                  `}
                >
                  {/* Drag Handle */}
                  <div className="absolute top-2 right-2 bg-white bg-opacity-90 p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity z-10 cursor-move">
                    <GripVertical className="w-4 h-4 text-gray-600" />
                  </div>

                  {/* Preview Image */}
                  <div className="relative w-full h-full rounded-lg overflow-hidden border border-gray-200 bg-gray-100">
                    <img
                      src={img}
                      alt={`Product image ${index + 1}`}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        console.error('Image failed to load:', img.substring(0, 50));
                      }}
                    />
                  </div>

                  {/* Overlay on Hover */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all rounded-lg flex items-center justify-center">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeImage(index);
                      }}
                      className="opacity-0 group-hover:opacity-100 bg-red-600 hover:bg-red-700 text-white p-2 rounded-full transition-all transform scale-90 group-hover:scale-100 cursor-pointer"
                      title="Remove image"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Main Image Badge */}
                  {index === 0 && (
                    <div className="absolute top-2 left-2 bg-blue-600 text-white text-xs font-semibold px-2 py-1 rounded shadow">
                      Main
                    </div>
                  )}

                  {/* Image Number Badge */}
                  <div className="absolute bottom-2 left-2 bg-black/60 text-white text-xs px-2 py-1 rounded">
                    {index + 1}
                  </div>
                </div>
              ))}
            </div>

            {/* Helper Text */}
            <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-start gap-2">
                <ImageIcon className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                <div className="text-xs text-blue-900">
                  <p className="font-semibold mb-1">💡 Image Tips:</p>
                  <ul className="space-y-0.5 ml-2">
                    <li>• The first image will be used as the main product image</li>
                    <li>• Use high-quality images with good lighting</li>
                    <li>• Show product from multiple angles</li>
                    <li>• Drag and drop images to reorder them</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}

