const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

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

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  const headers = new Headers(options.headers);

  headers.set('Content-Type', 'application/json');

  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('teamflow_token');
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    if (response.status === 401 && typeof window !== 'undefined') {
      localStorage.removeItem('teamflow_token');
      localStorage.removeItem('teamflow_user');
      if (!window.location.pathname.startsWith('/login') && !window.location.pathname.startsWith('/register')) {
        window.location.href = '/login?session_expired=true';
      }
    }

    let errorMessage = data.message || 'An unexpected error occurred';
    if (data.errors && Array.isArray(data.errors)) {
      errorMessage = data.errors.map((e: any) => (typeof e === 'string' ? e : e.message)).join(', ');
    }

    throw new ApiError(errorMessage, response.status, data);
  }

  return data as T;
}

export const api = {
  // Auth
  register: (payload: { name: string; email: string; password: string }) =>
    request<{ token: string; user: any }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  login: (payload: { email: string; password: string }) =>
    request<{ token: string; user: any }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  logout: () =>
    request<{ message: string }>('/auth/logout', {
      method: 'POST',
    }),

  getMe: () => request<{ user: any }>('/auth/me'),

  // Projects
  getProjects: () => request<{ projects: any[] }>('/projects'),

  getProjectById: (id: string) =>
    request<{ project: any; currentUserRole: 'owner' | 'member' }>(`/projects/${id}`),

  createProject: (payload: { name: string; description?: string }) =>
    request<{ project: any }>('/projects', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  updateProject: (id: string, payload: { name?: string; description?: string }) =>
    request<{ project: any }>(`/projects/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(payload),
    }),

  deleteProject: (id: string) =>
    request<{ message: string }>(`/projects/${id}`, {
      method: 'DELETE',
    }),

  addMember: (projectId: string, email: string) =>
    request<{ project: any }>(`/projects/${projectId}/members`, {
      method: 'POST',
      body: JSON.stringify({ email }),
    }),

  removeMember: (projectId: string, memberId: string) =>
    request<{ project: any }>(`/projects/${projectId}/members/${memberId}`, {
      method: 'DELETE',
    }),

  // Tasks
  getTasks: (projectId: string, params: Record<string, string | number | boolean | undefined> = {}) => {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== '' && value !== 'all') {
        searchParams.append(key, String(value));
      }
    });
    const queryString = searchParams.toString();
    return request<{
      tasks: any[];
      total: number;
      page: number;
      totalPages: number;
      limit: number;
    }>(`/projects/${projectId}/tasks${queryString ? `?${queryString}` : ''}`);
  },

  getTaskById: (taskId: string) =>
    request<{ task: any; comments: any[]; userRole: string; isCreator: boolean }>(`/tasks/${taskId}`),

  createTask: (projectId: string, payload: any) =>
    request<{ task: any }>(`/projects/${projectId}/tasks`, {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  updateTask: (taskId: string, payload: any) =>
    request<{ task: any }>(`/tasks/${taskId}`, {
      method: 'PATCH',
      body: JSON.stringify(payload),
    }),

  updateTaskStatus: (taskId: string, status: string, version: number) =>
    request<{ task: any }>(`/tasks/${taskId}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status, version }),
    }),

  deleteTask: (taskId: string) =>
    request<{ message: string }>(`/tasks/${taskId}`, {
      method: 'DELETE',
    }),

  // Comments
  getComments: (taskId: string) =>
    request<{ comments: any[] }>(`/tasks/${taskId}/comments`),

  addComment: (taskId: string, content: string) =>
    request<{ comment: any }>(`/tasks/${taskId}/comments`, {
      method: 'POST',
      body: JSON.stringify({ content }),
    }),

  deleteComment: (commentId: string) =>
    request<{ message: string }>(`/comments/${commentId}`, {
      method: 'DELETE',
    }),

  // Dashboard & Activity
  getDashboard: (projectId: string) =>
    request<{ project: any; dashboard: any }>(`/projects/${projectId}/dashboard`),

  getActivities: (projectId: string, page = 1, limit = 20) =>
    request<{
      activities: any[];
      total: number;
      page: number;
      totalPages: number;
    }>(`/projects/${projectId}/activity?page=${page}&limit=${limit}`),
};
