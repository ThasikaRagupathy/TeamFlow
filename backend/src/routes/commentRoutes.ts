import { Router } from 'express';
import { deleteComment } from '../controllers/commentController';
import { authenticate } from '../middleware/auth';

const router = Router();

router.use(authenticate);

// Individual comment deletion
router.delete('/:commentId', deleteComment);

export default router;
