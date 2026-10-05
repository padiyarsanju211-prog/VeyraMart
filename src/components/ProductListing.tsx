import React, { useState } from 'react';
import {
  Filter,
  SlidersHorizontal,
  X,
  Star,
  Check,
  ChevronDown,
  RotateCcw,
} from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { DEPARTMENTS } from '../data/departments';
import { ProductCard } from './ProductCard';
import { DepartmentId } from '../types';

export const ProductListing: React.FC = () => {
  const {
    filteredProducts,
    selectedDepartment,
    setSelectedDepartment,
    selectedSubcategory,
    setSelectedSubcategory,
    searchQuery,
    setSearchQuery,
    activeSort,
    setActiveSort,
    priceRange,
    setPriceRange,
    selectedBrands,
    toggleBrand,
    minRating,
    setMinRating,
    inStockOnly,
    setInStockOnly,
    resetFilters,
    allProducts,
  } = useShop();

  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Available brands in the current department or dataset
  const availableBrands = Array.from(
    new Set(
      allProducts
        .filter((p) => selectedDepartment === 'all' || p.department === selectedDepartment)
        .map((p) => p.brand)
    )
  ).sort();

  const currentDeptObj = DEPARTMENTS.find((d) => d.id === selectedDepartment);

  const formatInr = (amount: number) => {
    return '₹' + amount.toLocaleString('en-IN');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 pb-24">
      {/* Header & Breadcrumb */}
      <div className="mb-4">
        <div className="flex flex-wrap items-center gap-1.5 text-xs text-slate-500 mb-1.5">
          <button
            onClick={() => {
              setSelectedDepartment('all');
              setSelectedSubcategory(null);
            }}
            className="hover:text-slate-900"
          >
            Home
          </button>
          <span>/</span>
          <span className="text-slate-900 font-semibold">
            {currentDeptObj ? currentDeptObj.name : 'All Products'}
          </span>
          {selectedSubcategory && (
            <>
              <span>/</span>
              <span className="text-orange-600 font-bold">{selectedSubcategory}</span>
            </>
          )}
          {searchQuery && (
            <>
              <span>/</span>
              <span className="text-slate-700">Search: &quot;{searchQuery}&quot;</span>
            </>
          )}
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 font-display flex items-center gap-2">
              {currentDeptObj && <span>{currentDeptObj.icon}</span>}
              <span>
                {selectedSubcategory
                  ? selectedSubcategory
                  : currentDeptObj
                  ? currentDeptObj.name
                  : searchQuery
                  ? `Search results for "${searchQuery}"`
                  : 'All Marketplace Products'}
              </span>
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Showing <strong>{filteredProducts.length}</strong> verified products with fast ₹ pricing
            </p>
          </div>

          {/* Sort Selector & Mobile Filter Trigger */}
          <div className="flex items-center gap-2 self-start sm:self-auto">
            <button
              onClick={() => setMobileFilterOpen(true)}
              className="md:hidden px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-bold text-slate-800 flex items-center gap-1.5 shadow-xs"
            >
              <Filter className="w-3.5 h-3.5 text-orange-600" />
              <span>Filters</span>
              {(selectedBrands.length > 0 || minRating > 0 || inStockOnly) && (
                <span className="w-2 h-2 rounded-full bg-orange-600"></span>
              )}
            </button>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-1.5 bg-white border border-slate-200/90 rounded-xl px-3 py-1.5 shadow-xs">
              <span className="text-xs text-slate-500 font-medium">Sort:</span>
              <select
                value={activeSort}
                onChange={(e) => setActiveSort(e.target.value)}
                className="text-xs font-bold text-slate-800 bg-transparent focus:outline-none cursor-pointer"
              >
                <option value="popularity">Popularity (Most Reviewed)</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
                <option value="rating">Customer Rating (Highest)</option>
                <option value="discount">Biggest Discount (% OFF)</option>
                <option value="newest">Newest Additions</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Subcategory Pills if in a specific Department */}
      {currentDeptObj && (
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-2 mb-4 -mx-4 px-4 sm:mx-0 sm:px-0">
          <button
            onClick={() => setSelectedSubcategory(null)}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg shrink-0 transition-colors ${
              selectedSubcategory === null
                ? 'bg-slate-900 text-white shadow-sm'
                : 'bg-white border border-slate-200 text-slate-700 hover:border-slate-300'
            }`}
          >
            All {currentDeptObj.name}
          </button>
          {currentDeptObj.subcategories.map((subcat) => (
            <button
              key={subcat}
              onClick={() => setSelectedSubcategory(subcat)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg shrink-0 transition-colors ${
                selectedSubcategory === subcat
                  ? 'bg-orange-600 text-white shadow-sm'
                  : 'bg-white border border-slate-200 text-slate-700 hover:border-slate-300'
              }`}
            >
              {subcat}
            </button>
          ))}
        </div>
      )}

      {/* Main Grid: Left Filters Sidebar (Desktop) + Right Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-start">
        {/* Desktop Filters Sidebar */}
        <aside className="hidden md:block col-span-1 bg-white rounded-2xl border border-slate-200 p-4 space-y-6 sticky top-28 shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200">
            <div className="flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-orange-600" />
              <span className="font-bold text-sm text-slate-900">Filters</span>
            </div>
            <button
              onClick={resetFilters}
              className="text-xs text-orange-600 hover:text-orange-700 font-semibold flex items-center gap-1"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset</span>
            </button>
          </div>

          {/* Department Switcher */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
              Department
            </h4>
            <select
              value={selectedDepartment}
              onChange={(e) => {
                setSelectedDepartment(e.target.value as DepartmentId | 'all');
                setSelectedSubcategory(null);
              }}
              className="w-full text-xs font-semibold text-slate-800 bg-slate-50 border border-slate-200 rounded-xl p-2 focus:ring-1 focus:ring-orange-500 focus:outline-none"
            >
              <option value="all">All 20 Departments</option>
              {DEPARTMENTS.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.icon} {d.name}
                </option>
              ))}
            </select>
          </div>

          {/* Price Range Slider */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Max Price
              </h4>
              <span className="text-xs font-bold text-orange-600">
                {formatInr(priceRange[1])}
              </span>
            </div>
            <input
              type="range"
              min="100"
              max="15000"
              step="100"
              value={priceRange[1]}
              onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
              className="w-full accent-orange-600 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400 mt-1">
              <span>₹100</span>
              <span>₹5,000</span>
              <span>₹15,000+</span>
            </div>
          </div>

          {/* Brand Filter */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-2 flex items-center justify-between">
              <span>Brand</span>
              {selectedBrands.length > 0 && (
                <span className="text-[10px] font-bold text-orange-600">({selectedBrands.length})</span>
              )}
            </h4>
            <div className="space-y-1.5 max-h-44 overflow-y-auto no-scrollbar pr-1">
              {availableBrands.map((brand) => {
                const isChecked = selectedBrands.includes(brand);
                return (
                  <label
                    key={brand}
                    className="flex items-center gap-2 text-xs text-slate-700 hover:text-slate-900 cursor-pointer py-0.5 select-none"
                  >
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => toggleBrand(brand)}
                      className="rounded text-orange-600 focus:ring-orange-500 accent-orange-600 w-3.5 h-3.5 cursor-pointer"
                    />
                    <span className="truncate">{brand}</span>
                  </label>
                );
              })}
            </div>
          </div>

          {/* Customer Rating Filter */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
              Customer Rating
            </h4>
            <div className="space-y-1">
              {[4, 3, 2].map((stars) => (
                <button
                  key={stars}
                  onClick={() => setMinRating(minRating === stars ? 0 : stars)}
                  className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs transition-colors ${
                    minRating === stars
                      ? 'bg-orange-50 text-orange-700 font-bold border border-orange-200'
                      : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-1">
                    <span className="font-bold">{stars}★ & above</span>
                  </div>
                  {minRating === stars && <Check className="w-3.5 h-3.5 text-orange-600" />}
                </button>
              ))}
            </div>
          </div>

          {/* Availability Toggle */}
          <div className="pt-2 border-t border-slate-100">
            <label className="flex items-center gap-2 text-xs font-medium text-slate-700 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={inStockOnly}
                onChange={(e) => setInStockOnly(e.target.checked)}
                className="rounded text-orange-600 focus:ring-orange-500 accent-orange-600 w-4 h-4 cursor-pointer"
              />
              <span>In Stock Items Only</span>
            </label>
          </div>
        </aside>

        {/* Right: Products Grid */}
        <main className="col-span-1 md:col-span-3">
          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-3 sm:gap-4">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-3xl border border-slate-200 p-8 sm:p-12 text-center flex flex-col items-center justify-center">
              <div className="w-16 h-16 rounded-full bg-orange-50 text-orange-600 flex items-center justify-center text-3xl mb-3">
                🔍
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-1">
                No matching products found
              </h3>
              <p className="text-xs text-slate-500 max-w-sm mb-4">
                We couldn&apos;t find any items matching your selected criteria. Try adjusting the price range, brand, or search keywords.
              </p>
              <button
                onClick={resetFilters}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold shadow-sm transition-colors"
              >
                Clear All Filters
              </button>
            </div>
          )}
        </main>
      </div>

      {/* Mobile Filter Drawer Modal */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-slate-950/60 backdrop-blur-xs p-0 sm:p-4">
          <div className="w-full sm:max-w-md bg-white rounded-t-3xl sm:rounded-3xl max-h-[85vh] flex flex-col overflow-hidden shadow-2xl animate-in slide-in-from-bottom duration-200">
            <div className="flex items-center justify-between p-4 border-b border-slate-200">
              <span className="font-bold text-base text-slate-900">Filters</span>
              <button
                onClick={() => setMobileFilterOpen(false)}
                className="p-1 rounded-full text-slate-500 hover:text-slate-900"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="overflow-y-auto p-4 space-y-5">
              {/* Max Price */}
              <div>
                <div className="flex items-center justify-between mb-1 text-xs">
                  <span className="font-bold text-slate-800">Max Price:</span>
                  <span className="font-bold text-orange-600">{formatInr(priceRange[1])}</span>
                </div>
                <input
                  type="range"
                  min="100"
                  max="15000"
                  step="100"
                  value={priceRange[1]}
                  onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                  className="w-full accent-orange-600"
                />
              </div>

              {/* Brands */}
              <div>
                <span className="text-xs font-bold text-slate-800 block mb-2">Brands:</span>
                <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto">
                  {availableBrands.map((brand) => (
                    <label key={brand} className="flex items-center gap-2 text-xs text-slate-700">
                      <input
                        type="checkbox"
                        checked={selectedBrands.includes(brand)}
                        onChange={() => toggleBrand(brand)}
                        className="rounded text-orange-600 accent-orange-600"
                      />
                      <span className="truncate">{brand}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Rating */}
              <div>
                <span className="text-xs font-bold text-slate-800 block mb-1">Min Rating:</span>
                <div className="flex gap-2">
                  {[4, 3, 2].map((s) => (
                    <button
                      key={s}
                      onClick={() => setMinRating(minRating === s ? 0 : s)}
                      className={`px-3 py-1.5 text-xs font-bold rounded-lg border ${
                        minRating === s
                          ? 'bg-orange-600 text-white border-orange-600'
                          : 'bg-white text-slate-700 border-slate-200'
                      }`}
                    >
                      {s}★ +
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-4 border-t border-slate-200 flex gap-2">
              <button
                onClick={resetFilters}
                className="w-1/2 py-2.5 border border-slate-300 text-xs font-bold rounded-xl text-slate-700 hover:bg-slate-50"
              >
                Reset All
              </button>
              <button
                onClick={() => setMobileFilterOpen(false)}
                className="w-1/2 py-2.5 bg-orange-600 text-white text-xs font-bold rounded-xl shadow-md"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
