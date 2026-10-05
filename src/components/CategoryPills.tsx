import React from 'react';
import { useShop } from '../context/ShopContext';
import { DEPARTMENTS } from '../data/departments';
import { DepartmentId } from '../types';

export const CategoryPills: React.FC = () => {
  const { selectedDepartment, setSelectedDepartment, setSelectedSubcategory, setCurrentView } = useShop();

  const handleSelect = (deptId: DepartmentId) => {
    setSelectedDepartment(deptId);
    setSelectedSubcategory(null);
    setCurrentView('products');
  };

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
      <div className="flex items-center justify-between mb-3">
        <div>
          <h2 className="text-lg font-bold text-slate-900 tracking-tight font-display">
            Shop by Category
          </h2>
          <p className="text-xs text-slate-500">
            Explore 20 Indian marketplace departments with genuine quality
          </p>
        </div>
        <button
          onClick={() => setCurrentView('categories')}
          className="text-xs font-bold text-orange-600 hover:text-orange-700"
        >
          View All Departments →
        </button>
      </div>

      {/* Horizontal Swipeable Category Icons */}
      <div className="flex items-center gap-3 overflow-x-auto no-scrollbar pb-2 pt-1 -mx-4 px-4 sm:mx-0 sm:px-0">
        {DEPARTMENTS.map((dept) => {
          const isSelected = selectedDepartment === dept.id;
          return (
            <button
              key={dept.id}
              onClick={() => handleSelect(dept.id)}
              className={`flex flex-col items-center gap-1.5 shrink-0 group focus:outline-none transition-all ${
                isSelected ? 'scale-105' : 'hover:-translate-y-0.5'
              }`}
            >
              <div
                className={`w-15 h-15 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center text-2xl shadow-sm transition-all border ${
                  isSelected
                    ? 'bg-orange-600 text-white border-orange-600 shadow-orange-600/30'
                    : 'bg-white hover:bg-orange-50/60 border-slate-200/90 text-slate-800'
                }`}
              >
                <span>{dept.icon}</span>
              </div>
              <span
                className={`text-[11px] font-semibold tracking-tight text-center max-w-[76px] leading-tight line-clamp-2 ${
                  isSelected ? 'text-orange-700 font-bold' : 'text-slate-700 group-hover:text-slate-950'
                }`}
              >
                {dept.name}
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
};
