'use client';

import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Select } from '@/components/ui/Select';
import { Bell, Package, ShoppingCart, AlertCircle, CheckCircle, Trash2, Mail } from 'lucide-react';
import { format } from 'date-fns';

// Mock data
const notifications = [
  {
    id: '1',
    type: 'order',
    title: 'New Order Received',
    message: 'Order #ORD-2024-045 has been placed by John Doe',
    timestamp: new Date('2024-01-15T10:30:00'),
    read: false,
    icon: ShoppingCart,
    color: 'bg-blue-100 text-blue-600',
  },
  {
    id: '2',
    type: 'inventory',
    title: 'Low Stock Alert',
    message: 'Premium Headphones stock is running low (5 units remaining)',
    timestamp: new Date('2024-01-15T09:15:00'),
    read: false,
    icon: AlertCircle,
    color: 'bg-yellow-100 text-yellow-600',
  },
  {
    id: '3',
    type: 'order',
    title: 'Order Fulfilled',
    message: 'Order #ORD-2024-044 has been marked as fulfilled',
    timestamp: new Date('2024-01-14T16:45:00'),
    read: true,
    icon: CheckCircle,
    color: 'bg-green-100 text-green-600',
  },
  {
    id: '4',
    type: 'product',
    title: 'Product Approved',
    message: 'Your product "Wireless Mouse" has been approved and is now live',
    timestamp: new Date('2024-01-14T14:20:00'),
    read: true,
    icon: Package,
    color: 'bg-purple-100 text-purple-600',
  },
  {
    id: '5',
    type: 'review',
    title: 'New Review Received',
    message: 'A customer left a 5-star review on "Premium Headphones"',
    timestamp: new Date('2024-01-14T11:30:00'),
    read: true,
    icon: Mail,
    color: 'bg-pink-100 text-pink-600',
  },
];

export default function NotificationsPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Notifications</h1>
          <p className="text-gray-600 mt-1">Stay updated with your store activities</p>
        </div>
        <div className="flex items-center gap-3">
          <Select
            options={[
              { value: 'all', label: 'All Notifications' },
              { value: 'unread', label: 'Unread' },
              { value: 'order', label: 'Orders' },
              { value: 'inventory', label: 'Inventory' },
              { value: 'product', label: 'Products' },
            ]}
            defaultValue="all"
          />
          <Button variant="outline">
            Mark All as Read
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Unread</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">2</p>
            </div>
            <Bell className="w-10 h-10 text-red-500" />
          </div>
        </Card>
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Orders</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">12</p>
            </div>
            <ShoppingCart className="w-10 h-10 text-blue-500" />
          </div>
        </Card>
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Alerts</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">3</p>
            </div>
            <AlertCircle className="w-10 h-10 text-yellow-500" />
          </div>
        </Card>
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Updates</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">8</p>
            </div>
            <Package className="w-10 h-10 text-purple-500" />
          </div>
        </Card>
      </div>

      {/* Notifications List */}
      <Card padding={false}>
        <div className="divide-y divide-gray-100">
          {notifications.map((notification) => (
            <div
              key={notification.id}
              className={`
                flex items-start gap-4 p-6 hover:bg-gray-50 transition-colors
                ${!notification.read ? 'bg-red-50/30' : ''}
              `}
            >
              {/* Icon */}
              <div className={`${notification.color} w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0`}>
                <notification.icon className="w-6 h-6" />
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-4 mb-1">
                  <h3 className={`font-semibold ${!notification.read ? 'text-gray-900' : 'text-gray-700'}`}>
                    {notification.title}
                  </h3>
                  {!notification.read && (
                    <span className="w-2 h-2 bg-red-600 rounded-full flex-shrink-0 mt-2"></span>
                  )}
                </div>
                <p className="text-sm text-gray-600 mb-2">{notification.message}</p>
                <p className="text-xs text-gray-500">
                  {format(notification.timestamp, 'MMM dd, yyyy • hh:mm a')}
                </p>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 flex-shrink-0">
                {!notification.read && (
                  <Button variant="outline" size="sm">
                    Mark Read
                  </Button>
                )}
                <button className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Load More */}
        <div className="p-6 text-center border-t border-gray-200">
          <Button variant="outline">Load More Notifications</Button>
        </div>
      </Card>

      {/* Empty State (if no notifications) */}
      {notifications.length === 0 && (
        <Card>
          <div className="text-center py-12">
            <Bell className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No notifications yet</h3>
            <p className="text-gray-600">
              You're all caught up! We'll notify you when something important happens.
            </p>
          </div>
        </Card>
      )}
    </div>
  );
}

