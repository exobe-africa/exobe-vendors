'use client';
import { useEffect } from 'react';
import { useAuthStore } from '@/store/auth';
import { useRouter } from 'next/navigation';

import { Card, CardHeader, CardTitle } from '@/components/ui/Card';
import { 
  TrendingUp, 
  Package, 
  ShoppingCart, 
  DollarSign,
  ArrowUp,
  ArrowDown
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';

const stats = [
  { 
    name: 'Total Revenue', 
    value: 'R 45,231.89', 
    change: '+20.1%', 
    trend: 'up',
    icon: DollarSign,
    color: 'bg-green-500'
  },
  { 
    name: 'Orders', 
    value: '234', 
    change: '+12.5%', 
    trend: 'up',
    icon: ShoppingCart,
    color: 'bg-blue-500'
  },
  { 
    name: 'Products', 
    value: '89', 
    change: '+4', 
    trend: 'up',
    icon: Package,
    color: 'bg-purple-500'
  },
  { 
    name: 'Conversion Rate', 
    value: '3.24%', 
    change: '-0.4%', 
    trend: 'down',
    icon: TrendingUp,
    color: 'bg-orange-500'
  },
];

const salesData = [
  { name: 'Mon', sales: 2400 },
  { name: 'Tue', sales: 1398 },
  { name: 'Wed', sales: 9800 },
  { name: 'Thu', sales: 3908 },
  { name: 'Fri', sales: 4800 },
  { name: 'Sat', sales: 3800 },
  { name: 'Sun', sales: 4300 },
];

const orderData = [
  { name: 'Jan', orders: 65 },
  { name: 'Feb', orders: 59 },
  { name: 'Mar', orders: 80 },
  { name: 'Apr', orders: 81 },
  { name: 'May', orders: 56 },
  { name: 'Jun', orders: 89 },
];

const recentOrders = [
  { id: '#ORD-001', customer: 'John Doe', total: 'R 1,234.00', status: 'Completed', date: '2024-01-15' },
  { id: '#ORD-002', customer: 'Jane Smith', total: 'R 856.50', status: 'Processing', date: '2024-01-15' },
  { id: '#ORD-003', customer: 'Bob Johnson', total: 'R 2,100.00', status: 'Completed', date: '2024-01-14' },
  { id: '#ORD-004', customer: 'Alice Brown', total: 'R 567.25', status: 'Pending', date: '2024-01-14' },
];

const topProducts = [
  { name: 'Premium Headphones', sales: 145, revenue: 'R 21,750' },
  { name: 'Wireless Mouse', sales: 123, revenue: 'R 6,150' },
  { name: 'USB-C Cable', sales: 98, revenue: 'R 2,940' },
  { name: 'Laptop Stand', sales: 87, revenue: 'R 8,700' },
];

export default function DashboardPage() {
  const { user, isAuthenticated, fetchMe } = useAuthStore();
  const router = useRouter();
  useEffect(() => {
    fetchMe().then(() => {
      if (!isAuthenticated || !user || !['RETAILER','WHOLESALER','SERVICE_PROVIDER'].includes(user.role)) {
        router.push('/login');
      }
    });
  }, [fetchMe, isAuthenticated, user, router]);
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-1">Welcome back{user?.name ? `, ${user.name}` : ''}! Here&apos;s what&apos;s happening with your store today.</p>
        {user?.role && (
          <p className="text-sm text-gray-500 mt-1">Your role: <span className="font-medium">{user.role}</span></p>
        )}
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <Card key={stat.name}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                <p className="text-2xl font-bold text-gray-900 mt-2">{stat.value}</p>
                <div className="flex items-center gap-1 mt-2">
                  {stat.trend === 'up' ? (
                    <ArrowUp className="w-4 h-4 text-green-600" />
                  ) : (
                    <ArrowDown className="w-4 h-4 text-red-600" />
                  )}
                  <span className={`text-sm font-medium ${stat.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                    {stat.change}
                  </span>
                  <span className="text-sm text-gray-500">vs last month</span>
                </div>
              </div>
              <div className={`${stat.color} w-12 h-12 rounded-xl flex items-center justify-center`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Sales Overview</CardTitle>
          </CardHeader>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={salesData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="name" stroke="#888" />
              <YAxis stroke="#888" />
              <Tooltip />
              <Bar dataKey="sales" fill="#dc2626" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Orders Trend</CardTitle>
          </CardHeader>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={orderData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="name" stroke="#888" />
              <YAxis stroke="#888" />
              <Tooltip />
              <Line type="monotone" dataKey="orders" stroke="#dc2626" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Orders</CardTitle>
          </CardHeader>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Order</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Customer</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Total</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Status</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order) => (
                  <tr key={order.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4 text-sm font-medium text-gray-900">{order.id}</td>
                    <td className="py-3 px-4 text-sm text-gray-600">{order.customer}</td>
                    <td className="py-3 px-4 text-sm text-gray-900">{order.total}</td>
                    <td className="py-3 px-4">
                      <span className={`
                        inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                        ${order.status === 'Completed' ? 'bg-green-100 text-green-800' : ''}
                        ${order.status === 'Processing' ? 'bg-blue-100 text-blue-800' : ''}
                        ${order.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' : ''}
                      `}>
                        {order.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Top Products */}
        <Card>
          <CardHeader>
            <CardTitle>Top Products</CardTitle>
          </CardHeader>
          <div className="space-y-4">
            {topProducts.map((product, index) => (
              <div key={product.name} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center text-red-600 font-bold">
                    #{index + 1}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{product.name}</p>
                    <p className="text-sm text-gray-500">{product.sales} sales</p>
                  </div>
                </div>
                <p className="font-semibold text-gray-900">{product.revenue}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}

