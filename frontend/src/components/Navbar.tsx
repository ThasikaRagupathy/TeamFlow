'use client';

import React from 'react';
import Link from 'next/link';
import { useAuth } from '../context/AuthContext';
import { LogOut, FolderKanban, Shield, User as UserIcon } from 'lucide-react';

interface NavbarProps {
  projectName?: string;
  userRole?: 'owner' | 'member';
}

export const Navbar: React.FC<NavbarProps> = ({ projectName, userRole }) => {
  const { user, logout } = useAuth();

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Left: Brand & Breadcrumbs */}
        <div className="flex items-center gap-4">
          <Link href="/projects" className="flex items-center gap-2.5 font-bold text-slate-900 group">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-black text-sm shadow-sm group-hover:bg-indigo-700 transition">
              TF
            </div>
            <span className="text-base tracking-tight hidden sm:inline">TeamFlow</span>
          </Link>

          {projectName && (
            <>
              <span className="text-slate-300 font-light">/</span>
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-slate-800 max-w-[200px] truncate">
                  {projectName}
                </span>
                {userRole && (
                  <span
                    className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                      userRole === 'owner'
                        ? 'bg-purple-50 text-purple-700 border border-purple-200'
                        : 'bg-slate-100 text-slate-600 border border-slate-200'
                    }`}
                  >
                    {userRole === 'owner' && <Shield className="w-3 h-3" />}
                    {userRole === 'owner' ? 'Project Owner' : 'Member'}
                  </span>
                )}
              </div>
            </>
          )}
        </div>

        {/* Right: User Profile & Actions */}
        <div className="flex items-center gap-3">
          <Link
            href="/projects"
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition"
          >
            <FolderKanban className="w-3.5 h-3.5" />
            <span>All Projects</span>
          </Link>

          <div className="h-4 w-px bg-slate-200 hidden sm:block" />

          {user && (
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 font-bold text-xs flex items-center justify-center border border-indigo-200">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <div className="hidden md:block text-left">
                <p className="text-xs font-semibold text-slate-900 leading-tight">{user.name}</p>
                <p className="text-[10px] text-slate-500 leading-tight truncate max-w-[140px]">{user.email}</p>
              </div>
            </div>
          )}

          <button
            onClick={() => logout()}
            title="Log out"
            className="p-2 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
