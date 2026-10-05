import React from 'react';
import {
  Package,
  Calendar,
  CreditCard,
  Truck,
  CheckCircle2,
  Clock,
  ChevronRight,
  ExternalLink,
} from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { OrderStatus, Order } from '../types';

export const OrdersView: React.FC = () => {
  const { orders, setCurrentView, openProductDetail, allProducts } = useShop();

  const formatInr = (amount: number) => {
    return '₹' + amount.toLocaleString('en-IN');
  };

  const statusSteps: OrderStatus[] = [
    'Order Placed',
    'Confirmed',
    'Packed',
    'Shipped',
    'Out for Delivery',
    'Delivered',
  ];

  const getStatusStepIndex = (status: OrderStatus) => {
    return statusSteps.indexOf(status);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 pb-24">
      {/* Title */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 font-display">
            My Orders ({orders.length})
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Track package dispatches, live delivery updates, and past purchases
          </p>
        </div>
        <button
          onClick={() => setCurrentView('products')}
          className="text-xs font-bold text-orange-600 hover:text-orange-700 hidden sm:block"
        >
          Explore More Products →
        </button>
      </div>

      {orders.length > 0 ? (
        <div className="space-y-6">
          {orders.map((order) => {
            const currentStepIdx = getStatusStepIndex(order.status);
            const dateStr = new Date(order.createdAt).toLocaleDateString('en-IN', {
              day: 'numeric',
              month: 'short',
              year: 'numeric',
            });

            return (
              <div
                key={order.id}
                className="bg-white rounded-3xl border border-slate-200/90 shadow-xs overflow-hidden transition-all hover:border-slate-300"
              >
                {/* Order Top Bar */}
                <div className="p-4 sm:p-5 bg-slate-50/70 border-b border-slate-200/80 flex flex-wrap items-center justify-between gap-3 text-xs">
                  <div className="flex flex-wrap items-center gap-4">
                    <div>
                      <span className="text-slate-400 block text-[10px] uppercase font-bold">
                        Order ID
                      </span>
                      <span className="font-mono font-bold text-slate-900">
                        {order.orderNumber}
                      </span>
                    </div>

                    <div>
                      <span className="text-slate-400 block text-[10px] uppercase font-bold">
                        Placed On
                      </span>
                      <span className="text-slate-800 font-medium">{dateStr}</span>
                    </div>

                    <div>
                      <span className="text-slate-400 block text-[10px] uppercase font-bold">
                        Total Amount
                      </span>
                      <span className="font-bold text-slate-950 font-mono">
                        {formatInr(order.totalAmount)}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-bold px-2.5 py-1 rounded-md bg-orange-100 text-orange-800">
                      {order.paymentMethod}
                    </span>
                    <span
                      className={`text-[11px] font-bold px-2.5 py-1 rounded-md ${
                        order.status === 'Delivered'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-amber-100 text-amber-900'
                      }`}
                    >
                      {order.status}
                    </span>
                  </div>
                </div>

                {/* Tracking Stepper Bar */}
                <div className="px-4 sm:px-6 py-4 border-b border-slate-100 bg-white">
                  <div className="text-xs font-bold text-slate-700 mb-2 flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <Truck className="w-4 h-4 text-orange-600" />
                      <span>{order.estimatedDelivery}</span>
                    </span>
                    <span className="text-[11px] font-normal text-slate-400">
                      Courier: BlueDart Express
                    </span>
                  </div>

                  {/* Visual Status Progress */}
                  <div className="grid grid-cols-6 gap-1 pt-1">
                    {statusSteps.map((step, idx) => {
                      const isCompleted = idx <= currentStepIdx;
                      const isCurrent = idx === currentStepIdx;
                      return (
                        <div key={step} className="flex flex-col items-center text-center">
                          <div
                            className={`w-full h-1.5 rounded-full mb-1.5 transition-colors ${
                              isCompleted ? 'bg-emerald-500' : 'bg-slate-200'
                            }`}
                          />
                          <span
                            className={`text-[9px] sm:text-[10px] leading-tight line-clamp-1 ${
                              isCurrent
                                ? 'font-bold text-emerald-700'
                                : isCompleted
                                ? 'text-slate-700 font-medium'
                                : 'text-slate-400'
                            }`}
                          >
                            {step}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Items List */}
                <div className="p-4 sm:p-6 space-y-4">
                  {order.items.map((item) => {
                    const originalProduct = allProducts.find((p) => p.id === item.productId);
                    return (
                      <div
                        key={item.productId}
                        className="flex items-center justify-between gap-4 py-2 border-b border-slate-100 last:border-none"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-16 h-16 rounded-xl bg-slate-100 overflow-hidden shrink-0 border border-slate-200">
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-full h-full object-cover"
                            />
                          </div>

                          <div className="space-y-0.5">
                            <span className="text-[10px] font-bold uppercase text-orange-600">
                              {item.brand}
                            </span>
                            <h4 className="text-xs sm:text-sm font-semibold text-slate-900 line-clamp-1">
                              {item.name}
                            </h4>
                            <div className="flex items-center gap-2 text-[11px] text-slate-500">
                              <span>Qty: {item.quantity}</span>
                              {item.selectedSize && <span>· Size: {item.selectedSize}</span>}
                              {item.selectedColor && <span>· Color: {item.selectedColor}</span>}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <span className="font-bold text-slate-950 font-mono text-sm sm:text-base">
                            {formatInr(item.price * item.quantity)}
                          </span>
                          {originalProduct && (
                            <button
                              onClick={() => openProductDetail(originalProduct)}
                              className="px-2.5 py-1 text-xs font-semibold text-slate-700 hover:text-orange-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors hidden sm:block"
                            >
                              Buy Again
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Shipping Address Footer */}
                <div className="px-4 sm:px-6 py-3 bg-slate-50 text-[11px] text-slate-500 border-t border-slate-100 flex items-center justify-between">
                  <span>
                    Delivering to:{' '}
                    <strong className="text-slate-700">
                      {order.shippingAddress.name}, {order.shippingAddress.house}, {order.shippingAddress.city} {order.shippingAddress.pin}
                    </strong>
                  </span>
                  <span className="text-emerald-700 font-semibold">
                    Free Return Available until 7 Days
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center flex flex-col items-center justify-center">
          <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center text-3xl mb-3">
            📦
          </div>
          <h3 className="text-base font-bold text-slate-900 mb-1">
            No orders placed yet
          </h3>
          <p className="text-xs text-slate-500 max-w-sm mb-4">
            Once you place an order, your packages, tracking updates, and delivery timelines will appear here.
          </p>
          <button
            onClick={() => setCurrentView('products')}
            className="px-5 py-2.5 bg-orange-600 text-white rounded-xl text-xs font-bold shadow-md hover:bg-orange-700"
          >
            Explore Deals
          </button>
        </div>
      )}
    </div>
  );
};
