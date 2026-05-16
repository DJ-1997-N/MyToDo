import { PrismaClient } from '@prisma/client';
import { hashPassword, comparePassword } from '@/utils/password';
import { generateToken } from '@/utils/jwt';
import { badRequest, conflict, unauthorized } from '@/utils/errors';

const prisma = new PrismaClient();

// 用户注册
export const register = async (req: any, res: any) => {
  const { email, username, password, name } = req.body;
  
  // 检查用户是否已存在
  const existingUser = await prisma.user.findFirst({
    where: {
      OR: [{ email }, { username }]
    }
  });
  
  if (existingUser) {
    throw conflict('User with this email or username already exists');
  }
  
  // 哈希密码
  const hashedPassword = await hashPassword(password);
  
  // 创建用户
  const user = await prisma.user.create({
    data: {
      email,
      username,
      password: hashedPassword,
      name
    },
    select: {
      id: true,
      email: true,
      username: true,
      name: true,
      createdAt: true
    }
  });
  
  // 生成 token
  const token = generateToken(user.id);
  
  res.status(201).json({ user, token });
};

// 用户登录
export const login = async (req: any, res: any) => {
  const { email, password } = req.body;
  
  // 查找用户
  const user = await prisma.user.findUnique({
    where: { email }
  });
  
  if (!user) {
    throw unauthorized('Invalid email or password');
  }
  
  // 验证密码
  const isPasswordValid = await comparePassword(password, user.password);
  
  if (!isPasswordValid) {
    throw unauthorized('Invalid email or password');
  }
  
  // 生成 token
  const token = generateToken(user.id);
  
  res.json({
    user: {
      id: user.id,
      email: user.email,
      username: user.username,
      name: user.name,
      createdAt: user.createdAt
    },
    token
  });
};

// 获取当前用户
export const getCurrentUser = async (req: any, res: any) => {
  const userId = req.userId;
  
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      email: true,
      username: true,
      name: true,
      avatar: true,
      createdAt: true
    }
  });
  
  if (!user) {
    throw unauthorized('User not found');
  }
  
  res.json({ user });
};

// 更新用户资料
export const updateProfile = async (req: any, res: any) => {
  const userId = req.userId;
  const { name, avatar } = req.body;
  
  const user = await prisma.user.update({
    where: { id: userId },
    data: {
      ...(name !== undefined && { name }),
      ...(avatar !== undefined && { avatar })
    },
    select: {
      id: true,
      email: true,
      username: true,
      name: true,
      avatar: true,
      createdAt: true
    }
  });
  
  res.json({ user });
};
