import { PrismaClient } from '@prisma/client';
import { badRequest, notFound } from '../utils/errors';

const prisma = new PrismaClient();

// 获取任务列表（支持过滤和分页）
export const getTasks = async (req: any, res: any) => {
  const userId = req.userId;
  const {
    status,
    priority,
    categoryId,
    search,
    dueBefore,
    page = '1',
    limit = '20'
  } = req.query;
  
  const pageNum = parseInt(page);
  const limitNum = parseInt(limit);
  const skip = (pageNum - 1) * limitNum;
  
  // 构建过滤条件
  const where: any = { userId };
  
  if (status) where.status = status;
  if (priority) where.priority = priority;
  if (categoryId) where.categoryId = categoryId;
  if (search) {
    where.OR = [
      { title: { contains: search, mode: 'insensitive' } },
      { description: { contains: search, mode: 'insensitive' } }
    ];
  }
  if (dueBefore) where.dueDate = { lte: new Date(dueBefore) };
  
  // 查询任务和总数
  const [tasks, total] = await Promise.all([
    prisma.task.findMany({
      where,
      include: {
        category: true,
        tags: {
          include: { tag: true }
        },
        subtasks: {
          select: { id: true, title: true, status: true, completedAt: true }
        }
      },
      orderBy: { createdAt: 'desc' },
      skip,
      take: limitNum
    }),
    prisma.task.count({ where })
  ]);
  
  res.json({
    tasks,
    pagination: {
      page: pageNum,
      limit: limitNum,
      total,
      totalPages: Math.ceil(total / limitNum)
    }
  });
};

// 获取单个任务
export const getTask = async (req: any, res: any) => {
  const userId = req.userId;
  const { id } = req.params;
  
  const task = await prisma.task.findFirst({
    where: { id, userId },
    include: {
      category: true,
      tags: { include: { tag: true } },
      subtasks: true
    }
  });
  
  if (!task) {
    throw notFound('Task not found');
  }
  
  res.json({ task });
};

// 创建任务
export const createTask = async (req: any, res: any) => {
  const userId = req.userId;
  const { title, description, priority, dueDate, categoryId, tags } = req.body;
  
  const task = await prisma.task.create({
    data: {
      title,
      description,
      priority,
      dueDate: dueDate ? new Date(dueDate) : null,
      userId,
      categoryId,
      tags: tags?.length ? {
        create: tags.map((tagName: string) => ({
          tag: {
            connectOrCreate: {
              where: { name: tagName },
              create: { name: tagName }
            }
          }
        }))
      } : undefined
    },
    include: {
      category: true,
      tags: { include: { tag: true } }
    }
  });
  
  res.status(201).json({ task });
};

// 更新任务
export const updateTask = async (req: any, res: any) => {
  const userId = req.userId;
  const { id } = req.params;
  const { title, description, priority, dueDate, status, categoryId, tags } = req.body;
  
  // 检查任务是否存在
  const existingTask = await prisma.task.findFirst({
    where: { id, userId }
  });
  
  if (!existingTask) {
    throw notFound('Task not found');
  }
  
  // 更新任务
  const task = await prisma.task.update({
    where: { id },
    data: {
      ...(title !== undefined && { title }),
      ...(description !== undefined && { description }),
      ...(priority !== undefined && { priority }),
      ...(dueDate !== undefined && { dueDate: dueDate ? new Date(dueDate) : null }),
      ...(status !== undefined && { status, completedAt: status === 'COMPLETED' ? new Date() : null }),
      ...(categoryId !== undefined && { categoryId }),
      ...(tags !== undefined && {
        tags: {
          deleteMany: {},
          create: tags.map((tagName: string) => ({
            tag: {
              connectOrCreate: {
                where: { name: tagName },
                create: { name: tagName }
              }
            }
          }))
        }
      })
    },
    include: {
      category: true,
      tags: { include: { tag: true } },
      subtasks: true
    }
  });
  
  res.json({ task });
};

// 删除任务
export const deleteTask = async (req: any, res: any) => {
  const userId = req.userId;
  const { id } = req.params;
  
  const task = await prisma.task.findFirst({
    where: { id, userId }
  });
  
  if (!task) {
    throw notFound('Task not found');
  }
  
  await prisma.task.delete({ where: { id } });
  
  res.status(204).send();
};

// 更新任务状态
export const updateTaskStatus = async (req: any, res: any) => {
  const userId = req.userId;
  const { id } = req.params;
  const { status } = req.body;
  
  const task = await prisma.task.findFirst({
    where: { id, userId }
  });
  
  if (!task) {
    throw notFound('Task not found');
  }
  
  const updatedTask = await prisma.task.update({
    where: { id },
    data: {
      status,
      completedAt: status === 'COMPLETED' ? new Date() : null
    },
    include: {
      category: true,
      tags: { include: { tag: true } }
    }
  });
  
  res.json({ task: updatedTask });
};

// 完成任务
export const completeTask = async (req: any, res: any) => {
  const userId = req.userId;
  const { id } = req.params;
  
  const task = await prisma.task.findFirst({
    where: { id, userId }
  });
  
  if (!task) {
    throw notFound('Task not found');
  }
  
  const updatedTask = await prisma.task.update({
    where: { id },
    data: {
      status: 'COMPLETED',
      completedAt: new Date()
    },
    include: {
      category: true,
      tags: { include: { tag: true } }
    }
  });
  
  res.json({ task: updatedTask });
};

// 创建子任务
export const createSubtask = async (req: any, res: any) => {
  const userId = req.userId;
  const { parentId } = req.params;
  const { title } = req.body;
  
  // 检查父任务是否存在
  const parentTask = await prisma.task.findFirst({
    where: { id: parentId, userId }
  });
  
  if (!parentTask) {
    throw notFound('Parent task not found');
  }
  
  const subtask = await prisma.task.create({
    data: {
      title,
      userId,
      parentId
    }
  });
  
  res.status(201).json({ task: subtask });
};
