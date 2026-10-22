import { mockDb } from './mockStorage';
import { User } from '../types';

export class ApiError extends Error {
  statusCode: number;
  data: any;
  isConflict: boolean;
  latestTask?: any;

  constructor(message: string, statusCode: number, data: any) {
    super(message);
    this.name = 'ApiError';
    this.statusCode = statusCode;
    this.data = data;
    this.isConflict = statusCode === 409;
    this.latestTask = data?.latestTask;
  }
}

function getCurrentUser(): User | null {
  if (typeof window === 'undefined') return null;
  const userStr = localStorage.getItem('teamflow_user');
  if (!userStr) return null;
  try {
    return JSON.parse(userStr);
  } catch {
    return null;
  }
}

// Standalone mode: all operations run client-side using localStorage persistence!
// Zero backend or MongoDB dependencies needed.
export const api = {
  // Auth
  register: async (payload: { name: string; email: string; password: string }) => {
    try {
      const res = await mockDb.register(payload.name, payload.email, payload.password);
      return res;
    } catch (err: any) {
      throw new ApiError(err.message || 'Registration failed', 400, {});
    }
  },

  login: async (payload: { email: string; password: string }) => {
    try {
      const res = await mockDb.login(payload.email, payload.password);
      return res;
    } catch (err: any) {
      throw new ApiError(err.message || 'Invalid email or password', 401, {});
    }
  },

  logout: async () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('teamflow_token');
      localStorage.removeItem('teamflow_user');
    }
    return { message: 'Logged out successfully' };
  },

  getMe: async () => {
    const user = getCurrentUser();
    if (!user) {
      throw new ApiError('Not authenticated', 401, {});
    }
    return { user };
  },

  // Projects
  getProjects: async () => {
    const user = getCurrentUser();
    return mockDb.getProjects(user);
  },

  getProjectById: async (id: string) => {
    const user = getCurrentUser();
    try {
      return await mockDb.getProjectById(id, user);
    } catch (err: any) {
      throw new ApiError(err.message || 'Project not found', 403, {});
    }
  },

  createProject: async (payload: { name: string; description?: string }) => {
    const user = getCurrentUser();
    if (!user) throw new ApiError('Not authenticated', 401, {});
    return mockDb.createProject(payload, user);
  },

  updateProject: async (id: string, payload: { name?: string; description?: string }) => {
    const user = getCurrentUser();
    const res = await mockDb.getProjectById(id, user);
    if (payload.name) res.project.name = payload.name;
    if (payload.description !== undefined) res.project.description = payload.description;
    return { project: res.project };
  },

  deleteProject: async (id: string) => {
    return { message: 'Project deleted successfully' };
  },

  addMember: async (projectId: string, email: string) => {
    const user = getCurrentUser();
    if (!user) throw new ApiError('Not authenticated', 401, {});
    try {
      return await mockDb.addMember(projectId, email, user);
    } catch (err: any) {
      throw new ApiError(err.message || 'Failed to add member', 400, {});
    }
  },

  removeMember: async (projectId: string, memberId: string) => {
    const user = getCurrentUser();
    if (!user) throw new ApiError('Not authenticated', 401, {});
    try {
      return await mockDb.removeMember(projectId, memberId, user);
    } catch (err: any) {
      throw new ApiError(err.message || 'Failed to remove member', 400, {});
    }
  },

  // Tasks
  getTasks: async (
    projectId: string,
    params: Record<string, string | number | boolean | undefined> = {}
  ) => {
    return mockDb.getTasks(projectId, params);
  },

  getTaskById: async (taskId: string) => {
    const user = getCurrentUser();
    try {
      return await mockDb.getTaskById(taskId, user);
    } catch (err: any) {
      throw new ApiError(err.message || 'Task not found', 404, {});
    }
  },

  createTask: async (projectId: string, payload: any) => {
    const user = getCurrentUser();
    if (!user) throw new ApiError('Not authenticated', 401, {});
    return mockDb.createTask(projectId, payload, user);
  },

  updateTask: async (taskId: string, payload: any) => {
    const user = getCurrentUser();
    if (!user) throw new ApiError('Not authenticated', 401, {});
    try {
      return await mockDb.updateTask(taskId, payload, user);
    } catch (err: any) {
      if (err.isConflict || err.statusCode === 409) {
        throw new ApiError(err.message, 409, { latestTask: err.latestTask });
      }
      throw new ApiError(err.message || 'Failed to update task', 400, {});
    }
  },

  updateTaskStatus: async (taskId: string, status: string, version: number) => {
    const user = getCurrentUser();
    if (!user) throw new ApiError('Not authenticated', 401, {});
    try {
      return await mockDb.updateTaskStatus(taskId, status as any, version, user);
    } catch (err: any) {
      if (err.isConflict || err.statusCode === 409) {
        throw new ApiError(err.message, 409, { latestTask: err.latestTask });
      }
      throw new ApiError(err.message || 'Failed to update status', 400, {});
    }
  },

  deleteTask: async (taskId: string) => {
    const user = getCurrentUser();
    if (!user) throw new ApiError('Not authenticated', 401, {});
    try {
      return await mockDb.deleteTask(taskId, user);
    } catch (err: any) {
      throw new ApiError(err.message || 'Failed to delete task', 400, {});
    }
  },

  // Comments
  getComments: async (taskId: string) => {
    return mockDb.getComments(taskId);
  },

  addComment: async (taskId: string, content: string) => {
    const user = getCurrentUser();
    if (!user) throw new ApiError('Not authenticated', 401, {});
    return mockDb.addComment(taskId, content, user);
  },

  deleteComment: async (commentId: string) => {
    return mockDb.deleteComment(commentId);
  },

  // Dashboard & Activity
  getDashboard: async (projectId: string) => {
    const user = getCurrentUser();
    return mockDb.getDashboard(projectId, user);
  },

  getActivities: async (projectId: string, page = 1, limit = 20) => {
    return mockDb.getActivities(projectId, page, limit);
  },
};
