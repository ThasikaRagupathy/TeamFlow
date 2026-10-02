'use client';

import React from 'react';
import { RefreshCw, AlertCircle, X } from 'lucide-react';
import { Task } from '../types';

interface ConflictModalProps {
  isOpen: boolean;
  latestTask?: Task | null;
  onReload: () => void;
  onClose: () => void;
}

export const ConflictModal: React.FC<ConflictModalProps> = ({
  isOpen,
  latestTask,
  onReload,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in"
    >
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-rose-100 animate-in zoom-in-95">
        <div className="flex items-start gap-3.5 mb-4">
          <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center shrink-0">
            <AlertCircle className="w-5 h-5" />
          </div>
          <div className="flex-1">
            <h3 className="text-base font-bold text-slate-900">
              Edit Conflict Detected (OCC)
            </h3>
            <p className="mt-1 text-xs text-slate-600 leading-relaxed">
              Another team member has updated this task while you were making changes. To prevent
              overwriting their updates, your changes have not been saved.
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100 transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {latestTask && (
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 my-4 text-xs space-y-2">
            <div className="font-semibold text-slate-700">Latest Database State:</div>
            <div className="grid grid-cols-2 gap-2 text-slate-600">
              <div>
                <span className="text-slate-400">Title:</span> {latestTask.title}
              </div>
              <div>
                <span className="text-slate-400">Status:</span>{' '}
                <span className="font-medium text-slate-800">{latestTask.status}</span>
              </div>
              <div>
                <span className="text-slate-400">Priority:</span>{' '}
                <span className="font-medium text-slate-800">{latestTask.priority}</span>
              </div>
              <div>
                <span className="text-slate-400">Assignee:</span>{' '}
                <span className="font-medium text-slate-800">
                  {latestTask.assignee ? latestTask.assignee.name : 'Unassigned'}
                </span>
              </div>
            </div>
          </div>
        )}

        <div className="mt-6 flex items-center justify-end gap-2.5">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 rounded-lg transition cursor-pointer"
          >
            Discard My Changes
          </button>
          <button
            type="button"
            onClick={onReload}
            className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs transition flex items-center gap-1.5 cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Reload Latest Task</span>
          </button>
        </div>
      </div>
    </div>
  );
};
