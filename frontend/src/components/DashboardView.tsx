'use client';

import React from 'react';
import { DashboardData, Task } from '../types';
import {
  CheckCircle2,
  Clock,
  AlertCircle,
  UserCheck,
  Activity as ActivityIcon,
  Calendar,
  Layers,
  ArrowRight,
} from 'lucide-react';
import { formatDistanceToNow, format } from 'date-fns';

interface DashboardViewProps {
  data: DashboardData;
  isLoading: boolean;
  onOpenTask: (taskId: string) => void;
  onNavigateTab: (tab: 'board' | 'table' | 'activity') => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  data,
  isLoading,
  onOpenTask,
  onNavigateTab,
}) => {
  if (isLoading) {
    return (
      <div className="py-20 flex flex-col items-center justify-center gap-3 text-slate-400">
        <div className="w-8 h-8 border-3 border-indigo-600 border-t-transparent rounded-full animate-spin" />
        <span className="text-xs">Computing whole-project metrics...</span>
      </div>
    );
  }

  const {
    totalTasks,
    tasksByStatus,
    overdueTasksCount,
    assignedToCurrentUserCount,
    assignedToCurrentUser,
    recentActivities,
  } = data;

  return (
    <div className="space-y-6">
      {/* 4 Primary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Tasks */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Total Tasks
            </p>
            <h3 className="text-2xl font-black text-slate-900 mt-1">{totalTasks}</h3>
            <p className="text-[11px] text-slate-400 mt-0.5">Across entire project</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <Layers className="w-6 h-6" />
          </div>
        </div>

        {/* Overdue Tasks */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Overdue Tasks
            </p>
            <h3 className={`text-2xl font-black mt-1 ${overdueTasksCount > 0 ? 'text-rose-600' : 'text-slate-900'}`}>
              {overdueTasksCount}
            </h3>
            <p className="text-[11px] text-slate-400 mt-0.5">Due date passed & not Done</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center">
            <AlertCircle className="w-6 h-6" />
          </div>
        </div>

        {/* Assigned to Current User */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Assigned to You
            </p>
            <h3 className="text-2xl font-black text-slate-900 mt-1">{assignedToCurrentUserCount}</h3>
            <p className="text-[11px] text-slate-400 mt-0.5">Your active workload</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <UserCheck className="w-6 h-6" />
          </div>
        </div>

        {/* Completed Rate */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Completed Tasks
            </p>
            <h3 className="text-2xl font-black text-emerald-600 mt-1">
              {tasksByStatus?.Done || 0}
            </h3>
            <p className="text-[11px] text-slate-400 mt-0.5">
              {totalTasks > 0 ? Math.round(((tasksByStatus?.Done || 0) / totalTasks) * 100) : 0}% completion
            </p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <CheckCircle2 className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Status Breakdown Bar & Cards */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
        <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-3">
          Tasks Grouped by Status
        </h4>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/70">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-slate-400" />
              <span className="text-xs font-semibold text-slate-600">Backlog</span>
            </div>
            <p className="text-xl font-bold text-slate-800 mt-1">{tasksByStatus?.Backlog || 0}</p>
          </div>

          <div className="p-3 bg-amber-50/60 rounded-xl border border-amber-200/70">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-400" />
              <span className="text-xs font-semibold text-amber-800">To Do</span>
            </div>
            <p className="text-xl font-bold text-amber-900 mt-1">{tasksByStatus?.['To Do'] || 0}</p>
          </div>

          <div className="p-3 bg-blue-50/60 rounded-xl border border-blue-200/70">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-500" />
              <span className="text-xs font-semibold text-blue-800">In Progress</span>
            </div>
            <p className="text-xl font-bold text-blue-900 mt-1">{tasksByStatus?.['In Progress'] || 0}</p>
          </div>

          <div className="p-3 bg-emerald-50/60 rounded-xl border border-emerald-200/70">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span className="text-xs font-semibold text-emerald-800">Done</span>
            </div>
            <p className="text-xl font-bold text-emerald-900 mt-1">{tasksByStatus?.Done || 0}</p>
          </div>
        </div>
      </div>

      {/* Two Column Grid: Assigned to Me & Recent Activities */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Tasks Assigned to Current User */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
              <UserCheck className="w-4 h-4 text-indigo-600" />
              <span>Assigned to You ({assignedToCurrentUser?.length || 0})</span>
            </h4>
            <button
              onClick={() => onNavigateTab('table')}
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 flex items-center gap-1 transition cursor-pointer"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-2 flex-1 overflow-y-auto max-h-[360px]">
            {assignedToCurrentUser && assignedToCurrentUser.length > 0 ? (
              assignedToCurrentUser.map((task: Task) => (
                <div
                  key={task._id}
                  onClick={() => onOpenTask(task._id)}
                  className="p-3 rounded-xl bg-slate-50 hover:bg-indigo-50/60 border border-slate-200/70 transition flex items-center justify-between gap-3 cursor-pointer group"
                >
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-slate-900 group-hover:text-indigo-600 transition truncate">
                      {task.title}
                    </p>
                    <div className="flex items-center gap-2 mt-1 text-[11px] text-slate-500">
                      <span className="font-medium text-slate-700">{task.status}</span>
                      <span>•</span>
                      <span>{task.priority}</span>
                      {task.dueDate && (
                        <>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {format(new Date(task.dueDate), 'MMM d')}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                  <span className="text-[10px] font-semibold text-indigo-600 bg-white px-2 py-1 rounded-md border border-slate-200 shadow-2xs shrink-0">
                    Open
                  </span>
                </div>
              ))
            ) : (
              <div className="py-12 text-center text-slate-400 text-xs italic">
                You have no tasks assigned in this project right now.
              </div>
            )}
          </div>
        </div>

        {/* Right: Ten Most Recent Activity Entries */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
              <ActivityIcon className="w-4 h-4 text-indigo-600" />
              <span>Recent Activity (10 Entries)</span>
            </h4>
            <button
              onClick={() => onNavigateTab('activity')}
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 flex items-center gap-1 transition cursor-pointer"
            >
              <span>Full Audit Feed</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3 flex-1 overflow-y-auto max-h-[360px]">
            {recentActivities && recentActivities.length > 0 ? (
              recentActivities.map((act) => (
                <div
                  key={act._id}
                  className="flex items-start gap-3 text-xs p-2.5 rounded-xl hover:bg-slate-50 transition"
                >
                  <div className="w-7 h-7 rounded-full bg-slate-100 text-slate-700 font-bold text-[10px] flex items-center justify-center shrink-0 border border-slate-200 mt-0.5">
                    {act.userName ? act.userName.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-slate-800 leading-snug">
                      <span className="font-semibold text-slate-900">{act.userName}</span>{' '}
                      <span className="text-slate-600">
                        {act.details?.description || act.action.replace('_', ' ').toLowerCase()}
                      </span>
                    </p>
                    <p className="text-[10px] text-slate-400 mt-0.5">
                      {act.createdAt
                        ? formatDistanceToNow(new Date(act.createdAt), { addSuffix: true })
                        : ''}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="py-12 text-center text-slate-400 text-xs italic">
                No activity recorded yet.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
