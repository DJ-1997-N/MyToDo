// 自定义错误类
export class AppError extends Error {
  statusCode: number;
  code: string;
  
  constructor(message: string, statusCode: number = 500, code: string = 'INTERNAL_ERROR') {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.name = 'AppError';
  }
}

// 创建 400 错误
export const badRequest = (message: string, code: string = 'BAD_REQUEST'): AppError => {
  return new AppError(message, 400, code);
};

// 创建 401 错误
export const unauthorized = (message: string = 'Unauthorized', code: string = 'UNAUTHORIZED'): AppError => {
  return new AppError(message, 401, code);
};

// 创建 404 错误
export const notFound = (message: string = 'Not found', code: string = 'NOT_FOUND'): AppError => {
  return new AppError(message, 404, code);
};

// 创建 409 错误（冲突）
export const conflict = (message: string, code: string = 'CONFLICT'): AppError => {
  return new AppError(message, 409, code);
};
