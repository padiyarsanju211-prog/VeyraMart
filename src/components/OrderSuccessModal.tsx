import React from 'react';
import { CheckCircle, Package, ArrowRight, Home, Truck } from 'lucide-react';
import { useShop } from '../context/ShopContext';

export const OrderSuccessModal: React.FC = () => {
  const { latestPlacedOrder, setCurrentView, openOrderDetail } = useShop();

  if (!latestPlacedOrder) {
    return (
      <div className="max-w-xl mx-auto py-16 px-4 text-center">
        <h2 className="text-xl font-bold">No recent order</h2>
        <button
          onClick={() => setCurrentView('home')}
          className="mt-4 px-4 py-2 bg-orange-600 text-white rounded-xl text-xs font-bold"
        >
          Return Home
        </button>
      </div>
    );
  }

  const formatInr = (amount: number) => {
    return '₹' + amount.toLocaleString('en-IN');
  };

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10 pb-24">
      <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-10 shadow-lg text-center space-y-6">
        {/* Animated Celebration Icon */}
        <div className="w-20 h-20 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner animate-bounce">
          <CheckCircle className="w-12 h-12 text-emerald-600" />
        </div>

        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-orange-600 bg-orange-50 px-2.5 py-1 rounded-md">
            Order Confirmed!
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-display tracking-tight mt-2">
            Thank you, your order is placed!
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Order ID: <strong className="text-slate-900 font-mono font-bold">{latestPlacedOrder.orderNumber}</strong>
          </p>
        </div>

        {/* Order Brief Card */}
        <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200/80 text-left space-y-3">
          <div className="flex items-center justify-between text-xs pb-2 border-b border-slate-200">
            <span className="text-slate-500">Estimated Delivery:</span>
            <span className="font-bold text-slate-900 flex items-center gap-1.5 text-emerald-700">
              <Truck className="w-4 h-4 text-emerald-600" />
              <span>{latestPlacedOrder.estimatedDelivery}</span>
            </span>
          </div>

          <div className="flex items-center justify-between text-xs pb-2 border-b border-slate-200">
            <span className="text-slate-500">Shipping To:</span>
            <span className="font-semibold text-slate-900 text-right max-w-xs truncate">
              {latestPlacedOrder.shippingAddress.name} ({latestPlacedOrder.shippingAddress.city} {latestPlacedOrder.shippingAddress.pin})
            </span>
          </div>

          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-500">Total Paid ({latestPlacedOrder.paymentMethod}):</span>
            <span className="font-extrabold text-slate-950 font-mono text-sm">
              {formatInr(latestPlacedOrder.totalAmount)}
            </span>
          </div>
        </div>

        {/* Items Thumbnails */}
        <div className="flex items-center justify-center gap-2 overflow-x-auto py-2">
          {latestPlacedOrder.items.map((it) => (
            <div
              key={it.productId}
              className="w-14 h-14 rounded-xl border border-slate-200 overflow-hidden bg-slate-100 shrink-0 relative"
              title={it.name}
            >
              <img
                src={it.image}
                alt={it.name}
                className="w-full h-full object-cover"
              />
              <span className="absolute bottom-0 right-0 bg-slate-900 text-white text-[9px] font-bold px-1 rounded-tl">
                x{it.quantity}
              </span>
            </div>
          ))}
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <button
            onClick={() => {
              openOrderDetail(latestPlacedOrder);
              setCurrentView('orders');
            }}
            className="w-full sm:w-auto px-5 py-2.5 bg-orange-600 hover:bg-orange-700 text-white rounded-xl text-xs font-bold shadow-md transition-colors flex items-center justify-center gap-1.5"
          >
            <Package className="w-4 h-4" />
            <span>Track Order Status</span>
          </button>
          <button
            onClick={() => setCurrentView('home')}
            className="w-full sm:w-auto px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1.5"
          >
            <Home className="w-4 h-4" />
            <span>Continue Shopping</span>
          </button>
        </div>
      </div>
    </div>
  );
};
