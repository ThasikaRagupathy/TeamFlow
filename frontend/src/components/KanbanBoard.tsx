'use client';

import React from 'react';
import { Task, TaskStatus } from '../types';
import { Plus, Calendar, AlertCircle, Clock, ChevronDown } from 'lucide-react';
import { format, isPast } from 'date-fns';

interface KanbanBoardProps {
  tasks: Task[];
  onOpenTask: (taskId: string) => void;
  onNewTask: (status: TaskStatus) => void;
  onUpdateStatus: (taskId: string, newStatus: TaskStatus, version: number) => void;
}

const COLUMNS: { id: TaskStatus; label: string; dotColor: string }[] = [
  { id: 'Backlog', label: 'Backlog', dotColor: 'bg-slate-400' },
  { id: 'To Do', label: 'To Do', dotColor: 'bg-amber-400' },
  { id: 'In Progress', label: 'In Progress', dotColor: 'bg-blue-500' },
  { id: 'Done', label: 'Done', dotColor: 'bg-emerald-500' },
];

const PRIORITY_BADGES: Record<string, { label: string; className: string }> = {
  Low: { label: 'Low', className: 'bg-slate-100 text-slate-700 border-slate-200' },
  Medium: { label: 'Medium', className: 'bg-blue-50 text-blue-700 border-blue-200' },
  High: { label: 'High', className: 'bg-amber-50 text-amber-700 border-amber-200' },
  Critical: { label: 'Critical', className: 'bg-rose-50 text-rose-700 border-rose-200' },
};

export const KanbanBoard: React.FC<KanbanBoardProps> = ({
  tasks,
  onOpenTask,
  onNewTask,
  onUpdateStatus,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-start">
      {COLUMNS.map((col) => {
        const columnTasks = tasks.filter((t) => t.status === col.id);

        return (
          <div
            key={col.id}
            className="bg-slate-100/70 border border-slate-200/80 rounded-2xl p-3 flex flex-col min-h-[450px]"
          >
            {/* Column Header */}
            <div className="flex items-center justify-between px-2 py-1.5 mb-2">
              <div className="flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${col.dotColor}`} />
                <h3 className="text-xs font-bold text-slate-800 tracking-tight">
                  {col.label}
                </h3>
                <span className="text-[11px] font-semibold text-slate-400 bg-white/80 border border-slate-200 px-1.5 py-0.2 rounded-full">
                  {columnTasks.length}
                </span>
              </div>
              <button
                type="button"
                onClick={() => onNewTask(col.id)}
                title={`Add task to ${col.label}`}
                className="p-1 text-slate-500 hover:text-indigo-600 hover:bg-white rounded-md transition cursor-pointer"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            {/* Task Cards List */}
            <div className="space-y-2.5 flex-1 overflow-y-auto">
              {columnTasks.length === 0 ? (
                <div className="h-32 border-2 border-dashed border-slate-200 rounded-xl flex items-center justify-center text-slate-400 text-xs italic">
                  No tasks in {col.label}
                </div>
              ) : (
                columnTasks.map((task) => {
                  const isOverdue =
                    task.dueDate &&
                    isPast(new Date(task.dueDate)) &&
                    task.status !== 'Done';

                  const priorityInfo =
                    PRIORITY_BADGES[task.priority] || PRIORITY_BADGES.Medium;

                  return (
                    <div
                      key={task._id}
                      className="bg-white rounded-xl p-3.5 shadow-xs border border-slate-200/80 hover:shadow-md hover:border-indigo-300 transition group flex flex-col gap-2.5 cursor-pointer"
                      onClick={() => onOpenTask(task._id)}
                    >
                      {/* Priority & Overdue row */}
                      <div className="flex items-center justify-between gap-1">
                        <span
                          className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${priorityInfo.className}`}
                        >
                          {priorityInfo.label}
                        </span>

                        {isOverdue && (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-rose-600 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded-full">
                            <AlertCircle className="w-3 h-3" />
                            <span>Overdue</span>
                          </span>
                        )}
                      </div>

                      {/* Title */}
                      <h4 className="text-xs font-semibold text-slate-900 group-hover:text-indigo-600 transition leading-snug line-clamp-2">
                        {task.title}
                      </h4>

                      {/* Meta Footer */}
                      <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                        {/* Due Date */}
                        <div className="flex items-center gap-1">
                          {task.dueDate ? (
                            <>
                              <Calendar className="w-3 h-3 text-slate-400" />
                              <span className={isOverdue ? 'text-rose-600 font-medium' : ''}>
                                {format(new Date(task.dueDate), 'MMM d')}
                              </span>
                            </>
                          ) : (
                            <span className="text-[10px] text-slate-400 italic">No date</span>
                          )}
                        </div>

                        {/* Assignee Avatar */}
                        {task.assignee ? (
                          <div
                            title={`Assigned to ${task.assignee.name}`}
                            className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-700 text-[10px] font-bold flex items-center justify-center border border-indigo-200"
                          >
                            {task.assignee.name.charAt(0).toUpperCase()}
                          </div>
                        ) : (
                          <span className="text-[10px] text-slate-400">Unassigned</span>
                        )}
                      </div>

                      {/* Dropdown-based Quick Status Change (Candidate Brief: Dropdown-based status changes are sufficient) */}
                      <div
                        className="pt-1"
                        onClick={(e) => e.stopPropagation()} // Prevent opening task modal when changing status dropdown
                      >
                        <select
                          value={task.status}
                          onChange={(e) =>
                            onUpdateStatus(task._id, e.target.value as TaskStatus, task.version)
                          }
                          className="w-full text-[10px] font-medium py-1 px-2 bg-slate-50 hover:bg-slate-100 text-slate-600 rounded-lg border border-slate-200 transition cursor-pointer"
                        >
                          <option value="Backlog">Move to Backlog</option>
                          <option value="To Do">Move to To Do</option>
                          <option value="In Progress">Move to In Progress</option>
                          <option value="Done">Move to Done</option>
                        </select>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};
