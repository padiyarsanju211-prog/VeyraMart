import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config.ts';
import { UserModel, IUserDocument } from '../models/User.ts';

export interface AuthRequest extends Request {
  user?: IUserDocument | null;
}

export async function authenticateToken(
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Access token missing or invalid format' });
    return;
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, config.JWT_SECRET) as { userId: string; email: string };
    const user = await UserModel.findById(decoded.userId).select('-password');
    if (!user) {
      res.status(401).json({ error: 'User associated with token no longer exists' });
      return;
    }
    req.user = user;
    next();
  } catch (err: any) {
    res.status(401).json({ error: 'Invalid or expired token', details: err.message });
  }
}

export async function optionalAuth(
  req: AuthRequest,
  _res: Response,
  next: NextFunction
): Promise<void> {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    req.user = null;
    return next();
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, config.JWT_SECRET) as { userId: string; email: string };
    const user = await UserModel.findById(decoded.userId).select('-password');
    req.user = user || null;
  } catch {
    req.user = null;
  }
  next();
}
