import mongoose, { Schema, Document } from 'mongoose';
import { Address, OrderItem, OrderStatus } from '../../types/index.ts';

export interface IOrderDocument extends Document {
  id: string;
  orderNumber: string;
  userId?: string;
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
  createdAt: Date;
  updatedAt: Date;
}

const OrderItemSchema = new Schema(
  {
    productId: { type: String, required: true },
    name: { type: String, required: true },
    brand: { type: String, required: true },
    image: { type: String, required: true },
    price: { type: Number, required: true },
    originalPrice: { type: Number, required: true },
    quantity: { type: Number, required: true, default: 1 },
    selectedSize: { type: String },
    selectedColor: { type: String },
  },
  { _id: false }
);

const OrderTrackingSchema = new Schema(
  {
    status: { type: String, required: true },
    timestamp: { type: String, required: true },
    completed: { type: Boolean, default: false },
    description: { type: String, default: '' },
  },
  { _id: false }
);

const OrderSchema = new Schema<IOrderDocument>(
  {
    id: { type: String, required: true, unique: true, index: true },
    orderNumber: { type: String, required: true, unique: true, index: true },
    userId: { type: String, index: true },
    items: [OrderItemSchema],
    shippingAddress: { type: Schema.Types.Mixed, required: true },
    paymentMethod: {
      type: String,
      enum: ['UPI', 'Card', 'Net Banking', 'Cash on Delivery'],
      required: true,
    },
    subtotal: { type: Number, required: true },
    discount: { type: Number, default: 0 },
    deliveryFee: { type: Number, default: 0 },
    totalAmount: { type: Number, required: true },
    status: {
      type: String,
      enum: ['Order Placed', 'Confirmed', 'Packed', 'Shipped', 'Out for Delivery', 'Delivered'],
      default: 'Order Placed',
      index: true,
    },
    estimatedDelivery: { type: String, required: true },
    trackingTimeline: [OrderTrackingSchema],
  },
  {
    timestamps: true,
  }
);

export const OrderModel = mongoose.models.Order || mongoose.model<IOrderDocument>('Order', OrderSchema);
