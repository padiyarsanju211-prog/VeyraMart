import React from 'react';
import { ShieldCheck, Truck, RotateCcw, Headphones, Heart } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { DEPARTMENTS } from '../data/departments';
import { DepartmentId } from '../types';

export const Footer: React.FC = () => {
  const { setSelectedDepartment, setSelectedSubcategory, setCurrentView } = useShop();

  const handleDeptClick = (deptId: DepartmentId) => {
    setSelectedDepartment(deptId);
    setSelectedSubcategory(null);
    setCurrentView('products');
  };

  return (
    <footer className="bg-slate-900 text-slate-300 pt-12 pb-24 md:pb-12 border-t border-slate-800">
      {/* Trust Factors Row */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pb-12 border-b border-slate-800">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center shrink-0 text-orange-500">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white font-display">Pan-India Delivery</h4>
              <p className="text-xs text-slate-400 mt-0.5">
                Fast doorstep courier to 19,000+ PIN codes with free delivery on ₹499+.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center shrink-0 text-emerald-500">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white font-display">100% Genuine Products</h4>
              <p className="text-xs text-slate-400 mt-0.5">
                Sourced directly from certified brand distributors and Indian mills.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center shrink-0 text-amber-500">
              <RotateCcw className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white font-display">7-Day Easy Returns</h4>
              <p className="text-xs text-slate-400 mt-0.5">
                Hassle-free doorstep pickup and instant UPI refund on eligible items.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center shrink-0 text-cyan-500">
              <Headphones className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white font-display">24x7 Customer Care</h4>
              <p className="text-xs text-slate-400 mt-0.5">
                Friendly support team ready to assist via call, chat, and email.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 text-xs">
          {/* Col 1: About */}
          <div className="col-span-2 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-orange-600 flex items-center justify-center text-white font-black text-lg">
                V
              </div>
              <span className="text-xl font-bold tracking-tight text-white font-display">
                Veyra<span className="text-orange-500">Mart</span>
              </span>
            </div>
            <p className="text-slate-400 leading-relaxed max-w-sm">
              India’s trusted online shopping destination for daily groceries, festive fashion, smart electronics, fitness essentials, and home appliances in authentic Indian Rupees (₹).
            </p>
            <div className="pt-2 text-[11px] text-slate-400">
              Accepted Payment Methods: UPI · RuPay · Visa · Mastercard · NetBanking · COD
            </div>
          </div>

          {/* Col 2: Top Departments */}
          <div className="space-y-2">
            <h5 className="font-bold uppercase tracking-wider text-white text-[11px]">
              Top Categories
            </h5>
            <ul className="space-y-1.5 text-slate-400">
              {DEPARTMENTS.slice(0, 6).map((d) => (
                <li key={d.id}>
                  <button
                    onClick={() => handleDeptClick(d.id)}
                    className="hover:text-white transition-colors"
                  >
                    {d.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: More Categories */}
          <div className="space-y-2">
            <h5 className="font-bold uppercase tracking-wider text-white text-[11px]">
              More Departments
            </h5>
            <ul className="space-y-1.5 text-slate-400">
              {DEPARTMENTS.slice(6, 12).map((d) => (
                <li key={d.id}>
                  <button
                    onClick={() => handleDeptClick(d.id)}
                    className="hover:text-white transition-colors"
                  >
                    {d.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 4: Quick Links */}
          <div className="space-y-2">
            <h5 className="font-bold uppercase tracking-wider text-white text-[11px]">
              Account & Orders
            </h5>
            <ul className="space-y-1.5 text-slate-400">
              <li>
                <button
                  onClick={() => setCurrentView('orders')}
                  className="hover:text-white transition-colors"
                >
                  My Orders & Tracking
                </button>
              </li>
              <li>
                <button
                  onClick={() => setCurrentView('wishlist')}
                  className="hover:text-white transition-colors"
                >
                  Saved Wishlist
                </button>
              </li>
              <li>
                <button
                  onClick={() => setCurrentView('account')}
                  className="hover:text-white transition-colors"
                >
                  Saved Delivery Addresses
                </button>
              </li>
              <li>
                <button
                  onClick={() => setCurrentView('account')}
                  className="hover:text-white transition-colors"
                >
                  Help & Support
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Copyright Bottom Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-500 gap-2">
        <div>
          © {new Date().getFullYear()} VeyraMart Technologies India Private Limited. All rights reserved.
        </div>
        <div className="flex items-center gap-1 text-slate-400">
          <span>Crafted with pride in India</span>
        </div>
      </div>
    </footer>
  );
};
