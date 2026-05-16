import api from './api';
import type { Task, TaskInput, TaskFilter } from '@/types/task';

// 获取任务列表（支持过滤和分页）
export const getTasks = async (filter?: TaskFilter): Promise<{ tasks: Task[]; pagination: any }> => {
  const params = new URLSearchParams();
  
  if (filter) {
    if (filter.status) params.append('status', filter.status);
    if (filter.priority) params.append('priority', filter.priority);
    if (filter.categoryId) params.append('categoryId', filter.categoryId);
    if (filter.search) params.append('search', filter.search);
    if (filter.dueBefore) params.append('dueBefore', filter.dueBefore);
    if (filter.page) params.append('page', filter.page.toString());
    if (filter.limit) params.append('limit', filter.limit.toString());
  }
  
  const response = await api.get<{ tasks: Task[]; pagination: any }>(`/tasks?${params.toString()}`);
  return response.data;
};

// 获取单个任务
export const getTask = async (id: string): Promise<Task> => {
  const response = await api.get<{ task: Task }>(`/tasks/${id}`);
  return response.data.task;
};

// 创建任务
export const createTask = async (data: TaskInput): Promise<Task> => {
  const response = await api.post<{ task: Task }>('/tasks', data);
  return response.data.task;
};

// 更新任务
export const updateTask = async (id: string, data: Partial<TaskInput>): Promise<Task> => {
  const response = await api.put<{ task: Task }>(`/tasks/${id}`, data);
  return response.data.task;
};

// 删除任务
export const deleteTask = async (id: string): Promise<void> => {
  await api.delete(`/tasks/${id}`);
};

// 更新任务状态
export const updateTaskStatus = async (id: string, status: string): Promise<Task> => {
  const response = await api.patch<{ task: Task }>(`/tasks/${id}/status`, { status });
  return response.data.task;
};

// 标记任务完成
export const completeTask = async (id: string): Promise<Task> => {
  const response = await api.patch<{ task: Task }>(`/tasks/${id}/complete`);
  return response.data.task;
};

// 创建子任务
export const createSubtask = async (parentId: string, data: { title: string }): Promise<Task> => {
  const response = await api.post<{ task: Task }>(`/tasks/${parentId}/subtasks`, data);
  return response.data.task;
};
