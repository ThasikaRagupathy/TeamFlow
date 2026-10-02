import { Router } from 'express';
import {
  createProject,
  getProjects,
  getProjectById,
  updateProject,
  deleteProject,
  addMember,
  removeMember,
} from '../controllers/projectController';
import { createTask, getTasks } from '../controllers/taskController';
import { getProjectDashboard } from '../controllers/dashboardController';
import { getProjectActivities } from '../controllers/activityController';
import { authenticate } from '../middleware/auth';
import { requireProjectAccess, requireProjectOwner } from '../middleware/projectPermission';
import { validateBody } from '../middleware/validate';
import {
  createProjectSchema,
  updateProjectSchema,
  addMemberSchema,
  createTaskSchema,
} from '../utils/validation';

const router = Router();

// Apply auth to all project routes
router.use(authenticate);

// Project collections
router.post('/', validateBody(createProjectSchema), createProject);
router.get('/', getProjects);

// Specific project operations
router.get('/:id', requireProjectAccess, getProjectById);
router.patch('/:id', requireProjectAccess, requireProjectOwner, validateBody(updateProjectSchema), updateProject);
router.delete('/:id', requireProjectAccess, requireProjectOwner, deleteProject);

// Member management (Owner only)
router.post('/:id/members', requireProjectAccess, requireProjectOwner, validateBody(addMemberSchema), addMember);
router.delete('/:id/members/:memberId', requireProjectAccess, requireProjectOwner, removeMember);

// Project tasks
router.post('/:id/tasks', requireProjectAccess, validateBody(createTaskSchema), createTask);
router.get('/:id/tasks', requireProjectAccess, getTasks);

// Project dashboard metrics
router.get('/:id/dashboard', requireProjectAccess, getProjectDashboard);

// Project activity feed
router.get('/:id/activity', requireProjectAccess, getProjectActivities);

export default router;
