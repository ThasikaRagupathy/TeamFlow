'use client';

import React from 'react';
import { DashboardData, Task } from '../types';
import {
  Activity as ActivityIcon,
  AlertCircle,
  ArrowRight,
  Calendar,
  CheckCircle2,
  Clock3,
  Layers,
  MoreHorizontal,
  Target,
  TrendingUp,
  UserCheck,
  Zap,
} from 'lucide-react';
import { format, formatDistanceToNow } from 'date-fns';

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
      <div className="relative min-h-[600px] overflow-hidden rounded-3xl bg-[#f7f8fc]">
        <div className="absolute -left-24 -top-24 h-72 w-72 rounded-full bg-violet-200/30 blur-3xl" />
        <div className="absolute -right-24 top-20 h-80 w-80 rounded-full bg-indigo-200/30 blur-3xl" />

        <div className="relative flex min-h-[600px] items-center justify-center">
          <div className="flex flex-col items-center">
            <div className="relative flex h-14 w-14 items-center justify-center">
              <div className="absolute inset-0 animate-ping rounded-2xl bg-indigo-100 opacity-60" />

              <div className="relative flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-600 shadow-lg shadow-indigo-200">
                <span className="text-xs font-black text-white">TF</span>
              </div>
            </div>

            <p className="mt-5 text-sm font-bold text-slate-900">
              Preparing your workspace
            </p>

            <p className="mt-1 text-xs text-slate-500">
              Calculating project metrics...
            </p>
          </div>
        </div>
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

  const backlog = tasksByStatus?.Backlog || 0;
  const todo = tasksByStatus?.['To Do'] || 0;
  const inProgress = tasksByStatus?.['In Progress'] || 0;
  const done = tasksByStatus?.Done || 0;

  const completionRate =
    totalTasks > 0 ? Math.round((done / totalTasks) * 100) : 0;

  const inProgressRate =
    totalTasks > 0 ? Math.round((inProgress / totalTasks) * 100) : 0;

  const todoRate =
    totalTasks > 0 ? Math.round((todo / totalTasks) * 100) : 0;

  const backlogRate =
    totalTasks > 0 ? Math.round((backlog / totalTasks) * 100) : 0;

  const statusData = [
    {
      label: 'Backlog',
      value: backlog,
      percentage: backlogRate,
      dot: 'bg-slate-400',
      bar: 'bg-slate-400',
      bg: 'bg-slate-50',
      text: 'text-slate-700',
    },
    {
      label: 'To Do',
      value: todo,
      percentage: todoRate,
      dot: 'bg-amber-500',
      bar: 'bg-amber-500',
      bg: 'bg-amber-50',
      text: 'text-amber-700',
    },
    {
      label: 'In Progress',
      value: inProgress,
      percentage: inProgressRate,
      dot: 'bg-blue-500',
      bar: 'bg-blue-500',
      bg: 'bg-blue-50',
      text: 'text-blue-700',
    },
    {
      label: 'Done',
      value: done,
      percentage: completionRate,
      dot: 'bg-emerald-500',
      bar: 'bg-emerald-500',
      bg: 'bg-emerald-50',
      text: 'text-emerald-700',
    },
  ];

  const getStatusDot = (status: string) => {
    switch (status) {
      case 'Done':
        return 'bg-emerald-500';
      case 'In Progress':
        return 'bg-blue-500';
      case 'To Do':
        return 'bg-amber-500';
      default:
        return 'bg-slate-400';
    }
  };

  const getPriorityStyle = (priority: string) => {
    const value = priority?.toLowerCase();

    if (value === 'high' || value === 'urgent') {
      return 'bg-rose-50 text-rose-600 border-rose-100';
    }

    if (value === 'medium') {
      return 'bg-amber-50 text-amber-600 border-amber-100';
    }

    return 'bg-slate-50 text-slate-600 border-slate-200';
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#f7f8fc] px-1 py-1">
      {/* =========================================================
          BACKGROUND
      ========================================================== */}

      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-32 -top-32 h-[420px] w-[420px] rounded-full bg-violet-200/25 blur-[110px]" />

        <div className="absolute right-[-160px] top-0 h-[480px] w-[480px] rounded-full bg-indigo-200/25 blur-[120px]" />

        <div className="absolute bottom-[-180px] left-[35%] h-[400px] w-[400px] rounded-full bg-blue-200/15 blur-[120px]" />

        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage:
              'linear-gradient(#64748b 1px, transparent 1px), linear-gradient(90deg, #64748b 1px, transparent 1px)',
            backgroundSize: '32px 32px',
          }}
        />
      </div>

      <div className="relative z-10 space-y-6">
        {/* =========================================================
            HEADER
        ========================================================== */}

        <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div>
            <div className="mb-2 flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-violet-600 to-indigo-600 shadow-sm shadow-indigo-200">
                <span className="text-[9px] font-black text-white">TF</span>
              </div>

              <span className="text-[10px] font-bold uppercase tracking-[0.22em] text-indigo-600">
                Workspace Overview
              </span>
            </div>

            <h1 className="text-2xl font-black tracking-tight text-slate-950 sm:text-3xl">
              Dashboard
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Everything happening across your project, in one place.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onNavigateTab('activity')}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white/80 px-3.5 py-2.5 text-xs font-semibold text-slate-700 shadow-sm backdrop-blur transition hover:border-indigo-200 hover:bg-white hover:text-indigo-600"
            >
              <ActivityIcon className="h-3.5 w-3.5" />
              Activity
            </button>

            <button
              type="button"
              onClick={() => onNavigateTab('board')}
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-3.5 py-2.5 text-xs font-semibold text-white shadow-lg shadow-indigo-200 transition hover:-translate-y-0.5 hover:shadow-indigo-300"
            >
              <Layers className="h-3.5 w-3.5" />
              Open Board
            </button>
          </div>
        </div>

        {/* =========================================================
            KPI CARDS
        ========================================================== */}

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {/* Total Tasks */}
          <div className="group relative overflow-hidden rounded-2xl border border-white/70 bg-white/75 p-5 shadow-[0_8px_30px_rgba(15,23,42,0.05)] backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:shadow-[0_15px_40px_rgba(15,23,42,0.08)]">
            <div className="absolute right-0 top-0 h-20 w-20 rounded-full bg-violet-100/60 blur-2xl transition group-hover:bg-violet-200/70" />

            <div className="relative">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400">
                    Total Tasks
                  </p>

                  <p className="mt-2 text-3xl font-black tracking-tight text-slate-950">
                    {totalTasks}
                  </p>

                  <div className="mt-2 flex items-center gap-1.5">
                    <TrendingUp className="h-3 w-3 text-indigo-500" />

                    <span className="text-[10px] font-semibold text-indigo-600">
                      Project workload
                    </span>
                  </div>
                </div>

                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-violet-50 to-indigo-50 text-indigo-600 ring-1 ring-indigo-100">
                  <Layers className="h-5 w-5" />
                </div>
              </div>
            </div>
          </div>

          {/* In Progress */}
          <div className="group relative overflow-hidden rounded-2xl border border-white/70 bg-white/75 p-5 shadow-[0_8px_30px_rgba(15,23,42,0.05)] backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:shadow-[0_15px_40px_rgba(15,23,42,0.08)]">
            <div className="absolute right-0 top-0 h-20 w-20 rounded-full bg-blue-100/60 blur-2xl" />

            <div className="relative">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400">
                    In Progress
                  </p>

                  <p className="mt-2 text-3xl font-black tracking-tight text-slate-950">
                    {inProgress}
                  </p>

                  <div className="mt-2 flex items-center gap-1.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-blue-500" />

                    <span className="text-[10px] font-semibold text-blue-600">
                      {inProgressRate}% of project
                    </span>
                  </div>
                </div>

                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600 ring-1 ring-blue-100">
                  <Zap className="h-5 w-5" />
                </div>
              </div>
            </div>
          </div>

          {/* Completed */}
          <div className="group relative overflow-hidden rounded-2xl border border-white/70 bg-white/75 p-5 shadow-[0_8px_30px_rgba(15,23,42,0.05)] backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:shadow-[0_15px_40px_rgba(15,23,42,0.08)]">
            <div className="absolute right-0 top-0 h-20 w-20 rounded-full bg-emerald-100/60 blur-2xl" />

            <div className="relative">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400">
                    Completed
                  </p>

                  <p className="mt-2 text-3xl font-black tracking-tight text-slate-950">
                    {done}
                  </p>

                  <div className="mt-2 flex items-center gap-1.5">
                    <CheckCircle2 className="h-3 w-3 text-emerald-500" />

                    <span className="text-[10px] font-semibold text-emerald-600">
                      {completionRate}% complete
                    </span>
                  </div>
                </div>

                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 ring-1 ring-emerald-100">
                  <CheckCircle2 className="h-5 w-5" />
                </div>
              </div>
            </div>
          </div>

          {/* Overdue */}
          <div className="group relative overflow-hidden rounded-2xl border border-white/70 bg-white/75 p-5 shadow-[0_8px_30px_rgba(15,23,42,0.05)] backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:shadow-[0_15px_40px_rgba(15,23,42,0.08)]">
            <div className="absolute right-0 top-0 h-20 w-20 rounded-full bg-rose-100/60 blur-2xl" />

            <div className="relative">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400">
                    Overdue
                  </p>

                  <p
                    className={`mt-2 text-3xl font-black tracking-tight ${
                      overdueTasksCount > 0
                        ? 'text-rose-600'
                        : 'text-slate-950'
                    }`}
                  >
                    {overdueTasksCount}
                  </p>

                  <div className="mt-2 flex items-center gap-1.5">
                    <AlertCircle
                      className={`h-3 w-3 ${
                        overdueTasksCount > 0
                          ? 'text-rose-500'
                          : 'text-emerald-500'
                      }`}
                    />

                    <span
                      className={`text-[10px] font-semibold ${
                        overdueTasksCount > 0
                          ? 'text-rose-600'
                          : 'text-emerald-600'
                      }`}
                    >
                      {overdueTasksCount > 0
                        ? 'Needs attention'
                        : 'All on track'}
                    </span>
                  </div>
                </div>

                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-rose-50 text-rose-600 ring-1 ring-rose-100">
                  <AlertCircle className="h-5 w-5" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* =========================================================
            MAIN ANALYTICS
        ========================================================== */}

        <div className="grid grid-cols-1 gap-5 xl:grid-cols-[1.35fr_0.65fr]">
          {/* Progress Card */}
          <div className="relative overflow-hidden rounded-3xl border border-white/80 bg-white/80 p-6 shadow-[0_12px_40px_rgba(15,23,42,0.06)] backdrop-blur-xl">
            <div className="absolute -right-20 -top-20 h-52 w-52 rounded-full bg-violet-100/50 blur-3xl" />

            <div className="relative">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-indigo-500">
                    Project Health
                  </p>

                  <h2 className="mt-1 text-lg font-black text-slate-950">
                    Overall Progress
                  </h2>

                  <p className="mt-1 text-xs text-slate-500">
                    Completion across all project tasks
                  </p>
                </div>

                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                  <Target className="h-4 w-4" />
                </div>
              </div>

              <div className="mt-7 flex flex-col items-center gap-7 sm:flex-row">
                {/* Circular progress */}
                <div
                  className="relative flex h-40 w-40 shrink-0 items-center justify-center rounded-full"
                  style={{
                    background: `conic-gradient(#7c3aed ${completionRate * 3.6}deg, #eef2f7 ${completionRate * 3.6}deg)`,
                  }}
                >
                  <div className="flex h-32 w-32 flex-col items-center justify-center rounded-full bg-white shadow-inner">
                    <span className="text-3xl font-black text-slate-950">
                      {completionRate}%
                    </span>

                    <span className="mt-0.5 text-[10px] font-medium text-slate-400">
                      completed
                    </span>
                  </div>
                </div>

                {/* Progress details */}
                <div className="w-full flex-1">
                  <div className="mb-4 flex items-center justify-between">
                    <div>
                      <p className="text-sm font-bold text-slate-950">
                        {done} completed
                      </p>

                      <p className="mt-0.5 text-[10px] text-slate-500">
                        out of {totalTasks} total tasks
                      </p>
                    </div>

                    <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-bold text-emerald-600">
                      {completionRate}% done
                    </span>
                  </div>

                  <div className="space-y-3">
                    {statusData.map((item) => (
                      <div key={item.label}>
                        <div className="mb-1.5 flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span
                              className={`h-2 w-2 rounded-full ${item.dot}`}
                            />

                            <span className="text-[11px] font-semibold text-slate-600">
                              {item.label}
                            </span>
                          </div>

                          <span className="text-[10px] font-bold text-slate-700">
                            {item.value}
                          </span>
                        </div>

                        <div className="h-1.5 overflow-hidden rounded-full bg-slate-100">
                          <div
                            className={`h-full rounded-full ${item.bar} transition-all duration-700`}
                            style={{
                              width: `${item.percentage}%`,
                            }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="rounded-3xl border border-white/80 bg-white/80 p-6 shadow-[0_12px_40px_rgba(15,23,42,0.06)] backdrop-blur-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-indigo-500">
                  Workload
                </p>

                <h2 className="mt-1 text-lg font-black text-slate-950">
                  Your Tasks
                </h2>
              </div>

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-50 text-violet-600">
                <UserCheck className="h-4 w-4" />
              </div>
            </div>

            <div className="mt-6 rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-600 p-5 text-white shadow-lg shadow-indigo-200">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-white/70">
                  Assigned to you
                </span>

                <MoreHorizontal className="h-4 w-4 text-white/60" />
              </div>

              <p className="mt-3 text-4xl font-black">
                {assignedToCurrentUserCount}
              </p>

              <p className="mt-1 text-[10px] text-white/70">
                active tasks in this project
              </p>

              <button
                type="button"
                onClick={() => onNavigateTab('table')}
                className="mt-5 flex items-center gap-1.5 text-[10px] font-bold text-white transition hover:text-white/80"
              >
                View task list
                <ArrowRight className="h-3 w-3" />
              </button>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3">
              <div className="rounded-2xl border border-slate-100 bg-slate-50 p-3">
                <p className="text-[10px] text-slate-500">
                  In Progress
                </p>

                <p className="mt-1 text-lg font-black text-slate-950">
                  {inProgress}
                </p>
              </div>

              <div className="rounded-2xl border border-slate-100 bg-slate-50 p-3">
                <p className="text-[10px] text-slate-500">
                  Completed
                </p>

                <p className="mt-1 text-lg font-black text-emerald-600">
                  {done}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* =========================================================
            TASKS + ACTIVITY
        ========================================================== */}

        <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
          {/* My Tasks */}
          <div className="overflow-hidden rounded-3xl border border-white/80 bg-white/80 shadow-[0_12px_40px_rgba(15,23,42,0.06)] backdrop-blur-xl">
            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">
              <div>
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
                    <UserCheck className="h-4 w-4" />
                  </div>

                  <div>
                    <h3 className="text-sm font-black text-slate-950">
                      My Tasks
                    </h3>

                    <p className="text-[10px] text-slate-400">
                      Tasks currently assigned to you
                    </p>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => onNavigateTab('table')}
                className="flex items-center gap-1 text-[10px] font-bold text-indigo-600 hover:text-indigo-700"
              >
                View all
                <ArrowRight className="h-3 w-3" />
              </button>
            </div>

            <div className="p-4">
              {assignedToCurrentUser &&
              assignedToCurrentUser.length > 0 ? (
                <div className="space-y-2">
                  {assignedToCurrentUser
                    .slice(0, 6)
                    .map((task: Task) => (
                      <button
                        key={task._id}
                        type="button"
                        onClick={() => onOpenTask(task._id)}
                        className="group w-full rounded-2xl border border-slate-100 bg-white p-3.5 text-left transition duration-200 hover:border-indigo-100 hover:bg-indigo-50/30 hover:shadow-sm"
                      >
                        <div className="flex items-center gap-3">
                          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-50">
                            <span
                              className={`h-2.5 w-2.5 rounded-full ${getStatusDot(
                                task.status
                              )}`}
                            />
                          </div>

                          <div className="min-w-0 flex-1">
                            <p className="truncate text-xs font-bold text-slate-900 group-hover:text-indigo-700">
                              {task.title}
                            </p>

                            <div className="mt-1.5 flex flex-wrap items-center gap-2">
                              <span className="text-[10px] font-medium text-slate-500">
                                {task.status}
                              </span>

                              <span className="text-slate-300">
                                •
                              </span>

                              <span
                                className={`rounded-md border px-1.5 py-0.5 text-[9px] font-bold ${getPriorityStyle(
                                  task.priority
                                )}`}
                              >
                                {task.priority}
                              </span>

                              {task.dueDate && (
                                <>
                                  <span className="text-slate-300">
                                    •
                                  </span>

                                  <span className="flex items-center gap-1 text-[9px] text-slate-400">
                                    <Calendar className="h-3 w-3" />
                                    {format(
                                      new Date(task.dueDate),
                                      'MMM d'
                                    )}
                                  </span>
                                </>
                              )}
                            </div>
                          </div>

                          <ArrowRight className="h-4 w-4 shrink-0 text-slate-300 transition group-hover:translate-x-0.5 group-hover:text-indigo-500" />
                        </div>
                      </button>
                    ))}
                </div>
              ) : (
                <div className="flex min-h-[280px] flex-col items-center justify-center text-center">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50">
                    <CheckCircle2 className="h-6 w-6 text-emerald-500" />
                  </div>

                  <p className="mt-3 text-sm font-bold text-slate-900">
                    You're all caught up
                  </p>

                  <p className="mt-1 max-w-[220px] text-[10px] leading-5 text-slate-400">
                    There are no tasks currently assigned to you.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Activity */}
          <div className="overflow-hidden rounded-3xl border border-white/80 bg-white/80 shadow-[0_12px_40px_rgba(15,23,42,0.06)] backdrop-blur-xl">
            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-50 text-violet-600">
                  <ActivityIcon className="h-4 w-4" />
                </div>

                <div>
                  <h3 className="text-sm font-black text-slate-950">
                    Recent Activity
                  </h3>

                  <p className="text-[10px] text-slate-400">
                    Latest updates from your team
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => onNavigateTab('activity')}
                className="flex items-center gap-1 text-[10px] font-bold text-indigo-600 hover:text-indigo-700"
              >
                Full feed
                <ArrowRight className="h-3 w-3" />
              </button>
            </div>

            <div className="p-5">
              {recentActivities && recentActivities.length > 0 ? (
                <div className="relative">
                  {/* Timeline line */}
                  <div className="absolute bottom-5 left-[17px] top-5 w-px bg-slate-100" />

                  <div className="space-y-5">
                    {recentActivities
                      .slice(0, 7)
                      .map((act) => (
                        <div
                          key={act._id}
                          className="relative flex items-start gap-3"
                        >
                          <div className="relative z-10 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2 border-white bg-gradient-to-br from-violet-500 to-indigo-500 text-[10px] font-black text-white shadow-sm">
                            {act.userName
                              ? act.userName
                                  .charAt(0)
                                  .toUpperCase()
                              : 'U'}
                          </div>

                          <div className="min-w-0 flex-1 pt-0.5">
                            <p className="text-xs leading-relaxed text-slate-600">
                              <span className="font-bold text-slate-950">
                                {act.userName || 'User'}
                              </span>{' '}
                              {act.details?.description ||
                                act.action
                                  .replace(/_/g, ' ')
                                  .toLowerCase()}
                            </p>

                            <div className="mt-1.5 flex items-center gap-1 text-[9px] text-slate-400">
                              <Clock3 className="h-3 w-3" />

                              {act.createdAt
                                ? formatDistanceToNow(
                                    new Date(act.createdAt),
                                    {
                                      addSuffix: true,
                                    }
                                  )
                                : ''}
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              ) : (
                <div className="flex min-h-[280px] flex-col items-center justify-center text-center">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-50">
                    <ActivityIcon className="h-6 w-6 text-slate-300" />
                  </div>

                  <p className="mt-3 text-sm font-bold text-slate-900">
                    No activity yet
                  </p>

                  <p className="mt-1 text-[10px] text-slate-400">
                    Project activity will appear here.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* =========================================================
            BOTTOM STATUS STRIP
        ========================================================== */}

        <div className="relative overflow-hidden rounded-2xl border border-indigo-100/80 bg-gradient-to-r from-violet-50 via-white to-indigo-50 px-5 py-4 shadow-sm">
          <div className="absolute right-0 top-0 h-32 w-32 rounded-full bg-violet-200/20 blur-3xl" />

          <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 shadow-sm shadow-indigo-200">
                <TrendingUp className="h-4 w-4 text-white" />
              </div>

              <div>
                <p className="text-xs font-bold text-slate-950">
                  Project completion
                </p>

                <p className="mt-0.5 text-[10px] text-slate-500">
                  {done} of {totalTasks} tasks completed
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="h-2 w-40 overflow-hidden rounded-full bg-white shadow-inner">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-violet-500 to-indigo-500 transition-all duration-700"
                  style={{
                    width: `${completionRate}%`,
                  }}
                />
              </div>

              <span className="text-xs font-black text-slate-950">
                {completionRate}%
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};