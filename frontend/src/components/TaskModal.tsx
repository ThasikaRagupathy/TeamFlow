'use client';

import React, { useState, useEffect } from 'react';
import { Task, Project, Comment, TaskStatus, TaskPriority } from '../types';
import { useAuth } from '../context/AuthContext';
import { api, ApiError } from '../lib/api';
import { ConfirmModal } from './ConfirmModal';
import { ConflictModal } from './ConflictModal';
import {
  X,
  Calendar,
  User as UserIcon,
  Tag,
  Clock,
  Trash2,
  Send,
  MessageSquare,
  AlertCircle,
  Lock,
} from 'lucide-react';
import { format, formatDistanceToNow } from 'date-fns';

interface TaskModalProps {
  isOpen: boolean;
  taskId?: string | null; // null for new task
  project: Project;
  userRole: 'owner' | 'member';
  initialStatus?: TaskStatus;
  onClose: () => void;
  onSaved: () => void;
  onDeleted?: () => void;
}

export const TaskModal: React.FC<TaskModalProps> = ({
  isOpen,
  taskId,
  project,
  userRole,
  initialStatus = 'To Do',
  onClose,
  onSaved,
  onDeleted,
}) => {
  const { user } = useAuth();
  const isEditing = !!taskId;

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<TaskStatus>(initialStatus);
  const [priority, setPriority] = useState<TaskPriority>('Medium');
  const [assigneeId, setAssigneeId] = useState<string>('');
  const [dueDate, setDueDate] = useState<string>('');
  const [version, setVersion] = useState<number>(1);
  const [creatorId, setCreatorId] = useState<string>('');

  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // OCC Conflict State
  const [conflictOpen, setConflictOpen] = useState(false);
  const [latestTaskOCC, setLatestTaskOCC] = useState<Task | null>(null);

  // Confirmation Modals
  const [confirmDeleteTask, setConfirmDeleteTask] = useState(false);
  const [commentToDelete, setCommentToDelete] = useState<string | null>(null);

  const isCreator = user ? creatorId === user.id || creatorId === (user as any)._id : false;
  const canEditDetails = !isEditing || userRole === 'owner' || isCreator;
  const canAssign = userRole === 'owner';
  const canDeleteTask = isEditing && (userRole === 'owner' || isCreator);

  // Fetch task and comments when opening an existing task
  useEffect(() => {
    if (isOpen && taskId) {
      loadTaskData(taskId);
    } else if (isOpen && !taskId) {
      // New task reset
      setTitle('');
      setDescription('');
      setStatus(initialStatus);
      setPriority('Medium');
      setAssigneeId('');
      setDueDate('');
      setVersion(1);
      setCreatorId(user?.id || '');
      setComments([]);
      setError(null);
    }
  }, [isOpen, taskId, initialStatus]);

  const loadTaskData = async (id: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await api.getTaskById(id);
      const t = res.task;
      setTitle(t.title);
      setDescription(t.description || '');
      setStatus(t.status);
      setPriority(t.priority);
      setAssigneeId(t.assignee ? t.assignee._id || t.assignee.id : '');
      setDueDate(t.dueDate ? t.dueDate.split('T')[0] : '');
      setVersion(t.version);
      setCreatorId(t.creator ? t.creator._id || t.creator.id : '');
      setComments(res.comments || []);
    } catch (err: any) {
      setError(err.message || 'Failed to load task details');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Task title is required');
      return;
    }

    setIsSaving(true);
    setError(null);

    const payload: any = {
      title: title.trim(),
      description: description.trim(),
      status,
      priority,
      dueDate: dueDate ? new Date(dueDate).toISOString() : null,
    };

    if (canAssign) {
      payload.assignee = assigneeId || null;
    }

    try {
      if (isEditing && taskId) {
        payload.version = version;
        await api.updateTask(taskId, payload);
      } else {
        await api.createTask(project._id, payload);
      }
      onSaved();
      onClose();
    } catch (err: any) {
      if (err instanceof ApiError && err.isConflict) {
        setLatestTaskOCC(err.latestTask);
        setConflictOpen(true);
      } else {
        setError(err.message || 'Failed to save task');
      }
    } finally {
      setIsSaving(false);
    }
  };

  const handleReloadConflict = () => {
    setConflictOpen(false);
    if (taskId) {
      loadTaskData(taskId);
    }
  };

  const handleDeleteTask = async () => {
    if (!taskId) return;
    setIsSaving(true);
    try {
      await api.deleteTask(taskId);
      setConfirmDeleteTask(false);
      if (onDeleted) onDeleted();
      onSaved();
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to delete task');
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !taskId) return;

    setIsSubmittingComment(true);
    try {
      const res = await api.addComment(taskId, newComment.trim());
      setComments([...comments, res.comment]);
      setNewComment('');
    } catch (err: any) {
      setError(err.message || 'Failed to add comment');
    } finally {
      setIsSubmittingComment(false);
    }
  };

  const handleDeleteComment = async () => {
    if (!commentToDelete) return;
    try {
      await api.deleteComment(commentToDelete);
      setComments(comments.filter((c) => c._id !== commentToDelete));
      setCommentToDelete(null);
    } catch (err: any) {
      setError(err.message || 'Failed to delete comment');
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div
        role="dialog"
        aria-modal="true"
        className="fixed inset-0 z-40 flex items-center justify-center p-3 sm:p-6 bg-slate-900/50 backdrop-blur-xs animate-in fade-in overflow-y-auto"
      >
        <div className="bg-white rounded-2xl max-w-2xl w-full my-auto shadow-2xl border border-slate-100 flex flex-col max-h-[90vh] overflow-hidden animate-in zoom-in-95">
          {/* Header */}
          <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between shrink-0 bg-slate-50/50">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">
                {isEditing ? `Task #${version}` : 'New Task'}
              </span>
              <h2 className="text-base font-bold text-slate-900">
                {isEditing ? 'Task Details & Activity' : 'Create New Task'}
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {isLoading ? (
              <div className="py-12 flex flex-col items-center justify-center gap-2 text-slate-400">
                <div className="w-8 h-8 border-3 border-indigo-600 border-t-transparent rounded-full animate-spin" />
                <span className="text-xs">Loading task information...</span>
              </div>
            ) : (
              <>
                {error && (
                  <div className="p-3.5 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                {!canEditDetails && isEditing && (
                  <div className="p-3 bg-amber-50 border border-amber-200 text-amber-800 rounded-xl text-xs flex items-center gap-2">
                    <Lock className="w-4 h-4 text-amber-600 shrink-0" />
                    <span>
                      Viewing Mode: As a project member, you can change the status or post comments.
                      Only the creator or project owner can edit task details.
                    </span>
                  </div>
                )}

                <form id="task-form" onSubmit={handleSubmit} className="space-y-4">
                  {/* Title */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Title <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      maxLength={150}
                      disabled={!canEditDetails}
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="e.g. Implement authentication rate limiting"
                      className="w-full px-3.5 py-2 rounded-lg border border-slate-300 text-sm focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 disabled:bg-slate-100 disabled:text-slate-600 transition"
                    />
                    <div className="text-[10px] text-slate-400 text-right mt-1">
                      {title.length}/150 characters
                    </div>
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Description
                    </label>
                    <textarea
                      rows={3}
                      maxLength={5000}
                      disabled={!canEditDetails}
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Add detailed context, repro steps, or acceptance criteria..."
                      className="w-full px-3.5 py-2 rounded-lg border border-slate-300 text-sm focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 disabled:bg-slate-100 disabled:text-slate-600 transition"
                    />
                  </div>

                  {/* Controls Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                    {/* Status (Editable by ANY project member!) */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
                        <Tag className="w-3.5 h-3.5 text-slate-400" />
                        <span>Status</span>
                      </label>
                      <select
                        value={status}
                        onChange={(e) => setStatus(e.target.value as TaskStatus)}
                        className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 bg-white transition cursor-pointer"
                      >
                        <option value="Backlog">Backlog</option>
                        <option value="To Do">To Do</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Done">Done</option>
                      </select>
                    </div>

                    {/* Priority */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
                        <Tag className="w-3.5 h-3.5 text-slate-400" />
                        <span>Priority</span>
                      </label>
                      <select
                        disabled={!canEditDetails}
                        value={priority}
                        onChange={(e) => setPriority(e.target.value as TaskPriority)}
                        className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 bg-white disabled:bg-slate-100 transition cursor-pointer"
                      >
                        <option value="Low">Low</option>
                        <option value="Medium">Medium</option>
                        <option value="High">High</option>
                        <option value="Critical">Critical</option>
                      </select>
                    </div>

                    {/* Assignee (Owner Only Assignment Restriction) */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center justify-between">
                        <span className="flex items-center gap-1.5">
                          <UserIcon className="w-3.5 h-3.5 text-slate-400" />
                          <span>Assignee</span>
                        </span>
                        {!canAssign && (
                          <span className="text-[10px] text-amber-600 font-medium">Owner only</span>
                        )}
                      </label>
                      <select
                        disabled={!canAssign}
                        value={assigneeId}
                        onChange={(e) => setAssigneeId(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 bg-white disabled:bg-slate-100 disabled:cursor-not-allowed transition cursor-pointer"
                      >
                        <option value="">Unassigned</option>
                        {project.members.map((m) => (
                          <option key={m.user._id || m.user.id} value={m.user._id || m.user.id}>
                            {m.user.name} ({m.user.email})
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Due Date */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        <span>Due Date</span>
                      </label>
                      <input
                        type="date"
                        disabled={!canEditDetails}
                        value={dueDate}
                        onChange={(e) => setDueDate(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 bg-white disabled:bg-slate-100 transition cursor-pointer"
                      >
                      </input>
                    </div>
                  </div>
                </form>

                {/* Comments Section (Existing Tasks) */}
                {isEditing && (
                  <div className="pt-6 border-t border-slate-200">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-4 flex items-center gap-1.5">
                      <MessageSquare className="w-3.5 h-3.5 text-indigo-600" />
                      <span>Comments ({comments.length})</span>
                    </h3>

                    <div className="space-y-3 mb-4">
                      {comments.length === 0 ? (
                        <p className="text-xs text-slate-400 italic">No comments yet. Start the discussion below.</p>
                      ) : (
                        comments.map((c) => {
                          const authorId = c.author ? c.author._id || c.author.id : '';
                          const currentUserId = user ? user.id || (user as any)._id : '';
                          const canDeleteComment =
                            userRole === 'owner' || authorId === currentUserId;

                          return (
                            <div
                              key={c._id}
                              className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-start justify-between gap-3 text-xs"
                            >
                              <div className="space-y-1">
                                <div className="flex items-center gap-2">
                                  <span className="font-semibold text-slate-800">
                                    {c.author?.name || 'Unknown'}
                                  </span>
                                  <span className="text-[10px] text-slate-400">
                                    {c.createdAt
                                      ? formatDistanceToNow(new Date(c.createdAt), { addSuffix: true })
                                      : ''}
                                  </span>
                                </div>
                                <p className="text-slate-700 leading-relaxed whitespace-pre-wrap">
                                  {c.content}
                                </p>
                              </div>
                              {canDeleteComment && (
                                <button
                                  type="button"
                                  onClick={() => setCommentToDelete(c._id)}
                                  title="Delete comment"
                                  className="text-slate-400 hover:text-rose-600 p-1 rounded transition cursor-pointer"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              )}
                            </div>
                          );
                        })
                      )}
                    </div>

                    {/* Add Comment Form */}
                    <form onSubmit={handleAddComment} className="flex gap-2">
                      <input
                        type="text"
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder="Write a comment..."
                        className="flex-1 px-3.5 py-2 text-xs rounded-lg border border-slate-300 focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 transition"
                      />
                      <button
                        type="submit"
                        disabled={isSubmittingComment || !newComment.trim()}
                        className="px-3 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition disabled:opacity-50 cursor-pointer"
                      >
                        <Send className="w-3 h-3" />
                        <span>Send</span>
                      </button>
                    </form>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Footer */}
          <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between shrink-0">
            <div>
              {canDeleteTask && (
                <button
                  type="button"
                  onClick={() => setConfirmDeleteTask(true)}
                  className="text-xs font-semibold text-rose-600 hover:text-rose-700 flex items-center gap-1.5 p-1 rounded transition cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete Task</span>
                </button>
              )}
            </div>

            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-200 rounded-lg transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                form="task-form"
                type="submit"
                disabled={isSaving || isLoading}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold shadow-xs flex items-center gap-1.5 transition disabled:opacity-50 cursor-pointer"
              >
                {isSaving && (
                  <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                )}
                <span>{isEditing ? 'Save Changes' : 'Create Task'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Task Confirmation */}
      <ConfirmModal
        isOpen={confirmDeleteTask}
        title="Delete Task"
        message={`Are you sure you want to delete "${title}"? This action cannot be undone.`}
        confirmLabel="Delete Task"
        isDestructive={true}
        isLoading={isSaving}
        onConfirm={handleDeleteTask}
        onCancel={() => setConfirmDeleteTask(false)}
      />

      {/* Delete Comment Confirmation */}
      <ConfirmModal
        isOpen={!!commentToDelete}
        title="Delete Comment"
        message="Are you sure you want to delete this comment?"
        confirmLabel="Delete Comment"
        isDestructive={true}
        onConfirm={handleDeleteComment}
        onCancel={() => setCommentToDelete(null)}
      />

      {/* OCC Conflict Modal */}
      <ConflictModal
        isOpen={conflictOpen}
        latestTask={latestTaskOCC}
        onReload={handleReloadConflict}
        onClose={() => setConflictOpen(false)}
      />
    </>
  );
};
