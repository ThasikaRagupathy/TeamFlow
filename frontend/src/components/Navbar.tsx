'use client';

import React from 'react';
import Link from 'next/link';
import { useAuth } from '../context/AuthContext';
import {
  LogOut,
  FolderKanban,
  Shield,
  ChevronRight,
  Sparkles,
  LayoutDashboard,
  Circle,
} from 'lucide-react';

interface NavbarProps {
  projectName?: string;
  userRole?: 'owner' | 'member';
}

export const Navbar: React.FC<NavbarProps> = ({
  projectName,
  userRole,
}) => {
  const { user, logout } = useAuth();

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/70 bg-white/85 backdrop-blur-2xl">
      {/* Subtle top gradient */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-indigo-300 to-transparent opacity-70" />

      <div className="mx-auto flex h-[68px] max-w-[1440px] items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* =====================================================
            LEFT
        ====================================================== */}

        <div className="flex min-w-0 items-center gap-3">
          {/* TeamFlow Brand */}
          <Link
            href="/projects"
            className="group flex shrink-0 items-center gap-3"
          >
            <div className="relative">
              {/* Glow */}
              <div className="absolute inset-[-5px] rounded-2xl bg-indigo-500/15 opacity-0 blur-xl transition duration-300 group-hover:opacity-100" />

              {/* Logo */}
              <div className="relative flex h-10 w-10 items-center justify-center rounded-[13px] bg-gradient-to-br from-violet-600 via-indigo-600 to-blue-600 text-[11px] font-black tracking-tight text-white shadow-lg shadow-indigo-500/20 transition duration-300 group-hover:-translate-y-0.5 group-hover:shadow-indigo-500/30">
                TF
              </div>
            </div>

            <div className="hidden sm:block">
              <div className="flex items-center gap-1.5">
                <span className="text-[15px] font-black tracking-tight text-slate-950">
                  TeamFlow
                </span>

                <Sparkles className="h-3 w-3 text-violet-500" />
              </div>

              <div className="mt-0.5 flex items-center gap-1.5">
                <span className="text-[8px] font-bold uppercase tracking-[0.18em] text-slate-400">
                  Team Workspace
                </span>

                <span className="h-1 w-1 rounded-full bg-emerald-400" />

                <span className="text-[8px] font-semibold text-emerald-500">
                  Online
                </span>
              </div>
            </div>
          </Link>

          {/* Breadcrumb */}
          {projectName && (
            <>
              <div className="hidden h-7 w-px bg-slate-200 sm:block" />

              <ChevronRight className="h-4 w-4 shrink-0 text-slate-300 sm:hidden" />

              <div className="flex min-w-0 items-center gap-2.5">
                <ChevronRight className="hidden h-4 w-4 shrink-0 text-slate-300 sm:block" />

                {/* Project Icon */}
                <div className="hidden h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 sm:flex">
                  <LayoutDashboard className="h-3.5 w-3.5" />
                </div>

                {/* Project Info */}
                <div className="min-w-0">
                  <p className="max-w-[130px] truncate text-[11px] font-black text-slate-900 sm:max-w-[220px] sm:text-xs">
                    {projectName}
                  </p>

                  <p className="hidden text-[8px] font-medium uppercase tracking-wider text-slate-400 sm:block">
                    Current workspace
                  </p>
                </div>

                {/* Role */}
                {userRole && (
                  <span
                    className={`
                      hidden items-center gap-1.5 rounded-full border px-2.5 py-1
                      text-[9px] font-bold sm:inline-flex
                      ${
                        userRole === 'owner'
                          ? 'border-violet-200 bg-violet-50 text-violet-700'
                          : 'border-slate-200 bg-slate-50 text-slate-600'
                      }
                    `}
                  >
                    {userRole === 'owner' ? (
                      <Shield className="h-3 w-3" />
                    ) : (
                      <Circle className="h-2 w-2 fill-current" />
                    )}

                    {userRole === 'owner' ? 'Owner' : 'Member'}
                  </span>
                )}
              </div>
            </>
          )}
        </div>

        {/* =====================================================
            RIGHT
        ====================================================== */}

        <div className="flex items-center gap-2">
          {/* All Projects */}
          <Link
            href="/projects"
            className="
              hidden sm:inline-flex
              items-center gap-2
              rounded-xl
              border border-slate-200/80
              bg-white/80
              px-3.5 py-2.5
              text-[10px] font-bold
              text-slate-600
              shadow-sm
              transition-all duration-200
              hover:border-indigo-200
              hover:bg-indigo-50/50
              hover:text-indigo-600
              hover:shadow-indigo-100
            "
          >
            <FolderKanban className="h-3.5 w-3.5" />
            All Projects
          </Link>

          {/* Vertical Divider */}
          <div className="mx-1 hidden h-8 w-px bg-slate-200 sm:block" />

          {/* User */}
          {user && (
            <div className="group flex items-center gap-2.5 rounded-xl px-1.5 py-1.5 transition hover:bg-slate-50">
              {/* Avatar */}
              <div className="relative">
                <div className="relative flex h-9 w-9 items-center justify-center overflow-hidden rounded-xl border border-indigo-100 bg-gradient-to-br from-indigo-50 via-violet-50 to-purple-100 shadow-sm">
                  <span className="bg-gradient-to-br from-indigo-600 to-violet-600 bg-clip-text text-xs font-black text-transparent">
                    {user.name.charAt(0).toUpperCase()}
                  </span>
                </div>

                {/* Online indicator */}
                <span className="absolute -bottom-0.5 -right-0.5 flex h-3 w-3 items-center justify-center rounded-full border-2 border-white bg-emerald-500">
                  <span className="h-1 w-1 rounded-full bg-white" />
                </span>
              </div>

              {/* User details */}
              <div className="hidden max-w-[155px] md:block">
                <p className="truncate text-[11px] font-black leading-tight text-slate-950">
                  {user.name}
                </p>

                <p className="mt-0.5 truncate text-[9px] font-medium leading-tight text-slate-400">
                  {user.email}
                </p>
              </div>
            </div>
          )}

          {/* Logout */}
          <button
            type="button"
            onClick={() => logout()}
            title="Log out"
            aria-label="Log out"
            className="
              group
              flex h-9 w-9
              items-center justify-center
              rounded-xl
              border border-slate-200/80
              bg-white/80
              text-slate-500
              shadow-sm
              transition-all duration-200
              hover:border-rose-200
              hover:bg-rose-50
              hover:text-rose-600
              hover:shadow-rose-100
            "
          >
            <LogOut className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
          </button>
        </div>
      </div>
    </header>
  );
};