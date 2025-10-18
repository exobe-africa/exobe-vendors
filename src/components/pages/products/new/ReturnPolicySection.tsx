'use client';
import { Card, CardHeader, CardTitle } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Checkbox } from '@/components/ui/Checkbox';
import { RotateCcw, Info, X, Plus } from 'lucide-react';
import { useState } from 'react';

interface Props {
  returnPolicyName: string;
  returnsAccepted: boolean;
  returnPeriodDays: number;
  returnConditions: string[];
  restockingFeePct: number;
  returnShippingPaidBy: 'CUSTOMER' | 'VENDOR' | 'SHARED';
  onReturnPolicyNameChange: (value: string) => void;
  onReturnsAcceptedChange: (value: boolean) => void;
  onReturnPeriodDaysChange: (value: number) => void;
  onReturnConditionsChange: (value: string[]) => void;
  onRestockingFeePctChange: (value: number) => void;
  onReturnShippingPaidByChange: (value: 'CUSTOMER' | 'VENDOR' | 'SHARED') => void;
}

const RETURN_PERIOD_OPTIONS = [
  { value: '', label: 'Select return period' },
  { value: '7', label: '7 days' },
  { value: '14', label: '14 days' },
  { value: '30', label: '30 days (Recommended)' },
  { value: '60', label: '60 days' },
  { value: '90', label: '90 days' },
];

const RETURN_SHIPPING_OPTIONS = [
  { value: '', label: 'Select who pays' },
  { value: 'CUSTOMER', label: 'Customer pays return shipping' },
  { value: 'VENDOR', label: 'I pay return shipping (Free returns)' },
  { value: 'SHARED', label: 'Shared cost (50/50)' },
];

const PRESET_CONDITIONS = [
  'Product must be unopened and in original packaging',
  'All tags and labels must be attached',
  'Product must be unused and in resalable condition',
  'Original receipt or proof of purchase required',
  'Product must not show signs of wear or use',
];

export function ReturnPolicySection({
  returnPolicyName,
  returnsAccepted,
  returnPeriodDays,
  returnConditions,
  restockingFeePct,
  returnShippingPaidBy,
  onReturnPolicyNameChange,
  onReturnsAcceptedChange,
  onReturnPeriodDaysChange,
  onReturnConditionsChange,
  onRestockingFeePctChange,
  onReturnShippingPaidByChange,
}: Props) {
  const [newCondition, setNewCondition] = useState('');

  const addCondition = (condition: string) => {
    if (condition.trim()) {
      onReturnConditionsChange([...returnConditions, condition.trim()]);
      setNewCondition('');
    }
  };

  const addPresetCondition = (condition: string) => {
    if (!returnConditions.includes(condition)) {
      onReturnConditionsChange([...returnConditions, condition]);
    }
  };

  const removeCondition = (index: number) => {
    onReturnConditionsChange(returnConditions.filter((_, i) => i !== index));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addCondition(newCondition);
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <RotateCcw className="w-5 h-5 text-blue-600" />
          <CardTitle>Return Policy</CardTitle>
        </div>
        <p className="text-sm text-gray-500 mt-1">
          Define your return policy to build customer confidence and reduce disputes.
        </p>
      </CardHeader>
      <div className="space-y-6">
        {/* Returns Accepted Toggle */}
        <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
          <Checkbox
            id="returns-accepted"
            label="I accept returns for this product"
            checked={returnsAccepted}
            onChange={onReturnsAcceptedChange}
          />
          <Info className="w-4 h-4 text-gray-400 mt-0.5" />
        </div>

        {returnsAccepted && (
          <>
            {/* Policy Name */}
            <Input
              label="Policy Name *"
              placeholder="e.g. Standard 30-Day Returns, Premium Free Returns"
              value={returnPolicyName}
              onChange={(e) => onReturnPolicyNameChange(e.target.value)}
              helperText="Give this policy a memorable name for easy reference across products"
              required
            />

            {/* Return Period */}
            <div>
              <Select
                label="Return Period *"
                options={RETURN_PERIOD_OPTIONS}
                value={returnPeriodDays?.toString() || ''}
                onChange={(e) => onReturnPeriodDaysChange(parseInt(e.target.value) || 30)}
                helperText="How many days after purchase can customers return the product?"
                required
              />
              {returnPeriodDays === 30 && (
                <p className="text-xs text-green-600 mt-2 flex items-center gap-1">
                  <span className="font-semibold">✓ Recommended:</span> 30 days is the industry standard
                </p>
              )}
            </div>

            {/* Return Conditions */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Return Conditions
              </label>
              <p className="text-sm text-gray-500 mb-3">
                Be specific about what condition the product must be in for returns
              </p>

              {/* Existing Conditions List */}
              {returnConditions.length > 0 && (
                <div className="space-y-2 mb-3">
                  {returnConditions.map((condition, index) => (
                    <div
                      key={index}
                      className="flex items-start gap-2 p-3 bg-gray-50 border border-gray-200 rounded-lg group hover:border-gray-300 transition-colors"
                    >
                      <span className="text-gray-700 flex-1 text-sm">{condition}</span>
                      <button
                        type="button"
                        onClick={() => removeCondition(index)}
                        className="opacity-0 group-hover:opacity-100 text-red-600 hover:text-red-700 transition-opacity cursor-pointer"
                        title="Remove condition"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Add New Condition Input */}
              <div className="flex gap-2">
                <Input
                  placeholder="E.g., Product must be in original packaging with all tags attached"
                  value={newCondition}
                  onChange={(e) => setNewCondition(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="flex-1"
                />
                <button
                  type="button"
                  onClick={() => addCondition(newCondition)}
                  disabled={!newCondition.trim()}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors cursor-pointer flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Add
                </button>
              </div>
              
              {/* Quick Add Presets */}
              <div className="mt-3">
                <p className="text-xs font-medium text-gray-700 mb-2">Quick add common conditions:</p>
                <div className="flex flex-wrap gap-2">
                  {PRESET_CONDITIONS.map((condition, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => addPresetCondition(condition)}
                      disabled={returnConditions.includes(condition)}
                      className="text-xs px-2 py-1 bg-white border border-gray-300 rounded hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                    >
                      + {condition}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Return Shipping */}
            <Select
              label="Return Shipping Cost *"
              options={RETURN_SHIPPING_OPTIONS}
              value={returnShippingPaidBy || ''}
              onChange={(e) => onReturnShippingPaidByChange(e.target.value as any)}
              helperText="Who covers the cost of shipping the product back?"
              required
            />

            {/* Restocking Fee */}
            <div>
              <Input
                label="Restocking Fee (Optional)"
                type="number"
                min="0"
                max="100"
                step="0.01"
                placeholder="0.00"
                value={restockingFeePct || ''}
                onChange={(e) => onRestockingFeePctChange(parseFloat(e.target.value) || 0)}
                helperText="Percentage fee charged for returns (e.g., 15 = 15%). Leave blank for no fee."
              />
              {restockingFeePct > 0 && (
                <div className="mt-2 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                  <p className="text-xs text-amber-900">
                    <span className="font-semibold">Note:</span> A {restockingFeePct}% restocking fee will be deducted from the refund amount.
                  </p>
                </div>
              )}
            </div>

            {/* Info Box */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-blue-900">
                  <p className="font-semibold mb-2">💡 Best Practices:</p>
                  <ul className="space-y-1 ml-2">
                    <li>• Clear return policies increase customer confidence</li>
                    <li>• 30-day returns are standard for most products</li>
                    <li>• Free returns can significantly boost sales</li>
                    <li>• Be specific about product condition requirements</li>
                  </ul>
                </div>
              </div>
            </div>
          </>
        )}

        {/* No Returns Warning */}
        {!returnsAccepted && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <Info className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-red-900">
                <p className="font-semibold mb-2">⚠️ No Returns Policy</p>
                <p>
                  This product will be marked as <span className="font-semibold">"Final Sale - No Returns"</span> on the website. 
                  This may reduce customer confidence and sales. Consider accepting returns with restocking fees instead.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}

