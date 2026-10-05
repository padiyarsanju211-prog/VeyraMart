import React, { useState } from 'react';
import {
  User,
  Package,
  Heart,
  MapPin,
  HelpCircle,
  LogOut,
  Shield,
  Edit2,
  Trash2,
  Phone,
  Mail,
  ChevronRight,
  Plus,
} from 'lucide-react';
import { useShop } from '../context/ShopContext';

export const AccountView: React.FC = () => {
  const {
    currentUser,
    loginUser,
    registerUser,
    logoutUser,
    updateProfile,
    savedAddresses,
    addAddress,
    removeAddress,
    setDefaultAddress,
    setCurrentView,
    orders,
    wishlist,
    showToast,
  } = useShop();

  const [activeTab, setActiveTab] = useState<'profile' | 'addresses' | 'support'>('profile');
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileName, setProfileName] = useState(currentUser.name);
  const [profilePhone, setProfilePhone] = useState(currentUser.phone);
  const [isAddingAddress, setIsAddingAddress] = useState(false);

  // Authentication Modal State
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authName, setAuthName] = useState('');
  const [authPhone, setAuthPhone] = useState('');
  const [authLoading, setAuthLoading] = useState(false);

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthLoading(true);
    if (authMode === 'login') {
      const res = await loginUser(authEmail, authPassword);
      if (res.success) {
        setIsAuthModalOpen(false);
        setAuthPassword('');
      }
    } else {
      const res = await registerUser(authName, authEmail, authPassword, authPhone);
      if (res.success) {
        setIsAuthModalOpen(false);
        setAuthPassword('');
      }
    }
    setAuthLoading(false);
  };

  const [newAddr, setNewAddr] = useState({
    name: currentUser.name,
    phone: currentUser.phone.replace(/[^0-9]/g, ''),
    house: '',
    street: '',
    area: '',
    city: 'Mumbai',
    state: 'Maharashtra',
    pin: '400001',
    type: 'Home' as 'Home' | 'Work' | 'Other',
    isDefault: false,
  });

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateProfile({ name: profileName, phone: profilePhone });
    setIsEditingProfile(false);
  };

  const handleAddAddress = (e: React.FormEvent) => {
    e.preventDefault();
    addAddress(newAddr);
    setIsAddingAddress(false);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 pb-24">
      {/* Account Header Card */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-white rounded-3xl p-6 sm:p-8 shadow-lg mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-600 flex items-center justify-center text-white text-2xl font-bold font-display shadow-md">
            {currentUser.name.charAt(0)}
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold font-display tracking-tight text-white">
              {currentUser.name}
            </h1>
            <div className="flex flex-wrap items-center gap-2 text-xs text-slate-300 mt-1">
              <span className="flex items-center gap-1">
                <Mail className="w-3.5 h-3.5 text-slate-400" />
                <span>{currentUser.email}</span>
              </span>
              <span>·</span>
              <span className="flex items-center gap-1">
                <Phone className="w-3.5 h-3.5 text-slate-400" />
                <span>{currentUser.phone}</span>
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-semibold px-2.5 py-1 rounded-lg">
            VeyraMart Prime Member
          </span>
        </div>
      </div>

      {/* Quick Status Stats Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        <button
          onClick={() => setCurrentView('orders')}
          className="p-4 rounded-2xl bg-white border border-slate-200 hover:border-orange-300 hover:bg-orange-50/30 transition-all text-left group shadow-xs"
        >
          <Package className="w-5 h-5 text-orange-600 mb-1" />
          <div className="text-lg font-bold text-slate-900 font-sans">
            {orders.length}
          </div>
          <div className="text-xs text-slate-500 font-medium">My Orders</div>
        </button>

        <button
          onClick={() => setCurrentView('wishlist')}
          className="p-4 rounded-2xl bg-white border border-slate-200 hover:border-rose-300 hover:bg-rose-50/30 transition-all text-left group shadow-xs"
        >
          <Heart className="w-5 h-5 text-rose-600 mb-1" />
          <div className="text-lg font-bold text-slate-900 font-sans">
            {wishlist.length}
          </div>
          <div className="text-xs text-slate-500 font-medium">Wishlist Items</div>
        </button>

        <button
          onClick={() => setActiveTab('addresses')}
          className="p-4 rounded-2xl bg-white border border-slate-200 hover:border-blue-300 hover:bg-blue-50/30 transition-all text-left group shadow-xs"
        >
          <MapPin className="w-5 h-5 text-blue-600 mb-1" />
          <div className="text-lg font-bold text-slate-900 font-sans">
            {savedAddresses.length}
          </div>
          <div className="text-xs text-slate-500 font-medium">Saved Addresses</div>
        </button>

        <button
          onClick={() => setActiveTab('support')}
          className="p-4 rounded-2xl bg-white border border-slate-200 hover:border-emerald-300 hover:bg-emerald-50/30 transition-all text-left group shadow-xs"
        >
          <HelpCircle className="w-5 h-5 text-emerald-600 mb-1" />
          <div className="text-lg font-bold text-slate-900 font-sans">
            24x7
          </div>
          <div className="text-xs text-slate-500 font-medium">Help & Support</div>
        </button>
      </div>

      {/* Tabs Layout */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
        {/* Tab Buttons */}
        <div className="flex border-b border-slate-200 bg-slate-50/60 p-2 gap-1 overflow-x-auto">
          <button
            onClick={() => setActiveTab('profile')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors ${
              activeTab === 'profile'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Profile Details
          </button>
          <button
            onClick={() => setActiveTab('addresses')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors ${
              activeTab === 'addresses'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Saved Delivery Addresses
          </button>
          <button
            onClick={() => setActiveTab('support')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors ${
              activeTab === 'support'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Help & FAQs
          </button>
        </div>

        {/* Tab 1: Profile Details */}
        {activeTab === 'profile' && (
          <div className="p-6 max-w-xl space-y-4">
            {!isEditingProfile ? (
              <div className="space-y-4">
                <div className="flex justify-between items-center pb-2 border-b border-slate-100">
                  <span className="text-xs text-slate-500">Full Name</span>
                  <span className="text-xs font-bold text-slate-900">{currentUser.name}</span>
                </div>
                <div className="flex justify-between items-center pb-2 border-b border-slate-100">
                  <span className="text-xs text-slate-500">Email Address</span>
                  <span className="text-xs font-bold text-slate-900">{currentUser.email}</span>
                </div>
                <div className="flex justify-between items-center pb-2 border-b border-slate-100">
                  <span className="text-xs text-slate-500">Phone Number</span>
                  <span className="text-xs font-bold text-slate-900">{currentUser.phone}</span>
                </div>

                <div className="flex flex-wrap gap-2 pt-2">
                  <button
                    onClick={() => setIsEditingProfile(true)}
                    className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                    <span>Edit Profile</span>
                  </button>
                  <button
                    onClick={() => setIsAuthModalOpen(true)}
                    className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs"
                  >
                    <User className="w-3.5 h-3.5" />
                    <span>Sign In / Switch User</span>
                  </button>
                  <button
                    onClick={logoutUser}
                    className="px-4 py-2 bg-slate-100 hover:bg-rose-50 hover:text-rose-600 text-slate-700 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Logout</span>
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSaveProfile} className="space-y-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Your Name
                  </label>
                  <input
                    type="text"
                    value={profileName}
                    onChange={(e) => setProfileName(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-200"
                    required
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Phone Number
                  </label>
                  <input
                    type="text"
                    value={profilePhone}
                    onChange={(e) => setProfilePhone(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-200"
                    required
                  />
                </div>
                <div className="flex gap-2 pt-2">
                  <button
                    type="submit"
                    className="px-4 py-2 bg-orange-600 text-white rounded-xl text-xs font-bold"
                  >
                    Save Changes
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsEditingProfile(false)}
                    className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl text-xs font-bold"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>
        )}

        {/* Tab 2: Saved Delivery Addresses */}
        {activeTab === 'addresses' && (
          <div className="p-6 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Saved Locations
              </span>
              {!isAddingAddress && (
                <button
                  onClick={() => setIsAddingAddress(true)}
                  className="px-3 py-1.5 bg-orange-600 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add New Address</span>
                </button>
              )}
            </div>

            {isAddingAddress ? (
              <form onSubmit={handleAddAddress} className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
                <h4 className="text-xs font-bold text-slate-900">Add New Indian Delivery Address</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input
                    type="text"
                    placeholder="Recipient Name *"
                    required
                    value={newAddr.name}
                    onChange={(e) => setNewAddr({ ...newAddr, name: e.target.value })}
                    className="text-xs p-2.5 rounded-xl border border-slate-200 bg-white"
                  />
                  <input
                    type="tel"
                    placeholder="10-digit Phone *"
                    required
                    value={newAddr.phone}
                    onChange={(e) => setNewAddr({ ...newAddr, phone: e.target.value })}
                    className="text-xs p-2.5 rounded-xl border border-slate-200 bg-white"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input
                    type="text"
                    placeholder="Flat / House / Building *"
                    required
                    value={newAddr.house}
                    onChange={(e) => setNewAddr({ ...newAddr, house: e.target.value })}
                    className="text-xs p-2.5 rounded-xl border border-slate-200 bg-white"
                  />
                  <input
                    type="text"
                    placeholder="Street / Area *"
                    required
                    value={newAddr.street}
                    onChange={(e) => setNewAddr({ ...newAddr, street: e.target.value })}
                    className="text-xs p-2.5 rounded-xl border border-slate-200 bg-white"
                  />
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <input
                    type="text"
                    placeholder="PIN Code"
                    value={newAddr.pin}
                    onChange={(e) => setNewAddr({ ...newAddr, pin: e.target.value })}
                    className="text-xs p-2.5 rounded-xl border border-slate-200 bg-white"
                  />
                  <input
                    type="text"
                    placeholder="City"
                    value={newAddr.city}
                    onChange={(e) => setNewAddr({ ...newAddr, city: e.target.value })}
                    className="text-xs p-2.5 rounded-xl border border-slate-200 bg-white"
                  />
                  <input
                    type="text"
                    placeholder="State"
                    value={newAddr.state}
                    onChange={(e) => setNewAddr({ ...newAddr, state: e.target.value })}
                    className="text-xs p-2.5 rounded-xl border border-slate-200 bg-white"
                  />
                </div>
                <div className="flex gap-2 pt-2">
                  <button
                    type="submit"
                    className="px-4 py-2 bg-orange-600 text-white rounded-xl text-xs font-bold shadow-sm"
                  >
                    Save Address
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsAddingAddress(false)}
                    className="px-4 py-2 bg-slate-200 text-slate-700 rounded-xl text-xs font-bold"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {savedAddresses.map((addr) => (
                  <div
                    key={addr.id}
                    className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 flex flex-col justify-between"
                  >
                    <div className="space-y-1 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-900">{addr.name}</span>
                        <span className="px-2 py-0.5 rounded bg-slate-200/80 text-[10px] font-bold">
                          {addr.type || 'Home'}
                        </span>
                      </div>
                      <p className="text-slate-600">
                        {addr.house}, {addr.street}
                      </p>
                      <p className="text-slate-600">
                        {addr.city}, {addr.state} - {addr.pin}
                      </p>
                      <p className="text-slate-500">Phone: +91 {addr.phone}</p>
                    </div>

                    <div className="flex items-center justify-between pt-3 mt-3 border-t border-slate-200 text-xs">
                      {addr.isDefault ? (
                        <span className="text-emerald-700 font-bold text-[11px]">
                          ✓ Default Address
                        </span>
                      ) : (
                        <button
                          onClick={() => setDefaultAddress(addr.id)}
                          className="text-orange-600 hover:underline font-semibold"
                        >
                          Make Default
                        </button>
                      )}
                      {savedAddresses.length > 1 && (
                        <button
                          onClick={() => removeAddress(addr.id)}
                          className="text-slate-400 hover:text-rose-600 p-1"
                          title="Remove address"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 3: Help & Support */}
        {activeTab === 'support' && (
          <div className="p-6 space-y-4 max-w-2xl text-xs">
            <h4 className="font-bold text-slate-900 text-sm">Frequently Asked Questions</h4>

            <div className="space-y-3">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="font-bold text-slate-900 block mb-1">
                  How does Free Delivery work on VeyraMart?
                </span>
                <p className="text-slate-600">
                  All orders above ₹499 qualify for Free Standard Delivery across 19,000+ Indian PIN codes.
                  Orders under ₹499 carry a flat ₹40 delivery fee.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="font-bold text-slate-900 block mb-1">
                  What is the Return & Replacement policy?
                </span>
                <p className="text-slate-600">
                  Most fashion, electronics, and home products can be returned within 7 days of delivery.
                  For groceries, unopened packages can be reported within 48 hours for immediate replacement.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="font-bold text-slate-900 block mb-1">
                  Is Cash on Delivery (COD) available for my area?
                </span>
                <p className="text-slate-600">
                  Yes, Cash on Delivery is supported for all major Indian cities. You can pay cash or scan the courier&apos;s dynamic UPI QR code on arrival.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Authentication Modal (Sign In / Register) */}
      {isAuthModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden">
            <div className="p-4 sm:p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50/70">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-orange-600 text-white flex items-center justify-center font-bold text-sm">
                  V
                </div>
                <h3 className="font-bold text-base text-slate-900 font-display">
                  {authMode === 'login' ? 'Customer Sign In' : 'Create New Account'}
                </h3>
              </div>
              <button
                onClick={() => setIsAuthModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 p-1"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAuthSubmit} className="p-6 space-y-4">
              <div className="flex bg-slate-100 p-1 rounded-xl">
                <button
                  type="button"
                  onClick={() => setAuthMode('login')}
                  className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-colors ${
                    authMode === 'login' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500'
                  }`}
                >
                  Sign In
                </button>
                <button
                  type="button"
                  onClick={() => setAuthMode('register')}
                  className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-colors ${
                    authMode === 'register' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500'
                  }`}
                >
                  Register
                </button>
              </div>

              {authMode === 'register' && (
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    value={authName}
                    onChange={(e) => setAuthName(e.target.value)}
                    placeholder="e.g. Priya Sharma"
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-orange-500"
                  />
                </div>
              )}

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  value={authEmail}
                  onChange={(e) => setAuthEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-orange-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Password</label>
                <input
                  type="password"
                  required
                  value={authPassword}
                  onChange={(e) => setAuthPassword(e.target.value)}
                  placeholder="Minimum 6 characters"
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-orange-500"
                />
              </div>

              {authMode === 'register' && (
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Mobile Number</label>
                  <input
                    type="tel"
                    value={authPhone}
                    onChange={(e) => setAuthPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-orange-500"
                  />
                </div>
              )}

              <div className="text-[11px] text-slate-500 bg-slate-50 p-2.5 rounded-xl border border-slate-200/70">
                {authMode === 'login' ? (
                  <span>
                    Default demo credentials: <strong>padiyarsanju211@gmail.com</strong> / <strong>Veyra@2026</strong>
                  </span>
                ) : (
                  <span>
                    Your password will be securely salted and hashed with PBKDF2 on the server.
                  </span>
                )}
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  disabled={authLoading}
                  className="w-full py-2.5 bg-orange-600 hover:bg-orange-700 text-white rounded-xl text-xs font-bold shadow-md transition-colors disabled:opacity-50"
                >
                  {authLoading ? 'Verifying...' : authMode === 'login' ? 'Sign In to VeyraMart' : 'Create Account'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
