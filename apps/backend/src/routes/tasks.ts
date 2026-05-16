import { Router } from 'express';
import { authMiddleware } from '../middleware/auth';
import * as taskController from '../controllers/taskController';

const router = Router();

// 所有任务路由都需要认证
router.use(authMiddleware);

// 获取任务列表
router.get('/', taskController.getTasks);

// 创建任务
router.post('/', taskController.createTask);

// 获取单个任务
router.get('/:id', taskController.getTask);

// 更新任务
router.put('/:id', taskController.updateTask);

// 删除任务
router.delete('/:id', taskController.deleteTask);

// 更新任务状态
router.patch('/:id/status', taskController.updateTaskStatus);

// 完成任务
router.patch('/:id/complete', taskController.completeTask);

// 创建子任务
router.post('/:parentId/subtasks', taskController.createSubtask);

export default router;
