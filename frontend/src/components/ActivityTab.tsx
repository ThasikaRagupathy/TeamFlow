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

const ACTION_ICONS: Record<
  string,
  {
    icon: React.ReactNode;
    bg: string;
    text: string;
    glow: string;
  }
> = {
  TASK_CREATED: {
    icon: <PlusCircle className="w-4 h-4" />,
    bg: 'bg-emerald-500/10 border-emerald-500/20',
    text: 'text-emerald-400',
    glow: 'shadow-emerald-500/10',
  },
  TASK_DELETED: {
    icon: <Trash2 className="w-4 h-4" />,
    bg: 'bg-rose-500/10 border-rose-500/20',
    text: 'text-rose-400',
    glow: 'shadow-rose-500/10',
  },
  STATUS_CHANGED: {
    icon: <CheckCircle className="w-4 h-4" />,
    bg: 'bg-blue-500/10 border-blue-500/20',
    text: 'text-blue-400',
    glow: 'shadow-blue-500/10',
  },
  ASSIGNMENT_CHANGED: {
    icon: <UserCheck className="w-4 h-4" />,
    bg: 'bg-purple-500/10 border-purple-500/20',
    text: 'text-purple-400',
    glow: 'shadow-purple-500/10',
  },
  TASK_UPDATED: {
    icon: <Edit className="w-4 h-4" />,
    bg: 'bg-amber-500/10 border-amber-500/20',
    text: 'text-amber-400',
    glow: 'shadow-amber-500/10',
  },
  MEMBER_ADDED: {
    icon: <UserPlus className="w-4 h-4" />,
    bg: 'bg-indigo-500/10 border-indigo-500/20',
    text: 'text-indigo-400',
    glow: 'shadow-indigo-500/10',
  },
  MEMBER_REMOVED: {
    icon: <UserMinus className="w-4 h-4" />,
    bg: 'bg-slate-500/10 border-slate-500/20',
    text: 'text-slate-400',
    glow: 'shadow-slate-500/10',
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
    <div className="space-y-5 max-w-5xl">
      {/* Header */}
      <div className="relative overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.04] backdrop-blur-xl p-5">
        {/* Background glow */}
        <div className="absolute -top-16 -right-16 w-40 h-40 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative flex items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center shrink-0">
              <ActivityIcon className="w-5 h-5 text-indigo-400" />
            </div>

            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                Activity Feed
              </h3>

              <p className="text-xs text-slate-400 mt-1 max-w-xl">
                Track project activity, task updates, assignments, and team
                changes.
              </p>
            </div>
          </div>

          {/* Event Count */}
          <div className="shrink-0 flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.05] border border-white/[0.08]">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />

            <span className="text-xs font-semibold text-slate-300">
              {total} {total === 1 ? 'event' : 'events'}
            </span>
          </div>
        </div>
      </div>

      {/* Activity List */}
      <div className="rounded-2xl border border-white/[0.08] bg-white/[0.035] backdrop-blur-xl overflow-hidden">
        {isLoading ? (
          <div className="py-20 flex flex-col items-center justify-center">
            <div className="relative w-10 h-10">
              <div className="absolute inset-0 rounded-full border-4 border-white/10" />

              <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-indigo-400 border-r-violet-400 animate-spin" />
            </div>

            <p className="mt-4 text-xs text-slate-400">
              Loading activity feed...
            </p>
          </div>
        ) : activities.length === 0 ? (
          <div className="py-20 flex flex-col items-center justify-center text-center px-6">
            <div className="w-14 h-14 rounded-2xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-center mb-4">
              <ActivityIcon className="w-6 h-6 text-slate-500" />
            </div>

            <h4 className="text-sm font-semibold text-slate-300">
              No activity yet
            </h4>

            <p className="text-xs text-slate-500 mt-1 max-w-sm">
              Project activity will appear here when tasks or team members are
              updated.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-white/[0.06]">
            {activities.map((act) => {
              const meta = ACTION_ICONS[act.action] || {
                icon: <ActivityIcon className="w-4 h-4" />,
                bg: 'bg-slate-500/10 border-slate-500/20',
                text: 'text-slate-400',
                glow: 'shadow-slate-500/10',
              };

              return (
                <div
                  key={act._id}
                  className="group p-4 sm:p-5 flex items-start gap-3.5 hover:bg-white/[0.025] transition-all duration-200"
                >
                  {/* Action Icon */}
                  <div
                    className={`
                      w-9 h-9 rounded-xl flex items-center justify-center
                      border shrink-0 mt-0.5
                      ${meta.bg}
                      ${meta.text}
                      shadow-lg ${meta.glow}
                    `}
                  >
                    {meta.icon}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    {/* Main Activity */}
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-1.5 sm:gap-4">
                      <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                        <span className="font-bold text-white">
                          {act.userName}
                        </span>{' '}
                        <span className="text-slate-400">
                          {act.details?.description ||
                            act.action
                              .replace(/_/g, ' ')
                              .toLowerCase()}
                        </span>
                      </p>

                      {/* Time */}
                      <span className="text-[10px] text-slate-500 shrink-0">
                        {act.createdAt
                          ? formatDistanceToNow(new Date(act.createdAt), {
                              addSuffix: true,
                            })
                          : ''}
                      </span>
                    </div>

                    {/* Previous / New Value */}
                    {act.details &&
                      (act.details.previousValue ||
                        act.details.newValue) && (
                        <div className="mt-3 flex flex-wrap items-center gap-2 text-[11px]">
                          {act.details.previousValue && (
                            <span className="line-through text-slate-500 bg-white/[0.03] px-2.5 py-1 rounded-lg border border-white/[0.07]">
                              {act.details.previousValue}
                            </span>
                          )}

                          {act.details.previousValue &&
                            act.details.newValue && (
                              <span className="text-slate-600">
                                →
                              </span>
                            )}

                          {act.details.newValue && (
                            <span className="font-semibold text-indigo-300 bg-indigo-500/10 px-2.5 py-1 rounded-lg border border-indigo-500/20">
                              {act.details.newValue}
                            </span>
                          )}
                        </div>
                      )}

                    {/* Deleted Task */}
                    {act.action === 'TASK_DELETED' && act.taskTitle && (
                      <div className="mt-2 flex items-center gap-2">
                        <span className="text-[10px] uppercase tracking-wider text-slate-600">
                          Preserved title
                        </span>

                        <p className="text-[11px] text-slate-500 italic truncate">
                          “{act.taskTitle}”
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-4 sm:px-5 py-3.5 border-t border-white/[0.06] bg-white/[0.015] flex items-center justify-between">
            <div className="text-[11px] text-slate-500">
              Page{' '}
              <span className="text-slate-300 font-semibold">{page}</span>{' '}
              of{' '}
              <span className="text-slate-300 font-semibold">
                {totalPages}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                disabled={page <= 1 || isLoading}
                onClick={() => onPageChange(page - 1)}
                aria-label="Previous page"
                className="
                  w-8 h-8 rounded-lg
                  border border-white/[0.08]
                  bg-white/[0.03]
                  text-slate-400
                  hover:bg-white/[0.07]
                  hover:text-white
                  disabled:opacity-30
                  disabled:cursor-not-allowed
                  transition-all
                  flex items-center justify-center
                "
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <button
                type="button"
                disabled={page >= totalPages || isLoading}
                onClick={() => onPageChange(page + 1)}
                aria-label="Next page"
                className="
                  w-8 h-8 rounded-lg
                  border border-white/[0.08]
                  bg-white/[0.03]
                  text-black
                  hover:bg-white/[0.07]
                  hover:text-black
                  disabled:opacity-30
                  disabled:cursor-not-allowed
                  transition-all
                  flex items-center justify-center
                "
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