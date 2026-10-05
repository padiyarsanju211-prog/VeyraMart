import React from 'react';
import { BannerCarousel } from './BannerCarousel';
import { CategoryPills } from './CategoryPills';
import { ProductCarousel } from './ProductCarousel';
import { useShop } from '../context/ShopContext';
import { Sparkles, ShieldCheck, Zap } from 'lucide-react';

export const HomeView: React.FC = () => {
  const { allProducts, setSelectedDepartment, setCurrentView } = useShop();

  // Curated collections for the home page sections
  const groceryDeals = allProducts.filter((p) => p.department === 'grocery');
  const womensPicks = allProducts.filter((p) => p.department === 'womens_fashion');
  const mensPicks = allProducts.filter((p) => p.department === 'mens_fashion');
  const kidsPicks = allProducts.filter((p) => p.department === 'kids');
  const footwearPicks = allProducts.filter((p) => p.department === 'footwear');
  const beautyPicks = allProducts.filter((p) => p.department === 'beauty');
  const electronicsDeals = allProducts.filter((p) => p.department === 'electronics' || p.department === 'mobiles');
  const gymFitnessDeals = allProducts.filter((p) => p.department === 'gym_fitness');
  const homeKitchenDeals = allProducts.filter((p) => p.department === 'home_kitchen');
  const bestSellers = allProducts.filter((p) => p.isBestSeller || p.reviewsCount > 4000);
  const topDeals = allProducts.filter((p) => p.discount >= 45);
  const recommendedForYou = allProducts.filter((p) => p.rating >= 4.7).slice(0, 10);

  return (
    <div className="space-y-4 pb-20">
      {/* 1. Promotional Banner Carousel */}
      <BannerCarousel />

      {/* 2. Shop by Category Horizontal Pills */}
      <CategoryPills />

      {/* Mid-page Indian Festive Savings Highlight Strip */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-rose-600 rounded-2xl p-4 sm:p-5 text-white flex flex-col sm:flex-row items-center justify-between gap-3 shadow-md">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-xs flex items-center justify-center shrink-0">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="text-xs uppercase font-extrabold tracking-wider text-amber-200">
                Special Marketplace Privilege
              </div>
              <div className="text-base sm:text-lg font-bold font-display">
                Get Flat ₹100 OFF on your first order with code <strong>FIRST100</strong>
              </div>
            </div>
          </div>
          <button
            onClick={() => {
              setSelectedDepartment('all');
              setCurrentView('products');
            }}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-950 text-white rounded-xl text-xs font-bold transition-all shadow-sm shrink-0 whitespace-nowrap"
          >
            Claim Discount Now
          </button>
        </div>
      </div>

      {/* 3. Grocery Deals Carousel */}
      <ProductCarousel
        title="🛒 Grocery Super Saver Deals"
        subtitle="Basmati rice, whole wheat atta, dals, cooking oils & pantry staples"
        badge="Fresh Staples"
        products={groceryDeals}
        departmentId="grocery"
      />

      {/* 4. Best Sellers Carousel */}
      <ProductCarousel
        title="🔥 Best Sellers Across India"
        subtitle="Most loved and highest re-ordered products by VeyraMart shoppers"
        badge="Top Rated"
        products={bestSellers}
      />

      {/* 5. Women's Fashion Picks */}
      <ProductCarousel
        title="👗 Women's Ethnic & Western Picks"
        subtitle="Designer sarees, Anarkali kurta sets, everyday tunics & chic handbags"
        badge="Trending Style"
        products={womensPicks}
        departmentId="womens_fashion"
      />

      {/* 6. Men's Fashion Picks */}
      <ProductCarousel
        title="👔 Men's Fashion Essentials"
        subtitle="Smart formal shirts, pique polos, stretch denim jeans & leather accessories"
        badge="Up to 60% OFF"
        products={mensPicks}
        departmentId="mens_fashion"
      />

      {/* 7. Electronics & Mobiles Deals */}
      <ProductCarousel
        title="💻 Electronics & Audio Deals"
        subtitle="Noise cancelling earbuds, wireless Bluetooth speakers, smartwatches & storage"
        badge="Tech Bonanza"
        products={electronicsDeals}
        departmentId="electronics"
      />

      {/* 8. Top Deals (High Discounts) */}
      <ProductCarousel
        title="⚡ Top Deals · Min 45% OFF"
        subtitle="Handpicked mega price drops with genuine manufacturer warranty"
        badge="Mega Price Drop"
        products={topDeals}
      />

      {/* 9. Kids & Baby Picks */}
      <ProductCarousel
        title="👶 Kids & Baby Carnival"
        subtitle="Cotton rompers, festive party sets, school backpacks & stainless lunch boxes"
        badge="Kids Safe"
        products={kidsPicks}
        departmentId="kids"
      />

      {/* 10. Gym & Fitness Essentials */}
      <ProductCarousel
        title="🏋️ Gym & Fitness Gear"
        subtitle="Cast iron hex dumbbells, anti-skid TPE yoga mats & protein shakers"
        badge="Fit India"
        products={gymFitnessDeals}
        departmentId="gym_fitness"
      />

      {/* 11. Home & Kitchen Makeover */}
      <ProductCarousel
        title="🏠 Home & Kitchen Favorites"
        subtitle="Deep lid pressure cookers, 750W mixers, glass containers & bedsheets"
        badge="Kitchen Star"
        products={homeKitchenDeals}
        departmentId="home_kitchen"
      />

      {/* 12. Footwear Collection */}
      <ProductCarousel
        title="👟 Footwear for Every Step"
        subtitle="Lightweight running shoes, formal leathers, wedges & everyday slippers"
        badge="Comfort Fit"
        products={footwearPicks}
        departmentId="footwear"
      />

      {/* 13. Beauty & Personal Care */}
      <ProductCarousel
        title="💄 Beauty & Ayurvedic Glow"
        subtitle="Niacinamide serums, redensyl onion oils, invisible sunscreens & matte lipsticks"
        badge="Skin & Hair"
        products={beautyPicks}
        departmentId="beauty"
      />

      {/* 14. Recommended for You */}
      <ProductCarousel
        title="⭐ Recommended for You"
        subtitle="Selected specifically based on high quality ratings and customer satisfaction"
        badge="Editor's Choice"
        products={recommendedForYou}
      />
    </div>
  );
};
