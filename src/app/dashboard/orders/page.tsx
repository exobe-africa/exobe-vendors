
'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Search, Filter, Eye, Package, Truck, CheckCircle, XCircle } from 'lucide-react';
import { format } from 'date-fns';
import { getApolloClient } from '@/lib/apollo/client';
import { MY_VENDOR_ORDERS_QUERY } from '@/lib/api/orders';

// Order fulfillment statuses (not payment statuses)
const statusConfig = {
  PENDING: { label: 'Pending', color: 'bg-yellow-100 text-yellow-800', icon: Package },
  PROCESSING: { label: 'Processing', color: 'bg-amber-100 text-amber-800', icon: Package },
  SHIPPED: { label: 'Shipped', color: 'bg-blue-100 text-blue-800', icon: Truck },
  FULFILLED: { label: 'Fulfilled', color: 'bg-green-100 text-green-800', icon: CheckCircle },
  CANCELLED: { label: 'Cancelled', color: 'bg-red-100 text-red-800', icon: Package },
} as const;

export default function OrdersPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [orders, setOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      setIsLoading(true);
      try {
        const client = getApolloClient();
        const { data } = await client.query<{ myVendorOrders: any[] }>({
          query: MY_VENDOR_ORDERS_QUERY,
          fetchPolicy: 'network-only',
        });
        setOrders(data?.myVendorOrders ?? []);
      } catch {
        setOrders([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const filtered = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return orders.filter((o) => {
      const matchQuery = !q || o.order_number?.toLowerCase().includes(q) || o.email?.toLowerCase().includes(q);
      const matchStatus = statusFilter === 'all' || o.status === statusFilter;
      return matchQuery && matchStatus;
    });
  }, [orders, searchQuery, statusFilter]);

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
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Orders</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{isLoading ? '—' : orders.length}</p>
            </div>
            <Package className="w-10 h-10 text-blue-500" />
          </div>
        </Card>
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Pending</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{isLoading ? '—' : orders.filter(o => o.status === 'PENDING').length}</p>
            </div>
            <Package className="w-10 h-10 text-yellow-500" />
          </div>
        </Card>
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Processing</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{isLoading ? '—' : orders.filter(o => o.status === 'PROCESSING' || o.status === 'SHIPPED').length}</p>
            </div>
            <Truck className="w-10 h-10 text-blue-500" />
          </div>
        </Card>
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Completed</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{isLoading ? '—' : orders.filter(o => o.status === 'FULFILLED').length}</p>
            </div>
            <CheckCircle className="w-10 h-10 text-green-500" />
          </div>
        </Card>
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Cancelled</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{isLoading ? '—' : orders.filter(o => o.status === 'CANCELLED').length}</p>
            </div>
            <XCircle className="w-10 h-10 text-red-500" />
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
              </tr>
            </thead>
            <tbody>
              {(isLoading ? Array.from({ length: 4 }).map((_, i) => ({ id: `sk-${i}` })) : filtered).map((order: any) => {
                const statusKey = ((order?.status as string) || 'PENDING') as keyof typeof statusConfig;
                const StatusIcon = (statusConfig[statusKey]?.icon) || Package;
                return (
                  <tr 
                    key={order.id} 
                    onClick={() => !isLoading && router.push(`/dashboard/orders/${order.id}`)}
                    className="border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors"
                  >
                    <td className="py-4 px-6">
                      {isLoading ? (
                        <div className="h-4 w-40 bg-gray-200 rounded animate-pulse" />
                      ) : (
                        <p className="font-medium text-gray-900">{order.order_number}</p>
                      )}
                    </td>
                    <td className="py-4 px-6 text-sm text-gray-600">
                      {isLoading ? <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" /> : format(new Date(order.created_at), 'MMM dd, yyyy')}
                    </td>
                    <td className="py-4 px-6">
                      {isLoading ? (
                        <div className="h-4 w-48 bg-gray-200 rounded animate-pulse" />
                      ) : (
                        <div>
                          <p className="text-sm font-medium text-gray-900">{order.email}</p>
                        </div>
                      )}
                    </td>
                    <td className="py-4 px-6">
                      {isLoading ? (
                        <div className="h-4 w-20 bg-gray-200 rounded-full animate-pulse" />
                      ) : (
                        <span className={`
                          inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium
                          ${statusConfig[statusKey]?.color}
                        `}>
                          <StatusIcon className="w-3 h-3" />
                          {statusConfig[statusKey]?.label || 'Pending'}
                        </span>
                      )}
                    </td>
                    <td className="py-4 px-6">
                      {isLoading ? (
                        <div className="h-4 w-16 bg-gray-200 rounded animate-pulse" />
                      ) : (
                        <span className={`
                          text-xs font-medium
                          ${order.payment_status === 'PAID' ? 'text-green-600' : ''}
                          ${order.payment_status === 'INITIATED' ? 'text-yellow-600' : ''}
                          ${order.payment_status === 'FAILED' ? 'text-red-600' : ''}
                        `}>
                          {order.payment_status}
                        </span>
                      )}
                    </td>
                    <td className="py-4 px-6 text-sm font-medium text-gray-900">
                      {isLoading ? (
                        <div className="h-4 w-16 bg-gray-200 rounded animate-pulse" />
                      ) : (
                        <>R {(((order.total_cents ?? 0) as number) / 100).toFixed(2)}</>
                      )}
                    </td>
                    <td className="py-4 px-6 text-sm text-gray-600">
                      {isLoading ? (
                        <div className="h-4 w-12 bg-gray-200 rounded animate-pulse" />
                      ) : (
                        <>{order.items?.length || 0} {(order.items?.length || 0) === 1 ? 'item' : 'items'}</>
                      )}
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

