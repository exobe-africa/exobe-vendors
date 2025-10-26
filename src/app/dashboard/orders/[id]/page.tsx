'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { 
  ArrowLeft, 
  Package, 
  User, 
  MapPin, 
  CreditCard,
  Clock,
  CheckCircle,
  XCircle,
  Truck,
  Calendar
} from 'lucide-react';
import { format } from 'date-fns';
import { getApolloClient } from '@/lib/apollo/client';
import { VENDOR_ORDER_BY_ID_QUERY } from '@/lib/api/orderDetail';

const statusConfig = {
  PENDING: { 
    label: 'Pending', 
    color: 'bg-yellow-100 text-yellow-800 border-yellow-200', 
    icon: Clock,
    description: 'Order has been placed and is awaiting processing'
  },
  PROCESSING: { 
    label: 'Processing', 
    color: 'bg-blue-100 text-blue-800 border-blue-200', 
    icon: Package,
    description: 'Order is being prepared for shipment'
  },
  SHIPPED: { 
    label: 'Shipped', 
    color: 'bg-purple-100 text-purple-800 border-purple-200', 
    icon: Truck,
    description: 'Order has been shipped and is on the way'
  },
  FULFILLED: { 
    label: 'Fulfilled', 
    color: 'bg-green-100 text-green-800 border-green-200', 
    icon: CheckCircle,
    description: 'Order has been successfully delivered'
  },
  CANCELLED: { 
    label: 'Cancelled', 
    color: 'bg-red-100 text-red-800 border-red-200', 
    icon: XCircle,
    description: 'Order has been cancelled'
  },
} as const;

const paymentStatusConfig = {
  INITIATED: { label: 'Initiated', color: 'text-gray-600' },
  PENDING: { label: 'Pending', color: 'text-yellow-600' },
  PAID: { label: 'Paid', color: 'text-green-600' },
  FAILED: { label: 'Failed', color: 'text-red-600' },
  REFUNDED: { label: 'Refunded', color: 'text-purple-600' },
} as const;

export default function OrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [order, setOrder] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const orderId = params?.id as string;

  useEffect(() => {
    if (!orderId) return;
    
    const fetchOrder = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const client = getApolloClient();
        const { data } = await client.query<{ orderById: any }>({
          query: VENDOR_ORDER_BY_ID_QUERY,
          variables: { orderId },
          fetchPolicy: 'network-only',
        });
        
        if (data?.orderById) {
          // Filter items to only show vendor's products
          const filteredOrder = {
            ...data.orderById,
            items: data.orderById.items || []
          };
          setOrder(filteredOrder);
        } else {
          setError('Order not found');
        }
      } catch (err: any) {
        console.error('Error fetching order:', err);
        setError(err?.message || 'Failed to load order');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchOrder();
  }, [orderId]);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="h-8 w-48 bg-gray-200 rounded animate-pulse" />
          <div className="h-10 w-32 bg-gray-200 rounded animate-pulse" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="h-64 bg-gray-200 rounded-xl animate-pulse" />
            <div className="h-96 bg-gray-200 rounded-xl animate-pulse" />
          </div>
          <div className="space-y-6">
            <div className="h-48 bg-gray-200 rounded-xl animate-pulse" />
            <div className="h-64 bg-gray-200 rounded-xl animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <XCircle className="w-16 h-16 text-red-500 mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Order Not Found</h2>
        <p className="text-gray-600 mb-6">{error || 'The order you\'re looking for doesn\'t exist.'}</p>
        <Button onClick={() => router.push('/dashboard/orders')}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Orders
        </Button>
      </div>
    );
  }

  const statusKey = (order.status || 'PENDING') as keyof typeof statusConfig;
  const statusInfo = statusConfig[statusKey] || statusConfig.PENDING;
  const StatusIcon = statusInfo.icon;

  const paymentKey = (order.payment_status || 'PENDING') as keyof typeof paymentStatusConfig;
  const paymentInfo = paymentStatusConfig[paymentKey] || paymentStatusConfig.PENDING;

  const vendorSubtotal = order.items.reduce((sum: number, item: any) => sum + (item.total_cents || 0), 0);
  const vendorTotal = vendorSubtotal; // Simplified for vendor view

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => router.push('/dashboard/orders')}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{order.order_number}</h1>
            <p className="text-gray-600 mt-1">
              Placed on {format(new Date(order.created_at), 'MMMM dd, yyyy \'at\' HH:mm')}
            </p>
          </div>
        </div>
      </div>

      {/* Status Banner */}
      <Card className={`border-2 ${statusInfo.color}`}>
        <div className="flex items-center gap-4">
          <div className={`p-3 rounded-full ${statusInfo.color}`}>
            <StatusIcon className="w-6 h-6" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold">{statusInfo.label}</h3>
            <p className="text-sm opacity-80">{statusInfo.description}</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-600">Payment Status</p>
            <p className={`text-lg font-semibold ${paymentInfo.color}`}>{paymentInfo.label}</p>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Order Items */}
          <Card>
            <div className="flex items-center gap-2 mb-4">
              <Package className="w-5 h-5 text-gray-600" />
              <h2 className="text-xl font-bold text-gray-900">Your Products in this Order</h2>
            </div>
            
            <div className="space-y-4">
              {order.items.map((item: any) => (
                <div key={item.id} className="flex gap-4 p-4 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors">
                  <div className="w-20 h-20 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden flex-shrink-0">
                    {item.product?.media?.[0]?.url ? (
                      <img 
                        src={item.product.media[0].url} 
                        alt={item.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <Package className="w-8 h-8 text-gray-400" />
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 truncate">{item.title}</h3>
                    <p className="text-sm text-gray-600">SKU: {item.sku}</p>
                    {item.attributes && Object.keys(item.attributes).length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-1">
                        {Object.entries(item.attributes).map(([key, value]) => (
                          <span key={key} className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                            {key}: {String(value)}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  
                  <div className="text-right flex-shrink-0">
                    <p className="font-semibold text-gray-900">
                      R {((item.price_cents || 0) / 100).toFixed(2)}
                    </p>
                    <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                    <p className="text-sm font-medium text-gray-900 mt-1">
                      R {((item.total_cents || 0) / 100).toFixed(2)}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Vendor Totals */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="space-y-2">
                <div className="flex justify-between text-gray-600">
                  <span>Your Items Subtotal</span>
                  <span>R {(vendorSubtotal / 100).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-lg font-bold text-gray-900 pt-2 border-t border-gray-200">
                  <span>Your Total Revenue</span>
                  <span>R {(vendorTotal / 100).toFixed(2)}</span>
                </div>
              </div>
            </div>
          </Card>

          {/* Order Timeline */}
          {order.events && order.events.length > 0 && (
            <Card>
              <div className="flex items-center gap-2 mb-4">
                <Clock className="w-5 h-5 text-gray-600" />
                <h2 className="text-xl font-bold text-gray-900">Order Timeline</h2>
              </div>
              
              <div className="space-y-4">
                {order.events.map((event: any, index: number) => (
                  <div key={event.id} className="flex gap-4">
                    <div className="relative flex flex-col items-center">
                      <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                        <Calendar className="w-5 h-5 text-blue-600" />
                      </div>
                      {index < order.events.length - 1 && (
                        <div className="w-0.5 h-full bg-gray-200 flex-1 mt-2" />
                      )}
                    </div>
                    
                    <div className="flex-1 pb-6">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-semibold text-gray-900">
                            {event.status || event.payment_status}
                          </h3>
                          {event.description && (
                            <p className="text-sm text-gray-600 mt-1">{event.description}</p>
                          )}
                        </div>
                        <span className="text-sm text-gray-500">
                          {format(new Date(event.created_at), 'MMM dd, HH:mm')}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Customer Info */}
          <Card>
            <div className="flex items-center gap-2 mb-4">
              <User className="w-5 h-5 text-gray-600" />
              <h2 className="text-lg font-bold text-gray-900">Customer</h2>
            </div>
            
            {order.customer ? (
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-600">Name</p>
                  <p className="font-medium text-gray-900">
                    {order.customer.first_name} {order.customer.last_name}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Email</p>
                  <p className="font-medium text-gray-900">{order.customer.email}</p>
                </div>
                {(order.customer.phone || order.customer.mobile) && (
                  <div>
                    <p className="text-sm text-gray-600">Phone</p>
                    <p className="font-medium text-gray-900">
                      {order.customer.phone || order.customer.mobile}
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <div>
                <p className="text-sm text-gray-600">Email</p>
                <p className="font-medium text-gray-900">{order.email}</p>
              </div>
            )}
          </Card>

          {/* Shipping Address */}
          {order.shipping_address && (
            <Card>
              <div className="flex items-center gap-2 mb-4">
                <MapPin className="w-5 h-5 text-gray-600" />
                <h2 className="text-lg font-bold text-gray-900">Shipping Address</h2>
              </div>
              
              <div className="text-gray-900">
                {order.shipping_address.name && (
                  <p className="font-medium">{order.shipping_address.name}</p>
                )}
                {order.shipping_address.address_line_1 && (
                  <p>{order.shipping_address.address_line_1}</p>
                )}
                {order.shipping_address.address_line_2 && (
                  <p>{order.shipping_address.address_line_2}</p>
                )}
                <p>
                  {order.shipping_address.city && `${order.shipping_address.city}, `}
                  {order.shipping_address.province} {order.shipping_address.postal_code}
                </p>
                {order.shipping_address.country && (
                  <p>{order.shipping_address.country}</p>
                )}
              </div>
            </Card>
          )}

          {/* Payment Summary */}
          <Card>
            <div className="flex items-center gap-2 mb-4">
              <CreditCard className="w-5 h-5 text-gray-600" />
              <h2 className="text-lg font-bold text-gray-900">Order Summary</h2>
            </div>
            
            <div className="space-y-3">
              <div className="flex justify-between text-gray-600">
                <span>Order Total</span>
                <span>R {((order.total_cents || 0) / 100).toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Your Items</span>
                <span>{order.items.length}</span>
              </div>
              <div className="pt-3 border-t border-gray-200">
                <div className="flex justify-between text-lg font-bold text-gray-900">
                  <span>Your Revenue</span>
                  <span className="text-green-600">R {(vendorTotal / 100).toFixed(2)}</span>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

