import React from 'react';
import { Heart, Trash2, ShoppingBag, Star, ArrowRight } from 'lucide-react';
import { useShop } from '../context/ShopContext';

export const WishlistView: React.FC = () => {
  const { wishlist, toggleWishlist, addToCart, openProductDetail, setCurrentView } = useShop();

  const formatInr = (amount: number) => {
    return '₹' + amount.toLocaleString('en-IN');
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 pb-24">
      {/* Title */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 font-display flex items-center gap-2">
            <span>My Wishlist</span>
            <span className="text-base text-rose-600 font-normal">❤️ ({wishlist.length})</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Saved items you love. Move them to your cart anytime!
          </p>
        </div>

        {wishlist.length > 0 && (
          <button
            onClick={() => setCurrentView('products')}
            className="text-xs font-bold text-orange-600 hover:text-orange-700 hidden sm:block"
          >
            Continue Shopping →
          </button>
        )}
      </div>

      {wishlist.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {wishlist.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-2xl border border-slate-200/90 shadow-xs hover:shadow-md transition-all overflow-hidden flex flex-col justify-between"
            >
              <div
                onClick={() => openProductDetail(product)}
                className="cursor-pointer"
              >
                {/* Image */}
                <div className="relative aspect-square w-full bg-slate-100 overflow-hidden">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                  {product.discount > 0 && (
                    <div className="absolute top-2 left-2 bg-emerald-600 text-white text-[10px] font-extrabold px-1.5 py-0.5 rounded shadow-xs">
                      {product.discount}% OFF
                    </div>
                  )}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleWishlist(product);
                    }}
                    className="absolute top-2 right-2 p-1.5 rounded-full bg-white/90 text-rose-600 hover:bg-rose-50 shadow-sm"
                    title="Remove from Wishlist"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Details */}
                <div className="p-3">
                  <div className="text-[10px] font-bold uppercase text-slate-400 mb-0.5">
                    {product.brand}
                  </div>
                  <h3 className="text-xs font-semibold text-slate-900 line-clamp-2 leading-snug">
                    {product.name}
                  </h3>

                  <div className="flex items-center gap-1 mt-1 text-[11px] text-amber-600 font-bold">
                    <span>{product.rating.toFixed(1)}</span>
                    <Star className="w-3 h-3 fill-amber-500 text-amber-500 inline" />
                    <span className="text-slate-400 font-normal">
                      ({product.reviewsCount})
                    </span>
                  </div>

                  <div className="flex items-baseline gap-1.5 mt-2">
                    <span className="text-sm font-bold text-slate-900 font-sans">
                      {formatInr(product.price)}
                    </span>
                    {product.originalPrice > product.price && (
                      <span className="text-[10px] text-slate-400 line-through">
                        {formatInr(product.originalPrice)}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Action: Add to Cart */}
              <div className="p-3 pt-0">
                <button
                  onClick={() => {
                    addToCart(product, 1);
                    toggleWishlist(product);
                  }}
                  className="w-full py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-xl text-xs font-bold shadow-xs transition-colors flex items-center justify-center gap-1.5"
                >
                  <ShoppingBag className="w-3.5 h-3.5" />
                  <span>Move to Cart</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center flex flex-col items-center justify-center">
          <div className="w-16 h-16 rounded-full bg-rose-50 text-rose-500 flex items-center justify-center text-3xl mb-3">
            ❤️
          </div>
          <h3 className="text-base font-bold text-slate-900 mb-1">
            Your wishlist is empty
          </h3>
          <p className="text-xs text-slate-500 max-w-sm mb-4">
            Tap the heart icon on any product you want to save for later while shopping.
          </p>
          <button
            onClick={() => setCurrentView('products')}
            className="px-5 py-2.5 bg-slate-900 text-white rounded-xl text-xs font-bold shadow-md hover:bg-slate-800"
          >
            Explore Deals
          </button>
        </div>
      )}
    </div>
  );
};
