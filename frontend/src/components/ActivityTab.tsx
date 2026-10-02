'use client';

import React from 'react';
import { Activity } from '../types';
import {
  Activity as ActivityIcon,
  CheckCircle,
  UserCheck,
  PlusCircle,
  Trash2,
  Edit,
  UserPlus,
  UserMinus,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface ActivityTabProps {
  activities: Activity[];
  total: number;
  page: number;
  totalPages: number;
  isLoading: boolean;
  onPageChange: (newPage: number) => void;
}

const ACTION_ICONS: Record<string, { icon: React.ReactNode; bg: string; text: string }> = {
  TASK_CREATED: {
    icon: <PlusCircle className="w-4 h-4" />,
    bg: 'bg-emerald-50 border-emerald-200',
    text: 'text-emerald-700',
  },
  TASK_DELETED: {
    icon: <Trash2 className="w-4 h-4" />,
    bg: 'bg-rose-50 border-rose-200',
    text: 'text-rose-700',
  },
  STATUS_CHANGED: {
    icon: <CheckCircle className="w-4 h-4" />,
    bg: 'bg-blue-50 border-blue-200',
    text: 'text-blue-700',
  },
  ASSIGNMENT_CHANGED: {
    icon: <UserCheck className="w-4 h-4" />,
    bg: 'bg-purple-50 border-purple-200',
    text: 'text-purple-700',
  },
  TASK_UPDATED: {
    icon: <Edit className="w-4 h-4" />,
    bg: 'bg-amber-50 border-amber-200',
    text: 'text-amber-700',
  },
  MEMBER_ADDED: {
    icon: <UserPlus className="w-4 h-4" />,
    bg: 'bg-indigo-50 border-indigo-200',
    text: 'text-indigo-700',
  },
  MEMBER_REMOVED: {
    icon: <UserMinus className="w-4 h-4" />,
    bg: 'bg-slate-100 border-slate-200',
    text: 'text-slate-700',
  },
};

export const ActivityTab: React.FC<ActivityTabProps> = ({
  activities,
  total,
  page,
  totalPages,
  isLoading,
  onPageChange,
}) => {
  return (
    <div className="space-y-4 max-w-4xl">
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
        <div>
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <ActivityIcon className="w-5 h-5 text-indigo-600" />
            <span>Project Audit Trail & Activity Feed</span>
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Immutable log of task creations, status updates, reassignments, and team changes.
          </p>
        </div>
        <span className="text-xs font-semibold text-slate-600 bg-slate-100 px-3 py-1 rounded-full border border-slate-200">
          {total} events
        </span>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        {isLoading ? (
          <div className="py-16 text-center text-slate-400">
            <div className="flex flex-col items-center justify-center gap-2">
              <div className="w-6 h-6 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
              <span className="text-xs">Loading activity feed...</span>
            </div>
          </div>
        ) : activities.length === 0 ? (
          <div className="py-16 text-center text-slate-400 text-xs italic">
            No activity recorded yet for this project.
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {activities.map((act) => {
              const meta = ACTION_ICONS[act.action] || {
                icon: <ActivityIcon className="w-4 h-4" />,
                bg: 'bg-slate-50 border-slate-200',
                text: 'text-slate-700',
              };

              return (
                <div key={act._id} className="p-4 flex items-start gap-3.5 hover:bg-slate-50/60 transition">
                  <div
                    className={`w-8 h-8 rounded-xl flex items-center justify-center border shrink-0 mt-0.5 ${meta.bg} ${meta.text}`}
                  >
                    {meta.icon}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-xs text-slate-900">
                        <span className="font-bold text-slate-900">{act.userName}</span>{' '}
                        <span className="text-slate-700">
                          {act.details?.description || act.action.replace('_', ' ').toLowerCase()}
                        </span>
                      </p>
                      <span className="text-[10px] text-slate-400 shrink-0">
                        {act.createdAt
                          ? formatDistanceToNow(new Date(act.createdAt), { addSuffix: true })
                          : ''}
                      </span>
                    </div>

                    {/* Previous vs New Value Pill (where relevant) */}
                    {act.details && (act.details.previousValue || act.details.newValue) && (
                      <div className="mt-2 flex items-center gap-2 text-[11px]">
                        {act.details.previousValue && (
                          <span className="line-through text-slate-400 bg-slate-50 px-2 py-0.5 rounded border border-slate-200">
                            {act.details.previousValue}
                          </span>
                        )}
                        {act.details.previousValue && act.details.newValue && (
                          <span className="text-slate-400">→</span>
                        )}
                        {act.details.newValue && (
                          <span className="font-semibold text-slate-800 bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded border border-indigo-200">
                            {act.details.newValue}
                          </span>
                        )}
                      </div>
                    )}

                    {/* Preserved Task Title if task was deleted */}
                    {act.action === 'TASK_DELETED' && act.taskTitle && (
                      <p className="text-[11px] text-slate-500 mt-1 italic">
                        Preserved Title: &ldquo;{act.taskTitle}&rdquo;
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Pagination Bar */}
        {totalPages > 1 && (
          <div className="p-4 border-t border-slate-200 bg-slate-50/50 flex items-center justify-between text-xs text-slate-600">
            <span>
              Page {page} of {totalPages}
            </span>
            <div className="flex items-center gap-2">
              <button
                disabled={page <= 1 || isLoading}
                onClick={() => onPageChange(page - 1)}
                className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                disabled={page >= totalPages || isLoading}
                onClick={() => onPageChange(page + 1)}
                className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition cursor-pointer"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
