'use client';

import Link from 'next/link';
import {
  LogOut,
  FolderKanban,
  Shield,
  ChevronRight,
  LayoutDashboard,
  Circle,
} from 'lucide-react';

import { useAuth } from '../context/AuthContext';
import ThemeToggle from './ThemeToggle';

interface NavbarProps {
  projectName?: string;
}

export default function Navbar({ projectName }: NavbarProps) {
  const { user, logout } = useAuth();

  const isOwner = false;
  const userInitial = user?.name?.charAt(0)?.toUpperCase() || 'U';

  return (
    <header className="sticky top-0 z-50 border-b border-[var(--border)] bg-[var(--background)]/85 backdrop-blur-2xl transition-colors duration-300">
      <div className="absolute left-0 right-0 top-0 h-px bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-60" />

      <div className="mx-auto flex h-[72px] max-w-[1600px] items-center px-4 sm:px-6 lg:px-8">
        <Link href="/projects" className="group flex items-center gap-3">
          <div className="relative flex h-10 w-10 items-center justify-center overflow-hidden rounded-xl bg-gradient-to-br from-indigo-500 via-violet-500 to-purple-600 shadow-lg shadow-indigo-500/20 transition-transform duration-200 group-hover:scale-105">
            <span className="text-sm font-black tracking-tight text-white">
              TF
            </span>
            <div className="absolute inset-0 bg-white/10 opacity-0 transition duration-200 group-hover:opacity-100" />
          </div>

          <div className="hidden sm:block">
            <div className="flex items-center gap-2">
              <span className="text-[15px] font-bold tracking-tight text-[var(--foreground)]">
                TeamFlow
              </span>
              <span className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                Live
              </span>
            </div>

            <div className="mt-0.5 flex items-center gap-1.5">
              <Circle size={6} fill="currentColor" className="text-emerald-500" />
              <span className="text-[10px] font-medium text-[var(--muted)]">
                Team Workspace
              </span>
            </div>
          </div>
        </Link>

        <div className="mx-4 hidden h-8 w-px bg-[var(--border)] lg:block" />

        <div className="hidden items-center gap-2 lg:flex">
          <Link
            href="/projects"
            className="group flex items-center gap-2 rounded-lg px-2.5 py-1.5 text-[12px] font-medium text-[var(--muted)] transition hover:bg-[var(--surface-hover)] hover:text-[var(--foreground)]"
          >
            <LayoutDashboard size={14} />
            <span>Workspace</span>
          </Link>

          {projectName && (
            <>
              <ChevronRight size={14} className="text-[var(--muted-light)]" />
              <div className="flex items-center gap-2 rounded-lg bg-[var(--surface-secondary)] px-2.5 py-1.5">
                <FolderKanban size={14} className="text-indigo-500" />
                <div className="max-w-[220px]">
                  <p className="truncate text-[12px] font-semibold text-[var(--foreground)]">
                    {projectName}
                  </p>
                  <p className="text-[9px] text-[var(--muted)]">
                    Current project
                  </p>
                </div>
              </div>
            </>
          )}
        </div>

        <div className="ml-auto flex items-center gap-2">
          {user && (
            <div className="hidden items-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 py-2 md:flex">
              {isOwner && (
                <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
                  <Shield size={13} />
                </div>
              )}
              <div>
                <p className="text-[9px] font-medium uppercase tracking-wider text-[var(--muted)]">
                  Role
                </p>
                <p className="text-[11px] font-bold capitalize text-[var(--foreground)]">
                  {isOwner ? 'Owner' : 'Member'}
                </p>
              </div>
            </div>
          )}

          <ThemeToggle />

          <div className="mx-1 hidden h-8 w-px bg-[var(--border)] sm:block" />

          {user && (
            <div className="flex items-center gap-2.5">
              <div className="relative">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 text-sm font-bold text-white shadow-md shadow-indigo-500/15">
                  {userInitial}
                </div>
                <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-[var(--background)] bg-emerald-500" />
              </div>

              <div className="hidden max-w-[150px] sm:block">
                <p className="truncate text-[12px] font-bold text-[var(--foreground)]">
                  {user.name}
                </p>
                <p className="truncate text-[10px] text-[var(--muted)]">
                  {user.email}
                </p>
              </div>
            </div>
          )}

          <button
            type="button"
            onClick={logout}
            title="Sign out"
            aria-label="Sign out"
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-[var(--border)] bg-[var(--surface)] text-[var(--muted)] transition-all duration-200 hover:border-red-200 hover:bg-red-50 hover:text-red-600 dark:hover:border-red-500/20 dark:hover:bg-red-500/10 dark:hover:text-red-400"
          >
            <LogOut size={17} />
          </button>
        </div>
      </div>

      {projectName && (
        <div className="border-t border-[var(--border)] bg-[var(--surface-secondary)] px-4 py-2.5 lg:hidden">
          <div className="flex items-center gap-2">
            <FolderKanban size={14} className="shrink-0 text-indigo-500" />
            <div className="min-w-0">
              <p className="truncate text-[11px] font-bold text-[var(--foreground)]">
                {projectName}
              </p>
              <p className="text-[9px] text-[var(--muted)]">
                Current project
              </p>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
