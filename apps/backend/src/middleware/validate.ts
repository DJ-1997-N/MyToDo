import { Request, Response, NextFunction } from 'express';
import { ZodSchema } from 'zod';

// 请求验证中间件（使用 Zod）
export const validate = (schema: ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse(req.body);
      next();
    } catch (error: any) {
      return res.status(400).json({
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Invalid input',
          details: error.errors?.map((e: any) => ({
            field: e.path.join('.'),
            message: e.message
          }))
        }
      });
    }
  };
};
