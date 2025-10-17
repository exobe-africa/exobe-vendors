import React from 'react';
import { Check } from 'lucide-react';

interface CheckboxProps {
  id?: string;
  label?: string;
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  disabled?: boolean;
  className?: string;
}

export const Checkbox: React.FC<CheckboxProps> = ({
  id,
  label,
  checked = false,
  onChange,
  disabled = false,
  className = '',
}) => {
  const handleChange = () => {
    if (!disabled && onChange) {
      onChange(!checked);
    }
  };

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <button
        type="button"
        role="checkbox"
        aria-checked={checked}
        aria-labelledby={id ? `${id}-label` : undefined}
        onClick={handleChange}
        disabled={disabled}
        className={`
          relative w-5 h-5 rounded border-2 transition-all duration-200 flex items-center justify-center
          focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2
          ${checked 
            ? 'bg-red-600 border-red-600' 
            : 'bg-white border-gray-300 hover:border-red-400'
          }
          ${disabled 
            ? 'opacity-50 cursor-not-allowed' 
            : 'cursor-pointer'
          }
        `}
      >
        {checked && (
          <Check 
            className="w-3.5 h-3.5 text-white" 
            strokeWidth={3}
          />
        )}
      </button>
      {label && (
        <label
          id={id ? `${id}-label` : undefined}
          htmlFor={id}
          onClick={handleChange}
          className={`
            text-sm text-gray-700 select-none
            ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
          `}
        >
          {label}
        </label>
      )}
    </div>
  );
};

