import React, { useState } from 'react';
import {
  Search,
  ShoppingCart,
  Heart,
  Package,
  User,
  MapPin,
  ChevronDown,
  X,
  Sparkles,
} from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { DEPARTMENTS } from '../data/departments';
import { DepartmentId } from '../types';

interface HeaderProps {
  onOpenLocationModal: () => void;
  onOpenCart: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenLocationModal, onOpenCart }) => {
  const {
    currentView,
    setCurrentView,
    searchQuery,
    setSearchQuery,
    selectedDepartment,
    setSelectedDepartment,
    setSelectedSubcategory,
    cartTotalCount,
    wishlist,
    deliveryLocation,
  } = useShop();

  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [localSearch, setLocalSearch] = useState(searchQuery);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchQuery(localSearch);
    if (currentView !== 'products') {
      setCurrentView('products');
    }
  };

  const clearSearch = () => {
    setLocalSearch('');
    setSearchQuery('');
  };

  const handleDepartmentClick = (deptId: DepartmentId) => {
    setSelectedDepartment(deptId);
    setSelectedSubcategory(null);
    setCurrentView('products');
  };

  const popularSearches = [
    'Basmati Rice',
    'Cotton Kurti',
    'boAt Earbuds',
    'Hex Dumbbells',
    'Prestige Cooker',
    'Tata Tea Gold',
  ];

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-[0_2px_8px_-2px_rgba(0,0,0,0.06)]">
      {/* Top Notification Bar */}
      <div className="bg-slate-900 text-slate-100 text-xs py-1.5 px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2 font-medium">
            <span className="flex items-center justify-center w-4 h-4 rounded-full bg-emerald-500 text-[10px] text-white font-bold">✓</span>
            <span>Free Express Delivery across India on orders above ₹499 · 100% Genuine Brands</span>
          </div>
          <div className="hidden md:flex items-center gap-4 text-slate-300 text-xs">
            <span>24x7 Customer Care</span>
            <span aria-hidden="true">·</span>
            <span>Cash on Delivery Available</span>
            <span aria-hidden="true">·</span>
            <button
              onClick={() => setCurrentView('orders')}
              className="text-white hover:text-amber-300 font-medium transition-colors"
            >
              Track Order
            </button>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3">
        <div className="flex items-center justify-between gap-4 md:gap-6">
          {/* Brand Wordmark & Logo */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => {
                setSelectedDepartment('all');
                setSelectedSubcategory(null);
                setCurrentView('home');
              }}
              className="flex items-center gap-2 group text-left focus:outline-none"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 via-orange-500 to-rose-500 flex items-center justify-center text-white shadow-md shadow-orange-500/20 group-hover:scale-105 transition-transform">
                <span className="font-extrabold text-2xl tracking-tighter font-display">V</span>
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-1">
                  <span className="text-2xl font-bold tracking-tight text-slate-950 font-display">
                    Veyra<span className="text-orange-600">Mart</span>
                  </span>
                  <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-orange-100 text-orange-800">
                    India
                  </span>
                </div>
                <span className="text-[11px] text-slate-500 -mt-0.5 hidden sm:block">
                  Apna Mega Marketplace
                </span>
              </div>
            </button>

            {/* Location Selector (India PIN code) */}
            <button
              onClick={onOpenLocationModal}
              className="hidden lg:flex items-center gap-2 px-3 py-1.5 text-xs text-slate-700 bg-slate-100 hover:bg-slate-200/80 rounded-lg transition-colors border border-slate-200/70 ml-2"
              title="Change Delivery Location"
            >
              <MapPin className="w-3.5 h-3.5 text-orange-600 shrink-0" />
              <div className="text-left leading-tight">
                <div className="text-[10px] text-slate-500">Deliver to</div>
                <div className="font-semibold text-slate-900 flex items-center gap-1">
                  <span>{deliveryLocation.city} {deliveryLocation.pincode}</span>
                  <ChevronDown className="w-3 h-3 text-slate-500" />
                </div>
              </div>
            </button>
          </div>

          {/* Global Search Bar */}
          <div className="flex-1 max-w-2xl relative">
            <form onSubmit={handleSearchSubmit} className="relative flex items-center">
              <input
                type="text"
                value={localSearch}
                onChange={(e) => setLocalSearch(e.target.value)}
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
                placeholder="Search across 100+ items (e.g. Basmati Rice, Kurti, boAt Earbuds, Dumbbells)..."
                className="w-full pl-10 pr-20 py-2.5 bg-slate-100/90 hover:bg-slate-100 focus:bg-white text-sm text-slate-900 placeholder-slate-400 rounded-xl border border-slate-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 focus:outline-none transition-all shadow-inner"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />

              {localSearch && (
                <button
                  type="button"
                  onClick={clearSearch}
                  className="absolute right-12 p-1 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-4 h-4" />
                </button>
              )}

              <button
                type="submit"
                className="absolute right-1 px-3 py-1.5 bg-orange-600 hover:bg-orange-700 text-white text-xs font-semibold rounded-lg transition-colors shadow-sm"
              >
                Search
              </button>
            </form>

            {/* Search Autocomplete / Suggestions Overlay */}
            {isSearchFocused && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-xl border border-slate-200 p-3 z-50 animate-in fade-in slide-in-from-top-1 duration-150">
                <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <Sparkles className="w-3 h-3 text-amber-500" />
                  Popular Indian Searches
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {popularSearches.map((item) => (
                    <button
                      key={item}
                      onMouseDown={() => {
                        setLocalSearch(item);
                        setSearchQuery(item);
                        setCurrentView('products');
                      }}
                      className="px-2.5 py-1 text-xs bg-slate-100 hover:bg-orange-50 hover:text-orange-700 hover:border-orange-200 text-slate-700 rounded-md border border-slate-200/60 transition-colors"
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Quick Action Icons */}
          <div className="flex items-center gap-1 sm:gap-2">
            {/* Wishlist Button */}
            <button
              onClick={() => setCurrentView('wishlist')}
              className={`p-2 rounded-xl text-slate-700 hover:text-rose-600 hover:bg-slate-100 transition-colors relative ${
                currentView === 'wishlist' ? 'bg-rose-50 text-rose-600' : ''
              }`}
              title="My Wishlist"
            >
              <Heart className="w-5 h-5" />
              {wishlist.length > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-rose-500 text-white text-[11px] font-bold rounded-full flex items-center justify-center shadow-sm">
                  {wishlist.length}
                </span>
              )}
            </button>

            {/* Orders Button (Desktop) */}
            <button
              onClick={() => setCurrentView('orders')}
              className={`hidden md:flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-xl text-slate-700 hover:text-slate-900 hover:bg-slate-100 transition-colors ${
                currentView === 'orders' ? 'bg-orange-50 text-orange-700' : ''
              }`}
              title="My Orders"
            >
              <Package className="w-4 h-4 text-slate-500" />
              <span>Orders</span>
            </button>

            {/* Account Button (Desktop) */}
            <button
              onClick={() => setCurrentView('account')}
              className={`hidden md:flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-xl text-slate-700 hover:text-slate-900 hover:bg-slate-100 transition-colors ${
                currentView === 'account' ? 'bg-orange-50 text-orange-700' : ''
              }`}
              title="My Account"
            >
              <User className="w-4 h-4 text-slate-500" />
              <span>Account</span>
            </button>

            {/* Cart Button */}
            <button
              onClick={onOpenCart}
              className="flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white rounded-xl text-xs font-bold shadow-md shadow-orange-600/20 active:scale-95 transition-all ml-1"
              title="Shopping Cart"
            >
              <div className="relative">
                <ShoppingCart className="w-4 h-4" />
                {cartTotalCount > 0 && (
                  <span className="absolute -top-2.5 -right-2.5 min-w-[18px] h-[18px] bg-white text-orange-600 text-[10px] font-black rounded-full flex items-center justify-center px-1 shadow-sm">
                    {cartTotalCount}
                  </span>
                )}
              </div>
              <span className="hidden sm:inline">Cart</span>
            </button>
          </div>
        </div>
      </div>

      {/* 20 Departments Sub-Nav Scroll Bar */}
      <nav className="bg-slate-50 border-t border-slate-200/80 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* All Categories Button */}
          <button
            onClick={() => setCurrentView('categories')}
            className={`flex items-center gap-1.5 px-3 py-2.5 text-xs font-bold text-slate-800 hover:text-orange-600 border-r border-slate-200 shrink-0 transition-colors ${
              currentView === 'categories' ? 'text-orange-600 bg-orange-50/50' : ''
            }`}
          >
            <span>All 20 Categories</span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {/* Quick Department Items Scroller */}
          <div className="flex items-center gap-1 overflow-x-auto no-scrollbar py-1.5 px-2">
            <button
              onClick={() => {
                setSelectedDepartment('all');
                setSelectedSubcategory(null);
                setCurrentView('products');
              }}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg whitespace-nowrap transition-colors shrink-0 ${
                selectedDepartment === 'all' && currentView === 'products'
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-950 hover:bg-slate-200/60'
              }`}
            >
              All Products
            </button>

            {DEPARTMENTS.slice(0, 12).map((dept) => {
              const isActive = selectedDepartment === dept.id && currentView === 'products';
              return (
                <button
                  key={dept.id}
                  onClick={() => handleDepartmentClick(dept.id)}
                  className={`flex items-center gap-1 px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition-colors shrink-0 ${
                    isActive
                      ? 'bg-orange-600 text-white shadow-sm'
                      : 'text-slate-700 hover:text-slate-950 hover:bg-slate-200/60'
                  }`}
                >
                  <span className="text-sm">{dept.icon}</span>
                  <span>{dept.name}</span>
                </button>
              );
            })}

            <button
              onClick={() => setCurrentView('categories')}
              className="px-3 py-1.5 text-xs font-bold text-orange-600 hover:text-orange-700 whitespace-nowrap shrink-0"
            >
              + More Departments
            </button>
          </div>
        </div>
      </nav>
    </header>
  );
};
