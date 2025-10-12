'use client';

import { useState } from 'react';
import { Card, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Select } from '@/components/ui/Select';
import { Store, User, Bell, Shield, CreditCard, Package } from 'lucide-react';

const tabs = [
  { id: 'store', label: 'Store Details', icon: Store },
  { id: 'account', label: 'Account', icon: User },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'shipping', label: 'Shipping', icon: Package },
  { id: 'payments', label: 'Payments', icon: CreditCard },
  { id: 'security', label: 'Security', icon: Shield },
];

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('store');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600 mt-1">Manage your store settings and preferences</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar Navigation */}
        <Card className="lg:col-span-1 h-fit">
          <nav className="space-y-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all
                  ${activeTab === tab.id 
                    ? 'bg-red-50 text-red-600' 
                    : 'text-gray-700 hover:bg-gray-50'
                  }
                `}
              >
                <tab.icon className="w-5 h-5" />
                {tab.label}
              </button>
            ))}
          </nav>
        </Card>

        {/* Content */}
        <div className="lg:col-span-3 space-y-6">
          {/* Store Details Tab */}
          {activeTab === 'store' && (
            <>
              <Card>
                <CardHeader>
                  <CardTitle>Store Information</CardTitle>
                </CardHeader>
                <div className="space-y-4">
                  <Input
                    label="Store Name"
                    defaultValue="My Retail Store"
                    required
                  />
                  <Input
                    label="Store Slug"
                    defaultValue="my-retail-store"
                    helperText="This will be part of your store URL"
                  />
                  <Textarea
                    label="Store Description"
                    defaultValue="Quality products for everyone"
                    rows={4}
                  />
                  <Select
                    label="Store Status"
                    options={[
                      { value: 'PENDING', label: 'Pending' },
                      { value: 'APPROVED', label: 'Approved' },
                      { value: 'SUSPENDED', label: 'Suspended' },
                    ]}
                    defaultValue="APPROVED"
                    disabled
                  />
                </div>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Contact Information</CardTitle>
                </CardHeader>
                <div className="space-y-4">
                  <Input label="Email" type="email" defaultValue="store@example.com" />
                  <Input label="Phone" defaultValue="+27 12 345 6789" />
                  <Input label="Website" defaultValue="https://mystore.com" />
                </div>
              </Card>

              <div className="flex justify-end gap-3">
                <Button variant="outline">Cancel</Button>
                <Button variant="primary">Save Changes</Button>
              </div>
            </>
          )}

          {/* Account Tab */}
          {activeTab === 'account' && (
            <>
              <Card>
                <CardHeader>
                  <CardTitle>Personal Information</CardTitle>
                </CardHeader>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <Input label="First Name" defaultValue="John" />
                    <Input label="Last Name" defaultValue="Doe" />
                  </div>
                  <Input label="Email" type="email" defaultValue="john@example.com" />
                  <Input label="Phone" defaultValue="+27 12 345 6789" />
                </div>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Change Password</CardTitle>
                </CardHeader>
                <div className="space-y-4">
                  <Input label="Current Password" type="password" />
                  <Input label="New Password" type="password" />
                  <Input label="Confirm New Password" type="password" />
                </div>
              </Card>

              <div className="flex justify-end gap-3">
                <Button variant="outline">Cancel</Button>
                <Button variant="primary">Update Account</Button>
              </div>
            </>
          )}

          {/* Notifications Tab */}
          {activeTab === 'notifications' && (
            <>
              <Card>
                <CardHeader>
                  <CardTitle>Email Notifications</CardTitle>
                </CardHeader>
                <div className="space-y-4">
                  <div className="flex items-center justify-between py-3 border-b border-gray-100">
                    <div>
                      <p className="font-medium text-gray-900">New Orders</p>
                      <p className="text-sm text-gray-500">Get notified when you receive new orders</p>
                    </div>
                    <input type="checkbox" className="rounded" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between py-3 border-b border-gray-100">
                    <div>
                      <p className="font-medium text-gray-900">Order Cancelled</p>
                      <p className="text-sm text-gray-500">Get notified when orders are cancelled</p>
                    </div>
                    <input type="checkbox" className="rounded" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between py-3 border-b border-gray-100">
                    <div>
                      <p className="font-medium text-gray-900">Return Requested</p>
                      <p className="text-sm text-gray-500">Get notified about return requests</p>
                    </div>
                    <input type="checkbox" className="rounded" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between py-3 border-b border-gray-100">
                    <div>
                      <p className="font-medium text-gray-900">Low Stock Alerts</p>
                      <p className="text-sm text-gray-500">Get notified when products are running low</p>
                    </div>
                    <input type="checkbox" className="rounded" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between py-3 border-b border-gray-100">
                    <div>
                      <p className="font-medium text-gray-900">Product Reviews</p>
                      <p className="text-sm text-gray-500">Get notified about new product reviews</p>
                    </div>
                    <input type="checkbox" className="rounded" />
                  </div>
                  <div className="flex items-center justify-between py-3">
                    <div>
                      <p className="font-medium text-gray-900">Marketing Updates</p>
                      <p className="text-sm text-gray-500">Receive tips and news about eXobe</p>
                    </div>
                    <input type="checkbox" className="rounded" />
                  </div>
                </div>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Notification Preferences</CardTitle>
                </CardHeader>
                <div className="space-y-4">
                  <Input
                    label="Low Stock Threshold"
                    type="number"
                    defaultValue="5"
                    helperText="Get notified when stock falls below this number"
                  />
                </div>
              </Card>

              <div className="flex justify-end gap-3">
                <Button variant="outline">Cancel</Button>
                <Button variant="primary">Save Preferences</Button>
              </div>
            </>
          )}

          {/* Shipping Tab */}
          {activeTab === 'shipping' && (
            <>
              <Card>
                <CardHeader>
                  <CardTitle>Shipping Settings</CardTitle>
                </CardHeader>
                <div className="space-y-4">
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <p className="text-sm text-blue-800">
                      <strong>Coming Soon:</strong> Configure your shipping rates, zones, and fulfillment options.
                    </p>
                  </div>
                </div>
              </Card>
            </>
          )}

          {/* Payments Tab */}
          {activeTab === 'payments' && (
            <>
              <Card>
                <CardHeader>
                  <CardTitle>Payment Methods</CardTitle>
                </CardHeader>
                <div className="space-y-4">
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <p className="text-sm text-blue-800">
                      <strong>Coming Soon:</strong> Set up payment gateways and payout methods.
                    </p>
                  </div>
                </div>
              </Card>
            </>
          )}

          {/* Security Tab */}
          {activeTab === 'security' && (
            <>
              <Card>
                <CardHeader>
                  <CardTitle>Two-Factor Authentication</CardTitle>
                </CardHeader>
                <div className="space-y-4">
                  <p className="text-sm text-gray-600">
                    Add an extra layer of security to your account by enabling two-factor authentication.
                  </p>
                  <Button variant="primary">Enable 2FA</Button>
                </div>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Active Sessions</CardTitle>
                </CardHeader>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">MacBook Pro - Chrome</p>
                      <p className="text-sm text-gray-500">Cape Town, South Africa • Active now</p>
                    </div>
                    <Button variant="outline" size="sm">Revoke</Button>
                  </div>
                </div>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Danger Zone</CardTitle>
                </CardHeader>
                <div className="space-y-4">
                  <div className="p-4 border-2 border-red-200 rounded-lg">
                    <p className="font-medium text-gray-900 mb-2">Delete Account</p>
                    <p className="text-sm text-gray-600 mb-4">
                      Once you delete your account, there is no going back. Please be certain.
                    </p>
                    <Button variant="danger">Delete Account</Button>
                  </div>
                </div>
              </Card>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

