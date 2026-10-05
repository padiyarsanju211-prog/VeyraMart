import React, { useState } from 'react';
import { Star, Heart, ShoppingBag, Check } from 'lucide-react';
import { Product } from '../types';
import { useShop } from '../context/ShopContext';

interface ProductCardProps {
  product: Product;
  compact?: boolean;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, compact = false }) => {
  const { openProductDetail, addToCart, toggleWishlist, isInWishlist, cartItems } = useShop();
  const [imageError, setImageError] = useState(false);
  const [isAddedAnim, setIsAddedAnim] = useState(false);

  const inWishlist = isInWishlist(product.id);
  const cartItem = cartItems.find((item) => item.product.id === product.id);
  const inCartQty = cartItem ? cartItem.quantity : 0;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(product, 1);
    setIsAddedAnim(true);
    setTimeout(() => setIsAddedAnim(false), 1200);
  };

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleWishlist(product);
  };

  // Indian Rupee formatting utility
  const formatInr = (amount: number) => {
    return '₹' + amount.toLocaleString('en-IN');
  };

  return (
    <div
      onClick={() => openProductDetail(product)}
      className="group relative bg-white rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md hover:border-slate-300 transition-all duration-200 flex flex-col overflow-hidden cursor-pointer h-full"
    >
      {/* Product Image Area */}
      <div className="relative aspect-square w-full bg-slate-100 overflow-hidden">
        {!imageError ? (
          <img
            src={product.image}
            alt={product.name}
            referrerPolicy="no-referrer"
            onError={() => setImageError(true)}
            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200 text-slate-400 p-4 text-center">
            <span className="text-3xl mb-1">🛍️</span>
            <span className="text-xs font-medium text-slate-500 line-clamp-1">{product.brand}</span>
          </div>
        )}

        {/* Discount Badge */}
        {product.discount > 0 && (
          <div className="absolute top-2.5 left-2.5 bg-emerald-600 text-white text-[11px] font-extrabold px-2 py-0.5 rounded-md shadow-sm">
            {product.discount}% OFF
          </div>
        )}

        {/* Special Badge if exists */}
        {product.badge && (
          <div className="absolute bottom-2.5 left-2.5 bg-slate-900/90 backdrop-blur-sm text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-sm">
            {product.badge}
          </div>
        )}

        {/* Wishlist Button */}
        <button
          onClick={handleToggleWishlist}
          className={`absolute top-2.5 right-2.5 p-2 rounded-full backdrop-blur-md transition-all shadow-sm ${
            inWishlist
              ? 'bg-rose-50 text-rose-600 hover:bg-rose-100'
              : 'bg-white/80 text-slate-600 hover:bg-white hover:text-rose-600'
          }`}
          title={inWishlist ? 'Remove from Wishlist' : 'Add to Wishlist'}
        >
          <Heart className={`w-4 h-4 ${inWishlist ? 'fill-rose-600' : ''}`} />
        </button>
      </div>

      {/* Product Details Content */}
      <div className="p-3.5 flex flex-col flex-1 justify-between">
        <div>
          {/* Brand & Rating Row */}
          <div className="flex items-center justify-between gap-1 mb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 truncate max-w-[120px]">
              {product.brand}
            </span>
            <div className="flex items-center gap-1 bg-amber-50 px-1.5 py-0.5 rounded text-amber-800 text-[11px] font-bold">
              <span>{product.rating.toFixed(1)}</span>
              <Star className="w-3 h-3 fill-amber-500 text-amber-500 inline" />
              <span className="text-slate-400 font-normal text-[10px]">
                ({product.reviewsCount > 999 ? `${(product.reviewsCount / 1000).toFixed(1)}k` : product.reviewsCount})
              </span>
            </div>
          </div>

          {/* Product Title */}
          <h3 className="text-xs sm:text-sm font-semibold text-slate-900 line-clamp-2 leading-snug group-hover:text-orange-600 transition-colors mb-2">
            {product.name}
          </h3>

          {/* Sizes or Colors Preview (if available for fashion / clothing) */}
          {(product.sizes || product.colors) && !compact && (
            <div className="mb-2 text-[11px] text-slate-500 flex items-center gap-1.5 flex-wrap">
              {product.sizes && (
                <span className="truncate">
                  Sizes: <strong className="text-slate-700">{product.sizes.slice(0, 3).join(', ')}{product.sizes.length > 3 ? '...' : ''}</strong>
                </span>
              )}
              {product.colors && (
                <span className="truncate">
                  · <strong className="text-slate-700">{product.colors.length} Colors</strong>
                </span>
              )}
            </div>
          )}
        </div>

        {/* Pricing & Add-to-Cart Row */}
        <div className="mt-2 pt-2 border-t border-slate-100 flex items-end justify-between gap-2">
          <div className="flex flex-col">
            <div className="flex items-baseline gap-1.5">
              <span className="text-base sm:text-lg font-bold text-slate-950 font-sans tracking-tight">
                {formatInr(product.price)}
              </span>
              {product.originalPrice > product.price && (
                <span className="text-xs text-slate-400 line-through">
                  {formatInr(product.originalPrice)}
                </span>
              )}
            </div>
            {product.discount > 0 && (
              <span className="text-[10px] font-bold text-emerald-600">
                Save {formatInr(product.originalPrice - product.price)}
              </span>
            )}
          </div>

          {/* Add to Cart Button */}
          <button
            onClick={handleAddToCart}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm active:scale-95 ${
              isAddedAnim
                ? 'bg-emerald-600 text-white'
                : inCartQty > 0
                ? 'bg-orange-100 text-orange-800 hover:bg-orange-200'
                : 'bg-slate-900 hover:bg-orange-600 text-white'
            }`}
            title="Add to Shopping Cart"
          >
            {isAddedAnim ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>Added!</span>
              </>
            ) : inCartQty > 0 ? (
              <>
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>In Cart ({inCartQty})</span>
              </>
            ) : (
              <>
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>Add</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
