import React, { useState } from 'react';
import {
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  ShoppingBag,
  ShieldCheck,
  Tag,
  Check,
  ArrowLeft,
} from 'lucide-react';
import { useShop } from '../context/ShopContext';

export const CartView: React.FC = () => {
  const {
    cartItems,
    updateQuantity,
    removeFromCart,
    cartTotalCount,
    cartSubtotal,
    cartDiscount,
    deliveryFee,
    cartGrandTotal,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
    setCurrentView,
  } = useShop();

  const [couponCode, setCouponCode] = useState('');
  const [couponFeedback, setCouponFeedback] = useState<{ message: string; success: boolean } | null>(null);

  const formatInr = (amount: number) => {
    return '₹' + amount.toLocaleString('en-IN');
  };

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponCode) return;
    const res = applyCoupon(couponCode);
    setCouponFeedback(res);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 pb-24">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 mb-4">
        <button
          onClick={() => setCurrentView('products')}
          className="flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-slate-900"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Continue Shopping</span>
        </button>
        <span className="text-slate-300">/</span>
        <span className="text-xs font-bold text-slate-900">Shopping Cart</span>
      </div>

      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 font-display flex items-center gap-2">
            <span>Shopping Cart</span>
            <span className="text-base text-orange-600 font-normal">({cartTotalCount} items)</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Review your items and proceed to fast checkout
          </p>
        </div>
      </div>

      {cartItems.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Items Column */}
          <div className="lg:col-span-8 space-y-4">
            {cartItems.map((item) => (
              <div
                key={`${item.product.id}-${item.selectedSize}-${item.selectedColor}`}
                className="flex gap-4 p-4 rounded-3xl bg-white border border-slate-200/90 shadow-xs hover:border-slate-300 transition-colors"
              >
                <div className="w-24 h-24 rounded-2xl bg-slate-100 overflow-hidden shrink-0 border border-slate-200/60">
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className="text-[10px] font-bold uppercase text-orange-600">
                          {item.product.brand}
                        </span>
                        <h3 className="text-sm font-semibold text-slate-900 line-clamp-1">
                          {item.product.name}
                        </h3>
                      </div>
                      <button
                        onClick={() => removeFromCart(item.product.id, item.selectedSize, item.selectedColor)}
                        className="text-slate-400 hover:text-rose-600 transition-colors p-1"
                        title="Remove item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    {(item.selectedSize || item.selectedColor) && (
                      <div className="flex gap-2 text-xs text-slate-500 mt-1">
                        {item.selectedSize && <span>Size: {item.selectedSize}</span>}
                        {item.selectedColor && <span>· Color: {item.selectedColor}</span>}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between mt-3 pt-2 border-t border-slate-100">
                    <div className="flex items-baseline gap-2">
                      <span className="text-base font-bold text-slate-950 font-sans">
                        {formatInr(item.product.price * item.quantity)}
                      </span>
                      {item.product.originalPrice > item.product.price && (
                        <span className="text-xs text-slate-400 line-through">
                          {formatInr(item.product.originalPrice * item.quantity)}
                        </span>
                      )}
                    </div>

                    {/* Quantity Stepper */}
                    <div className="flex items-center border border-slate-200 rounded-xl overflow-hidden bg-slate-50">
                      <button
                        onClick={() =>
                          updateQuantity(
                            item.product.id,
                            item.quantity - 1,
                            item.selectedSize,
                            item.selectedColor
                          )
                        }
                        className="px-2.5 py-1 hover:bg-slate-200 text-slate-600 transition-colors"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="px-3 text-xs font-bold text-slate-900 min-w-6 text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() =>
                          updateQuantity(
                            item.product.id,
                            item.quantity + 1,
                            item.selectedSize,
                            item.selectedColor
                          )
                        }
                        className="px-2.5 py-1 hover:bg-slate-200 text-slate-600 transition-colors"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Bill Summary Column */}
          <div className="lg:col-span-4 space-y-4">
            {/* Promo Code Box */}
            <div className="p-4 rounded-3xl bg-white border border-slate-200/90 shadow-xs space-y-3">
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
                <Tag className="w-4 h-4 text-orange-600" />
                <span>Apply Coupon</span>
              </div>

              {!appliedCoupon ? (
                <form onSubmit={handleApplyCoupon} className="flex gap-2">
                  <input
                    type="text"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                    placeholder="Try VEYRA100, SUPER50"
                    className="flex-1 px-3 py-2 bg-slate-50 text-xs text-slate-900 border border-slate-200 rounded-xl focus:outline-none focus:border-orange-500 font-mono uppercase"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition-colors"
                  >
                    Apply
                  </button>
                </form>
              ) : (
                <div className="flex items-center justify-between bg-emerald-50 border border-emerald-200 p-2.5 rounded-xl text-xs">
                  <div className="flex items-center gap-1.5 text-emerald-800 font-bold">
                    <Check className="w-4 h-4 text-emerald-600" />
                    <span>{appliedCoupon.code} applied! Saved ₹{appliedCoupon.discountAmount}</span>
                  </div>
                  <button
                    onClick={removeCoupon}
                    className="text-xs text-rose-600 hover:underline font-bold"
                  >
                    Remove
                  </button>
                </div>
              )}

              {couponFeedback && !appliedCoupon && (
                <div
                  className={`text-[11px] font-semibold ${
                    couponFeedback.success ? 'text-emerald-700' : 'text-rose-600'
                  }`}
                >
                  {couponFeedback.message}
                </div>
              )}
            </div>

            {/* Bill Summary */}
            <div className="p-5 rounded-3xl bg-white border border-slate-200/90 shadow-xs space-y-3">
              <h3 className="text-sm font-bold text-slate-900 pb-2 border-b border-slate-100">
                Order Summary
              </h3>

              <div className="space-y-2 text-xs text-slate-600">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-semibold text-slate-900 font-mono">{formatInr(cartSubtotal)}</span>
                </div>
                <div className="flex justify-between text-emerald-600">
                  <span>Discount Savings</span>
                  <span className="font-semibold font-mono">-{formatInr(cartDiscount)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Delivery</span>
                  <span className="font-semibold font-mono">
                    {deliveryFee === 0 ? 'FREE' : formatInr(deliveryFee)}
                  </span>
                </div>
                <div className="flex justify-between text-sm font-bold text-slate-900 pt-2 border-t border-slate-200">
                  <span>Total Amount</span>
                  <span className="text-lg font-black text-orange-600 font-sans">
                    {formatInr(cartGrandTotal)}
                  </span>
                </div>
              </div>

              <button
                onClick={() => setCurrentView('checkout')}
                className="w-full py-3.5 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white rounded-xl text-xs sm:text-sm font-bold shadow-md shadow-orange-600/30 flex items-center justify-center gap-2 transition-all active:scale-95"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="flex items-center gap-2 text-[11px] text-slate-500 justify-center pt-1">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>100% Purchase Protection</span>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center flex flex-col items-center justify-center">
          <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center text-3xl mb-3">
            🛒
          </div>
          <h3 className="text-base font-bold text-slate-900 mb-1">
            Your cart is empty
          </h3>
          <p className="text-xs text-slate-500 max-w-sm mb-4">
            Discover great ₹ savings on 127+ authentic Indian groceries, electronics, and fashion.
          </p>
          <button
            onClick={() => setCurrentView('products')}
            className="px-5 py-2.5 bg-orange-600 text-white rounded-xl text-xs font-bold shadow-md hover:bg-orange-700"
          >
            Start Shopping
          </button>
        </div>
      )}
    </div>
  );
};
