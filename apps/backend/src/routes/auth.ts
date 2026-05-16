import { Router } from 'express';
import { authMiddleware } from '../middleware/auth';
import * as authController from '../controllers/authController';

const router = Router();

// 用户注册
router.post('/register', authController.register);

// 用户登录
router.post('/login', authController.login);

// 获取当前用户信息（需要认证）
router.get('/me', authMiddleware, authController.getCurrentUser);

// 更新用户信息（需要认证）
router.put('/me', authMiddleware, authController.updateProfile);

export default router;
