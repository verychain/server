import { Role } from '../../../generated/prisma'; // 또는 @prisma/client 경로에 따라

export interface JWTPayload {
    username: string;
    role: Role;
    exp: number;
    iat?: number;
  }
  
// Express에 req.user 타입 추가
declare global {
    namespace Express {
      interface Request {
        user?: any;
      }
    }
  }
  