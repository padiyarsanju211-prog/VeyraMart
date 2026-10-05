import React, { useRef } from 'react';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import { Product } from '../types';
import { ProductCard } from './ProductCard';
import { useShop } from '../context/ShopContext';
import { DepartmentId } from '../types';

interface ProductCarouselProps {
  title: string;
  subtitle?: string;
  badge?: string;
  products: Product[];
  departmentId?: DepartmentId;
  viewAllAction?: () => void;
}

export const ProductCarousel: React.FC<ProductCarouselProps> = ({
  title,
  subtitle,
  badge,
  products,
  departmentId,
  viewAllAction,
}) => {
  const { setSelectedDepartment, setSelectedSubcategory, setCurrentView } = useShop();
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = direction === 'left' ? -380 : 380;
      scrollContainerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const handleViewAll = () => {
    if (viewAllAction) {
      viewAllAction();
    } else if (departmentId) {
      setSelectedDepartment(departmentId);
      setSelectedSubcategory(null);
      setCurrentView('products');
    } else {
      setSelectedDepartment('all');
      setSelectedSubcategory(null);
      setCurrentView('products');
    }
  };

  if (!products || products.length === 0) return null;

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 py-6 border-b border-slate-200/60 last:border-none">
      {/* Carousel Header */}
      <div className="flex items-end justify-between mb-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 font-display">
              {title}
            </h2>
            {badge && (
              <span className="text-[10px] font-extrabold px-2 py-0.5 rounded bg-orange-100 text-orange-800 uppercase tracking-wider">
                {badge}
              </span>
            )}
          </div>
          {subtitle && (
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              {subtitle}
            </p>
          )}
        </div>

        <div className="flex items-center gap-2">
          {/* View All Link */}
          <button
            onClick={handleViewAll}
            className="text-xs sm:text-sm font-bold text-orange-600 hover:text-orange-700 flex items-center gap-1 group py-1"
          >
            <span>View All ({products.length})</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </button>

          {/* Desktop Arrow Controls */}
          <div className="hidden sm:flex items-center gap-1 ml-2">
            <button
              onClick={() => scroll('left')}
              className="p-1.5 rounded-full border border-slate-200 text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors"
              aria-label="Scroll left"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => scroll('right')}
              className="p-1.5 rounded-full border border-slate-200 text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors"
              aria-label="Scroll right"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Horizontal Swipeable Track */}
      <div
        ref={scrollContainerRef}
        className="flex items-stretch gap-4 overflow-x-auto no-scrollbar pb-3 pt-1 -mx-4 px-4 sm:mx-0 sm:px-0 scroll-smooth"
      >
        {products.map((product) => (
          <div
            key={product.id}
            className="w-52 sm:w-60 md:w-64 shrink-0 flex flex-col"
          >
            <ProductCard product={product} />
          </div>
        ))}
      </div>
    </section>
  );
};
