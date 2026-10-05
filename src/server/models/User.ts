import mongoose, { Schema, Document } from 'mongoose';
import bcrypt from 'bcryptjs';
import { Address, CartItem } from '../../types/index.ts';

export interface IUserDocument extends Document {
  name: string;
  email: string;
  password: string;
  phone: string;
  role: 'customer' | 'admin';
  savedAddresses: Address[];
  cart: CartItem[];
  wishlist: string[]; // Product IDs
  comparePassword(candidatePassword: string): Promise<boolean>;
  createdAt: Date;
  updatedAt: Date;
}

const AddressSchema = new Schema(
  {
    id: { type: String, required: true },
    name: { type: String, required: true },
    phone: { type: String, required: true },
    house: { type: String, required: true },
    street: { type: String, default: '' },
    area: { type: String, default: '' },
    city: { type: String, required: true },
    state: { type: String, required: true },
    pin: { type: String, required: true },
    isDefault: { type: Boolean, default: false },
    type: { type: String, enum: ['Home', 'Work', 'Other'], default: 'Home' },
  },
  { _id: false }
);

const CartItemSchema = new Schema(
  {
    product: { type: Schema.Types.Mixed, required: true },
    quantity: { type: Number, required: true, default: 1, min: 1 },
    selectedSize: { type: String },
    selectedColor: { type: String },
  },
  { _id: false }
);

const UserSchema = new Schema<IUserDocument>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
    password: { type: String, required: true },
    phone: { type: String, default: '+91 98765 00000' },
    role: { type: String, enum: ['customer', 'admin'], default: 'customer' },
    savedAddresses: [AddressSchema],
    cart: [CartItemSchema],
    wishlist: [{ type: String }],
  },
  {
    timestamps: true,
  }
);

// Pre-save hook to hash password with bcryptjs
UserSchema.pre('save', async function () {
  if (!this.isModified('password')) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Instance method to compare password
UserSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

export const UserModel = mongoose.models.User || mongoose.model<IUserDocument>('User', UserSchema);
