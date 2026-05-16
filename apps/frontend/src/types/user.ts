// 用户接口
export interface User {
  id: string;
  email: string;
  username: string;
  name?: string;
  avatar?: string;
  createdAt: string;
}

// 注册输入
export interface RegisterInput {
  email: string;
  username: string;
  password: string;
  name?: string;
}

// 登录输入
export interface LoginInput {
  email: string;
  password: string;
}

// 认证响应
export interface AuthResponse {
  user: User;
  token: string;
}
