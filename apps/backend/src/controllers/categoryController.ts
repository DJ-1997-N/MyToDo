import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// 获取用户的所有分类
export const getCategories = async (req: any, res: any) => {
  const userId = req.userId;
  
  const categories = await prisma.category.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' }
  });
  
  res.json({ categories });
};

// 创建分类
export const createCategory = async (req: any, res: any) => {
  const userId = req.userId;
  const { name, color, icon } = req.body;
  
  // 检查同名分类是否已存在
  const existing = await prisma.category.findFirst({
    where: { userId, name }
  });
  
  if (existing) {
    return res.status(409).json({
      error: {
        code: 'DUPLICATE',
        message: 'Category with this name already exists'
      }
    });
  }
  
  const category = await prisma.category.create({
    data: {
      name,
      color: color || '#6c5ce7',
      icon,
      userId
    }
  });
  
  res.status(201).json({ category });
};

// 更新分类
export const updateCategory = async (req: any, res: any) => {
  const userId = req.userId;
  const { id } = req.params;
  const { name, color, icon } = req.body;
  
  // 检查分类是否存在且属于该用户
  const category = await prisma.category.findFirst({
    where: { id, userId }
  });
  
  if (!category) {
    return res.status(404).json({
      error: {
        code: 'NOT_FOUND',
        message: 'Category not found'
      }
    });
  }
  
  // 如果修改名称，检查是否与其他分类重名
  if (name && name !== category.name) {
    const existing = await prisma.category.findFirst({
      where: { userId, name }
    });
    
    if (existing) {
      return res.status(409).json({
        error: {
          code: 'DUPLICATE',
          message: 'Category with this name already exists'
        }
      });
    }
  }
  
  const updated = await prisma.category.update({
    where: { id },
    data: {
      ...(name !== undefined && { name }),
      ...(color !== undefined && { color }),
      ...(icon !== undefined && { icon })
    }
  });
  
  res.json({ category: updated });
};

// 删除分类
export const deleteCategory = async (req: any, res: any) => {
  const userId = req.userId;
  const { id } = req.params;
  
  // 检查分类是否存在且属于该用户
  const category = await prisma.category.findFirst({
    where: { id, userId }
  });
  
  if (!category) {
    return res.status(404).json({
      error: {
        code: 'NOT_FOUND',
        message: 'Category not found'
      }
    });
  }
  
  await prisma.category.delete({
    where: { id }
  });
  
  res.status(204).send();
};
