import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { Role } from '../../generated/prisma';
import { JWTPayload } from '../model/types/type';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET as string;
const EXPIRES_IN = Number(process.env.JWT_EXPIRES_IN) || 60 * 60 * 24;

export const generateJWT = (
  username: string,
  role: Role,
): string => {
  const payload = {
    username,
    role,
    exp: Math.floor(Date.now() / 1000) + EXPIRES_IN,
  };
  const token = jwt.sign(payload, JWT_SECRET);

  return token;
};

export const verifyJWT = (token: string): { username: string; role: Role; exp: number; } => {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JWTPayload;
    return decoded;
  } catch (error) {
    throw new Error('Invalid token');
  }
}

