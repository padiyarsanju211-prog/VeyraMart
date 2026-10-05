import React, { useState, useEffect } from 'react';
import {
  X,
  Star,
  Heart,
  ShoppingBag,
  Zap,
  Truck,
  ShieldCheck,
  RotateCcw,
  CheckCircle2,
  Share2,
  ChevronRight,
} from 'lucide-react';
import { Product } from '../types';
import { useShop } from '../context/ShopContext';
import { generateProductReviews } from '../data/reviews';
import { ProductCard } from './ProductCard';

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({ product, onClose }) => {
  const {
    addToCart,
    toggleWishlist,
    isInWishlist,
    setCurrentView,
    allProducts,
    deliveryLocation,
    showToast,
  } = useShop();

  const [selectedSize, setSelectedSize] = useState<string | undefined>(undefined);
  const [selectedColor, setSelectedColor] = useState<string | undefined>(undefined);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'description' | 'specifications' | 'reviews'>('description');
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    if (product) {
      setSelectedSize(product.sizes ? product.sizes[0] : undefined);
      setSelectedColor(product.colors ? product.colors[0] : undefined);
      setQuantity(1);
      setActiveTab('description');
      setImageError(false);
    }
  }, [product]);

  if (!product) return null;

  const inWishlist = isInWishlist(product.id);
  const reviews = generateProductReviews(product.id, 5);

  const relatedProducts = allProducts
    .filter((p) => p.department === product.department && p.id !== product.id)
    .slice(0, 6);

  const formatInr = (amount: number) => {
    return '₹' + amount.toLocaleString('en-IN');
  };

  const handleAddToCart = () => {
    addToCart(product, quantity, selectedSize, selectedColor);
  };

  const handleBuyNow = () => {
    addToCart(product, quantity, selectedSize, selectedColor);
    onClose();
    setCurrentView('checkout');
  };

  const handleShare = () => {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(window.location.href).catch(() => {});
      }
    } catch {}
    showToast('Product link copied to clipboard!', 'info');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/70 backdrop-blur-sm overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-auto max-h-[92vh] flex flex-col">
        {/* Modal Top Bar */}
        <div className="flex items-center justify-between px-6 py-3.5 border-b border-slate-200/80 bg-slate-50/60 sticky top-0 z-20">
          <div className="flex items-center gap-2 text-xs text-slate-500 truncate">
            <span className="font-semibold text-slate-900">{product.brand}</span>
            <ChevronRight className="w-3 h-3 text-slate-400" />
            <span className="truncate">{product.category}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleShare}
              className="p-1.5 rounded-full text-slate-500 hover:text-slate-900 hover:bg-slate-200/70 transition-colors"
              title="Share Product"
            >
              <Share2 className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-full text-slate-500 hover:text-slate-900 hover:bg-slate-200/70 transition-colors"
              title="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body - Scrollable */}
        <div className="overflow-y-auto p-4 sm:p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 items-start">
            {/* Left: Product Media Gallery */}
            <div className="flex flex-col gap-3">
              <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 shadow-inner">
                {!imageError ? (
                  <img
                    src={product.image}
                    alt={product.name}
                    referrerPolicy="no-referrer"
                    onError={() => setImageError(true)}
                    className="w-full h-full object-cover object-center"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center bg-slate-100 text-slate-400">
                    <span className="text-4xl">🛍️</span>
                    <span className="text-sm font-semibold mt-2">{product.name}</span>
                  </div>
                )}

                {/* Discount Badge */}
                {product.discount > 0 && (
                  <div className="absolute top-3 left-3 bg-emerald-600 text-white text-xs font-black px-2.5 py-1 rounded-md shadow-md">
                    {product.discount}% OFF
                  </div>
                )}

                {/* Wishlist Button */}
                <button
                  onClick={() => toggleWishlist(product)}
                  className={`absolute top-3 right-3 p-2.5 rounded-full backdrop-blur-md shadow-md transition-all ${
                    inWishlist
                      ? 'bg-rose-50 text-rose-600'
                      : 'bg-white/90 text-slate-600 hover:text-rose-600'
                  }`}
                  title={inWishlist ? 'Remove from Wishlist' : 'Add to Wishlist'}
                >
                  <Heart className={`w-5 h-5 ${inWishlist ? 'fill-rose-600' : ''}`} />
                </button>
              </div>

              {/* Delivery Promise Tags */}
              <div className="grid grid-cols-3 gap-2 text-center text-[11px] pt-1">
                <div className="flex flex-col items-center p-2 rounded-xl bg-slate-50 border border-slate-200/60">
                  <Truck className="w-4 h-4 text-orange-600 mb-1" />
                  <span className="font-semibold text-slate-800">Free Delivery</span>
                  <span className="text-[10px] text-slate-500">Above ₹499</span>
                </div>
                <div className="flex flex-col items-center p-2 rounded-xl bg-slate-50 border border-slate-200/60">
                  <RotateCcw className="w-4 h-4 text-emerald-600 mb-1" />
                  <span className="font-semibold text-slate-800">7 Days Return</span>
                  <span className="text-[10px] text-slate-500">Easy replacement</span>
                </div>
                <div className="flex flex-col items-center p-2 rounded-xl bg-slate-50 border border-slate-200/60">
                  <ShieldCheck className="w-4 h-4 text-blue-600 mb-1" />
                  <span className="font-semibold text-slate-800">100% Genuine</span>
                  <span className="text-[10px] text-slate-500">Direct from Brand</span>
                </div>
              </div>
            </div>

            {/* Right: Product Purchase Module */}
            <div className="flex flex-col space-y-4">
              {/* Brand & Title */}
              <div>
                <span className="text-xs font-extrabold uppercase tracking-wider text-orange-600">
                  {product.brand}
                </span>
                <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight leading-snug mt-1 font-display">
                  {product.name}
                </h1>
              </div>

              {/* Ratings & Reviews */}
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1 bg-amber-500 text-white text-xs font-bold px-2 py-0.5 rounded-md shadow-xs">
                  <span>{product.rating.toFixed(1)}</span>
                  <Star className="w-3 h-3 fill-white inline" />
                </div>
                <span className="text-xs text-slate-500">
                  {product.reviewsCount.toLocaleString('en-IN')} Ratings & Verified Reviews
                </span>
                <span className="text-slate-300">·</span>
                <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600 inline" />
                  Assured Quality
                </span>
              </div>

              {/* Price Block */}
              <div className="p-3.5 rounded-2xl bg-orange-50/50 border border-orange-200/60">
                <div className="flex items-baseline gap-2.5">
                  <span className="text-2xl sm:text-3xl font-extrabold text-slate-950 font-sans tracking-tight">
                    {formatInr(product.price)}
                  </span>
                  {product.originalPrice > product.price && (
                    <span className="text-sm sm:text-base text-slate-400 line-through">
                      MRP {formatInr(product.originalPrice)}
                    </span>
                  )}
                  {product.discount > 0 && (
                    <span className="text-sm font-extrabold text-emerald-600">
                      ({product.discount}% OFF)
                    </span>
                  )}
                </div>
                <div className="text-xs text-slate-600 mt-1 flex items-center gap-2">
                  <span>Inclusive of all taxes</span>
                  <span className="text-emerald-700 font-bold">
                    · You save {formatInr(product.originalPrice - product.price)}!
                  </span>
                </div>
              </div>

              {/* Stock Status & Delivery Location Indicator */}
              <div className="flex items-center justify-between text-xs py-1 border-b border-slate-100">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span className="font-semibold text-emerald-800">
                    {product.stock > 10 ? 'In Stock · Ready to dispatch' : `Only ${product.stock} left in stock!`}
                  </span>
                </div>
                <div className="text-slate-500">
                  Deliver to <strong className="text-slate-800">{deliveryLocation.city} {deliveryLocation.pincode}</strong>
                </div>
              </div>

              {/* Size Selector (if sizes exist) */}
              {product.sizes && product.sizes.length > 0 && (
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-800">Select Option / Size:</span>
                    <span className="text-slate-500">Standard Indian Sizing</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {product.sizes.map((size) => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition-all ${
                          selectedSize === size
                            ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                            : 'bg-white text-slate-700 border-slate-200 hover:border-slate-400'
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Color Selector (if colors exist) */}
              {product.colors && product.colors.length > 0 && (
                <div className="space-y-1.5">
                  <span className="text-xs font-bold text-slate-800">Select Shade / Color:</span>
                  <div className="flex flex-wrap gap-2">
                    {product.colors.map((color) => (
                      <button
                        key={color}
                        onClick={() => setSelectedColor(color)}
                        className={`px-3 py-1 text-xs font-medium rounded-lg border transition-all ${
                          selectedColor === color
                            ? 'bg-orange-600 text-white border-orange-600 shadow-sm'
                            : 'bg-white text-slate-700 border-slate-200 hover:border-slate-400'
                        }`}
                      >
                        {color}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity Stepper */}
              <div className="flex items-center gap-3 pt-1">
                <span className="text-xs font-bold text-slate-800">Quantity:</span>
                <div className="flex items-center border border-slate-200 rounded-xl overflow-hidden bg-slate-50">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="px-3 py-1 text-sm font-bold text-slate-600 hover:bg-slate-200 transition-colors"
                  >
                    -
                  </button>
                  <span className="px-3 py-1 text-xs font-bold text-slate-900">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
                    className="px-3 py-1 text-sm font-bold text-slate-600 hover:bg-slate-200 transition-colors"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Action Buttons: Add to Cart & Buy Now */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <button
                  onClick={handleAddToCart}
                  className="w-full py-3 px-4 rounded-xl text-xs sm:text-sm font-bold bg-white hover:bg-slate-50 text-slate-900 border-2 border-slate-900 transition-all flex items-center justify-center gap-2 active:scale-95 shadow-sm"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Add to Cart</span>
                </button>
                <button
                  onClick={handleBuyNow}
                  className="w-full py-3 px-4 rounded-xl text-xs sm:text-sm font-bold bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white transition-all flex items-center justify-center gap-2 active:scale-95 shadow-md shadow-orange-600/30"
                >
                  <Zap className="w-4 h-4 fill-white" />
                  <span>Buy Now</span>
                </button>
              </div>
            </div>
          </div>

          {/* Product Deep Information Tabs */}
          <div className="pt-4 border-t border-slate-200">
            {/* Tab Buttons */}
            <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
              <button
                onClick={() => setActiveTab('description')}
                className={`px-4 py-2 text-xs sm:text-sm font-bold rounded-lg transition-colors ${
                  activeTab === 'description'
                    ? 'bg-slate-900 text-white'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Description
              </button>
              <button
                onClick={() => setActiveTab('specifications')}
                className={`px-4 py-2 text-xs sm:text-sm font-bold rounded-lg transition-colors ${
                  activeTab === 'specifications'
                    ? 'bg-slate-900 text-white'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Specifications
              </button>
              <button
                onClick={() => setActiveTab('reviews')}
                className={`px-4 py-2 text-xs sm:text-sm font-bold rounded-lg transition-colors ${
                  activeTab === 'reviews'
                    ? 'bg-slate-900 text-white'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Reviews ({reviews.length})
              </button>
            </div>

            {/* Tab Contents */}
            <div className="pt-4">
              {activeTab === 'description' && (
                <div className="text-sm text-slate-700 leading-relaxed max-w-3xl space-y-3">
                  <p>{product.description}</p>
                  <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200/80 text-xs text-slate-600">
                    <strong className="text-slate-900 block mb-1">VeyraMart Quality Promise:</strong>
                    All items shipped under VeyraMart are subjected to strict quality and expiry checks.
                    We guarantee 100% authentic packaging with manufacturer seal.
                  </div>
                </div>
              )}

              {activeTab === 'specifications' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  {Object.entries(product.specifications).map(([key, val]) => (
                    <div
                      key={key}
                      className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 border border-slate-200/60"
                    >
                      <span className="text-slate-500 font-medium">{key}</span>
                      <span className="text-slate-900 font-semibold">{val}</span>
                    </div>
                  ))}
                  <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 border border-slate-200/60">
                    <span className="text-slate-500 font-medium">Department</span>
                    <span className="text-slate-900 font-semibold">{product.department}</span>
                  </div>
                  <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 border border-slate-200/60">
                    <span className="text-slate-500 font-medium">Subcategory</span>
                    <span className="text-slate-900 font-semibold">{product.subcategory}</span>
                  </div>
                </div>
              )}

              {activeTab === 'reviews' && (
                <div className="space-y-3">
                  {reviews.map((rev) => (
                    <div
                      key={rev.id}
                      className="p-3.5 rounded-xl bg-slate-50/70 border border-slate-200/70 space-y-1.5"
                    >
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-900">{rev.userName}</span>
                          <span className="text-[10px] text-slate-400">({rev.userCity})</span>
                          <span className="text-[10px] bg-emerald-100 text-emerald-800 font-semibold px-1.5 py-0.2 rounded">
                            Verified Buyer
                          </span>
                        </div>
                        <span className="text-[10px] text-slate-400">{rev.date}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={`w-3 h-3 ${
                              i < rev.rating
                                ? 'fill-amber-400 text-amber-400'
                                : 'text-slate-200'
                            }`}
                          />
                        ))}
                        <span className="text-xs font-bold text-slate-800 ml-1.5">
                          {rev.title}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 leading-normal">
                        {rev.comment}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Related Products Carousel */}
          {relatedProducts.length > 0 && (
            <div className="pt-6 border-t border-slate-200">
              <h3 className="text-base font-bold text-slate-900 mb-3 font-display">
                Customers Also Bought (Related Deals)
              </h3>
              <div className="flex items-stretch gap-3 overflow-x-auto no-scrollbar pb-2">
                {relatedProducts.map((rel) => (
                  <div key={rel.id} className="w-48 shrink-0">
                    <ProductCard product={rel} compact />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
