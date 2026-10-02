'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '../../../context/AuthContext';
import { api, ApiError } from '../../../lib/api';
import { Project, Task, DashboardData, Activity, TaskStatus } from '../../../types';
import { Navbar } from '../../../components/Navbar';
import { KanbanBoard } from '../../../components/KanbanBoard';
import { TaskTable } from '../../../components/TaskTable';
import { DashboardView } from '../../../components/DashboardView';
import { MembersTab } from '../../../components/MembersTab';
import { ActivityTab } from '../../../components/ActivityTab';
import { TaskModal } from '../../../components/TaskModal';
import { ConflictModal } from '../../../components/ConflictModal';
import {
  LayoutDashboard,
  Kanban,
  Table as TableIcon,
  Users,
  Activity as ActivityIcon,
  Plus,
  AlertCircle,
} from 'lucide-react';

export default function ProjectWorkspacePage() {
  const { user, isLoading: authLoading } = useAuth();
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();

  const projectId = params?.id as string;

  // Active Tab: dashboard | board | table | members | activity
  const activeTab = (searchParams.get('tab') as string) || 'dashboard';

  // Project state
  const [project, setProject] = useState<Project | null>(null);
  const [userRole, setUserRole] = useState<'owner' | 'member'>('member');
  const [isLoadingProject, setIsLoadingProject] = useState(true);
  const [projectError, setProjectError] = useState<string | null>(null);

  // Tasks state
  const [tasks, setTasks] = useState<Task[]>([]);
  const [totalTasks, setTotalTasks] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoadingTasks, setIsLoadingTasks] = useState(false);

  // Dashboard state
  const [dashboardData, setDashboardData] = useState<DashboardData>({
    totalTasks: 0,
    tasksByStatus: { Backlog: 0, 'To Do': 0, 'In Progress': 0, Done: 0 },
    overdueTasksCount: 0,
    assignedToCurrentUserCount: 0,
    assignedToCurrentUser: [],
    recentActivities: [],
  });
  const [isLoadingDashboard, setIsLoadingDashboard] = useState(false);

  // Full Activity Feed state
  const [activities, setActivities] = useState<Activity[]>([]);
  const [totalActivities, setTotalActivities] = useState(0);
  const [activityPage, setActivityPage] = useState(1);
  const [totalActivityPages, setTotalActivityPages] = useState(1);
  const [isLoadingActivities, setIsLoadingActivities] = useState(false);

  // Task Modal state
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [modalInitialStatus, setModalInitialStatus] = useState<TaskStatus>('To Do');

  // Concurrency Conflict state (for quick-status updates)
  const [conflictOpen, setConflictOpen] = useState(false);
  const [latestTaskOCC, setLatestTaskOCC] = useState<Task | null>(null);

  // Filter state for Table/Board
  const search = searchParams.get('search') || '';
  const status = searchParams.get('status') || 'all';
  const priority = searchParams.get('priority') || 'all';
  const assignee = searchParams.get('assignee') || 'all';
  const overdue = searchParams.get('overdue') === 'true';
  const sortBy = searchParams.get('sortBy') || 'createdAt';
  const sortOrder = (searchParams.get('sortOrder') as 'asc' | 'desc') || 'desc';
  const page = parseInt(searchParams.get('page') || '1', 10);

  // Update URL search parameters
  const updateQueryParams = useCallback(
    (newParams: Record<string, string | number | boolean | undefined>) => {
      const current = new URLSearchParams(Array.from(searchParams.entries()));

      Object.entries(newParams).forEach(([key, value]) => {
        if (value === undefined || value === '' || value === 'all' || value === false) {
          current.delete(key);
        } else {
          current.set(key, String(value));
        }
      });

      const query = current.toString();
      router.push(`/projects/${projectId}${query ? `?${query}` : ''}`, { scroll: false });
    },
    [searchParams, router, projectId]
  );

  // 1. Load Project Meta
  const loadProject = useCallback(async () => {
    if (!projectId) return;
    setIsLoadingProject(true);
    setProjectError(null);
    try {
      const res = await api.getProjectById(projectId);
      setProject(res.project);
      setUserRole(res.currentUserRole);
    } catch (err: any) {
      setProjectError(err.message || 'Failed to load project');
    } finally {
      setIsLoadingProject(false);
    }
  }, [projectId]);

  // 2. Load Tasks
  const loadTasks = useCallback(async () => {
    if (!projectId) return;
    setIsLoadingTasks(true);
    try {
      const limit = activeTab === 'board' ? 100 : 10;
      const res = await api.getTasks(projectId, {
        search: activeTab === 'board' ? undefined : search,
        status: activeTab === 'board' ? undefined : status,
        priority: activeTab === 'board' ? undefined : priority,
        assignee: activeTab === 'board' ? undefined : assignee,
        overdue: activeTab === 'board' ? undefined : overdue,
        sortBy,
        sortOrder,
        page: activeTab === 'board' ? 1 : page,
        limit,
      });
      setTasks(res.tasks);
      setTotalTasks(res.total);
      setTotalPages(res.totalPages);
    } catch (err: any) {
      console.error('Failed to load tasks:', err);
    } finally {
      setIsLoadingTasks(false);
    }
  }, [projectId, activeTab, search, status, priority, assignee, overdue, sortBy, sortOrder, page]);

  // 3. Load Dashboard
  const loadDashboard = useCallback(async () => {
    if (!projectId) return;
    setIsLoadingDashboard(true);
    try {
      const res = await api.getDashboard(projectId);
      setDashboardData(res.dashboard);
    } catch (err: any) {
      console.error('Failed to load dashboard:', err);
    } finally {
      setIsLoadingDashboard(false);
    }
  }, [projectId]);

  // 4. Load Activities
  const loadActivities = useCallback(
    async (pageToLoad = 1) => {
      if (!projectId) return;
      setIsLoadingActivities(true);
      try {
        const res = await api.getActivities(projectId, pageToLoad, 20);
        setActivities(res.activities);
        setTotalActivities(res.total);
        setActivityPage(res.page);
        setTotalActivityPages(res.totalPages);
      } catch (err: any) {
        console.error('Failed to load activities:', err);
      } finally {
        setIsLoadingActivities(false);
      }
    },
    [projectId]
  );

  useEffect(() => {
    if (!authLoading && !user) {
      router.replace('/login');
      return;
    }
    if (user && projectId) {
      loadProject();
    }
  }, [user, authLoading, projectId, loadProject, router]);

  // Tab change & data fetching
  useEffect(() => {
    if (project) {
      if (activeTab === 'dashboard') {
        loadDashboard();
      } else if (activeTab === 'board' || activeTab === 'table') {
        loadTasks();
      } else if (activeTab === 'activity') {
        loadActivities(1);
      }
    }
  }, [activeTab, project, loadDashboard, loadTasks, loadActivities]);

  // Quick status change from Kanban card or Table dropdown
  const handleQuickStatusChange = async (
    taskId: string,
    newStatus: TaskStatus,
    currentVersion: number
  ) => {
    try {
      await api.updateTaskStatus(taskId, newStatus, currentVersion);
      loadTasks();
      if (activeTab === 'dashboard') loadDashboard();
    } catch (err: any) {
      if (err instanceof ApiError && err.isConflict) {
        setLatestTaskOCC(err.latestTask);
        setConflictOpen(true);
      } else {
        alert(err.message || 'Status change failed');
      }
    }
  };

  const handleOpenTask = (taskId: string) => {
    setSelectedTaskId(taskId);
    setIsTaskModalOpen(true);
  };

  const handleNewTask = (initialColStatus: TaskStatus = 'To Do') => {
    setSelectedTaskId(null);
    setModalInitialStatus(initialColStatus);
    setIsTaskModalOpen(true);
  };

  if (authLoading || isLoadingProject) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-screen">
        <div className="w-8 h-8 border-3 border-indigo-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (projectError || !project) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-50">
        <Navbar />
        <main className="flex-1 max-w-xl mx-auto px-4 py-16 text-center">
          <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-6 h-6" />
          </div>
          <h2 className="text-lg font-bold text-slate-900">Project Access Denied or Missing</h2>
          <p className="text-xs text-slate-500 mt-2 mb-6">
            {projectError || 'You do not have permission to access this project.'}
          </p>
          <button
            onClick={() => router.push('/projects')}
            className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-semibold"
          >
            Back to All Projects
          </button>
        </main>
      </div>
    );
  }

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: 'board', label: 'Kanban Board', icon: <Kanban className="w-4 h-4" /> },
    { id: 'table', label: 'Table View', icon: <TableIcon className="w-4 h-4" /> },
    { id: 'members', label: 'Team & Settings', icon: <Users className="w-4 h-4" /> },
    { id: 'activity', label: 'Activity Trail', icon: <ActivityIcon className="w-4 h-4" /> },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar projectName={project.name} userRole={userRole} />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Project Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">{project.name}</h1>
            {project.description && (
              <p className="text-xs text-slate-500 mt-0.5 max-w-2xl">{project.description}</p>
            )}
          </div>

          {/* New Task Action */}
          <button
            onClick={() => handleNewTask('To Do')}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold shadow-xs flex items-center gap-1.5 transition cursor-pointer self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>New Task</span>
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-1 border-b border-slate-200 mb-6 overflow-x-auto pb-px">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => updateQueryParams({ tab: tab.id })}
                className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold border-b-2 transition whitespace-nowrap cursor-pointer ${
                  isActive
                    ? 'border-indigo-600 text-indigo-600 bg-white/50'
                    : 'border-transparent text-slate-500 hover:text-slate-900 hover:border-slate-300'
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Content */}
        {activeTab === 'dashboard' && (
          <DashboardView
            data={dashboardData}
            isLoading={isLoadingDashboard}
            onOpenTask={handleOpenTask}
            onNavigateTab={(tab) => updateQueryParams({ tab })}
          />
        )}

        {activeTab === 'board' && (
          <KanbanBoard
            tasks={tasks}
            onOpenTask={handleOpenTask}
            onNewTask={handleNewTask}
            onUpdateStatus={handleQuickStatusChange}
          />
        )}

        {activeTab === 'table' && (
          <TaskTable
            tasks={tasks}
            total={totalTasks}
            totalPages={totalPages}
            page={page}
            limit={10}
            isLoading={isLoadingTasks}
            filters={{
              search,
              status,
              priority,
              assignee,
              overdue,
              sortBy,
              sortOrder,
              page,
            }}
            project={project}
            onFilterChange={updateQueryParams}
            onOpenTask={handleOpenTask}
            onStatusChange={handleQuickStatusChange}
          />
        )}

        {activeTab === 'members' && (
          <MembersTab
            project={project}
            userRole={userRole}
            onProjectUpdated={loadProject}
          />
        )}

        {activeTab === 'activity' && (
          <ActivityTab
            activities={activities}
            total={totalActivities}
            page={activityPage}
            totalPages={totalActivityPages}
            isLoading={isLoadingActivities}
            onPageChange={(p) => loadActivities(p)}
          />
        )}
      </main>

      {/* Task Creation & Edit Modal */}
      <TaskModal
        isOpen={isTaskModalOpen}
        taskId={selectedTaskId}
        project={project}
        userRole={userRole}
        initialStatus={modalInitialStatus}
        onClose={() => setIsTaskModalOpen(false)}
        onSaved={() => {
          if (activeTab === 'dashboard') loadDashboard();
          else if (activeTab === 'board' || activeTab === 'table') loadTasks();
          else if (activeTab === 'activity') loadActivities(1);
        }}
        onDeleted={() => {
          if (activeTab === 'dashboard') loadDashboard();
          else if (activeTab === 'board' || activeTab === 'table') loadTasks();
        }}
      />

      {/* OCC Conflict Modal */}
      <ConflictModal
        isOpen={conflictOpen}
        latestTask={latestTaskOCC}
        onReload={() => {
          setConflictOpen(false);
          loadTasks();
        }}
        onClose={() => setConflictOpen(false)}
      />
    </div>
  );
}
