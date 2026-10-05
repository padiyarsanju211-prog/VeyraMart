import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Product,
  CartItem,
  Address,
  Order,
  UserProfile,
  DepartmentId,
} from '../types/index.ts';
import { SAMPLE_PRODUCTS } from '../data/products.ts';

export type AppView =
  | 'home'
  | 'categories'
  | 'products'
  | 'cart'
  | 'checkout'
  | 'orders'
  | 'account'
  | 'wishlist'
  | 'order-success';

interface ToastMessage {
  id: string;
  message: string;
  type?: 'success' | 'info' | 'cart';
}

interface ShopContextType {
  // Navigation & View
  currentView: AppView;
  setCurrentView: (view: AppView) => void;
  selectedProduct: Product | null;
  openProductDetail: (product: Product) => void;
  closeProductDetail: () => void;
  selectedOrderForModal: Order | null;
  openOrderDetail: (order: Order) => void;
  closeOrderDetail: () => void;
  latestPlacedOrder: Order | null;

  // Filter & Search
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedDepartment: DepartmentId | 'all';
  setSelectedDepartment: (dept: DepartmentId | 'all') => void;
  selectedSubcategory: string | null;
  setSelectedSubcategory: (subcat: string | null) => void;
  activeSort: string;
  setActiveSort: (sort: string) => void;
  priceRange: [number, number];
  setPriceRange: (range: [number, number]) => void;
  selectedBrands: string[];
  toggleBrand: (brand: string) => void;
  minRating: number;
  setMinRating: (rating: number) => void;
  inStockOnly: boolean;
  setInStockOnly: (val: boolean) => void;
  resetFilters: () => void;
  allProducts: Product[];
  filteredProducts: Product[];

  // Cart
  cartItems: CartItem[];
  addToCart: (product: Product, quantity?: number, size?: string, color?: string) => Promise<void>;
  removeFromCart: (productId: string, size?: string, color?: string) => Promise<void>;
  updateQuantity: (productId: string, quantity: number, size?: string, color?: string) => Promise<void>;
  clearCart: () => Promise<void>;
  cartTotalCount: number;
  cartSubtotal: number;
  cartDiscount: number;
  deliveryFee: number;
  cartGrandTotal: number;
  appliedCoupon: { code: string; discountAmount: number } | null;
  applyCoupon: (code: string) => { success: boolean; message: string };
  removeCoupon: () => void;

  // Wishlist
  wishlist: Product[];
  toggleWishlist: (product: Product) => Promise<void>;
  isInWishlist: (productId: string) => boolean;

  // User & Delivery Location
  currentUser: UserProfile;
  authToken: string | null;
  loginUser: (email: string, password?: string) => Promise<{ success: boolean; message?: string }>;
  registerUser: (name: string, email: string, password: string, phone?: string) => Promise<{ success: boolean; message?: string }>;
  logoutUser: () => Promise<void>;
  updateProfile: (updates: { name?: string; phone?: string }) => Promise<void>;
  deliveryLocation: { city: string; pincode: string };
  updateDeliveryLocation: (city: string, pincode: string) => void;
  savedAddresses: Address[];
  addAddress: (addr: Omit<Address, 'id'>) => Promise<void>;
  removeAddress: (id: string) => Promise<void>;
  setDefaultAddress: (id: string) => Promise<void>;

  // Orders
  orders: Order[];
  placeOrder: (shippingAddress: Address, paymentMethod: 'UPI' | 'Card' | 'Net Banking' | 'Cash on Delivery') => Promise<Order>;

  // Toast notifications
  toast: ToastMessage | null;
  showToast: (message: string, type?: 'success' | 'info' | 'cart') => void;
  hideToast: () => void;
}

const ShopContext = createContext<ShopContextType | undefined>(undefined);

export const ShopProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Navigation
  const [currentView, setCurrentView] = useState<AppView>('home');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedOrderForModal, setSelectedOrderForModal] = useState<Order | null>(null);
  const [latestPlacedOrder, setLatestPlacedOrder] = useState<Order | null>(null);

  // Products
  const [allProducts, setAllProducts] = useState<Product[]>(SAMPLE_PRODUCTS);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState<DepartmentId | 'all'>('all');
  const [selectedSubcategory, setSelectedSubcategory] = useState<string | null>(null);
  const [activeSort, setActiveSort] = useState('popularity');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 15000]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [minRating, setMinRating] = useState(0);
  const [inStockOnly, setInStockOnly] = useState(false);

  // Auth Token
  const [authToken, setAuthToken] = useState<string | null>(() => {
    try {
      return localStorage.getItem('veyramart_token') || 'veyra_demo_token';
    } catch {
      return null;
    }
  });

  // User Profile
  const [currentUser, setCurrentUser] = useState<UserProfile>({
    id: 'usr-1',
    name: 'Sanju Padiyar',
    email: 'padiyarsanju211@gmail.com',
    phone: '+91 98765 43210',
    role: 'customer',
    savedAddresses: [
      {
        id: 'addr-1',
        name: 'Sanju Padiyar',
        phone: '9876543210',
        house: 'Flat 402, Royal Palms Residency',
        street: '14th Cross, Indiranagar',
        area: 'Indiranagar 100ft Road',
        city: 'Bengaluru',
        state: 'Karnataka',
        pin: '560038',
        isDefault: true,
        type: 'Home',
      },
      {
        id: 'addr-2',
        name: 'Sanju Padiyar (Office)',
        phone: '9876543210',
        house: 'Level 5, WeWork Prestige Tech Park',
        street: 'Marathahalli - Sarjapur Outer Ring Rd',
        area: 'Kadubeesanahalli',
        city: 'Bengaluru',
        state: 'Karnataka',
        pin: '560103',
        isDefault: false,
        type: 'Work',
      },
    ],
  });

  // Delivery Location
  const [deliveryLocation, setDeliveryLocation] = useState({
    city: 'Bengaluru',
    pincode: '560038',
  });

  // Cart & Wishlist
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<Product[]>([]);
  const [appliedCoupon, setAppliedCoupon] = useState<{ code: string; discountAmount: number } | null>(null);

  // Orders
  const [orders, setOrders] = useState<Order[]>([]);

  // Toast
  const [toast, setToast] = useState<ToastMessage | null>(null);
  const showToast = (message: string, type: 'success' | 'info' | 'cart' = 'success') => {
    setToast({ id: `${Date.now()}`, message, type });
    setTimeout(() => {
      setToast(null);
    }, 3200);
  };
  const hideToast = () => setToast(null);

  // Helper for authenticated requests
  const getAuthHeaders = () => {
    return {
      'Content-Type': 'application/json',
      ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
    };
  };

  // 1. Fetch products from server
  useEffect(() => {
    fetch('/api/products')
      .then((res) => {
        if (!res.ok) throw new Error('Failed to load products');
        return res.json();
      })
      .then((data) => {
        if (data.products && data.products.length > 0) {
          setAllProducts(data.products);
        }
      })
      .catch((err) => {
        console.warn('Fallback to local sample products:', err);
      });
  }, []);

  // 2. Fetch authenticated user profile
  useEffect(() => {
    fetch('/api/auth/me', { headers: getAuthHeaders() })
      .then((res) => {
        if (!res.ok) throw new Error('Not authenticated');
        return res.json();
      })
      .then((data) => {
        if (data.user) {
          setCurrentUser(data.user);
        }
      })
      .catch(() => {});
  }, [authToken]);

  // 3. Fetch server cart
  useEffect(() => {
    fetch('/api/cart', { headers: getAuthHeaders() })
      .then((res) => {
        if (!res.ok) throw new Error('Failed to load cart');
        return res.json();
      })
      .then((data) => {
        if (data.items) {
          setCartItems(data.items);
        }
      })
      .catch(() => {});
  }, [authToken]);

  // 4. Fetch server wishlist
  useEffect(() => {
    fetch('/api/wishlist', { headers: getAuthHeaders() })
      .then((res) => {
        if (!res.ok) throw new Error('Failed to load wishlist');
        return res.json();
      })
      .then((data) => {
        if (data.items) {
          setWishlist(data.items);
        }
      })
      .catch(() => {});
  }, [authToken]);

  // 5. Fetch server orders
  useEffect(() => {
    fetch('/api/orders', { headers: getAuthHeaders() })
      .then((res) => {
        if (!res.ok) throw new Error('Failed to load orders');
        return res.json();
      })
      .then((data) => {
        if (data.orders) {
          setOrders(data.orders);
        }
      })
      .catch(() => {});
  }, [authToken]);

  // Navigation handlers
  const openProductDetail = (product: Product) => {
    setSelectedProduct(product);
  };

  const closeProductDetail = () => {
    setSelectedProduct(null);
  };

  const openOrderDetail = (order: Order) => {
    setSelectedOrderForModal(order);
  };

  const closeOrderDetail = () => {
    setSelectedOrderForModal(null);
  };

  // Cart operations with server synchronization
  const addToCart = async (product: Product, quantity = 1, size?: string, color?: string) => {
    const chosenSize = size || (product.sizes ? product.sizes[0] : undefined);
    const chosenColor = color || (product.colors ? product.colors[0] : undefined);

    // Optimistic UI update
    setCartItems((prev) => {
      const idx = prev.findIndex(
        (it) => it.product.id === product.id && it.selectedSize === chosenSize && it.selectedColor === chosenColor
      );
      if (idx > -1) {
        const next = [...prev];
        next[idx] = { ...next[idx], quantity: next[idx].quantity + quantity };
        return next;
      }
      return [...prev, { product, quantity, selectedSize: chosenSize, selectedColor: chosenColor }];
    });

    showToast(`Added "${product.name.slice(0, 32)}..." to Cart!`, 'cart');

    try {
      const res = await fetch('/api/cart', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          product,
          quantity,
          selectedSize: chosenSize,
          selectedColor: chosenColor,
        }),
      });
      const data = await res.json();
      if (data.items) {
        setCartItems(data.items);
      }
    } catch (err) {
      console.warn('Server cart sync issue:', err);
    }
  };

  const updateQuantity = async (productId: string, quantity: number, size?: string, color?: string) => {
    if (quantity <= 0) {
      await removeFromCart(productId, size, color);
      return;
    }

    setCartItems((prev) =>
      prev.map((it) => {
        if (it.product.id === productId && it.selectedSize === size && it.selectedColor === color) {
          return { ...it, quantity };
        }
        return it;
      })
    );

    try {
      const res = await fetch('/api/cart', {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({ productId, quantity, selectedSize: size, selectedColor: color }),
      });
      const data = await res.json();
      if (data.items) {
        setCartItems(data.items);
      }
    } catch (err) {
      console.warn('Server cart update issue:', err);
    }
  };

  const removeFromCart = async (productId: string, size?: string, color?: string) => {
    setCartItems((prev) =>
      prev.filter((it) => !(it.product.id === productId && it.selectedSize === size && it.selectedColor === color))
    );
    showToast('Item removed from cart', 'info');

    try {
      const res = await fetch('/api/cart/item', {
        method: 'DELETE',
        headers: getAuthHeaders(),
        body: JSON.stringify({ productId, selectedSize: size, selectedColor: color }),
      });
      const data = await res.json();
      if (data.items) {
        setCartItems(data.items);
      }
    } catch (err) {
      console.warn('Server cart item delete issue:', err);
    }
  };

  const clearCart = async () => {
    setCartItems([]);
    setAppliedCoupon(null);
    try {
      await fetch('/api/cart', {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });
    } catch (err) {
      console.warn('Server clear cart issue:', err);
    }
  };

  // Cart Calculations
  const cartTotalCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  const cartSubtotal = cartItems.reduce(
    (acc, item) => acc + item.product.price * item.quantity,
    0
  );

  const cartMrpTotal = cartItems.reduce(
    (acc, item) => acc + item.product.originalPrice * item.quantity,
    0
  );

  const cartProductSavings = Math.max(0, cartMrpTotal - cartSubtotal);

  // Delivery fee: FREE if subtotal > ₹499, else ₹40 standard Indian delivery fee
  const deliveryFee = cartSubtotal >= 499 || cartSubtotal === 0 ? 0 : 40;

  const couponDiscount = appliedCoupon ? appliedCoupon.discountAmount : 0;
  const cartGrandTotal = Math.max(0, cartSubtotal + deliveryFee - couponDiscount);

  const applyCoupon = (code: string) => {
    const trimmed = code.trim().toUpperCase();
    if (cartSubtotal < 299) {
      return { success: false, message: 'Minimum order value of ₹299 required for coupons.' };
    }
    if (trimmed === 'VEYRA100' || trimmed === 'FIRST100') {
      const discount = Math.min(100, Math.floor(cartSubtotal * 0.15));
      setAppliedCoupon({ code: trimmed, discountAmount: discount });
      showToast(`Coupon ${trimmed} applied! Saved ₹${discount}`, 'success');
      return { success: true, message: `Awesome! You saved ₹${discount}` };
    }
    if (trimmed === 'SUPER50') {
      const discount = 50;
      setAppliedCoupon({ code: trimmed, discountAmount: discount });
      showToast(`Coupon SUPER50 applied! Saved ₹50`, 'success');
      return { success: true, message: 'Super! You saved ₹50' };
    }
    if (trimmed === 'FREEDEL') {
      setAppliedCoupon({ code: trimmed, discountAmount: deliveryFee });
      showToast('Free delivery coupon applied!', 'success');
      return { success: true, message: 'Free delivery applied on this order!' };
    }
    return { success: false, message: 'Invalid coupon code. Try "VEYRA100" or "SUPER50"' };
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    showToast('Coupon removed', 'info');
  };

  // Wishlist operations with server synchronization
  const toggleWishlist = async (product: Product) => {
    const exists = wishlist.some((p) => p.id === product.id);

    // Optimistic UI update
    setWishlist((prev) => (exists ? prev.filter((p) => p.id !== product.id) : [...prev, product]));
    showToast(exists ? 'Removed from Wishlist' : 'Added to your Wishlist ❤️', exists ? 'info' : 'success');

    try {
      const res = await fetch('/api/wishlist/toggle', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ productId: product.id }),
      });
      const data = await res.json();
      if (data.items) {
        setWishlist(data.items);
      }
    } catch (err) {
      console.warn('Server wishlist toggle issue:', err);
    }
  };

  const isInWishlist = (productId: string) => {
    return wishlist.some((p) => p.id === productId);
  };

  // Addresses
  const addAddress = async (addr: Omit<Address, 'id'>) => {
    const newAddr: Address = {
      ...addr,
      id: `addr-${Date.now()}`,
    };
    const nextAddrs = addr.isDefault
      ? currentUser.savedAddresses.map((a) => ({ ...a, isDefault: false })).concat(newAddr)
      : [...currentUser.savedAddresses, newAddr];

    setCurrentUser((prev) => ({ ...prev, savedAddresses: nextAddrs }));
    showToast('Address added successfully!', 'success');

    try {
      await fetch('/api/auth/profile', {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({ savedAddresses: nextAddrs }),
      });
    } catch (err) {
      console.warn('Profile address sync issue:', err);
    }
  };

  const removeAddress = async (id: string) => {
    const nextAddrs = currentUser.savedAddresses.filter((a) => a.id !== id);
    setCurrentUser((prev) => ({ ...prev, savedAddresses: nextAddrs }));
    showToast('Address removed', 'info');

    try {
      await fetch('/api/auth/profile', {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({ savedAddresses: nextAddrs }),
      });
    } catch (err) {
      console.warn('Profile address sync issue:', err);
    }
  };

  const setDefaultAddress = async (id: string) => {
    const nextAddrs = currentUser.savedAddresses.map((a) => ({
      ...a,
      isDefault: a.id === id,
    }));
    setCurrentUser((prev) => ({ ...prev, savedAddresses: nextAddrs }));
    showToast('Default delivery address updated', 'success');

    try {
      await fetch('/api/auth/profile', {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({ savedAddresses: nextAddrs }),
      });
    } catch (err) {
      console.warn('Profile address sync issue:', err);
    }
  };

  // Auth Operations
  const loginUser = async (email: string, password = 'Veyra@2026') => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        showToast(data.error || 'Failed to login', 'info');
        return { success: false, message: data.error };
      }
      setAuthToken(data.token);
      localStorage.setItem('veyramart_token', data.token);
      setCurrentUser(data.user);
      showToast(`Welcome back, ${data.user.name}!`, 'success');
      return { success: true };
    } catch {
      showToast('Network error logging in', 'info');
      return { success: false, message: 'Network error' };
    }
  };

  const registerUser = async (name: string, email: string, password: string, phone = '+91 98765 00000') => {
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, phone }),
      });
      const data = await res.json();
      if (!res.ok) {
        showToast(data.error || 'Registration failed', 'info');
        return { success: false, message: data.error };
      }
      setAuthToken(data.token);
      localStorage.setItem('veyramart_token', data.token);
      setCurrentUser(data.user);
      showToast(`Account created for ${data.user.name}!`, 'success');
      return { success: true };
    } catch {
      showToast('Network error registering', 'info');
      return { success: false, message: 'Network error' };
    }
  };

  const logoutUser = async () => {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        headers: getAuthHeaders(),
      });
    } catch {}
    setAuthToken(null);
    localStorage.removeItem('veyramart_token');
    showToast('Logged out successfully', 'info');
  };

  const updateProfile = async (updates: { name?: string; phone?: string }) => {
    setCurrentUser((prev) => ({ ...prev, ...updates }));
    try {
      await fetch('/api/auth/profile', {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(updates),
      });
      showToast('Profile updated successfully!', 'success');
    } catch {
      showToast('Profile updated locally', 'info');
    }
  };

  const updateDeliveryLocation = (city: string, pincode: string) => {
    setDeliveryLocation({ city, pincode });
    showToast(`Delivering to ${city} (${pincode})`, 'info');
  };

  // Filter Logic
  const resetFilters = () => {
    setSearchQuery('');
    setSelectedDepartment('all');
    setSelectedSubcategory(null);
    setActiveSort('popularity');
    setPriceRange([0, 15000]);
    setSelectedBrands([]);
    setMinRating(0);
    setInStockOnly(false);
  };

  const toggleBrand = (brand: string) => {
    setSelectedBrands((prev) =>
      prev.includes(brand) ? prev.filter((b) => b !== brand) : [...prev, brand]
    );
  };

  // Compute filtered products
  const filteredProducts = allProducts.filter((product) => {
    if (selectedDepartment !== 'all' && product.department !== selectedDepartment) {
      return false;
    }

    if (selectedSubcategory && product.subcategory !== selectedSubcategory) {
      return false;
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const matchName = product.name.toLowerCase().includes(q);
      const matchBrand = product.brand.toLowerCase().includes(q);
      const matchCat = product.category.toLowerCase().includes(q);
      const matchSub = product.subcategory.toLowerCase().includes(q);
      const matchDesc = product.description.toLowerCase().includes(q);
      if (!matchName && !matchBrand && !matchCat && !matchSub && !matchDesc) {
        return false;
      }
    }

    if (product.price < priceRange[0] || product.price > priceRange[1]) {
      return false;
    }

    if (selectedBrands.length > 0 && !selectedBrands.includes(product.brand)) {
      return false;
    }

    if (minRating > 0 && product.rating < minRating) {
      return false;
    }

    if (inStockOnly && product.stock <= 0) {
      return false;
    }

    return true;
  }).sort((a, b) => {
    switch (activeSort) {
      case 'price_asc':
        return a.price - b.price;
      case 'price_desc':
        return b.price - a.price;
      case 'rating':
        return b.rating - a.rating;
      case 'discount':
        return b.discount - a.discount;
      case 'newest':
        return b.id.localeCompare(a.id);
      case 'popularity':
      default:
        return b.reviewsCount - a.reviewsCount;
    }
  });

  // Place Order through server API
  const placeOrder = async (
    shippingAddress: Address,
    paymentMethod: 'UPI' | 'Card' | 'Net Banking' | 'Cash on Delivery'
  ): Promise<Order> => {
    const orderItems = cartItems.map((item) => ({
      productId: item.product.id,
      name: item.product.name,
      brand: item.product.brand,
      image: item.product.image,
      price: item.product.price,
      originalPrice: item.product.originalPrice,
      quantity: item.quantity,
      selectedSize: item.selectedSize,
      selectedColor: item.selectedColor,
    }));

    const payload = {
      items: orderItems,
      shippingAddress,
      paymentMethod,
      subtotal: cartSubtotal,
      discount: couponDiscount,
      deliveryFee,
      totalAmount: cartGrandTotal,
    };

    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      const placed: Order = data.order;

      setOrders((prev) => [placed, ...prev]);
      setLatestPlacedOrder(placed);
      setCartItems([]);
      setAppliedCoupon(null);
      setCurrentView('order-success');
      return placed;
    } catch (err) {
      console.error('Order placement error:', err);
      throw err;
    }
  };

  return (
    <ShopContext.Provider
      value={{
        currentView,
        setCurrentView,
        selectedProduct,
        openProductDetail,
        closeProductDetail,
        selectedOrderForModal,
        openOrderDetail,
        closeOrderDetail,
        latestPlacedOrder,

        searchQuery,
        setSearchQuery,
        selectedDepartment,
        setSelectedDepartment,
        selectedSubcategory,
        setSelectedSubcategory,
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
        filteredProducts,

        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartTotalCount,
        cartSubtotal,
        cartDiscount: cartProductSavings + couponDiscount,
        deliveryFee,
        cartGrandTotal,
        appliedCoupon,
        applyCoupon,
        removeCoupon,

        wishlist,
        toggleWishlist,
        isInWishlist,

        currentUser,
        authToken,
        loginUser,
        registerUser,
        logoutUser,
        updateProfile,
        deliveryLocation,
        updateDeliveryLocation,
        savedAddresses: currentUser.savedAddresses,
        addAddress,
        removeAddress,
        setDefaultAddress,

        orders,
        placeOrder,

        toast,
        showToast,
        hideToast,
      }}
    >
      {children}
    </ShopContext.Provider>
  );
};

export const useShop = () => {
  const context = useContext(ShopContext);
  if (!context) {
    throw new Error('useShop must be used within a ShopProvider');
  }
  return context;
};
