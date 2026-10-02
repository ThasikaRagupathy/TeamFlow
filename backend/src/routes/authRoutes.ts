import { Router } from 'express';
import { register, login, logout, getMe } from '../controllers/authController';
import { authenticate } from '../middleware/auth';
import { validateBody } from '../middleware/validate';
import { authRateLimiter } from '../middleware/rateLimiter';
import { registerSchema, loginSchema } from '../utils/validation';

const router = Router();

router.post('/register', authRateLimiter, validateBody(registerSchema), register);
router.post('/login', authRateLimiter, validateBody(loginSchema), login);
router.post('/logout', authenticate, logout);
router.get('/me', authenticate, getMe);

export default router;
