import React, { useState } from 'react';
import {
  X,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  ShoppingBag,
  ShieldCheck,
  Tag,
  Check,
} from 'lucide-react';
import { useShop } from '../context/ShopContext';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({ isOpen, onClose }) => {
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

  if (!isOpen) return null;

  const formatInr = (amount: number) => {
    return '₹' + amount.toLocaleString('en-IN');
  };

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponCode) return;
    const res = applyCoupon(couponCode);
    setCouponFeedback(res);
  };

  const handleProceedToCheckout = () => {
    onClose();
    setCurrentView('checkout');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden animate-in fade-in duration-200">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-slate-950/60 backdrop-blur-xs transition-opacity"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col justify-between border-l border-slate-200">
          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50/70">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-orange-600" />
              <h2 className="text-base sm:text-lg font-bold text-slate-900 font-display">
                Shopping Cart ({cartTotalCount})
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
            {cartItems.length > 0 ? (
              cartItems.map((item) => (
                <div
                  key={`${item.product.id}-${item.selectedSize}-${item.selectedColor}`}
                  className="flex gap-3 p-3 rounded-2xl bg-white border border-slate-200/90 shadow-xs hover:border-slate-300 transition-colors"
                >
                  {/* Thumbnail */}
                  <div className="w-20 h-20 rounded-xl bg-slate-100 overflow-hidden shrink-0 border border-slate-200/60">
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover object-center"
                    />
                  </div>

                  {/* Info */}
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <span className="text-[10px] font-bold uppercase text-orange-600">
                            {item.product.brand}
                          </span>
                          <h4 className="text-xs font-semibold text-slate-900 line-clamp-1">
                            {item.product.name}
                          </h4>
                        </div>
                        <button
                          onClick={() => removeFromCart(item.product.id, item.selectedSize, item.selectedColor)}
                          className="text-slate-400 hover:text-rose-600 transition-colors p-0.5"
                          title="Remove item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Variant tags */}
                      {(item.selectedSize || item.selectedColor) && (
                        <div className="flex gap-2 text-[11px] text-slate-500 mt-0.5">
                          {item.selectedSize && <span>Size: {item.selectedSize}</span>}
                          {item.selectedColor && <span>· {item.selectedColor}</span>}
                        </div>
                      )}
                    </div>

                    {/* Price and Quantity Stepper */}
                    <div className="flex items-center justify-between mt-2 pt-1 border-t border-slate-100">
                      <div className="flex items-baseline gap-1.5">
                        <span className="text-sm font-bold text-slate-900">
                          {formatInr(item.product.price * item.quantity)}
                        </span>
                        {item.product.originalPrice > item.product.price && (
                          <span className="text-[10px] text-slate-400 line-through">
                            {formatInr(item.product.originalPrice * item.quantity)}
                          </span>
                        )}
                      </div>

                      {/* Stepper */}
                      <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden bg-slate-50">
                        <button
                          onClick={() =>
                            updateQuantity(
                              item.product.id,
                              item.quantity - 1,
                              item.selectedSize,
                              item.selectedColor
                            )
                          }
                          className="p-1 hover:bg-slate-200 text-slate-600 transition-colors"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-2 text-xs font-bold text-slate-900 min-w-5 text-center">
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
                          className="p-1 hover:bg-slate-200 text-slate-600 transition-colors"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="py-12 text-center flex flex-col items-center justify-center">
                <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 text-3xl mb-3">
                  🛒
                </div>
                <h3 className="text-base font-bold text-slate-900 mb-1">
                  Your cart is empty
                </h3>
                <p className="text-xs text-slate-500 max-w-xs mb-4">
                  Add genuine Indian groceries, latest fashion trends, and electronics to your bag.
                </p>
                <button
                  onClick={() => {
                    onClose();
                    setCurrentView('products');
                  }}
                  className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-xl text-xs font-bold shadow-md transition-colors"
                >
                  Start Shopping
                </button>
              </div>
            )}

            {/* Coupons Section */}
            {cartItems.length > 0 && (
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/90 space-y-2.5">
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
                  <Tag className="w-3.5 h-3.5 text-orange-600" />
                  <span>Apply Promotional Coupon</span>
                </div>

                {!appliedCoupon ? (
                  <form onSubmit={handleApplyCoupon} className="flex gap-2">
                    <input
                      type="text"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                      placeholder="Try VEYRA100, SUPER50"
                      className="flex-1 px-3 py-1.5 bg-white text-xs text-slate-900 border border-slate-200 rounded-lg focus:outline-none focus:border-orange-500 font-mono uppercase"
                    />
                    <button
                      type="submit"
                      className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-lg transition-colors"
                    >
                      Apply
                    </button>
                  </form>
                ) : (
                  <div className="flex items-center justify-between bg-emerald-50 border border-emerald-200 p-2 rounded-lg text-xs">
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
            )}
          </div>

          {/* Footer - Order Bill Summary & Checkout CTA */}
          {cartItems.length > 0 && (
            <div className="p-4 sm:p-5 border-t border-slate-200 bg-slate-50/90 space-y-3">
              <div className="space-y-1.5 text-xs text-slate-600">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-semibold text-slate-900 font-mono">
                    {formatInr(cartSubtotal)}
                  </span>
                </div>
                <div className="flex justify-between text-emerald-600">
                  <span>Discount Savings</span>
                  <span className="font-semibold font-mono">
                    -{formatInr(cartDiscount)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="flex items-center gap-1">
                    <span>Delivery Fee</span>
                    {deliveryFee === 0 && (
                      <span className="text-[10px] bg-emerald-100 text-emerald-800 px-1 rounded font-bold">
                        FREE
                      </span>
                    )}
                  </span>
                  <span className="font-semibold font-mono">
                    {deliveryFee === 0 ? 'FREE' : formatInr(deliveryFee)}
                  </span>
                </div>
                <div className="flex justify-between text-sm font-bold text-slate-900 pt-2 border-t border-slate-200">
                  <span>Total Payable</span>
                  <span className="font-extrabold text-orange-600 font-sans text-base">
                    {formatInr(cartGrandTotal)}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 text-[10px] text-slate-500 bg-white p-2 rounded-lg border border-slate-200/60">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Safe & Secure Checkout · 100% Purchase Protection</span>
              </div>

              <button
                onClick={handleProceedToCheckout}
                className="w-full py-3 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white rounded-xl text-xs sm:text-sm font-bold shadow-md shadow-orange-600/30 flex items-center justify-center gap-2 transition-all active:scale-95"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
