import React, { useState } from 'react';
import { ChevronRight, ArrowRight, Sparkles } from 'lucide-react';
import { DEPARTMENTS } from '../data/departments';
import { useShop } from '../context/ShopContext';
import { DepartmentId } from '../types';

export const CategoryView: React.FC = () => {
  const { setSelectedDepartment, setSelectedSubcategory, setCurrentView } = useShop();
  const [activeDeptId, setActiveDeptId] = useState<DepartmentId>('grocery');

  const currentDept = DEPARTMENTS.find((d) => d.id === activeDeptId) || DEPARTMENTS[0];

  const handleSubcategorySelect = (deptId: DepartmentId, subcat: string) => {
    setSelectedDepartment(deptId);
    setSelectedSubcategory(subcat);
    setCurrentView('products');
  };

  const handleViewAllDepartment = (deptId: DepartmentId) => {
    setSelectedDepartment(deptId);
    setSelectedSubcategory(null);
    setCurrentView('products');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 pb-24">
      {/* Category Explorer Header */}
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 font-display">
          All Departments & Categories
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Explore over 20 departments and 100+ categories curated for the Indian household
        </p>
      </div>

      {/* Main Split Layout: Left Departments list, Right Subcategory drilldown */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden p-2 sm:p-4">
        {/* Left Side: Department Selector (Scrollable or Vertical list) */}
        <div className="md:col-span-4 lg:col-span-4 border-b md:border-b-0 md:border-r border-slate-200 pr-0 md:pr-4">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 px-2">
            Select Department
          </div>
          <div className="space-y-1 max-h-[600px] overflow-y-auto no-scrollbar pr-1">
            {DEPARTMENTS.map((dept) => {
              const isActive = activeDeptId === dept.id;
              return (
                <button
                  key={dept.id}
                  onClick={() => setActiveDeptId(dept.id)}
                  className={`w-full flex items-center justify-between p-3 rounded-2xl text-left text-xs sm:text-sm font-semibold transition-all ${
                    isActive
                      ? 'bg-orange-600 text-white shadow-md shadow-orange-600/20 translate-x-1'
                      : 'text-slate-700 hover:bg-slate-100 hover:text-slate-950'
                  }`}
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <span className="text-xl shrink-0">{dept.icon}</span>
                    <span className="truncate">{dept.name}</span>
                  </div>
                  <ChevronRight
                    className={`w-4 h-4 shrink-0 transition-transform ${
                      isActive ? 'text-white translate-x-0.5' : 'text-slate-400'
                    }`}
                  />
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Side: Active Department Detail & Subcategories */}
        <div className="md:col-span-8 lg:col-span-8 p-2 sm:p-4 flex flex-col justify-between">
          <div>
            {/* Department Promo Banner */}
            <div className="relative rounded-2xl p-6 bg-gradient-to-r from-orange-500 to-amber-600 text-white overflow-hidden shadow-md mb-6">
              <div className="relative z-10">
                <span className="text-3xl mb-2 block">{currentDept.icon}</span>
                <h2 className="text-2xl sm:text-3xl font-bold font-display tracking-tight text-white mb-1">
                  {currentDept.name}
                </h2>
                <p className="text-xs sm:text-sm text-white/90 max-w-md mb-4 font-medium">
                  {currentDept.tagline}
                </p>
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    onClick={() => handleViewAllDepartment(currentDept.id)}
                    className="px-4 py-2 bg-white text-slate-900 rounded-xl text-xs font-bold shadow-md hover:bg-slate-100 transition-colors flex items-center gap-1.5"
                  >
                    <span>View All {currentDept.name}</span>
                    <ArrowRight className="w-3.5 h-3.5 text-orange-600" />
                  </button>
                  <span className="text-[11px] bg-white/20 px-2.5 py-1 rounded-lg backdrop-blur-xs">
                    {currentDept.bannerText}
                  </span>
                </div>
              </div>
            </div>

            {/* Subcategories Grid */}
            <div className="mb-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-orange-500" />
                  Popular Subcategories
                </h3>
                <span className="text-xs text-slate-400">
                  {currentDept.subcategories.length} subcategories
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {currentDept.subcategories.map((subcat) => (
                  <button
                    key={subcat}
                    onClick={() => handleSubcategorySelect(currentDept.id, subcat)}
                    className="p-3.5 rounded-2xl bg-slate-50 hover:bg-orange-50 border border-slate-200/80 hover:border-orange-300 text-left transition-all group flex flex-col justify-between min-h-[75px]"
                  >
                    <span className="text-xs font-bold text-slate-800 group-hover:text-orange-700 leading-snug line-clamp-2">
                      {subcat}
                    </span>
                    <div className="flex items-center justify-between text-[10px] text-slate-400 group-hover:text-orange-600 mt-2">
                      <span>Explore</span>
                      <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Notice */}
          <div className="mt-6 p-4 rounded-2xl bg-amber-50/70 border border-amber-200/80 text-xs text-amber-900 flex items-center justify-between">
            <div>
              <span className="font-bold">Need something specific?</span> Use the search bar on top to search any Indian grocery, brand, or fashion style.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
