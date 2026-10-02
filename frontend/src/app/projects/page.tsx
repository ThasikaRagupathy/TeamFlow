'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../lib/api';
import { Project } from '../../types';
import { Navbar } from '../../components/Navbar';
import {
  FolderKanban,
  Plus,
  Shield,
  Users,
  ArrowRight,
  AlertCircle,
  X,
  Sparkles,
  Search,
  Layers3,
  Crown,
  UserRound,
  BriefcaseBusiness,
} from 'lucide-react';

export default function ProjectsPage() {
  const { user, isLoading: authLoading } = useAuth();
  const router = useRouter();

  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Create Project Modal
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Search
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (!authLoading && !user) {
      router.replace('/login');
      return;
    }

    if (user) {
      loadProjects();
    }
  }, [user, authLoading, router]);

  const loadProjects = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const res = await api.getProjects();
      setProjects(res.projects);
    } catch (err: any) {
      setError(err.message || 'Failed to load projects');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) return;

    setIsSubmitting(true);
    setError(null);

    try {
      const res = await api.createProject({
        name: name.trim(),
        description: description.trim(),
      });

      setIsCreateOpen(false);
      setName('');
      setDescription('');

      router.push(`/projects/${res.project._id}`);
    } catch (err: any) {
      setError(err.message || 'Failed to create project');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (authLoading || (!user && isLoading)) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f7f8fc]">
        <div className="flex flex-col items-center">
          <div className="relative flex h-14 w-14 items-center justify-center">
            <div className="absolute inset-0 animate-ping rounded-2xl bg-indigo-100 opacity-60" />

            <div className="relative flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-600 shadow-lg shadow-indigo-200">
              <span className="text-xs font-black text-white">TF</span>
            </div>
          </div>

          <p className="mt-4 text-sm font-bold text-slate-900">
            Loading TeamFlow
          </p>

          <p className="mt-1 text-xs text-slate-400">
            Preparing your workspace...
          </p>
        </div>
      </div>
    );
  }

  const userId = user?.id || (user as any)?._id;

  const filteredProjects = projects.filter((project) => {
    const query = searchQuery.toLowerCase().trim();

    if (!query) return true;

    return (
      project.name.toLowerCase().includes(query) ||
      (project.description || '').toLowerCase().includes(query)
    );
  });

  const ownedProjects = projects.filter((project) => {
    const ownerId = project.owner
      ? project.owner._id || project.owner.id
      : '';

    return ownerId === userId;
  }).length;

  const memberProjects = projects.length - ownedProjects;

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#f7f8fc] text-slate-950">
      {/* =========================================================
          AMBIENT BACKGROUND
      ========================================================== */}

      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-40 -top-40 h-[500px] w-[500px] rounded-full bg-violet-200/25 blur-[120px]" />

        <div className="absolute -right-40 top-20 h-[500px] w-[500px] rounded-full bg-indigo-200/25 blur-[130px]" />

        <div className="absolute bottom-[-200px] left-[30%] h-[450px] w-[450px] rounded-full bg-blue-200/15 blur-[130px]" />

        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage:
              'linear-gradient(#64748b 1px, transparent 1px), linear-gradient(90deg, #64748b 1px, transparent 1px)',
            backgroundSize: '32px 32px',
          }}
        />
      </div>

      <Navbar />

      <main className="relative z-10 mx-auto w-full max-w-[1440px] px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
        {/* =========================================================
            HERO HEADER
        ========================================================== */}

        <section className="mb-8">
          <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
            <div>
              <div className="mb-3 flex items-center gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-violet-600 to-indigo-600 shadow-sm shadow-indigo-200">
                  <Sparkles className="h-3.5 w-3.5 text-white" />
                </div>

                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-600">
                  Workspace
                </span>
              </div>

              <h1 className="text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">
                Your Projects
              </h1>

              <p className="mt-2 max-w-xl text-sm leading-6 text-slate-500">
                Manage your team workspaces, collaborate on tasks, and keep
                every project moving forward.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setIsCreateOpen(true)}
              className="group inline-flex items-center justify-center gap-2.5 self-start rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-5 py-3 text-xs font-bold text-white shadow-lg shadow-indigo-200 transition duration-200 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-indigo-200 lg:self-auto"
            >
              <span className="flex h-5 w-5 items-center justify-center rounded-md bg-white/15">
                <Plus className="h-3.5 w-3.5" />
              </span>

              Create New Project

              <ArrowRight className="h-3.5 w-3.5 opacity-60 transition-transform group-hover:translate-x-0.5" />
            </button>
          </div>
        </section>

        {/* =========================================================
            SUMMARY CARDS
        ========================================================== */}

        <section className="mb-7 grid grid-cols-1 gap-4 sm:grid-cols-3">
          {/* Total */}
          <div className="relative overflow-hidden rounded-2xl border border-white/80 bg-white/75 p-5 shadow-[0_8px_30px_rgba(15,23,42,0.05)] backdrop-blur-xl">
            <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-violet-100/60 blur-2xl" />

            <div className="relative flex items-center justify-between">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400">
                  Total Projects
                </p>

                <p className="mt-2 text-3xl font-black text-slate-950">
                  {projects.length}
                </p>

                <p className="mt-1 text-[10px] font-medium text-slate-400">
                  Available workspaces
                </p>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-violet-50 text-violet-600 ring-1 ring-violet-100">
                <Layers3 className="h-5 w-5" />
              </div>
            </div>
          </div>

          {/* Owned */}
          <div className="relative overflow-hidden rounded-2xl border border-white/80 bg-white/75 p-5 shadow-[0_8px_30px_rgba(15,23,42,0.05)] backdrop-blur-xl">
            <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-amber-100/60 blur-2xl" />

            <div className="relative flex items-center justify-between">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400">
                  Owned by You
                </p>

                <p className="mt-2 text-3xl font-black text-slate-950">
                  {ownedProjects}
                </p>

                <p className="mt-1 text-[10px] font-medium text-slate-400">
                  Projects you manage
                </p>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-50 text-amber-600 ring-1 ring-amber-100">
                <Crown className="h-5 w-5" />
              </div>
            </div>
          </div>

          {/* Member */}
          <div className="relative overflow-hidden rounded-2xl border border-white/80 bg-white/75 p-5 shadow-[0_8px_30px_rgba(15,23,42,0.05)] backdrop-blur-xl">
            <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-blue-100/60 blur-2xl" />

            <div className="relative flex items-center justify-between">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400">
                  Member Of
                </p>

                <p className="mt-2 text-3xl font-black text-slate-950">
                  {memberProjects}
                </p>

                <p className="mt-1 text-[10px] font-medium text-slate-400">
                  Shared team projects
                </p>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600 ring-1 ring-blue-100">
                <Users className="h-5 w-5" />
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================
            SEARCH + FILTER BAR
        ========================================================== */}

        {projects.length > 0 && (
          <section className="mb-5">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="relative max-w-md flex-1">
                <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search projects..."
                  className="
                    h-11 w-full rounded-xl
                    border border-slate-200/80
                    bg-white/75
                    pl-10 pr-4
                    text-xs font-medium text-slate-900
                    shadow-sm
                    outline-none
                    backdrop-blur-xl
                    transition
                    placeholder:text-slate-400
                    focus:border-indigo-300
                    focus:ring-4
                    focus:ring-indigo-100/60
                  "
                />
              </div>

              <div className="flex items-center gap-2 text-[10px] font-medium text-slate-400">
                <BriefcaseBusiness className="h-3.5 w-3.5" />

                {filteredProjects.length} project
                {filteredProjects.length !== 1 ? 's' : ''} shown
              </div>
            </div>
          </section>
        )}

        {/* =========================================================
            ERROR
        ========================================================== */}

        {error && (
          <div className="mb-6 flex items-start gap-3 rounded-2xl border border-rose-200 bg-rose-50/80 p-4 text-xs text-rose-800 shadow-sm backdrop-blur">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-rose-100">
              <AlertCircle className="h-4 w-4 text-rose-600" />
            </div>

            <div className="flex-1">
              <p className="font-bold">Something went wrong</p>
              <p className="mt-0.5 text-rose-700/80">{error}</p>
            </div>

            <button
              type="button"
              onClick={() => setError(null)}
              className="rounded-lg p-1 text-rose-400 transition hover:bg-rose-100 hover:text-rose-600"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        )}

        {/* =========================================================
            PROJECT CONTENT
        ========================================================== */}

        {isLoading ? (
          <div className="flex min-h-[360px] flex-col items-center justify-center rounded-3xl border border-white/80 bg-white/70 shadow-[0_12px_40px_rgba(15,23,42,0.05)] backdrop-blur-xl">
            <div className="relative flex h-14 w-14 items-center justify-center">
              <div className="absolute inset-0 animate-ping rounded-2xl bg-indigo-100 opacity-60" />

              <div className="relative flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-600 shadow-lg shadow-indigo-200">
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
              </div>
            </div>

            <p className="mt-5 text-sm font-bold text-slate-900">
              Loading projects
            </p>

            <p className="mt-1 text-xs text-slate-400">
              Fetching your workspaces...
            </p>
          </div>
        ) : projects.length === 0 ? (
          /* =====================================================
              EMPTY STATE
          ====================================================== */

          <div className="relative mx-auto max-w-2xl overflow-hidden rounded-3xl border border-white/80 bg-white/75 px-6 py-16 text-center shadow-[0_12px_40px_rgba(15,23,42,0.06)] backdrop-blur-xl sm:px-10">
            <div className="absolute -left-20 -top-20 h-48 w-48 rounded-full bg-violet-100/60 blur-3xl" />

            <div className="absolute -bottom-20 -right-20 h-48 w-48 rounded-full bg-indigo-100/60 blur-3xl" />

            <div className="relative">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-50 to-indigo-50 text-indigo-600 ring-1 ring-indigo-100">
                <FolderKanban className="h-7 w-7" />
              </div>

              <p className="mt-5 text-[10px] font-black uppercase tracking-[0.2em] text-indigo-500">
                Your workspace starts here
              </p>

              <h3 className="mt-2 text-xl font-black text-slate-950">
                No projects yet
              </h3>

              <p className="mx-auto mt-2 max-w-md text-xs leading-6 text-slate-500">
                Create your first project and start organizing tasks,
                collaborating with your team, and tracking progress.
              </p>

              <button
                type="button"
                onClick={() => setIsCreateOpen(true)}
                className="mt-6 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-5 py-3 text-xs font-bold text-white shadow-lg shadow-indigo-200 transition hover:-translate-y-0.5 hover:shadow-xl"
              >
                <Plus className="h-4 w-4" />
                Create Your First Project
              </button>
            </div>
          </div>
        ) : filteredProjects.length === 0 ? (
          /* =====================================================
              NO SEARCH RESULTS
          ====================================================== */

          <div className="rounded-3xl border border-white/80 bg-white/75 px-6 py-16 text-center shadow-[0_12px_40px_rgba(15,23,42,0.05)] backdrop-blur-xl">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
              <Search className="h-6 w-6" />
            </div>

            <h3 className="mt-4 text-base font-black text-slate-900">
              No matching projects
            </h3>

            <p className="mt-1 text-xs text-slate-400">
              Try searching with a different project name or description.
            </p>

            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="mt-4 text-xs font-bold text-indigo-600 hover:text-indigo-700"
            >
              Clear search
            </button>
          </div>
        ) : (
          /* =====================================================
              PROJECT GRID
          ====================================================== */

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
            {filteredProjects.map((proj) => {
              const ownerId = proj.owner
                ? proj.owner._id || proj.owner.id
                : '';

              const isOwner = ownerId === userId;

              return (
                <Link
                  key={proj._id}
                  href={`/projects/${proj._id}`}
                  className="
                    group relative flex min-h-[255px] flex-col
                    overflow-hidden rounded-3xl
                    border border-white/80
                    bg-white/75
                    p-5
                    shadow-[0_8px_30px_rgba(15,23,42,0.05)]
                    backdrop-blur-xl
                    transition-all duration-300
                    hover:-translate-y-1
                    hover:border-indigo-100
                    hover:bg-white/90
                    hover:shadow-[0_18px_45px_rgba(79,70,229,0.10)]
                  "
                >
                  {/* Card glow */}
                  <div className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-indigo-100/40 blur-3xl opacity-0 transition duration-300 group-hover:opacity-100" />

                  {/* Top */}
                  <div className="relative flex items-start justify-between gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-violet-50 to-indigo-50 text-indigo-600 ring-1 ring-indigo-100 transition duration-300 group-hover:from-indigo-600 group-hover:to-violet-600 group-hover:text-white group-hover:shadow-lg group-hover:shadow-indigo-200">
                      <FolderKanban className="h-5 w-5" />
                    </div>

                    <span
                      className={`
                        inline-flex items-center gap-1.5
                        rounded-full border
                        px-2.5 py-1
                        text-[9px] font-black uppercase tracking-wide
                        ${
                          isOwner
                            ? 'border-violet-200 bg-violet-50 text-violet-700'
                            : 'border-slate-200 bg-slate-50 text-slate-600'
                        }
                      `}
                    >
                      {isOwner ? (
                        <Shield className="h-3 w-3" />
                      ) : (
                        <UserRound className="h-3 w-3" />
                      )}

                      {isOwner ? 'Owner' : 'Member'}
                    </span>
                  </div>

                  {/* Project Info */}
                  <div className="relative mt-5 flex-1">
                    <h3 className="line-clamp-1 text-base font-black leading-snug text-slate-950 transition group-hover:text-indigo-600">
                      {proj.name}
                    </h3>

                    <p className="mt-2 line-clamp-3 text-xs leading-5 text-slate-500">
                      {proj.description || 'No description provided.'}
                    </p>
                  </div>

                  {/* Bottom */}
                  <div className="relative mt-5 border-t border-slate-100 pt-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5 text-[10px] font-medium text-slate-400">
                        <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-slate-50">
                          <Users className="h-3 w-3" />
                        </div>

                        <span>
                          {proj.members.length}{' '}
                          {proj.members.length === 1
                            ? 'member'
                            : 'members'}
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5 text-[10px] font-bold text-indigo-600">
                        <span>Open Workspace</span>

                        <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-indigo-50 transition group-hover:bg-indigo-100">
                          <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </main>

      {/* =========================================================
          CREATE PROJECT MODAL
      ========================================================== */}

      {isCreateOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="create-project-title"
          className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/45 p-4 backdrop-blur-md"
        >
          <div
            className="
              relative w-full max-w-md
              overflow-hidden rounded-3xl
              border border-white/80
              bg-white
              shadow-[0_30px_100px_rgba(15,23,42,0.25)]
            "
          >
            {/* Modal top gradient */}
            <div className="h-1.5 bg-gradient-to-r from-violet-600 via-indigo-600 to-blue-500" />

            {/* Ambient glow */}
            <div className="pointer-events-none absolute -right-20 -top-20 h-48 w-48 rounded-full bg-violet-100/70 blur-3xl" />

            <div className="relative p-6 sm:p-7">
              {/* Modal Header */}
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-violet-50 to-indigo-50 text-indigo-600 ring-1 ring-indigo-100">
                    <FolderKanban className="h-5 w-5" />
                  </div>

                  <div>
                    <h3
                      id="create-project-title"
                      className="text-base font-black text-slate-950"
                    >
                      Create New Project
                    </h3>

                    <p className="mt-0.5 text-[10px] text-slate-400">
                      Set up a new workspace for your team.
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setIsCreateOpen(false)}
                  className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                  aria-label="Close dialog"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleCreateProject} className="mt-6 space-y-5">
                <div>
                  <label
                    htmlFor="project-name"
                    className="mb-1.5 block text-[10px] font-black uppercase tracking-wider text-slate-600"
                  >
                    Project Name{' '}
                    <span className="text-rose-500">*</span>
                  </label>

                  <input
                    id="project-name"
                    type="text"
                    required
                    maxLength={100}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Website Overhaul"
                    autoFocus
                    className="
                      h-11 w-full rounded-xl
                      border border-slate-200
                      bg-slate-50/70
                      px-3.5
                      text-xs font-medium text-slate-900
                      outline-none
                      transition
                      placeholder:text-slate-400
                      focus:border-indigo-400
                      focus:bg-white
                      focus:ring-4
                      focus:ring-indigo-100/60
                    "
                  />

                  <p className="mt-1.5 text-[9px] text-slate-400">
                    Choose a clear name your team will recognize.
                  </p>
                </div>

                <div>
                  <label
                    htmlFor="project-description"
                    className="mb-1.5 block text-[10px] font-black uppercase tracking-wider text-slate-600"
                  >
                    Description
                  </label>

                  <textarea
                    id="project-description"
                    rows={4}
                    maxLength={1000}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Objectives, deliverables, or team scope..."
                    className="
                      w-full resize-none rounded-xl
                      border border-slate-200
                      bg-slate-50/70
                      px-3.5 py-3
                      text-xs font-medium text-slate-900
                      outline-none
                      transition
                      placeholder:text-slate-400
                      focus:border-indigo-400
                      focus:bg-white
                      focus:ring-4
                      focus:ring-indigo-100/60
                    "
                  />

                  <div className="mt-1.5 flex justify-end">
                    <span className="text-[9px] text-slate-400">
                      {description.length}/1000
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-end gap-2.5 border-t border-slate-100 pt-5">
                  <button
                    type="button"
                    onClick={() => setIsCreateOpen(false)}
                    className="
                      rounded-xl
                      px-4 py-2.5
                      text-xs font-bold
                      text-slate-600
                      transition
                      hover:bg-slate-100
                    "
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={isSubmitting || !name.trim()}
                    className="
                      inline-flex items-center gap-2
                      rounded-xl
                      bg-gradient-to-r from-violet-600 to-indigo-600
                      px-5 py-2.5
                      text-xs font-bold text-white
                      shadow-lg shadow-indigo-200
                      transition
                      hover:-translate-y-0.5
                      hover:shadow-xl
                      disabled:cursor-not-allowed
                      disabled:opacity-50
                      disabled:hover:translate-y-0
                    "
                  >
                    {isSubmitting && (
                      <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                    )}

                    <span>
                      {isSubmitting
                        ? 'Creating...'
                        : 'Create Project'}
                    </span>

                    {!isSubmitting && (
                      <ArrowRight className="h-3.5 w-3.5" />
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}