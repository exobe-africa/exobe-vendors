'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Plus, Search, Edit, Trash2, Copy, ToggleLeft, ToggleRight, Tag } from 'lucide-react';
import { format } from 'date-fns';

// Mock data
const discounts = [
  {
    id: '1',
    code: 'SUMMER2024',
    title: 'Summer Sale',
    type: 'ORDER_PERCENT',
    value: 20,
    usage: 45,
    usage_limit: 100,
    starts_at: new Date('2024-06-01'),
    ends_at: new Date('2024-08-31'),
    is_active: true,
  },
  {
    id: '2',
    code: 'WELCOME10',
    title: 'Welcome Discount',
    type: 'ORDER_AMOUNT',
    value: 100,
    usage: 234,
    usage_limit: null,
    starts_at: new Date('2024-01-01'),
    ends_at: null,
    is_active: true,
  },
  {
    id: '3',
    code: 'FREESHIP',
    title: 'Free Shipping',
    type: 'FREE_SHIPPING',
    value: 0,
    usage: 89,
    usage_limit: 500,
    starts_at: new Date('2024-01-01'),
    ends_at: new Date('2024-12-31'),
    is_active: true,
  },
  {
    id: '4',
    code: 'BLACKFRIDAY',
    title: 'Black Friday Sale',
    type: 'ORDER_PERCENT',
    value: 50,
    usage: 567,
    usage_limit: 1000,
    starts_at: new Date('2023-11-24'),
    ends_at: new Date('2023-11-27'),
    is_active: false,
  },
];

const discountTypeLabels = {
  ORDER_PERCENT: 'Percentage',
  ORDER_AMOUNT: 'Fixed Amount',
  FREE_SHIPPING: 'Free Shipping',
  PRODUCT_PERCENT: 'Product %',
  PRODUCT_AMOUNT: 'Product Amount',
  BUY_X_GET_Y: 'Buy X Get Y',
};

export default function DiscountsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Discounts</h1>
          <p className="text-gray-600 mt-1">Create and manage discount codes</p>
        </div>
        <Link href="/dashboard/discounts/new">
          <Button variant="primary" size="lg">
            <Plus className="w-5 h-5" />
            Create Discount
          </Button>
        </Link>
      </div>

      {/* Filters */}
      <Card>
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                placeholder="Search discount codes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <div className="w-full md:w-48">
            <Select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              options={[
                { value: 'all', label: 'All Discounts' },
                { value: 'active', label: 'Active' },
                { value: 'inactive', label: 'Inactive' },
                { value: 'scheduled', label: 'Scheduled' },
              ]}
            />
          </div>
        </div>
      </Card>

      {/* Discounts List */}
      <div className="space-y-4">
        {discounts.map((discount) => (
          <Card key={discount.id}>
            <div className="flex items-start gap-6">
              {/* Toggle */}
              <button className="mt-1">
                {discount.is_active ? (
                  <ToggleRight className="w-8 h-8 text-green-600" />
                ) : (
                  <ToggleLeft className="w-8 h-8 text-gray-400" />
                )}
              </button>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{discount.title}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <code className="px-2 py-1 bg-gray-100 text-red-600 rounded text-sm font-mono">
                        {discount.code}
                      </code>
                      <button
                        onClick={() => copyCode(discount.code)}
                        className="p-1 text-gray-500 hover:text-gray-700"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Link href={`/dashboard/discounts/${discount.id}/edit`}>
                      <Button variant="outline" size="sm">
                        <Edit className="w-4 h-4" />
                        Edit
                      </Button>
                    </Link>
                    <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Type</p>
                    <p className="text-sm font-medium text-gray-900">
                      {discountTypeLabels[discount.type as keyof typeof discountTypeLabels]}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Value</p>
                    <p className="text-sm font-medium text-gray-900">
                      {discount.type.includes('PERCENT') 
                        ? `${discount.value}%` 
                        : discount.type === 'FREE_SHIPPING'
                        ? 'Free'
                        : `R ${discount.value}`}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Usage</p>
                    <p className="text-sm font-medium text-gray-900">
                      {discount.usage} {discount.usage_limit ? `/ ${discount.usage_limit}` : ''}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Active Period</p>
                    <p className="text-sm font-medium text-gray-900">
                      {format(discount.starts_at, 'MMM dd')} -{' '}
                      {discount.ends_at ? format(discount.ends_at, 'MMM dd, yyyy') : 'No end date'}
                    </p>
                  </div>
                </div>

                {/* Progress Bar */}
                {discount.usage_limit && (
                  <div className="mt-4">
                    <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
                      <span>Usage Progress</span>
                      <span>{Math.round((discount.usage / discount.usage_limit) * 100)}%</span>
                    </div>
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-red-600 rounded-full transition-all"
                        style={{ width: `${(discount.usage / discount.usage_limit) * 100}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {discounts.length === 0 && (
        <Card>
          <div className="text-center py-12">
            <Tag className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No discounts yet</h3>
            <p className="text-gray-600 mb-6">Create your first discount code to boost sales</p>
            <Link href="/dashboard/discounts/new">
              <Button variant="primary">
                <Plus className="w-5 h-5" />
                Create Discount
              </Button>
            </Link>
          </div>
        </Card>
      )}
    </div>
  );
}

