import mongoose, { Schema, Document } from 'mongoose';
import { ProductReview } from '../../types/index.ts';

export interface IProductDocument extends Document {
  id: string;
  name: string;
  brand: string;
  department: string;
  category: string;
  subcategory: string;
  price: number;
  originalPrice: number;
  discount: number;
  image: string;
  gallery?: string[];
  rating: number;
  reviewsCount: number;
  stock: number;
  sizes?: string[];
  colors?: string[];
  description: string;
  specifications: Record<string, string>;
  reviews?: ProductReview[];
  isFeatured?: boolean;
  isDeal?: boolean;
  isBestSeller?: boolean;
  badge?: string;
  createdAt: Date;
  updatedAt: Date;
}

const ProductReviewSchema = new Schema(
  {
    id: { type: String, required: true },
    userName: { type: String, required: true },
    userCity: { type: String, default: 'India' },
    rating: { type: Number, required: true },
    date: { type: String, required: true },
    title: { type: String, default: '' },
    comment: { type: String, default: '' },
    verifiedPurchase: { type: Boolean, default: true },
  },
  { _id: false }
);

const ProductSchema = new Schema<IProductDocument>(
  {
    id: { type: String, required: true, unique: true, index: true },
    name: { type: String, required: true, index: true },
    brand: { type: String, required: true, index: true },
    department: { type: String, required: true, index: true },
    category: { type: String, required: true, index: true },
    subcategory: { type: String, required: true, index: true },
    price: { type: Number, required: true, index: true },
    originalPrice: { type: Number, required: true },
    discount: { type: Number, default: 0 },
    image: { type: String, required: true },
    gallery: [{ type: String }],
    rating: { type: Number, default: 4.5, index: true },
    reviewsCount: { type: Number, default: 50 },
    stock: { type: Number, default: 25 },
    sizes: [{ type: String }],
    colors: [{ type: String }],
    description: { type: String, default: '' },
    specifications: { type: Schema.Types.Mixed, default: {} },
    reviews: [ProductReviewSchema],
    isFeatured: { type: Boolean, default: false },
    isDeal: { type: Boolean, default: false },
    isBestSeller: { type: Boolean, default: false },
    badge: { type: String },
  },
  {
    timestamps: true,
  }
);

// Search text index for name, brand, category, subcategory, description
ProductSchema.index({
  name: 'text',
  brand: 'text',
  category: 'text',
  subcategory: 'text',
  description: 'text',
});

export const ProductModel = mongoose.models.Product || mongoose.model<IProductDocument>('Product', ProductSchema);
