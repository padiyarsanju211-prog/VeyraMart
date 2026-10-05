import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { config } from './config.ts';
import { ProductModel } from './models/Product.ts';
import { UserModel } from './models/User.ts';
import { OrderModel } from './models/Order.ts';
import { SAMPLE_PRODUCTS } from '../data/products.ts';
import { Address, Order } from '../types/index.ts';

let mongoMemoryServer: MongoMemoryServer | null = null;
let isConnected = false;

const initialAddresses: Address[] = [
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
];

const initialOrders: Partial<Order>[] = [
  {
    id: 'ord-101',
    orderNumber: 'VM-892401',
    userId: 'usr-1',
    createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    items: [
      {
        productId: 'groc-1',
        name: 'India Gate Classic Basmati Rice (Aged Long Grain)',
        brand: 'India Gate',
        image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=600&q=80',
        price: 849,
        originalPrice: 1199,
        quantity: 1,
        selectedSize: '5 kg',
      },
      {
        productId: 'groc-6',
        name: 'Tata Tea Gold Royal Rich Assam CTC & Long Leaves',
        brand: 'Tata Tea',
        image: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=600&q=80',
        price: 499,
        originalPrice: 620,
        quantity: 1,
        selectedSize: '1 kg',
      },
    ],
    shippingAddress: initialAddresses[0],
    paymentMethod: 'UPI',
    subtotal: 1348,
    discount: 100,
    deliveryFee: 0,
    totalAmount: 1248,
    status: 'Delivered',
    estimatedDelivery: 'Delivered on Oct 28, 2026',
    trackingTimeline: [
      { status: 'Order Placed', timestamp: 'Oct 26, 10:30 AM', completed: true, description: 'Order confirmed and verified' },
      { status: 'Confirmed', timestamp: 'Oct 26, 11:15 AM', completed: true, description: 'Seller approved the order' },
      { status: 'Packed', timestamp: 'Oct 26, 04:00 PM', completed: true, description: 'Package inspected and boxed' },
      { status: 'Shipped', timestamp: 'Oct 27, 08:30 AM', completed: true, description: 'Dispatched via BlueDart Express' },
      { status: 'Out for Delivery', timestamp: 'Oct 28, 09:00 AM', completed: true, description: 'With delivery agent Ramesh' },
      { status: 'Delivered', timestamp: 'Oct 28, 02:45 PM', completed: true, description: 'Delivered to recipient with OTP' },
    ],
  },
  {
    id: 'ord-102',
    orderNumber: 'VM-901452',
    userId: 'usr-1',
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    items: [
      {
        productId: 'mob-1',
        name: 'boAt Airdopes 141 ANC Bluetooth Wireless Earbuds (42H Playback)',
        brand: 'boAt',
        image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=600&q=80',
        price: 1299,
        originalPrice: 4490,
        quantity: 1,
        selectedColor: 'Bold Black',
      },
    ],
    shippingAddress: initialAddresses[0],
    paymentMethod: 'Cash on Delivery',
    subtotal: 1299,
    discount: 0,
    deliveryFee: 0,
    totalAmount: 1299,
    status: 'Shipped',
    estimatedDelivery: 'Arriving Tomorrow, 8:00 PM',
    trackingTimeline: [
      { status: 'Order Placed', timestamp: 'Yesterday, 02:20 PM', completed: true, description: 'Order placed via COD' },
      { status: 'Confirmed', timestamp: 'Yesterday, 03:00 PM', completed: true, description: 'Seller confirmed packaging' },
      { status: 'Packed', timestamp: 'Yesterday, 07:45 PM', completed: true, description: 'Sealed with tamper-evident tape' },
      { status: 'Shipped', timestamp: 'Today, 06:15 AM', completed: true, description: 'In transit from Bengaluru Hub' },
      { status: 'Out for Delivery', timestamp: 'Pending', completed: false, description: 'Courier will arrive soon' },
      { status: 'Delivered', timestamp: 'Pending', completed: false, description: 'Pending receipt' },
    ],
  },
];

export async function connectDatabase(): Promise<typeof mongoose> {
  if (isConnected && mongoose.connection.readyState === 1) {
    return mongoose;
  }

  const configuredUri = config.MONGODB_URI?.trim();

  // 1. Attempt connection to configured external MONGODB_URI if available
  if (configuredUri) {
    try {
      console.log(`Connecting to configured MONGODB_URI...`);
      await mongoose.connect(configuredUri, {
        serverSelectionTimeoutMS: 4000,
      });
      isConnected = true;
      console.log(`Connected successfully to remote MongoDB database!`);
      await seedDatabase();
      return mongoose;
    } catch (remoteErr: any) {
      console.warn(`Remote MongoDB connection notice (${remoteErr.message}). Gracefully switching to dedicated local MongoDB instance...`);
      try {
        await mongoose.disconnect();
      } catch {}
      isConnected = false;
    }
  }

  // 2. Fallback to in-memory MongoDB instance
  try {
    if (!mongoMemoryServer) {
      console.log('Starting dedicated in-memory MongoDB server...');
      mongoMemoryServer = await MongoMemoryServer.create();
    }
    const memoryUri = mongoMemoryServer.getUri();
    await mongoose.connect(memoryUri);
    isConnected = true;
    console.log(`VeyraMart MongoDB active at ${memoryUri}`);
    await seedDatabase();
    return mongoose;
  } catch (memErr: any) {
    console.warn(`In-memory MongoDB notice: ${memErr.message}. Attempting connection to 127.0.0.1:27017...`);
    try {
      await mongoose.disconnect();
      await mongoose.connect('mongodb://127.0.0.1:27017/veyramart', { serverSelectionTimeoutMS: 2000 });
      isConnected = true;
      console.log(`Connected to local MongoDB daemon.`);
      await seedDatabase();
      return mongoose;
    } catch (localErr: any) {
      console.warn('Local MongoDB fallback notice:', localErr.message);
    }
  }

  return mongoose;
}

export async function seedDatabase(): Promise<void> {
  try {
    // 1. Seed Products (127+ authentic Indian catalog items)
    const productCount = await ProductModel.countDocuments();
    if (productCount === 0) {
      console.log(`Seeding MongoDB with ${SAMPLE_PRODUCTS.length} authentic VeyraMart marketplace products...`);
      await ProductModel.insertMany(SAMPLE_PRODUCTS);
      console.log(`Successfully seeded ${SAMPLE_PRODUCTS.length} products into MongoDB!`);
    } else {
      console.log(`MongoDB already populated with ${productCount} products.`);
    }

    // 2. Seed Default User (Sanju Padiyar)
    const existingUser = await UserModel.findOne({ email: 'padiyarsanju211@gmail.com' });
    if (!existingUser) {
      console.log('Seeding default demo user (Sanju Padiyar)...');
      const user = new UserModel({
        name: 'Sanju Padiyar',
        email: 'padiyarsanju211@gmail.com',
        password: 'Veyra@2026', // Will be hashed via pre-save hook
        phone: '+91 98765 43210',
        role: 'customer',
        savedAddresses: initialAddresses,
        cart: [],
        wishlist: ['groc-1', 'mob-1', 'wom-1'],
      });
      await user.save();
      console.log('Default demo user seeded with ID:', user._id);
    }

    // 3. Seed Default Orders
    const orderCount = await OrderModel.countDocuments();
    if (orderCount === 0) {
      console.log('Seeding sample past orders...');
      const user = await UserModel.findOne({ email: 'padiyarsanju211@gmail.com' });
      const ordersToSeed = initialOrders.map((ord) => ({
        ...ord,
        userId: user ? user._id.toString() : 'usr-1',
      }));
      await OrderModel.insertMany(ordersToSeed);
      console.log(`Successfully seeded ${ordersToSeed.length} orders into MongoDB!`);
    }
  } catch (err) {
    console.error('Error seeding MongoDB collections:', err);
  }
}

export async function disconnectDatabase(): Promise<void> {
  if (isConnected) {
    await mongoose.disconnect();
    isConnected = false;
  }
  if (mongoMemoryServer) {
    await mongoMemoryServer.stop();
    mongoMemoryServer = null;
  }
}
