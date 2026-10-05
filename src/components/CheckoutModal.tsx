import React, { useState } from 'react';
import {
  ArrowLeft,
  MapPin,
  CreditCard,
  Smartphone,
  Building,
  Banknote,
  ShieldCheck,
  CheckCircle,
  Truck,
  Plus,
} from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { Address } from '../types';

export const CheckoutView: React.FC = () => {
  const {
    cartItems,
    cartSubtotal,
    cartDiscount,
    deliveryFee,
    cartGrandTotal,
    savedAddresses,
    addAddress,
    placeOrder,
    setCurrentView,
    showToast,
  } = useShop();

  // Selected Address
  const [selectedAddressId, setSelectedAddressId] = useState<string>(
    savedAddresses.find((a) => a.isDefault)?.id || savedAddresses[0]?.id || ''
  );

  // New address form mode
  const [isAddingNewAddress, setIsAddingNewAddress] = useState(false);
  const [newAddr, setNewAddr] = useState({
    name: 'Sanju Padiyar',
    phone: '9876543210',
    house: '',
    street: '',
    area: '',
    city: 'Bengaluru',
    state: 'Karnataka',
    pin: '560038',
    type: 'Home' as 'Home' | 'Work' | 'Other',
    isDefault: false,
  });

  // Payment method selection
  const [paymentMethod, setPaymentMethod] = useState<'UPI' | 'Card' | 'Net Banking' | 'Cash on Delivery'>('UPI');
  const [selectedUpiApp, setSelectedUpiApp] = useState<'GPay' | 'PhonePe' | 'Paytm' | 'BHIM' | 'Other'>('GPay');
  const [customUpiId, setCustomUpiId] = useState('');
  const [selectedBank, setSelectedBank] = useState('HDFC Bank');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const formatInr = (amount: number) => {
    return '₹' + amount.toLocaleString('en-IN');
  };

  const activeAddress = savedAddresses.find((a) => a.id === selectedAddressId) || savedAddresses[0];

  const handleAddNewAddressSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAddr.name || !newAddr.phone || !newAddr.house || !newAddr.pin) {
      showToast('Please fill all required address fields.', 'info');
      return;
    }
    addAddress(newAddr);
    setIsAddingNewAddress(false);
  };

  const handlePlaceOrder = async () => {
    if (!activeAddress) {
      showToast('Please choose or enter a delivery address.', 'info');
      return;
    }

    setIsSubmitting(true);
    try {
      await placeOrder(activeAddress, paymentMethod);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-12 text-center">
        <h2 className="text-xl font-bold text-slate-900 mb-2">No items to checkout</h2>
        <p className="text-xs text-slate-500 mb-4">Your cart is currently empty.</p>
        <button
          onClick={() => setCurrentView('products')}
          className="px-5 py-2.5 bg-orange-600 text-white rounded-xl text-xs font-bold"
        >
          Browse Marketplace
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 pb-24">
      {/* Checkout Breadcrumb / Back button */}
      <div className="flex items-center gap-2 mb-6">
        <button
          onClick={() => setCurrentView('cart')}
          className="flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-slate-950 p-1 rounded-lg"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Cart</span>
        </button>
        <span className="text-slate-300">/</span>
        <span className="text-xs font-bold text-slate-900">Secure Checkout</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Delivery Address & Payment Method */}
        <div className="lg:col-span-8 space-y-6">
          {/* STEP 1: Delivery Address */}
          <section className="bg-white rounded-3xl border border-slate-200/90 p-5 sm:p-6 shadow-xs">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-orange-100 text-orange-700 flex items-center justify-center font-bold text-sm">
                  1
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 font-display">
                    Delivery Address
                  </h3>
                  <p className="text-xs text-slate-500">
                    Order will be shipped to this Indian address
                  </p>
                </div>
              </div>

              {!isAddingNewAddress && (
                <button
                  onClick={() => setIsAddingNewAddress(true)}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-lg transition-colors flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add New</span>
                </button>
              )}
            </div>

            {/* Saved Addresses List */}
            {!isAddingNewAddress ? (
              <div className="space-y-3">
                {savedAddresses.map((addr) => {
                  const isSelected = selectedAddressId === addr.id;
                  return (
                    <div
                      key={addr.id}
                      onClick={() => setSelectedAddressId(addr.id)}
                      className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-start justify-between gap-3 ${
                        isSelected
                          ? 'border-orange-500 bg-orange-50/40 shadow-xs'
                          : 'border-slate-200 bg-white hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <input
                          type="radio"
                          name="address"
                          checked={isSelected}
                          onChange={() => setSelectedAddressId(addr.id)}
                          className="mt-1 accent-orange-600 cursor-pointer"
                        />
                        <div className="space-y-1 text-xs">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-slate-900 text-sm">{addr.name}</span>
                            <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-[10px] font-bold">
                              {addr.type || 'Home'}
                            </span>
                            {addr.isDefault && (
                              <span className="text-[10px] text-emerald-700 font-bold bg-emerald-50 px-1.5 py-0.5 rounded">
                                Default
                              </span>
                            )}
                          </div>
                          <p className="text-slate-600">
                            {addr.house}, {addr.street}, {addr.area}
                          </p>
                          <p className="text-slate-600">
                            {addr.city}, {addr.state} - <strong>{addr.pin}</strong>
                          </p>
                          <p className="text-slate-500 pt-0.5">
                            Phone: <strong className="text-slate-800">+91 {addr.phone}</strong>
                          </p>
                        </div>
                      </div>

                      {isSelected && (
                        <CheckCircle className="w-5 h-5 text-orange-600 shrink-0" />
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              /* Add New Address Form */
              <form onSubmit={handleAddNewAddressSubmit} className="space-y-4 pt-1">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={newAddr.name}
                      onChange={(e) => setNewAddr({ ...newAddr, name: e.target.value })}
                      placeholder="e.g. Sanju Padiyar"
                      className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-orange-500"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">
                      10-Digit Mobile Number *
                    </label>
                    <input
                      type="tel"
                      required
                      value={newAddr.phone}
                      onChange={(e) => setNewAddr({ ...newAddr, phone: e.target.value })}
                      placeholder="e.g. 9876543210"
                      className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-orange-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">
                      Flat / House No. / Building *
                    </label>
                    <input
                      type="text"
                      required
                      value={newAddr.house}
                      onChange={(e) => setNewAddr({ ...newAddr, house: e.target.value })}
                      placeholder="e.g. Flat 302, Sai Residency"
                      className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-orange-500"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">
                      Street / Road Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={newAddr.street}
                      onChange={(e) => setNewAddr({ ...newAddr, street: e.target.value })}
                      placeholder="e.g. 12th Main Road"
                      className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-orange-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">
                      PIN Code *
                    </label>
                    <input
                      type="text"
                      required
                      maxLength={6}
                      value={newAddr.pin}
                      onChange={(e) => setNewAddr({ ...newAddr, pin: e.target.value })}
                      placeholder="560038"
                      className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-orange-500 font-mono"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">
                      City *
                    </label>
                    <input
                      type="text"
                      required
                      value={newAddr.city}
                      onChange={(e) => setNewAddr({ ...newAddr, city: e.target.value })}
                      placeholder="Bengaluru"
                      className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-orange-500"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">
                      State *
                    </label>
                    <input
                      type="text"
                      required
                      value={newAddr.state}
                      onChange={(e) => setNewAddr({ ...newAddr, state: e.target.value })}
                      placeholder="Karnataka"
                      className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-orange-500"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-3 pt-2">
                  <button
                    type="submit"
                    className="px-4 py-2 bg-orange-600 text-white rounded-xl text-xs font-bold shadow-md hover:bg-orange-700"
                  >
                    Save & Use Address
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsAddingNewAddress(false)}
                    className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl text-xs font-bold hover:bg-slate-200"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </section>

          {/* STEP 2: Payment Options */}
          <section className="bg-white rounded-3xl border border-slate-200/90 p-5 sm:p-6 shadow-xs">
            <div className="flex items-center gap-2.5 pb-4 border-b border-slate-100 mb-4">
              <div className="w-8 h-8 rounded-xl bg-orange-100 text-orange-700 flex items-center justify-center font-bold text-sm">
                2
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 font-display">
                  Payment Method
                </h3>
                <p className="text-xs text-slate-500">
                  Select your preferred demo payment option
                </p>
              </div>
            </div>

            <div className="space-y-3">
              {/* Option 1: UPI */}
              <div
                onClick={() => setPaymentMethod('UPI')}
                className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                  paymentMethod === 'UPI'
                    ? 'border-orange-500 bg-orange-50/30 shadow-xs'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="payment"
                      checked={paymentMethod === 'UPI'}
                      onChange={() => setPaymentMethod('UPI')}
                      className="accent-orange-600 cursor-pointer"
                    />
                    <div className="flex items-center gap-2">
                      <Smartphone className="w-4 h-4 text-emerald-600" />
                      <span className="font-bold text-sm text-slate-900">UPI (Instant & Zero Fee)</span>
                    </div>
                  </div>
                  <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded">
                    Fastest
                  </span>
                </div>

                {paymentMethod === 'UPI' && (
                  <div className="mt-3 pt-3 border-t border-slate-200/80 space-y-3 pl-6">
                    <div className="text-xs text-slate-600">Select your preferred UPI app:</div>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {['GPay', 'PhonePe', 'Paytm', 'BHIM'].map((app) => (
                        <button
                          key={app}
                          type="button"
                          onClick={() => setSelectedUpiApp(app as any)}
                          className={`p-2 rounded-xl text-xs font-bold border transition-colors ${
                            selectedUpiApp === app
                              ? 'bg-slate-900 text-white border-slate-900'
                              : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
                          }`}
                        >
                          {app}
                        </button>
                      ))}
                    </div>
                    <div className="flex items-center gap-2 pt-1">
                      <input
                        type="text"
                        placeholder="Or enter UPI ID (e.g. mobile@upi)"
                        value={customUpiId}
                        onChange={(e) => setCustomUpiId(e.target.value)}
                        className="flex-1 text-xs p-2 rounded-lg border border-slate-200 bg-white"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Option 2: Card */}
              <div
                onClick={() => setPaymentMethod('Card')}
                className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                  paymentMethod === 'Card'
                    ? 'border-orange-500 bg-orange-50/30 shadow-xs'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === 'Card'}
                    onChange={() => setPaymentMethod('Card')}
                    className="accent-orange-600 cursor-pointer"
                  />
                  <div className="flex items-center gap-2">
                    <CreditCard className="w-4 h-4 text-blue-600" />
                    <span className="font-bold text-sm text-slate-900">
                      Credit / Debit Card (Visa, MasterCard, RuPay)
                    </span>
                  </div>
                </div>

                {paymentMethod === 'Card' && (
                  <div className="mt-3 pt-3 border-t border-slate-200/80 space-y-2 pl-6 text-xs text-slate-600">
                    <p>Demo Card: 4242 •••• •••• 4242 (Valid Thru 12/28, CVV: 123)</p>
                    <p className="text-[11px] text-slate-400">
                      Demo mode: no real money is deducted.
                    </p>
                  </div>
                )}
              </div>

              {/* Option 3: Net Banking */}
              <div
                onClick={() => setPaymentMethod('Net Banking')}
                className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                  paymentMethod === 'Net Banking'
                    ? 'border-orange-500 bg-orange-50/30 shadow-xs'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === 'Net Banking'}
                    onChange={() => setPaymentMethod('Net Banking')}
                    className="accent-orange-600 cursor-pointer"
                  />
                  <div className="flex items-center gap-2">
                    <Building className="w-4 h-4 text-purple-600" />
                    <span className="font-bold text-sm text-slate-900">
                      Net Banking (All Major Indian Banks)
                    </span>
                  </div>
                </div>

                {paymentMethod === 'Net Banking' && (
                  <div className="mt-3 pt-3 border-t border-slate-200/80 pl-6">
                    <select
                      value={selectedBank}
                      onChange={(e) => setSelectedBank(e.target.value)}
                      className="w-full text-xs p-2 bg-white border border-slate-200 rounded-lg focus:outline-none"
                    >
                      <option>HDFC Bank</option>
                      <option>State Bank of India (SBI)</option>
                      <option>ICICI Bank</option>
                      <option>Axis Bank</option>
                      <option>Kotak Mahindra Bank</option>
                      <option>Punjab National Bank</option>
                    </select>
                  </div>
                )}
              </div>

              {/* Option 4: Cash on Delivery */}
              <div
                onClick={() => setPaymentMethod('Cash on Delivery')}
                className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                  paymentMethod === 'Cash on Delivery'
                    ? 'border-orange-500 bg-orange-50/30 shadow-xs'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="payment"
                      checked={paymentMethod === 'Cash on Delivery'}
                      onChange={() => setPaymentMethod('Cash on Delivery')}
                      className="accent-orange-600 cursor-pointer"
                    />
                    <div className="flex items-center gap-2">
                      <Banknote className="w-4 h-4 text-amber-600" />
                      <span className="font-bold text-sm text-slate-900">Cash on Delivery (COD)</span>
                    </div>
                  </div>
                  <span className="text-[10px] text-slate-500 bg-slate-100 px-2 py-0.5 rounded font-medium">
                    Pay at Doorstep
                  </span>
                </div>

                {paymentMethod === 'Cash on Delivery' && (
                  <div className="mt-3 pt-3 border-t border-slate-200/80 pl-6 text-xs text-slate-600">
                    <p>Pay with cash or scan QR code via UPI directly with delivery agent Ramesh.</p>
                  </div>
                )}
              </div>
            </div>
          </section>
        </div>

        {/* Right Column: Order Summary & Place Order Button */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white rounded-3xl border border-slate-200/90 p-5 shadow-xs space-y-4">
            <h3 className="text-base font-bold text-slate-900 font-display pb-3 border-b border-slate-100">
              Order Summary ({cartItems.length} items)
            </h3>

            {/* Thumbnail preview of cart items */}
            <div className="space-y-2 max-h-48 overflow-y-auto no-scrollbar pr-1">
              {cartItems.map((item) => (
                <div key={item.product.id} className="flex items-center justify-between text-xs py-1">
                  <div className="flex items-center gap-2 truncate pr-2">
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      className="w-9 h-9 rounded-lg object-cover shrink-0 border border-slate-100"
                    />
                    <div className="truncate">
                      <div className="font-semibold text-slate-900 truncate">
                        {item.product.name}
                      </div>
                      <div className="text-[10px] text-slate-400">Qty: {item.quantity}</div>
                    </div>
                  </div>
                  <span className="font-bold text-slate-900 shrink-0 font-mono">
                    {formatInr(item.product.price * item.quantity)}
                  </span>
                </div>
              ))}
            </div>

            {/* Price Breakdown */}
            <div className="pt-3 border-t border-slate-100 space-y-2 text-xs text-slate-600">
              <div className="flex justify-between">
                <span>Items Subtotal</span>
                <span className="font-semibold text-slate-900 font-mono">{formatInr(cartSubtotal)}</span>
              </div>
              <div className="flex justify-between text-emerald-600">
                <span>Discount Savings</span>
                <span className="font-semibold font-mono">-{formatInr(cartDiscount)}</span>
              </div>
              <div className="flex justify-between">
                <span>Delivery Charge</span>
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

            {/* Place Order CTA */}
            <button
              onClick={handlePlaceOrder}
              disabled={isSubmitting}
              className="w-full py-3.5 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white rounded-xl text-sm font-bold shadow-lg shadow-orange-600/30 flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-60 cursor-pointer"
            >
              {isSubmitting ? (
                <span>Confirming Order...</span>
              ) : (
                <>
                  <span>Place Order ({formatInr(cartGrandTotal)})</span>
                </>
              )}
            </button>

            <div className="flex items-center gap-2 text-[11px] text-slate-500 justify-center">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Safe 256-bit encrypted checkout</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
