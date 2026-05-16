import { Router } from 'express';
import { authMiddleware } from '../middleware/auth';
import * as categoryController from '../controllers/categoryController';

const router = Router();

// 所有分类路由都需要认证
router.use(authMiddleware);

// 获取用户的所有分类
router.get('/', categoryController.getCategories);

// 创建分类
router.post('/', categoryController.createCategory);

// 更新分类
router.put('/:id', categoryController.updateCategory);

// 删除分类
router.delete('/:id', categoryController.deleteCategory);

export default router;
