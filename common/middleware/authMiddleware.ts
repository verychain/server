import { Request, Response, NextFunction } from 'express';
import { verifyJWT } from '../utils/jwtUtils';
import { userRepository } from '@/domain/user/repository/userRepository';

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ message: 'Unauthorized: No token provided' });
    return 
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = verifyJWT(token);
    const user = await userRepository.findUserByUsername(decoded.username)
    req.user = user;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Unauthorized: Invalid token' });
    return 
  }
};
