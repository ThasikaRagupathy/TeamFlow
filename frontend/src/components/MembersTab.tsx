'use client';

import React, { useState } from 'react';
import { Project, User } from '../types';
import { useAuth } from '../context/AuthContext';
import { api } from '../lib/api';
import { ConfirmModal } from './ConfirmModal';
import {
  UserPlus,
  Shield,
  Trash2,
  AlertCircle,
  CheckCircle2,
  Users,
} from 'lucide-react';
import { format } from 'date-fns';

interface MembersTabProps {
  project: Project;
  userRole: 'owner' | 'member';
  onProjectUpdated: () => void;
}

export const MembersTab: React.FC<MembersTabProps> = ({
  project,
  userRole,
  onProjectUpdated,
}) => {
  const { user } = useAuth();
  const [emailToAdd, setEmailToAdd] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [addError, setAddError] = useState<string | null>(null);
  const [addSuccess, setAddSuccess] = useState<string | null>(null);

  const [memberToRemove, setMemberToRemove] = useState<User | null>(null);
  const [isRemoving, setIsRemoving] = useState(false);
  const [removeError, setRemoveError] = useState<string | null>(null);

  const isOwner = userRole === 'owner';

  const handleAddMember = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailToAdd.trim()) return;

    setIsAdding(true);
    setAddError(null);
    setAddSuccess(null);

    try {
      await api.addMember(project._id, emailToAdd.trim());
      setAddSuccess(`User "${emailToAdd.trim()}" added to the project!`);
      setEmailToAdd('');
      onProjectUpdated();
    } catch (err: any) {
      setAddError(err.message || 'Failed to add member');
    } finally {
      setIsAdding(false);
    }
  };

  const handleConfirmRemove = async () => {
    if (!memberToRemove) return;

    setIsRemoving(true);
    setRemoveError(null);

    try {
      const memberId = memberToRemove._id || memberToRemove.id;
      await api.removeMember(project._id, memberId);
      setMemberToRemove(null);
      onProjectUpdated();
    } catch (err: any) {
      setRemoveError(err.message || 'Failed to remove member');
    } finally {
      setIsRemoving(false);
    }
  };

  const ownerId = project.owner ? project.owner._id || project.owner.id : '';

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header Info */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
        <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
          <Users className="w-5 h-5 text-indigo-600" />
          <span>Project Team & Members</span>
        </h3>
        <p className="text-xs text-slate-500 mt-1">
          Manage team access. Removing a member immediately revokes their project access and unassigns
          any tasks assigned to them.
        </p>
      </div>

      {/* Add Member Box (Owner Only) */}
      {isOwner && (
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
          <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
            <UserPlus className="w-4 h-4 text-indigo-600" />
            <span>Add Registered User by Email</span>
          </h4>

          {addError && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{addError}</span>
            </div>
          )}

          {addSuccess && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{addSuccess}</span>
            </div>
          )}

          <form onSubmit={handleAddMember} className="flex flex-col sm:flex-row gap-2">
            <input
              type="email"
              required
              value={emailToAdd}
              onChange={(e) => setEmailToAdd(e.target.value)}
              placeholder="e.g. charlie@example.com"
              className="flex-1 px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 transition"
            />
            <button
              type="submit"
              disabled={isAdding || !emailToAdd.trim()}
              className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold shadow-xs flex items-center justify-center gap-1.5 transition disabled:opacity-50 cursor-pointer"
            >
              {isAdding && (
                <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              )}
              <span>Add Member</span>
            </button>
          </form>
        </div>
      )}

      {/* Members List */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-200/80 bg-slate-50/50 flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-600">
            Current Members ({project.members.length})
          </span>
        </div>

        {removeError && (
          <div className="m-4 p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{removeError}</span>
          </div>
        )}

        <div className="divide-y divide-slate-100">
          {project.members.map((member) => {
            const memberUser = member.user;
            const mId = memberUser._id || memberUser.id;
            const isMemberOwner = mId === ownerId || member.role === 'owner';

            return (
              <div
                key={mId}
                className="p-4 flex items-center justify-between gap-4 hover:bg-slate-50/60 transition"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-indigo-100 text-indigo-700 font-bold text-xs flex items-center justify-center border border-indigo-200">
                    {memberUser.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-900">{memberUser.name}</span>
                      {isMemberOwner ? (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-purple-700 bg-purple-50 border border-purple-200 px-2 py-0.5 rounded-full">
                          <Shield className="w-3 h-3" />
                          Owner
                        </span>
                      ) : (
                        <span className="text-[10px] font-semibold text-slate-500 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded-full">
                          Member
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-400 mt-0.5">{memberUser.email}</p>
                  </div>
                </div>

                <div>
                  {isOwner && !isMemberOwner ? (
                    <button
                      type="button"
                      onClick={() => setMemberToRemove(memberUser)}
                      title={`Remove ${memberUser.name} from project`}
                      className="text-xs font-semibold text-slate-400 hover:text-rose-600 p-2 rounded-lg hover:bg-rose-50 transition flex items-center gap-1 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">Remove</span>
                    </button>
                  ) : isMemberOwner ? (
                    <span className="text-[11px] text-slate-400 italic">Project Owner</span>
                  ) : null}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Remove Member Confirmation */}
      <ConfirmModal
        isOpen={!!memberToRemove}
        title="Remove Member from Project"
        message={`Are you sure you want to remove ${memberToRemove?.name} (${memberToRemove?.email})? Their project access will be revoked immediately and all tasks assigned to them will be unassigned.`}
        confirmLabel="Remove Member"
        isDestructive={true}
        isLoading={isRemoving}
        onConfirm={handleConfirmRemove}
        onCancel={() => setMemberToRemove(null)}
      />
    </div>
  );
};
