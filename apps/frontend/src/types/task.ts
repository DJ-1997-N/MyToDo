// 任务状态枚举
export enum TaskStatus {
  PENDING = 'PENDING',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  ARCHIVED = 'ARCHIVED'
}

// 优先级枚举
export enum Priority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  URGENT = 'URGENT'
}

// 分类接口
export interface Category {
  id: string;
  name: string;
  color: string;
  icon?: string;
  userId: string;
  createdAt: string;
}

// 标签接口
export interface Tag {
  id: string;
  name: string;
  color: string;
}

// 子任务接口
export interface Subtask {
  id: string;
  title: string;
  status: TaskStatus;
  completedAt?: string;
}

// 任务接口
export interface Task {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: Priority;
  dueDate?: string;
  completedAt?: string;
  userId: string;
  categoryId?: string;
  category?: Category;
  parentId?: string;
  subtasks: Subtask[];
  tags: Tag[];
  createdAt: string;
  updatedAt: string;
}

// 创建/编辑任务的输入
export interface TaskInput {
  title: string;
  description?: string;
  priority?: Priority;
  dueDate?: string;
  categoryId?: string;
  tags?: string[];
  parentId?: string;
}

// 任务过滤参数
export interface TaskFilter {
  status?: TaskStatus;
  priority?: Priority;
  categoryId?: string;
  search?: string;
  dueBefore?: string;
  page?: number;
  limit?: number;
}

// 分页响应
export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
