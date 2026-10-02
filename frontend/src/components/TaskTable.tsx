'use client';

import React from 'react';
import { Task, Project, TaskStatus, TaskPriority } from '../types';
import {
  Search,
  Filter,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
  Calendar,
  CheckCircle2,
} from 'lucide-react';
import { format, isPast } from 'date-fns';

interface FilterState {
  search: string;
  status: string;
  priority: string;
  assignee: string;
  overdue: boolean;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
  page: number;
}

interface TaskTableProps {
  tasks: Task[];
  total: number;
  totalPages: number;
  page: number;
  limit: number;
  isLoading: boolean;
  filters: FilterState;
  project: Project;
  onFilterChange: (newFilters: Partial<FilterState>) => void;
  onOpenTask: (taskId: string) => void;
  onStatusChange: (taskId: string, newStatus: TaskStatus, version: number) => void;
}

const PRIORITY_BADGES: Record<string, { label: string; className: string }> = {
  Low: { label: 'Low', className: 'bg-slate-100 text-slate-700 border-slate-200' },
  Medium: { label: 'Medium', className: 'bg-blue-50 text-blue-700 border-blue-200' },
  High: { label: 'High', className: 'bg-amber-50 text-amber-700 border-amber-200' },
  Critical: { label: 'Critical', className: 'bg-rose-50 text-rose-700 border-rose-200' },
};

const STATUS_BADGES: Record<string, { label: string; dot: string }> = {
  Backlog: { label: 'Backlog', dot: 'bg-slate-400' },
  'To Do': { label: 'To Do', dot: 'bg-amber-400' },
  'In Progress': { label: 'In Progress', dot: 'bg-blue-500' },
  Done: { label: 'Done', dot: 'bg-emerald-500' },
};

export const TaskTable: React.FC<TaskTableProps> = ({
  tasks,
  total,
  totalPages,
  page,
  limit,
  isLoading,
  filters,
  project,
  onFilterChange,
  onOpenTask,
  onStatusChange,
}) => {
  const handleSort = (field: string) => {
    if (filters.sortBy === field) {
      onFilterChange({
        sortOrder: filters.sortOrder === 'asc' ? 'desc' : 'asc',
        page: 1,
      });
    } else {
      onFilterChange({
        sortBy: field,
        sortOrder: 'desc',
        page: 1,
      });
    }
  };

  return (
    <div className="space-y-4">
      {/* Search and Filters Toolbar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3">
        {/* Search */}
        <div className="relative flex-1 min-w-[220px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={filters.search}
            onChange={(e) => onFilterChange({ search: e.target.value, page: 1 })}
            placeholder="Search tasks by title..."
            className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-slate-200 focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 transition"
          />
        </div>

        {/* Filter Dropdowns */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Status Filter */}
          <select
            value={filters.status}
            onChange={(e) => onFilterChange({ status: e.target.value, page: 1 })}
            className="text-xs px-2.5 py-2 rounded-xl border border-slate-200 bg-white text-slate-700 focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 transition cursor-pointer"
          >
            <option value="all">All Statuses</option>
            <option value="Backlog">Backlog</option>
            <option value="To Do">To Do</option>
            <option value="In Progress">In Progress</option>
            <option value="Done">Done</option>
          </select>

          {/* Priority Filter */}
          <select
            value={filters.priority}
            onChange={(e) => onFilterChange({ priority: e.target.value, page: 1 })}
            className="text-xs px-2.5 py-2 rounded-xl border border-slate-200 bg-white text-slate-700 focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 transition cursor-pointer"
          >
            <option value="all">All Priorities</option>
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
            <option value="Critical">Critical</option>
          </select>

          {/* Assignee Filter */}
          <select
            value={filters.assignee}
            onChange={(e) => onFilterChange({ assignee: e.target.value, page: 1 })}
            className="text-xs px-2.5 py-2 rounded-xl border border-slate-200 bg-white text-slate-700 focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 transition cursor-pointer"
          >
            <option value="all">All Assignees</option>
            <option value="unassigned">Unassigned</option>
            {project.members.map((m) => (
              <option key={m.user._id || m.user.id} value={m.user._id || m.user.id}>
                {m.user.name}
              </option>
            ))}
          </select>

          {/* Overdue Checkbox Filter */}
          <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 transition cursor-pointer select-none">
            <input
              type="checkbox"
              checked={filters.overdue}
              onChange={(e) => onFilterChange({ overdue: e.target.checked, page: 1 })}
              className="rounded text-indigo-600 focus:ring-indigo-500 cursor-pointer"
            />
            <span className={filters.overdue ? 'text-rose-600' : ''}>Overdue Only</span>
          </label>
        </div>
      </div>

      {/* Table Container */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/80 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4">Title</th>
                <th className="py-3 px-4">
                  <button
                    onClick={() => handleSort('status')}
                    className="flex items-center gap-1 hover:text-indigo-600 transition cursor-pointer"
                  >
                    <span>Status</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </button>
                </th>
                <th className="py-3 px-4">
                  <button
                    onClick={() => handleSort('priority')}
                    className="flex items-center gap-1 hover:text-indigo-600 transition cursor-pointer"
                  >
                    <span>Priority</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </button>
                </th>
                <th className="py-3 px-4">Assignee</th>
                <th className="py-3 px-4">
                  <button
                    onClick={() => handleSort('dueDate')}
                    className="flex items-center gap-1 hover:text-indigo-600 transition cursor-pointer"
                  >
                    <span>Due Date</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </button>
                </th>
                <th className="py-3 px-4">
                  <button
                    onClick={() => handleSort('createdAt')}
                    className="flex items-center gap-1 hover:text-indigo-600 transition cursor-pointer"
                  >
                    <span>Created</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </button>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <div className="w-6 h-6 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
                      <span>Loading tasks...</span>
                    </div>
                  </td>
                </tr>
              ) : tasks.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400">
                    <div className="flex flex-col items-center justify-center gap-1">
                      <p className="text-sm font-semibold text-slate-600">No tasks found</p>
                      <p className="text-xs text-slate-400">
                        Try changing your search terms or filter criteria.
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                tasks.map((task) => {
                  const isOverdue =
                    task.dueDate &&
                    isPast(new Date(task.dueDate)) &&
                    task.status !== 'Done';

                  const priorityInfo =
                    PRIORITY_BADGES[task.priority] || PRIORITY_BADGES.Medium;
                  const statusInfo =
                    STATUS_BADGES[task.status] || STATUS_BADGES['To Do'];

                  return (
                    <tr
                      key={task._id}
                      onClick={() => onOpenTask(task._id)}
                      className="hover:bg-slate-50/80 transition cursor-pointer group"
                    >
                      {/* Title */}
                      <td className="py-3 px-4 max-w-[280px]">
                        <div className="font-semibold text-slate-900 group-hover:text-indigo-600 transition truncate">
                          {task.title}
                        </div>
                        {task.description && (
                          <div className="text-[11px] text-slate-400 truncate mt-0.5">
                            {task.description}
                          </div>
                        )}
                      </td>

                      {/* Status */}
                      <td className="py-3 px-4" onClick={(e) => e.stopPropagation()}>
                        <select
                          value={task.status}
                          onChange={(e) =>
                            onStatusChange(task._id, e.target.value as TaskStatus, task.version)
                          }
                          className="text-xs py-1 px-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 transition cursor-pointer"
                        >
                          <option value="Backlog">Backlog</option>
                          <option value="To Do">To Do</option>
                          <option value="In Progress">In Progress</option>
                          <option value="Done">Done</option>
                        </select>
                      </td>

                      {/* Priority */}
                      <td className="py-3 px-4">
                        <span
                          className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${priorityInfo.className}`}
                        >
                          {priorityInfo.label}
                        </span>
                      </td>

                      {/* Assignee */}
                      <td className="py-3 px-4">
                        {task.assignee ? (
                          <div className="flex items-center gap-1.5">
                            <div className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-700 font-bold text-[10px] flex items-center justify-center border border-indigo-200">
                              {task.assignee.name.charAt(0).toUpperCase()}
                            </div>
                            <span className="text-slate-800 font-medium truncate max-w-[120px]">
                              {task.assignee.name}
                            </span>
                          </div>
                        ) : (
                          <span className="text-slate-400 italic">Unassigned</span>
                        )}
                      </td>

                      {/* Due Date & Overdue */}
                      <td className="py-3 px-4">
                        {task.dueDate ? (
                          <div className="flex items-center gap-1.5">
                            <Calendar className="w-3.5 h-3.5 text-slate-400" />
                            <span className={isOverdue ? 'text-rose-600 font-bold' : 'text-slate-600'}>
                              {format(new Date(task.dueDate), 'MMM d, yyyy')}
                            </span>
                            {isOverdue && (
                              <span className="text-[10px] font-bold text-rose-600 bg-rose-50 px-1.5 py-0.5 rounded border border-rose-200">
                                Overdue
                              </span>
                            )}
                          </div>
                        ) : (
                          <span className="text-slate-400">None</span>
                        )}
                      </td>

                      {/* Created At */}
                      <td className="py-3 px-4 text-slate-500">
                        {task.createdAt ? format(new Date(task.createdAt), 'MMM d, yyyy') : '-'}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar */}
        <div className="p-4 border-t border-slate-200 bg-slate-50/50 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-600">
          <div>
            Showing <span className="font-semibold text-slate-900">{tasks.length}</span> of{' '}
            <span className="font-semibold text-slate-900">{total}</span> total tasks
          </div>

          <div className="flex items-center gap-2">
            <button
              disabled={page <= 1 || isLoading}
              onClick={() => onFilterChange({ page: page - 1 })}
              className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="font-medium text-slate-700">
              Page {page} of {totalPages || 1}
            </span>
            <button
              disabled={page >= totalPages || isLoading}
              onClick={() => onFilterChange({ page: page + 1 })}
              className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
