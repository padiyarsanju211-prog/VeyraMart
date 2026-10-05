export type DepartmentId =
  | 'grocery'
  | 'womens_fashion'
  | 'mens_fashion'
  | 'kids'
  | 'footwear'
  | 'beauty'
  | 'mobiles'
  | 'electronics'
  | 'home_kitchen'
  | 'gym_fitness'
  | 'sports'
  | 'toys_games'
  | 'books_stationery'
  | 'jewellery'
  | 'bags_luggage'
  | 'health_wellness'
  | 'household'
  | 'pet_supplies'
  | 'automotive'
  | 'gifts';

export interface Subcategory {
  id: string;
  name: string;
  departmentId: DepartmentId;
}

export interface Department {
  id: DepartmentId;
  name: string;
  icon: string;
  subcategories: string[];
  bannerText: string;
  tagline: string;
  color: string;
}

export interface ProductReview {
  id: string;
  userName: string;
  userCity: string;
  rating: number;
  date: string;
  title: string;
  comment: string;
  verifiedPurchase: boolean;
}

export interface Product {
  id: string;
  name: string;
  brand: string;
  department: DepartmentId;
  category: string;
  subcategory: string;
  price: number;
  originalPrice: number;
  discount: number; // percentage
  image: string;
  gallery?: string[];
  rating: number;
  reviewsCount: number;
  stock: number;
  sizes?: string[];
  colors?: string[];
  description: string;
  specifications: Record<string, string>;
  isFeatured?: boolean;
  isDeal?: boolean;
  isBestSeller?: boolean;
  badge?: string;
  reviews?: ProductReview[];
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedSize?: string;
  selectedColor?: string;
}

export interface Address {
  id: string;
  name: string;
  phone: string;
  house: string;
  street: string;
  area: string;
  city: string;
  state: string;
  pin: string;
  isDefault: boolean;
  type?: 'Home' | 'Work' | 'Other';
}

export type OrderStatus =
  | 'Order Placed'
  | 'Confirmed'
  | 'Packed'
  | 'Shipped'
  | 'Out for Delivery'
  | 'Delivered';

export interface OrderItem {
  productId: string;
  name: string;
  brand: string;
  image: string;
  price: number;
  originalPrice: number;
  quantity: number;
  selectedSize?: string;
  selectedColor?: string;
}

export interface Order {
  id: string;
  userId?: string;
  orderNumber: string;
  createdAt: string;
  items: OrderItem[];
  shippingAddress: Address;
  paymentMethod: 'UPI' | 'Card' | 'Net Banking' | 'Cash on Delivery';
  subtotal: number;
  discount: number;
  deliveryFee: number;
  totalAmount: number;
  status: OrderStatus;
  estimatedDelivery: string;
  trackingTimeline: {
    status: OrderStatus;
    timestamp: string;
    completed: boolean;
    description: string;
  }[];
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'customer' | 'admin';
  savedAddresses: Address[];
}

export interface FilterOptions {
  searchQuery?: string;
  department?: DepartmentId | 'all';
  subcategory?: string;
  minPrice?: number;
  maxPrice?: number;
  brands?: string[];
  minRating?: number;
  inStockOnly?: boolean;
  sortBy?: 'popularity' | 'price_asc' | 'price_desc' | 'rating' | 'discount' | 'newest';
}
