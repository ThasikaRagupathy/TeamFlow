export type TaskStatus = 'Backlog' | 'To Do' | 'In Progress' | 'Done';
export type TaskPriority = 'Low' | 'Medium' | 'High' | 'Critical';
export type ProjectRole = 'owner' | 'member';

export interface User {
  id: string;
  _id?: string;
  name: string;
  email: string;
  createdAt?: string;
}

export interface ProjectMember {
  user: User;
  role: ProjectRole;
  joinedAt: string;
}

export interface Project {
  _id: string;
  name: string;
  description?: string;
  owner: User;
  members: ProjectMember[];
  createdAt: string;
  updatedAt: string;
}

export interface Task {
  _id: string;
  project: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  assignee: User | null;
  dueDate: string | null;
  creator: User;
  version: number;
  createdAt: string;
  updatedAt: string;
}

export interface Comment {
  _id: string;
  task: string;
  project: string;
  author: User;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export interface Activity {
  _id: string;
  project: string;
  task?: string | null;
  taskTitle?: string;
  user: User;
  userName: string;
  action:
    | 'TASK_CREATED'
    | 'TASK_DELETED'
    | 'STATUS_CHANGED'
    | 'ASSIGNMENT_CHANGED'
    | 'TASK_UPDATED'
    | 'MEMBER_ADDED'
    | 'MEMBER_REMOVED';
  details: {
    previousValue?: string | null;
    newValue?: string | null;
    field?: string;
    description?: string;
    targetUserName?: string;
  };
  createdAt: string;
}

export interface DashboardData {
  totalTasks: number;
  tasksByStatus: {
    Backlog: number;
    'To Do': number;
    'In Progress': number;
    Done: number;
  };
  overdueTasksCount: number;
  assignedToCurrentUserCount: number;
  assignedToCurrentUser: Task[];
  recentActivities: Activity[];
}
