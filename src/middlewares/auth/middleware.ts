import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface AuthRequest extends Request {
  user?: any;
}

export const authenticateToken = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.status(401).json({ message: 'Token missing' });

  try {
    const secret = process.env.JWT_SECRET!;
    const user = jwt.verify(token, secret);
    req.user = user;
    next();
  } catch (err) {
    return res.status(403).json({ message: 'Invalid token' });
  }
};
