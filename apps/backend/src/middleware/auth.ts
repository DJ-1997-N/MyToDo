import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '@/utils/jwt';

// 扩展 Express Request 类型
declare global {
  namespace Express {
    interface Request {
      userId?: string;
    }
  }
}

// JWT 认证中间件
export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // 从 Authorization header 获取 token
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      error: {
        code: 'UNAUTHORIZED',
        message: 'Authentication required'
      }
    });
  }
  
  const token = authHeader.split(' ')[1];
  const decoded = verifyToken(token);
  
  if (!decoded) {
    return res.status(401).json({
      error: {
        code: 'UNAUTHORIZED',
        message: 'Invalid or expired token'
      }
    });
  }
  
  // 将 userId 添加到请求对象
  req.userId = decoded.userId;
  next();
};
