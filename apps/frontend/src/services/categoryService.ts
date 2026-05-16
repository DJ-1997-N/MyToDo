import api from './api';
import type { Category } from '@/types/task';

// 获取用户的所有分类
export const getCategories = async (): Promise<Category[]> => {
  const response = await api.get<{ categories: Category[] }>('/categories');
  return response.data.categories;
};

// 创建分类
export const createCategory = async (data: { name: string; color?: string; icon?: string }): Promise<Category> => {
  const response = await api.post<{ category: Category }>('/categories', data);
  return response.data.category;
};

// 更新分类
export const updateCategory = async (id: string, data: { name?: string; color?: string; icon?: string }): Promise<Category> => {
  const response = await api.put<{ category: Category }>(`/categories/${id}`, data);
  return response.data.category;
};

// 删除分类
export const deleteCategory = async (id: string): Promise<void> => {
  await api.delete(`/categories/${id}`);
};
