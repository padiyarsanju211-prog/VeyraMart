import express, { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import { config } from './config.ts';
import { ProductModel } from './models/Product.ts';
import { UserModel, IUserDocument } from './models/User.ts';
import { OrderModel } from './models/Order.ts';
import { authenticateToken, optionalAuth, AuthRequest } from './middleware/auth.ts';
import { Order, OrderStatus } from '../types/index.ts';

export const apiRouter = express.Router();
apiRouter.use(express.json());

// Helper to get or fallback to default user for guest/browsing actions
async function resolveUser(req: AuthRequest): Promise<IUserDocument | null> {
  if (req.user) return req.user;
  // Fallback to default demo user if unauthenticated
  const defaultUser = await UserModel.findOne({ email: 'padiyarsanju211@gmail.com' });
  return defaultUser;
}

// ==========================================
// 1. HEALTH ENDPOINT
// ==========================================
apiRouter.get('/health', async (_req: Request, res: Response) => {
  try {
    const productsCount = await ProductModel.countDocuments();
    const usersCount = await UserModel.countDocuments();
    const ordersCount = await OrderModel.countDocuments();
    const dbState = mongoose.connection.readyState;
    const dbStatus = ['disconnected', 'connected', 'connecting', 'disconnecting'][dbState] || 'unknown';

    res.json({
      status: 'ok',
      store: 'VeyraMart',
      database: 'MongoDB (Mongoose)',
      dbStatus,
      currency: 'INR',
      productsCount,
      usersCount,
      ordersCount,
      timestamp: new Date().toISOString(),
    });
  } catch (err: any) {
    res.status(500).json({ error: 'Health check failed', details: err.message });
  }
});

// ==========================================
// 2. PRODUCT API
// ==========================================
apiRouter.get('/products', async (req: Request, res: Response) => {
  try {
    const { department, category, subcategory, search, sort, minPrice, maxPrice, brand } = req.query;

    const filter: any = {};

    if (department && department !== 'all') {
      filter.department = department;
    }

    if (category) {
      filter.category = new RegExp(`^${category}$`, 'i');
    }

    if (subcategory) {
      filter.subcategory = new RegExp(`^${subcategory}$`, 'i');
    }

    if (brand) {
      const brandsList = (brand as string).split(',').map((b) => b.trim());
      filter.brand = { $in: brandsList.map((b) => new RegExp(`^${b}$`, 'i')) };
    }

    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    if (search) {
      const q = (search as string).trim();
      const regex = new RegExp(q, 'i');
      filter.$or = [
        { name: regex },
        { brand: regex },
        { category: regex },
        { subcategory: regex },
        { description: regex },
      ];
    }

    let query = ProductModel.find(filter);

    if (sort) {
      switch (sort) {
        case 'price_asc':
          query = query.sort({ price: 1 });
          break;
        case 'price_desc':
          query = query.sort({ price: -1 });
          break;
        case 'rating':
          query = query.sort({ rating: -1 });
          break;
        case 'discount':
          query = query.sort({ discount: -1 });
          break;
        case 'newest':
          query = query.sort({ createdAt: -1, id: -1 });
          break;
        case 'popularity':
        default:
          query = query.sort({ reviewsCount: -1 });
          break;
      }
    } else {
      query = query.sort({ reviewsCount: -1 });
    }

    const results = await query.exec();

    res.json({
      total: results.length,
      products: results,
    });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to fetch products', details: err.message });
  }
});

apiRouter.get('/products/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    let product = await ProductModel.findOne({ id }).exec();

    if (!product && mongoose.isValidObjectId(id)) {
      product = await ProductModel.findById(id).exec();
    }

    if (!product) {
      res.status(404).json({ error: 'Product not found' });
      return;
    }

    const productObj = product.toObject();
    res.json({ product: productObj, ...productObj });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to fetch product details', details: err.message });
  }
});

// ==========================================
// 3. AUTHENTICATION API
// ==========================================
apiRouter.post('/auth/register', async (req: Request, res: Response) => {
  try {
    const { name, email, password, phone } = req.body;

    if (!name || !email || !password) {
      res.status(400).json({ error: 'Name, email, and password are required' });
      return;
    }

    if (password.length < 6) {
      res.status(400).json({ error: 'Password must be at least 6 characters' });
      return;
    }

    const existingUser = await UserModel.findOne({ email: email.toLowerCase().trim() });
    if (existingUser) {
      res.status(409).json({ error: 'User with this email already exists' });
      return;
    }

    const newUser = new UserModel({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password, // Password hashed automatically by UserSchema pre-save hook
      phone: phone || '+91 98765 00000',
      role: 'customer',
      savedAddresses: [],
      cart: [],
      wishlist: [],
    });

    await newUser.save();

    const token = jwt.sign(
      { userId: newUser._id.toString(), email: newUser.email },
      config.JWT_SECRET,
      { expiresIn: '30d' }
    );

    res.status(201).json({
      message: 'Account registered successfully',
      token,
      user: {
        id: newUser._id.toString(),
        name: newUser.name,
        email: newUser.email,
        phone: newUser.phone,
        role: newUser.role,
        savedAddresses: newUser.savedAddresses,
      },
    });
  } catch (err: any) {
    res.status(500).json({ error: 'Registration failed', details: err.message });
  }
});

apiRouter.post('/auth/login', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ error: 'Email and password are required' });
      return;
    }

    const user = await UserModel.findOne({ email: email.toLowerCase().trim() });
    if (!user) {
      res.status(401).json({ error: 'Invalid email or password' });
      return;
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      res.status(401).json({ error: 'Invalid email or password' });
      return;
    }

    const token = jwt.sign(
      { userId: user._id.toString(), email: user.email },
      config.JWT_SECRET,
      { expiresIn: '30d' }
    );

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        savedAddresses: user.savedAddresses,
      },
    });
  } catch (err: any) {
    res.status(500).json({ error: 'Login failed', details: err.message });
  }
});

apiRouter.post('/auth/logout', (_req: Request, res: Response) => {
  res.json({ message: 'Logged out successfully' });
});

apiRouter.get('/auth/me', authenticateToken, (req: AuthRequest, res: Response) => {
  const user = req.user!;
  res.json({
    user: {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      savedAddresses: user.savedAddresses,
    },
  });
});

apiRouter.put('/auth/profile', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const user = req.user!;
    const { name, phone, savedAddresses } = req.body;

    if (name) user.name = name;
    if (phone) user.phone = phone;
    if (savedAddresses) user.savedAddresses = savedAddresses;

    await user.save();

    res.json({
      message: 'Profile updated successfully',
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        savedAddresses: user.savedAddresses,
      },
    });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to update profile', details: err.message });
  }
});

// ==========================================
// 4. CART API
// ==========================================
apiRouter.get('/cart', optionalAuth, async (req: AuthRequest, res: Response) => {
  try {
    const user = await resolveUser(req);
    const cart = user ? user.cart : [];
    res.json({
      totalItems: cart.reduce((sum, it) => sum + it.quantity, 0),
      items: cart,
    });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to load cart', details: err.message });
  }
});

apiRouter.post('/cart', optionalAuth, async (req: AuthRequest, res: Response) => {
  try {
    const user = await resolveUser(req);
    if (!user) {
      res.status(404).json({ error: 'User session not found' });
      return;
    }

    const { product, quantity = 1, selectedSize, selectedColor } = req.body;
    if (!product || !product.id) {
      res.status(400).json({ error: 'Valid product required' });
      return;
    }

    const existingIdx = user.cart.findIndex(
      (it) =>
        it.product.id === product.id &&
        it.selectedSize === selectedSize &&
        it.selectedColor === selectedColor
    );

    if (existingIdx > -1) {
      user.cart[existingIdx].quantity += quantity;
    } else {
      user.cart.push({
        product,
        quantity,
        selectedSize,
        selectedColor,
      });
    }

    await user.save();

    res.json({
      message: 'Cart updated',
      totalItems: user.cart.reduce((sum, it) => sum + it.quantity, 0),
      items: user.cart,
    });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to add item to cart', details: err.message });
  }
});

apiRouter.put('/cart', optionalAuth, async (req: AuthRequest, res: Response) => {
  try {
    const user = await resolveUser(req);
    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    const { productId, quantity, selectedSize, selectedColor } = req.body;

    if (quantity <= 0) {
      user.cart = user.cart.filter(
        (it) =>
          !(it.product.id === productId && it.selectedSize === selectedSize && it.selectedColor === selectedColor)
      );
    } else {
      const item = user.cart.find(
        (it) =>
          it.product.id === productId && it.selectedSize === selectedSize && it.selectedColor === selectedColor
      );
      if (item) {
        item.quantity = quantity;
      }
    }

    await user.save();

    res.json({
      message: 'Cart quantity updated',
      totalItems: user.cart.reduce((sum, it) => sum + it.quantity, 0),
      items: user.cart,
    });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to update cart quantity', details: err.message });
  }
});

apiRouter.delete('/cart/item', optionalAuth, async (req: AuthRequest, res: Response) => {
  try {
    const user = await resolveUser(req);
    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    const { productId, selectedSize, selectedColor } = req.body;

    user.cart = user.cart.filter(
      (it) =>
        !(it.product.id === productId && it.selectedSize === selectedSize && it.selectedColor === selectedColor)
    );

    await user.save();

    res.json({
      message: 'Item removed from cart',
      totalItems: user.cart.reduce((sum, it) => sum + it.quantity, 0),
      items: user.cart,
    });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to delete cart item', details: err.message });
  }
});

apiRouter.delete('/cart', optionalAuth, async (req: AuthRequest, res: Response) => {
  try {
    const user = await resolveUser(req);
    if (user) {
      user.cart = [];
      await user.save();
    }
    res.json({ message: 'Cart cleared', items: [] });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to clear cart', details: err.message });
  }
});

// ==========================================
// 5. WISHLIST API
// ==========================================
apiRouter.get('/wishlist', optionalAuth, async (req: AuthRequest, res: Response) => {
  try {
    const user = await resolveUser(req);
    const wishlistIds = user ? user.wishlist : [];

    const products = await ProductModel.find({ id: { $in: wishlistIds } }).exec();

    res.json({
      total: products.length,
      items: products,
    });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to load wishlist', details: err.message });
  }
});

apiRouter.post('/wishlist/toggle', optionalAuth, async (req: AuthRequest, res: Response) => {
  try {
    const user = await resolveUser(req);
    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    const { productId } = req.body;
    if (!productId) {
      res.status(400).json({ error: 'productId required' });
      return;
    }

    const idx = user.wishlist.indexOf(productId);
    let added = false;

    if (idx > -1) {
      user.wishlist.splice(idx, 1);
    } else {
      user.wishlist.push(productId);
      added = true;
    }

    await user.save();

    const updatedProducts = await ProductModel.find({ id: { $in: user.wishlist } }).exec();

    res.json({
      added,
      message: added ? 'Added to wishlist' : 'Removed from wishlist',
      total: updatedProducts.length,
      items: updatedProducts,
    });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to toggle wishlist', details: err.message });
  }
});

// ==========================================
// 6. ORDERS API
// ==========================================
apiRouter.get('/orders', optionalAuth, async (req: AuthRequest, res: Response) => {
  try {
    const user = await resolveUser(req);
    const userId = user ? user._id.toString() : 'usr-1';

    // Fetch user orders, or fallback to all demo orders if initial user
    let orders = await OrderModel.find({ userId }).sort({ createdAt: -1 }).exec();
    if (orders.length === 0) {
      orders = await OrderModel.find().sort({ createdAt: -1 }).limit(10).exec();
    }

    res.json({
      total: orders.length,
      orders,
    });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to load orders', details: err.message });
  }
});

apiRouter.get('/orders/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    let order = await OrderModel.findOne({ $or: [{ id }, { orderNumber: id }] }).exec();

    if (!order && mongoose.isValidObjectId(id)) {
      order = await OrderModel.findById(id).exec();
    }

    if (!order) {
      res.status(404).json({ error: 'Order not found' });
      return;
    }

    const orderObj = order.toObject();
    res.json({ order: orderObj, ...orderObj });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to fetch order details', details: err.message });
  }
});

apiRouter.post('/orders', optionalAuth, async (req: AuthRequest, res: Response) => {
  try {
    const user = await resolveUser(req);
    const userId = user ? user._id.toString() : 'usr-1';
    const { items, shippingAddress, paymentMethod, subtotal, discount, deliveryFee, totalAmount } = req.body;

    if (!items || !items.length || !shippingAddress || !paymentMethod) {
      res.status(400).json({ error: 'Invalid order payload' });
      return;
    }

    const orderNum = `VM-${Math.floor(100000 + Math.random() * 900000)}`;
    const estDate = new Date();
    estDate.setDate(estDate.getDate() + 3);
    const formattedEst = estDate.toLocaleDateString('en-IN', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
    });

    const now = new Date();
    const timeStr = now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });

    const newOrderData = {
      id: `ord-${Date.now()}`,
      orderNumber: orderNum,
      userId,
      items,
      shippingAddress,
      paymentMethod,
      subtotal: subtotal || totalAmount,
      discount: discount || 0,
      deliveryFee: deliveryFee || 0,
      totalAmount,
      status: 'Order Placed' as OrderStatus,
      estimatedDelivery: `Expected by ${formattedEst}, 8:00 PM`,
      trackingTimeline: [
        {
          status: 'Order Placed' as OrderStatus,
          timestamp: `Today, ${timeStr}`,
          completed: true,
          description: 'Order placed & payment verified',
        },
        {
          status: 'Confirmed' as OrderStatus,
          timestamp: 'Estimated within 1 hour',
          completed: false,
          description: 'Seller confirmation in progress',
        },
        {
          status: 'Packed' as OrderStatus,
          timestamp: 'Pending',
          completed: false,
          description: 'Item will be packed at fulfillment hub',
        },
        {
          status: 'Shipped' as OrderStatus,
          timestamp: 'Pending',
          completed: false,
          description: 'Courier assignment pending',
        },
        {
          status: 'Out for Delivery' as OrderStatus,
          timestamp: 'Pending',
          completed: false,
          description: 'Delivery executive on route',
        },
        {
          status: 'Delivered' as OrderStatus,
          timestamp: 'Pending',
          completed: false,
          description: 'Delivery confirmation via OTP',
        },
      ],
    };

    const createdOrder = await OrderModel.create(newOrderData);

    // Decrement stock for ordered items
    for (const item of items) {
      await ProductModel.updateOne(
        { id: item.productId, stock: { $gt: 0 } },
        { $inc: { stock: -item.quantity } }
      ).exec();
    }

    // Clear cart for user
    if (user) {
      user.cart = [];
      await user.save();
    }

    res.status(201).json({
      message: 'Order placed successfully',
      order: createdOrder,
    });
  } catch (err: any) {
    res.status(500).json({ error: 'Order creation failed', details: err.message });
  }
});
