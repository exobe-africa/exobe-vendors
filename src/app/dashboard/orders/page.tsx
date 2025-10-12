'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Search, Filter, Eye, Package, Truck, CheckCircle } from 'lucide-react';
import { format } from 'date-fns';

// Mock data
const orders = [
  {
    id: '1',
    order_number: 'ORD-2024-001',
    customer: 'John Doe',
    email: 'john@example.com',
    status: 'PAID',
    payment_status: 'PAID',
    total: 1234.50,
    items_count: 3,
    created_at: new Date('2024-01-15'),
  },
  {
    id: '2',
    order_number: 'ORD-2024-002',
    customer: 'Jane Smith',
    email: 'jane@example.com',
    status: 'FULFILLED',
    payment_status: 'PAID',
    total: 856.00,
    items_count: 2,
    created_at: new Date('2024-01-14'),
  },
  {
    id: '3',
    order_number: 'ORD-2024-003',
    customer: 'Bob Johnson',
    email: 'bob@example.com',
    status: 'PENDING',
    payment_status: 'INITIATED',
    total: 2100.00,
    items_count: 5,
    created_at: new Date('2024-01-14'),
  },
  {
    id: '4',
    order_number: 'ORD-2024-004',
    customer: 'Alice Brown',
    email: 'alice@example.com',
    status: 'CANCELLED',
    payment_status: 'FAILED',
    total: 567.25,
    items_count: 1,
    created_at: new Date('2024-01-13'),
  },
];

const statusConfig = {
  PENDING: { label: 'Pending', color: 'bg-yellow-100 text-yellow-800', icon: Package },
  PAID: { label: 'Paid', color: 'bg-blue-100 text-blue-800', icon: CheckCircle },
  FULFILLED: { label: 'Fulfilled', color: 'bg-green-100 text-green-800', icon: Truck },
  CANCELLED: { label: 'Cancelled', color: 'bg-red-100 text-red-800', icon: Package },
  REFUNDED: { label: 'Refunded', color: 'bg-gray-100 text-gray-800', icon: Package },
};

export default function OrdersPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Orders</h1>
          <p className="text-gray-600 mt-1">Manage and track your orders</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Orders</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">234</p>
            </div>
            <Package className="w-10 h-10 text-blue-500" />
          </div>
        </Card>
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Pending</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">12</p>
            </div>
            <Package className="w-10 h-10 text-yellow-500" />
          </div>
        </Card>
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Processing</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">8</p>
            </div>
            <Truck className="w-10 h-10 text-blue-500" />
          </div>
        </Card>
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Completed</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">214</p>
            </div>
            <CheckCircle className="w-10 h-10 text-green-500" />
          </div>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                placeholder="Search orders, customers..."
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
                { value: 'all', label: 'All Status' },
                { value: 'PENDING', label: 'Pending' },
                { value: 'PAID', label: 'Paid' },
                { value: 'FULFILLED', label: 'Fulfilled' },
                { value: 'CANCELLED', label: 'Cancelled' },
              ]}
            />
          </div>
          <Button variant="outline">
            <Filter className="w-5 h-5" />
            More Filters
          </Button>
        </div>
      </Card>

      {/* Orders Table */}
      <Card padding={false}>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">Order</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">Date</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">Customer</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">Status</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">Payment</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">Total</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">Items</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => {
                const StatusIcon = statusConfig[order.status as keyof typeof statusConfig].icon;
                return (
                  <tr key={order.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-4 px-6">
                      <Link href={`/dashboard/orders/${order.id}`}>
                        <p className="font-medium text-gray-900 hover:text-red-600">{order.order_number}</p>
                      </Link>
                    </td>
                    <td className="py-4 px-6 text-sm text-gray-600">
                      {format(order.created_at, 'MMM dd, yyyy')}
                    </td>
                    <td className="py-4 px-6">
                      <div>
                        <p className="text-sm font-medium text-gray-900">{order.customer}</p>
                        <p className="text-xs text-gray-500">{order.email}</p>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className={`
                        inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium
                        ${statusConfig[order.status as keyof typeof statusConfig].color}
                      `}>
                        <StatusIcon className="w-3 h-3" />
                        {statusConfig[order.status as keyof typeof statusConfig].label}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <span className={`
                        text-xs font-medium
                        ${order.payment_status === 'PAID' ? 'text-green-600' : ''}
                        ${order.payment_status === 'INITIATED' ? 'text-yellow-600' : ''}
                        ${order.payment_status === 'FAILED' ? 'text-red-600' : ''}
                      `}>
                        {order.payment_status}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-sm font-medium text-gray-900">
                      R {order.total.toFixed(2)}
                    </td>
                    <td className="py-4 px-6 text-sm text-gray-600">
                      {order.items_count} {order.items_count === 1 ? 'item' : 'items'}
                    </td>
                    <td className="py-4 px-6">
                      <Link href={`/dashboard/orders/${order.id}`}>
                        <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
                          <Eye className="w-4 h-4" />
                        </button>
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200">
          <p className="text-sm text-gray-600">
            Showing <span className="font-medium">1</span> to <span className="font-medium">4</span> of{' '}
            <span className="font-medium">234</span> orders
          </p>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" disabled>
              Previous
            </Button>
            <Button variant="outline" size="sm">
              Next
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}

