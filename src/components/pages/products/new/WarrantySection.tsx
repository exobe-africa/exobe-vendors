'use client';

import { Card, CardHeader, CardTitle } from '@/components/ui/Card';
import { Checkbox } from '@/components/ui/Checkbox';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Textarea } from '@/components/ui/Textarea';

interface WarrantySectionProps {
  hasWarranty: boolean;
  warrantyPeriod: number;
  warrantyUnit: 'months' | 'years';
  warrantyDetails: string;
  onHasWarrantyChange: (value: boolean) => void;
  onWarrantyPeriodChange: (value: number) => void;
  onWarrantyUnitChange: (value: 'months' | 'years') => void;
  onWarrantyDetailsChange: (value: string) => void;
}

export function WarrantySection({
  hasWarranty,
  warrantyPeriod,
  warrantyUnit,
  warrantyDetails,
  onHasWarrantyChange,
  onWarrantyPeriodChange,
  onWarrantyUnitChange,
  onWarrantyDetailsChange,
}: WarrantySectionProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <CardTitle>Product Warranty</CardTitle>
          <div className="group relative">
            <svg
              className="w-4 h-4 text-gray-400 cursor-help"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <div className="absolute left-0 top-6 w-72 p-3 bg-gray-900 text-white text-xs rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10">
              Specify if this product comes with a warranty. This information helps
              customers make informed purchase decisions and builds trust.
            </div>
          </div>
        </div>
        <p className="text-sm text-gray-500 mt-1">
          Define warranty coverage for this product
        </p>
      </CardHeader>

      <div className="space-y-4">
        {/* Does product have warranty checkbox */}
        <Checkbox
          id="has-warranty"
          label="This product includes a warranty"
          checked={hasWarranty}
          onChange={onHasWarrantyChange}
        />

        {/* Show warranty details only if hasWarranty is true */}
        {hasWarranty && (
          <div className="space-y-4 pl-6 border-l-2 border-blue-200">
            {/* Warranty Period */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Warranty Duration
              </label>
              <div className="grid grid-cols-2 gap-3">
                <Input
                  type="number"
                  min="1"
                  placeholder="Enter period"
                  value={warrantyPeriod || ''}
                  onChange={(e) =>
                    onWarrantyPeriodChange(
                      Math.max(1, parseInt(e.target.value) || 1)
                    )
                  }
                  helperText="Must be positive"
                />
                <Select
                  options={[
                    { value: 'months', label: 'Months' },
                    { value: 'years', label: 'Years' },
                  ]}
                  value={warrantyUnit}
                  onChange={(e) =>
                    onWarrantyUnitChange(e.target.value as 'months' | 'years')
                  }
                />
              </div>
            </div>

            {/* Preview */}
            {warrantyPeriod > 0 && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <svg
                    className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                    />
                  </svg>
                  <div>
                    <p className="text-sm font-medium text-green-900 mb-1">
                      Customer will see:
                    </p>
                    <p className="text-sm text-green-800">
                      <span className="font-semibold">
                        {warrantyPeriod} {warrantyUnit}
                      </span>{' '}
                      warranty included
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Additional Warranty Details */}
            <div>
              <Textarea
                label="Warranty Details (Optional)"
                placeholder="e.g., Covers manufacturing defects. Does not cover physical damage or misuse."
                rows={3}
                value={warrantyDetails}
                onChange={(e) => onWarrantyDetailsChange(e.target.value)}
                helperText="Specify what is covered by the warranty"
              />
            </div>
          </div>
        )}

        {/* Info banner */}
        {!hasWarranty && (
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
            <div className="flex items-start gap-2">
              <svg
                className="w-4 h-4 text-gray-600 flex-shrink-0 mt-0.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <p className="text-xs text-gray-700">
                Products without warranty may have lower customer confidence. Consider
                offering at least a basic warranty period to increase trust and sales.
              </p>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}

