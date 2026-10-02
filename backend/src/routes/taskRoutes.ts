import { Router } from 'express';
import {
  getTaskById,
  updateTask,
  updateTaskStatus,
  deleteTask,
} from '../controllers/taskController';
import { addComment, getComments } from '../controllers/commentController';
import { authenticate } from '../middleware/auth';
import { validateBody } from '../middleware/validate';
import {
  updateTaskSchema,
  updateTaskStatusSchema,
  createCommentSchema,
} from '../utils/validation';

const router = Router();

router.use(authenticate);

// Individual task operations
router.get('/:taskId', getTaskById);
router.patch('/:taskId', validateBody(updateTaskSchema), updateTask);
router.patch('/:taskId/status', validateBody(updateTaskStatusSchema), updateTaskStatus);
router.delete('/:taskId', deleteTask);

// Task comments
router.post('/:taskId/comments', validateBody(createCommentSchema), addComment);
router.get('/:taskId/comments', getComments);

export default router;
