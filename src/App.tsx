import React, { useState } from 'react';
import { ShopProvider, useShop } from './context/ShopContext';
import { Header } from './components/Header';
import { MobileBottomNav } from './components/MobileBottomNav';
import { HomeView } from './components/HomeView';
import { CategoryView } from './components/CategoryView';
import { ProductListing } from './components/ProductListing';
import { WishlistView } from './components/WishlistView';
import { CartView } from './components/CartView';
import { OrdersView } from './components/OrdersView';
import { AccountView } from './components/AccountView';
import { CheckoutView } from './components/CheckoutModal';
import { OrderSuccessModal } from './components/OrderSuccessModal';
import { ProductDetailModal } from './components/ProductDetailModal';
import { CartDrawer } from './components/CartDrawer';
import { LocationModal } from './components/LocationModal';
import { Footer } from './components/Footer';
import { CheckCircle2, Info, ShoppingBag, X } from 'lucide-react';

function AppContent() {
  const {
    currentView,
    selectedProduct,
    closeProductDetail,
    toast,
    hideToast,
  } = useShop();

  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans">
      {/* Toast Notification Banner */}
      {toast && (
        <div className="fixed top-20 right-4 z-50 animate-in slide-in-from-top-2 fade-in duration-200">
          <div className="flex items-center gap-2.5 px-4 py-2.5 bg-slate-900 text-white text-xs font-semibold rounded-2xl shadow-xl border border-slate-700">
            {toast.type === 'cart' ? (
              <ShoppingBag className="w-4 h-4 text-orange-400 shrink-0" />
            ) : toast.type === 'info' ? (
              <Info className="w-4 h-4 text-blue-400 shrink-0" />
            ) : (
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            )}
            <span>{toast.message}</span>
            <button
              onClick={hideToast}
              className="ml-2 text-slate-400 hover:text-white"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Header */}
      <Header
        onOpenLocationModal={() => setIsLocationModalOpen(true)}
        onOpenCart={() => setIsCartDrawerOpen(true)}
      />

      {/* Main View Router */}
      <main className="flex-1">
        {currentView === 'home' && <HomeView />}
        {currentView === 'categories' && <CategoryView />}
        {currentView === 'products' && <ProductListing />}
        {currentView === 'cart' && <CartView />}
        {currentView === 'wishlist' && <WishlistView />}
        {currentView === 'orders' && <OrdersView />}
        {currentView === 'account' && <AccountView />}
        {currentView === 'checkout' && <CheckoutView />}
        {currentView === 'order-success' && <OrderSuccessModal />}
      </main>

      {/* Footer */}
      <Footer />

      {/* Mobile Fixed Bottom Navigation Bar */}
      <MobileBottomNav />

      {/* Modals & Drawers */}
      <ProductDetailModal
        product={selectedProduct}
        onClose={closeProductDetail}
      />

      <CartDrawer
        isOpen={isCartDrawerOpen}
        onClose={() => setIsCartDrawerOpen(false)}
      />

      <LocationModal
        isOpen={isLocationModalOpen}
        onClose={() => setIsLocationModalOpen(false)}
      />
    </div>
  );
}

export default function App() {
  return (
    <ShopProvider>
      <AppContent />
    </ShopProvider>
  );
}
