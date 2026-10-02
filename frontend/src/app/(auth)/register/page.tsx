'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '../../../context/AuthContext';
import {
  UserPlus,
  AlertCircle,
  ArrowLeft,
  Sparkles,
  CheckCircle2,
  ShieldCheck,
  Users,
  FolderKanban,
  Zap,
} from 'lucide-react';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    setIsSubmitting(true);

    try {
      await register(name, email, password);
    } catch (err: any) {
      setError(
        err.message || 'Registration failed. Please try again.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-[#080812]">

      {/* =====================================================
          BACKGROUND EFFECTS
      ====================================================== */}

      <div className="absolute inset-0">

        <div className="absolute -left-32 -top-32 h-[450px] w-[450px] rounded-full bg-violet-600/20 blur-[120px]" />

        <div className="absolute -right-32 top-20 h-[500px] w-[500px] rounded-full bg-blue-600/20 blur-[130px]" />

        <div className="absolute bottom-[-200px] left-[35%] h-[500px] w-[500px] rounded-full bg-fuchsia-600/10 blur-[130px]" />

      </div>

      {/* Grid background */}

      <div
        className="absolute inset-0 opacity-[0.035]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.8) 1px, transparent 1px)',
          backgroundSize: '45px 45px',
        }}
      />

      {/* =====================================================
          MAIN CONTENT
      ====================================================== */}

      <div className="relative z-10 flex min-h-screen">

        {/* =================================================
            LEFT SIDE
        ================================================== */}

        <div className="hidden lg:flex lg:w-[55%] xl:w-[58%] flex-col justify-center px-12 xl:px-20">

          {/* Logo */}

          <div className="mb-10 flex items-center gap-3">

            <div className="relative flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 to-blue-500 shadow-lg shadow-violet-500/30">

              <span className="text-lg font-black text-white">
                TF
              </span>

              <div className="absolute -right-1 -top-1 h-3 w-3 rounded-full border-2 border-[#080812] bg-emerald-400" />

            </div>

            <div>

              <div className="text-xl font-bold tracking-tight text-white">
                Team<span className="text-violet-400">Flow</span>
              </div>

              <div className="text-[10px] font-medium uppercase tracking-[0.25em] text-slate-500">
                Team Collaboration
              </div>

            </div>

          </div>

          {/* Main text */}

          <div className="max-w-xl">

            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-violet-400/20 bg-violet-400/10 px-3 py-1.5 text-xs font-medium text-violet-300">

              <Sparkles className="h-3.5 w-3.5" />

              Start collaborating today

            </div>

            <h1 className="text-5xl font-bold leading-[1.08] tracking-tight text-white xl:text-6xl">

              Build better.

              <br />

              <span className="bg-gradient-to-r from-violet-400 via-fuchsia-400 to-blue-400 bg-clip-text text-transparent">
                Together.
              </span>

            </h1>

            <p className="mt-6 max-w-lg text-base leading-7 text-slate-400">

              Create your TeamFlow workspace and bring your
              projects, tasks, and team collaboration into one
              organized place.

            </p>

          </div>

          {/* Benefits */}

          <div className="mt-10 max-w-xl space-y-3">

            <div className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.04] p-4 backdrop-blur-sm transition hover:bg-white/[0.07]">

              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-500/15">

                <FolderKanban className="h-5 w-5 text-violet-400" />

              </div>

              <div>

                <h3 className="text-sm font-semibold text-white">
                  Organize your projects
                </h3>

                <p className="mt-0.5 text-xs text-slate-500">
                  Keep projects, tasks, and deadlines in one place.
                </p>

              </div>

              <CheckCircle2 className="ml-auto h-4 w-4 text-emerald-400" />

            </div>

            <div className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.04] p-4 backdrop-blur-sm transition hover:bg-white/[0.07]">

              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-500/15">

                <Users className="h-5 w-5 text-blue-400" />

              </div>

              <div>

                <h3 className="text-sm font-semibold text-white">
                  Work with your team
                </h3>

                <p className="mt-0.5 text-xs text-slate-500">
                  Collaborate and stay connected with your team.
                </p>

              </div>

              <CheckCircle2 className="ml-auto h-4 w-4 text-emerald-400" />

            </div>

            <div className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.04] p-4 backdrop-blur-sm transition hover:bg-white/[0.07]">

              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-orange-500/15">

                <Zap className="h-5 w-5 text-orange-400" />

              </div>

              <div>

                <h3 className="text-sm font-semibold text-white">
                  Move faster
                </h3>

                <p className="mt-0.5 text-xs text-slate-500">
                  Focus on your work without the unnecessary clutter.
                </p>

              </div>

              <CheckCircle2 className="ml-auto h-4 w-4 text-emerald-400" />

            </div>

          </div>

        </div>

        {/* =================================================
            RIGHT SIDE - REGISTER
        ================================================== */}

        <div className="flex w-full items-center justify-center px-5 py-10 lg:w-[45%] xl:w-[42%]">

          <div className="w-full max-w-md">

            {/* Mobile Logo */}

            <div className="mb-8 flex items-center justify-center gap-3 lg:hidden">

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-blue-500 shadow-lg shadow-violet-500/30">

                <span className="font-black text-white">
                  TF
                </span>

              </div>

              <div className="text-xl font-bold text-white">
                Team<span className="text-violet-400">Flow</span>
              </div>

            </div>

            {/* Register Card */}

            <div className="rounded-[28px] border border-white/10 bg-white/[0.065] p-6 shadow-2xl backdrop-blur-2xl sm:p-8">

              {/* Header */}

              <div className="mb-7">

                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500/20 to-blue-500/20 ring-1 ring-white/10">

                  <UserPlus className="h-5 w-5 text-violet-300" />

                </div>

                <h2 className="text-2xl font-bold tracking-tight text-white">
                  Create your account
                </h2>

                <p className="mt-1.5 text-sm text-slate-400">
                  Join TeamFlow and start working smarter.
                </p>

              </div>

              {/* Error */}

              {error && (
                <div className="mb-5 flex items-start gap-3 rounded-xl border border-rose-400/20 bg-rose-400/10 p-3.5 text-xs text-rose-200">

                  <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-rose-400" />

                  <span>{error}</span>

                </div>
              )}

              {/* Form */}

              <form
                onSubmit={handleSubmit}
                className="space-y-5"
              >

                {/* Full Name */}

                <div>

                  <label className="mb-2 block text-xs font-semibold text-slate-300">
                    Full name
                  </label>

                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Alex Morgan"
                    autoComplete="name"
                    className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3.5 text-sm text-white outline-none placeholder:text-slate-600 transition focus:border-violet-400/60 focus:bg-black/30 focus:ring-4 focus:ring-violet-500/10"
                  />

                </div>

                {/* Email */}

                <div>

                  <label className="mb-2 block text-xs font-semibold text-slate-300">
                    Email address
                  </label>

                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="alex@company.com"
                    autoComplete="email"
                    className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3.5 text-sm text-white outline-none placeholder:text-slate-600 transition focus:border-violet-400/60 focus:bg-black/30 focus:ring-4 focus:ring-violet-500/10"
                  />

                </div>

                {/* Password */}

                <div>

                  <div className="mb-2 flex items-center justify-between">

                    <label className="block text-xs font-semibold text-slate-300">
                      Password
                    </label>

                    <span className="text-[10px] text-slate-500">
                      Minimum 6 characters
                    </span>

                  </div>

                  <input
                    type="password"
                    required
                    minLength={6}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    autoComplete="new-password"
                    className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3.5 text-sm text-white outline-none placeholder:text-slate-600 transition focus:border-violet-400/60 focus:bg-black/30 focus:ring-4 focus:ring-violet-500/10"
                  />

                </div>

                {/* Submit */}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="group relative flex w-full items-center justify-center gap-2 overflow-hidden rounded-xl bg-gradient-to-r from-violet-600 to-blue-600 py-3.5 text-sm font-semibold text-white shadow-lg shadow-violet-900/30 transition hover:scale-[1.01] hover:shadow-violet-500/20 disabled:cursor-not-allowed disabled:opacity-50"
                >

                  <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent transition-transform duration-700 group-hover:translate-x-full" />

                  {isSubmitting ? (
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  ) : (
                    <>
                      <UserPlus className="h-4 w-4" />

                      <span>
                        Create TeamFlow Account
                      </span>

                      <ArrowLeft className="h-4 w-4 rotate-180 transition-transform group-hover:translate-x-1" />
                    </>
                  )}

                </button>

              </form>

              {/* Security */}

              <div className="mt-7 flex items-center justify-center gap-2 text-[10px] text-slate-500">

                <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />

                Your information is kept secure

                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />

              </div>

              {/* Login */}

              <div className="mt-5 text-center text-xs text-slate-500">

                Already have an account?{' '}

                <Link
                  href="/login"
                  className="inline-flex items-center gap-1 font-semibold text-violet-400 transition hover:text-violet-300 hover:underline"
                >

                  <ArrowLeft className="h-3 w-3" />

                  Back to sign in

                </Link>

              </div>

            </div>

            {/* Footer */}

            <p className="mt-5 text-center text-[10px] text-slate-600">
              © {new Date().getFullYear()} TeamFlow · Built for better teamwork
            </p>

          </div>

        </div>

      </div>
    </div>
  );
}
