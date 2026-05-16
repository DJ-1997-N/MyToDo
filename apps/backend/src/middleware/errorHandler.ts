import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/errors';

// 全局错误处理中间件
export const errorHandler = (
  err: Error | AppError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error('Error:', err);
  
  // 自定义 AppError
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      error: {
        code: err.code,
        message: err.message
      }
    });
  }
  
  // Prisma 错误处理
  if (err.name === 'PrismaClientKnownRequestError') {
    const prismaError = err as any;
    
    // 唯一约束违反
    if (prismaError.code === 'P2002') {
      return res.status(409).json({
        error: {
          code: 'DUPLICATE_ENTRY',
          message: 'A record with this value already exists'
        }
      });
    }
    
    // 外键约束违反
    if (prismaError.code === 'P2003') {
      return res.status(400).json({
        error: {
          code: 'FOREIGN_KEY_CONSTRAINT',
          message: 'Related record not found'
        }
      });
    }
  }
  
  // 默认服务器错误
  return res.status(500).json({
    error: {
      code: 'INTERNAL_ERROR',
      message: process.env.NODE_ENV === 'production' 
        ? 'Internal server error' 
        : err.message
    }
  });
};
