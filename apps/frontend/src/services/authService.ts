import api from './api';
import type { RegisterInput, LoginInput, AuthResponse, User } from '@/types/user';

// 用户注册
export const register = async (data: RegisterInput): Promise<AuthResponse> => {
  const response = await api.post<AuthResponse>('/auth/register', data);
  return response.data;
};

// 用户登录
export const login = async (data: LoginInput): Promise<AuthResponse> => {
  const response = await api.post<AuthResponse>('/auth/login', data);
  return response.data;
};

// 获取当前用户信息
export const getCurrentUser = async (): Promise<User> => {
  const response = await api.get<{ user: User }>('/auth/me');
  return response.data.user;
};

// 更新用户信息
export const updateProfile = async (data: Partial<User>): Promise<User> => {
  const response = await api.put<{ user: User }>('/auth/me', data);
  return response.data.user;
};

// 登出（客户端清除 token）
export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};
