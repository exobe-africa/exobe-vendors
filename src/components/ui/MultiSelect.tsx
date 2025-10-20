import React, { useState, useRef, useEffect } from 'react';
import { X } from 'lucide-react';

interface MultiSelectProps {
  label?: string;
  error?: string;
  helperText?: string;
  options: { value: string; label: string }[];
  value: string[];
  onChange: (values: string[]) => void;
  placeholder?: string;
}

export const MultiSelect: React.FC<MultiSelectProps> = ({
  label,
  error,
  helperText,
  options,
  value,
  onChange,
  placeholder = 'Select...',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleOption = (optionValue: string) => {
    if (value.includes(optionValue)) {
      onChange(value.filter((v) => v !== optionValue));
    } else {
      onChange([...value, optionValue]);
    }
  };

  const removeValue = (optionValue: string) => {
    onChange(value.filter((v) => v !== optionValue));
  };

  const selectedLabels = value.map((v) => options.find((o) => o.value === v)?.label || v);

  return (
    <div className="w-full" ref={containerRef}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1.5">
          {label}
        </label>
      )}
      
      <div className="relative">
        {/* Selected items display */}
        <div
          onClick={() => setIsOpen(!isOpen)}
          className={`
            w-full min-h-[40px] px-3 py-2 border rounded-lg cursor-pointer
            focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent
            ${error ? 'border-red-500' : 'border-gray-300'}
            ${isOpen ? 'ring-2 ring-red-500 border-transparent' : ''}
          `}
        >
          {value.length === 0 ? (
            <span className="text-gray-400">{placeholder}</span>
          ) : (
            <div className="flex flex-wrap gap-2">
              {selectedLabels.map((label, index) => (
                <span
                  key={value[index]}
                  className="inline-flex items-center gap-1 px-2 py-1 bg-red-100 text-red-800 rounded text-sm"
                >
                  {label}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeValue(value[index]);
                    }}
                    className="hover:text-red-900"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Dropdown */}
        {isOpen && (
          <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-auto">
            {options.map((option) => (
              <div
                key={option.value}
                onClick={() => toggleOption(option.value)}
                className={`
                  px-3 py-2 cursor-pointer hover:bg-gray-50 transition-colors
                  ${value.includes(option.value) ? 'bg-red-50 text-red-800' : ''}
                `}
              >
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={value.includes(option.value)}
                    onChange={() => {}}
                    className="w-4 h-4 text-red-600 rounded focus:ring-red-500"
                  />
                  <span>{option.label}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
      {helperText && !error && (
        <p className="mt-1 text-sm text-gray-500">{helperText}</p>
      )}
    </div>
  );
};

