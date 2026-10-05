import dotenv from 'dotenv';

dotenv.config();

export const config = {
  PORT: process.env.PORT ? parseInt(process.env.PORT, 10) : 3000,
  MONGODB_URI: process.env.MONGODB_URI || '',
  JWT_SECRET: process.env.JWT_SECRET || 'veyramart_jwt_secret_key_2026_super_secure',
  NODE_ENV: process.env.NODE_ENV || 'development',
};
