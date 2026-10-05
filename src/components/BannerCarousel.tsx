import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, Tag, ArrowRight } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { DepartmentId } from '../types';

interface BannerSlide {
  id: string;
  tag: string;
  title: string;
  subtitle: string;
  discountBadge: string;
  departmentId: DepartmentId;
  ctaText: string;
  gradient: string;
  patternColor: string;
  accentBadge: string;
}

const BANNERS: BannerSlide[] = [
  {
    id: 'b1',
    tag: 'FESTIVE MEGA CARNIVAL',
    title: 'Big Shopping Days',
    subtitle: 'Unbeatable ₹ savings across Electronics, Fashion & Home Appliances',
    discountBadge: 'UP TO 70% OFF',
    departmentId: 'electronics',
    ctaText: 'Explore Electronics Deals',
    gradient: 'from-amber-600 via-orange-600 to-rose-700',
    patternColor: 'rgba(255,255,255,0.08)',
    accentBadge: 'No Cost EMI · Free Shipping',
  },
  {
    id: 'b2',
    tag: 'DAILY ESSENTIALS SUPER SAVER',
    title: 'Grocery Mega Deals',
    subtitle: 'Basmati rice, whole wheat atta, cooking oils, dals & teas at wholesale ₹ prices',
    discountBadge: 'UP TO 55% OFF',
    departmentId: 'grocery',
    ctaText: 'Shop Daily Staples',
    gradient: 'from-emerald-700 via-teal-700 to-cyan-800',
    patternColor: 'rgba(255,255,255,0.08)',
    accentBadge: '100% Pure & Aged Staples',
  },
  {
    id: 'b3',
    tag: 'ROYAL ETHNIC & TRENDING FASHION',
    title: 'Festive Fashion Season',
    subtitle: 'Designer silk sarees, embroidered Anarkali suits, kurtas & dapper shirts',
    discountBadge: 'FROM ₹499',
    departmentId: 'womens_fashion',
    ctaText: 'Browse Fashion Picks',
    gradient: 'from-purple-700 via-fuchsia-700 to-rose-600',
    patternColor: 'rgba(255,255,255,0.08)',
    accentBadge: 'Top Indian Ethnic Brands',
  },
  {
    id: 'b4',
    tag: 'NEW AGE WORKOUT GEAR',
    title: 'Fitness Essentials Fest',
    subtitle: 'Cast iron hex dumbbells, anti-skid TPE mats, whey protein & shakers',
    discountBadge: 'UP TO 60% OFF',
    departmentId: 'gym_fitness',
    ctaText: 'Gear Up For Fitness',
    gradient: 'from-red-600 via-rose-600 to-amber-700',
    patternColor: 'rgba(255,255,255,0.08)',
    accentBadge: 'Boldfit, Strauss & More',
  },
  {
    id: 'b5',
    tag: 'HOME UPGRADE SPECIAL',
    title: 'Kitchen & Home Makeover',
    subtitle: 'Prestige cookers, Butterfly 750W mixers, cotton bedsheets & air fryers',
    discountBadge: 'MIN 40% OFF',
    departmentId: 'home_kitchen',
    ctaText: 'Shop Home & Kitchen',
    gradient: 'from-blue-700 via-indigo-700 to-violet-800',
    patternColor: 'rgba(255,255,255,0.08)',
    accentBadge: '5-Year Brand Warranties',
  },
];

export const BannerCarousel: React.FC = () => {
  const { setSelectedDepartment, setSelectedSubcategory, setCurrentView } = useShop();
  const [currentIndex, setCurrentIndex] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % BANNERS.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + BANNERS.length) % BANNERS.length);
  };

  useEffect(() => {
    timerRef.current = setInterval(nextSlide, 5000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const handleBannerClick = (deptId: DepartmentId) => {
    setSelectedDepartment(deptId);
    setSelectedSubcategory(null);
    setCurrentView('products');
  };

  return (
    <div className="relative max-w-7xl mx-auto px-4 sm:px-6 pt-4 pb-2">
      <div className="relative overflow-hidden rounded-2xl shadow-lg">
        {/* Banner Container */}
        <div
          className="flex transition-transform duration-500 ease-out"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {BANNERS.map((banner) => (
            <div
              key={banner.id}
              className={`w-full shrink-0 bg-gradient-to-r ${banner.gradient} text-white p-6 sm:p-10 md:p-12 relative overflow-hidden flex flex-col justify-between min-h-[230px] sm:min-h-[280px]`}
            >
              {/* Background Geometric circles */}
              <div
                className="absolute right-0 top-0 w-96 h-96 rounded-full pointer-events-none -mr-20 -mt-20 blur-2xl"
                style={{ backgroundColor: banner.patternColor }}
              />
              <div
                className="absolute right-32 bottom-0 w-64 h-64 rounded-full pointer-events-none -mb-20 blur-xl"
                style={{ backgroundColor: banner.patternColor }}
              />

              {/* Top Tag & Discount Pill */}
              <div className="flex flex-wrap items-center gap-2 mb-3 relative z-10">
                <span className="text-[11px] font-bold tracking-widest uppercase bg-white/20 backdrop-blur-md px-2.5 py-1 rounded-md">
                  {banner.tag}
                </span>
                <span className="text-[11px] font-extrabold tracking-wide bg-amber-400 text-slate-950 px-2.5 py-1 rounded-md shadow-sm">
                  {banner.discountBadge}
                </span>
                <span className="hidden sm:inline text-xs text-white/80">
                  {banner.accentBadge}
                </span>
              </div>

              {/* Title & Description */}
              <div className="relative z-10 max-w-xl my-2">
                <h2 className="text-2xl sm:text-4xl md:text-5xl font-black tracking-tight font-display text-white mb-2 leading-tight">
                  {banner.title}
                </h2>
                <p className="text-sm sm:text-base text-white/90 font-medium line-clamp-2">
                  {banner.subtitle}
                </p>
              </div>

              {/* CTA Button */}
              <div className="relative z-10 mt-4 flex items-center gap-4">
                <button
                  onClick={() => handleBannerClick(banner.departmentId)}
                  className="px-5 py-2.5 bg-white text-slate-900 hover:bg-slate-100 text-xs sm:text-sm font-bold rounded-xl shadow-md transition-all flex items-center gap-2 group cursor-pointer active:scale-95"
                >
                  <span>{banner.ctaText}</span>
                  <ArrowRight className="w-4 h-4 text-orange-600 group-hover:translate-x-1 transition-transform" />
                </button>
                <div className="hidden sm:flex items-center gap-1.5 text-xs text-white/80 font-medium">
                  <Tag className="w-3.5 h-3.5 text-amber-300" />
                  <span>Use code <strong>VEYRA100</strong> for extra ₹100 OFF</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Carousel Arrow Controls */}
        <button
          onClick={prevSlide}
          className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/80 hover:bg-white text-slate-800 shadow-md backdrop-blur-sm flex items-center justify-center transition-all opacity-80 hover:opacity-100 focus:outline-none"
          aria-label="Previous slide"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/80 hover:bg-white text-slate-800 shadow-md backdrop-blur-sm flex items-center justify-center transition-all opacity-80 hover:opacity-100 focus:outline-none"
          aria-label="Next slide"
        >
          <ChevronRight className="w-5 h-5" />
        </button>

        {/* Dot Indicators */}
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 z-10">
          {BANNERS.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`h-1.5 rounded-full transition-all ${
                currentIndex === idx ? 'w-6 bg-white' : 'w-2 bg-white/50'
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
