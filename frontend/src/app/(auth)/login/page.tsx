'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useAuth } from '../../../context/AuthContext';

import {
  LogIn,
 AlertCircle,
  ArrowRight,
  CheckCircle2,
  Users,
  BarChart3,
  FolderKanban,
  Zap,
  ShieldCheck,
  LayoutDashboard,
  ListTodo,
} from 'lucide-react';

/* =========================================================
   LOGIN FORM
   ========================================================= */

function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { login } = useAuth();
  const searchParams = useSearchParams();

  const sessionExpired =
    searchParams.get('session_expired') === 'true';

  /* =======================================================
     LOGIN
     ======================================================= */

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setError(null);
    setIsSubmitting(true);

    try {
      await login(email, password);
    } catch (err: any) {
      setError(
        err?.message ||
          'Login failed. Please verify your credentials.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-[#080812]">

      {/* ===================================================
          BACKGROUND
      =================================================== */}

      <div className="pointer-events-none absolute inset-0 overflow-hidden">

        {/* Violet glow */}
        <div
          className="
            absolute
            -left-32
            -top-32
            h-[450px]
            w-[450px]
            rounded-full
            bg-violet-600/20
            blur-[120px]
          "
        />

        {/* Blue glow */}
        <div
          className="
            absolute
            -right-32
            top-20
            h-[500px]
            w-[500px]
            rounded-full
            bg-blue-600/20
            blur-[130px]
          "
        />

        {/* Pink glow */}
        <div
          className="
            absolute
            bottom-[-200px]
            left-[35%]
            h-[500px]
            w-[500px]
            rounded-full
            bg-fuchsia-600/10
            blur-[130px]
          "
        />

        {/* Subtle center glow */}
        <div
          className="
            absolute
            left-1/2
            top-1/2
            h-[350px]
            w-[350px]
            -translate-x-1/2
            -translate-y-1/2
            rounded-full
            bg-indigo-500/[0.035]
            blur-[100px]
          "
        />
      </div>

      {/* ===================================================
          GRID BACKGROUND
      =================================================== */}

      <div
        className="pointer-events-none absolute inset-0 opacity-[0.035]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.8) 1px, transparent 1px)',
          backgroundSize: '45px 45px',
        }}
      />

      {/* ===================================================
          CONTENT
      =================================================== */}

      <div className="relative z-10 flex min-h-screen">

        {/* =================================================
            LEFT SIDE
        ================================================= */}

        <div
          className="
            hidden
            flex-col
            justify-center
            px-12
            lg:flex
            lg:w-[55%]
            xl:w-[58%]
            xl:px-20
          "
        >

          {/* ===============================================
              LOGO
          =============================================== */}

          <div className="mb-10 flex items-center gap-3">

            <div
              className="
                relative
                flex
                h-12
                w-12
                items-center
                justify-center
                rounded-2xl
                bg-gradient-to-br
                from-violet-500
                to-blue-500
                shadow-lg
                shadow-violet-500/30
              "
            >
              <span className="text-lg font-black text-white">
                TF
              </span>

              <div
                className="
                  absolute
                  -right-1
                  -top-1
                  h-3
                  w-3
                  rounded-full
                  border-2
                  border-[#080812]
                  bg-emerald-400
                "
              />
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

          {/* ===============================================
              HERO
          =============================================== */}

          <div className="max-w-xl">

            <div
              className="
                mb-5
                inline-flex
                items-center
                gap-2
                rounded-full
                border
                border-violet-400/20
                bg-violet-400/10
                px-3
                py-1.5
                text-xs
                font-medium
                text-violet-300
              "
            >
             The smarter way to work together
            </div>

            <h1
              className="
                text-5xl
                font-bold
                leading-[1.08]
                tracking-tight
                text-white
                xl:text-6xl
              "
            >
              Bring your team.
              <br />

              <span
                className="
                  bg-gradient-to-r
                  from-violet-400
                  via-fuchsia-400
                  to-blue-400
                  bg-clip-text
                  text-transparent
                "
              >
                Get things done.
              </span>
            </h1>

            <p className="mt-6 max-w-lg text-base leading-7 text-slate-400">
              Plan projects, manage tasks, collaborate with your
              team, and keep everything moving forward — all in one
              beautiful workspace.
            </p>

          </div>

          {/* ===============================================
              FEATURES
          =============================================== */}

          <div className="mt-10 grid max-w-xl grid-cols-2 gap-4">

            {/* Project Management */}

            <div
              className="
                group
                rounded-2xl
                border
                border-white/10
                bg-white/[0.04]
                p-4
                backdrop-blur-sm
                transition-all
                duration-300
                hover:-translate-y-1
                hover:border-violet-400/30
                hover:bg-white/[0.07]
              "
            >
              <div
                className="
                  mb-3
                  flex
                  h-9
                  w-9
                  items-center
                  justify-center
                  rounded-xl
                  bg-violet-500/15
                "
              >
                <FolderKanban className="h-4 w-4 text-violet-400" />
              </div>

              <h3 className="text-sm font-semibold text-white">
                Project Management
              </h3>

              <p className="mt-1 text-xs leading-5 text-slate-500">
                Organize projects and keep everyone aligned.
              </p>
            </div>

            {/* Team Collaboration */}

            <div
              className="
                group
                rounded-2xl
                border
                border-white/10
                bg-white/[0.04]
                p-4
                backdrop-blur-sm
                transition-all
                duration-300
                hover:-translate-y-1
                hover:border-blue-400/30
                hover:bg-white/[0.07]
              "
            >
              <div
                className="
                  mb-3
                  flex
                  h-9
                  w-9
                  items-center
                  justify-center
                  rounded-xl
                  bg-blue-500/15
                "
              >
                <Users className="h-4 w-4 text-blue-400" />
              </div>

              <h3 className="text-sm font-semibold text-white">
                Team Collaboration
              </h3>

              <p className="mt-1 text-xs leading-5 text-slate-500">
                Work together without losing context.
              </p>
            </div>

            {/* Track Progress */}

            <div
              className="
                group
                rounded-2xl
                border
                border-white/10
                bg-white/[0.04]
                p-4
                backdrop-blur-sm
                transition-all
                duration-300
                hover:-translate-y-1
                hover:border-emerald-400/30
                hover:bg-white/[0.07]
              "
            >
              <div
                className="
                  mb-3
                  flex
                  h-9
                  w-9
                  items-center
                  justify-center
                  rounded-xl
                  bg-emerald-500/15
                "
              >
                <BarChart3 className="h-4 w-4 text-emerald-400" />
              </div>

              <h3 className="text-sm font-semibold text-white">
                Track Progress
              </h3>

              <p className="mt-1 text-xs leading-5 text-slate-500">
                See progress and keep projects on track.
              </p>
            </div>

            {/* Work Faster */}

            <div
              className="
                group
                rounded-2xl
                border
                border-white/10
                bg-white/[0.04]
                p-4
                backdrop-blur-sm
                transition-all
                duration-300
                hover:-translate-y-1
                hover:border-orange-400/30
                hover:bg-white/[0.07]
              "
            >
              <div
                className="
                  mb-3
                  flex
                  h-9
                  w-9
                  items-center
                  justify-center
                  rounded-xl
                  bg-orange-500/15
                "
              >
                <Zap className="h-4 w-4 text-orange-400" />
              </div>

              <h3 className="text-sm font-semibold text-white">
                Work Faster
              </h3>

              <p className="mt-1 text-xs leading-5 text-slate-500">
                Simple tools designed for productive teams.
              </p>
            </div>

          </div>

          {/* ===============================================
              REAL PRODUCT PREVIEW
              =============================================== */}

          <div className="mt-10 hidden xl:block">

            <div
              className="
                relative
                w-[500px]
                overflow-hidden
                rounded-2xl
                border
                border-white/10
                bg-white/[0.04]
                p-4
                shadow-2xl
                backdrop-blur-md
              "
            >

              {/* Preview header */}

              <div className="mb-4 flex items-center justify-between">

                <div className="flex items-center gap-2">

                  <div
                    className="
                      flex
                      h-7
                      w-7
                      items-center
                      justify-center
                      rounded-lg
                      bg-violet-500/10
                    "
                  >
                    <LayoutDashboard className="h-3.5 w-3.5 text-violet-400" />
                  </div>

                  <div>
                    <span className="block text-xs font-semibold text-white">
                      TeamFlow Workspace
                    </span>

                    <span className="block text-[9px] text-slate-500">
                      Projects · Tasks · Team activity
                    </span>
                  </div>

                </div>

                <span
                  className="
                    rounded-full
                    border
                    border-emerald-400/20
                    bg-emerald-400/10
                    px-2
                    py-1
                    text-[9px]
                    font-medium
                    text-emerald-400
                  "
                >
                  Workspace
                </span>

              </div>

              {/* Feature overview */}

              <div className="grid grid-cols-3 gap-3">

                {/* Projects */}

                <div
                  className="
                    rounded-xl
                    border
                    border-white/5
                    bg-white/[0.045]
                    p-3
                  "
                >
                  <div className="mb-2 flex items-center gap-2">

                    <FolderKanban className="h-3.5 w-3.5 text-violet-400" />

                    <span className="text-[10px] text-slate-500">
                      Projects
                    </span>

                  </div>

                  <div className="text-xs font-semibold text-slate-300">
                    Organize
                  </div>
                </div>

                {/* Tasks */}

                <div
                  className="
                    rounded-xl
                    border
                    border-white/5
                    bg-white/[0.045]
                    p-3
                  "
                >
                  <div className="mb-2 flex items-center gap-2">

                    <ListTodo className="h-3.5 w-3.5 text-blue-400" />

                    <span className="text-[10px] text-slate-500">
                      Tasks
                    </span>

                  </div>

                  <div className="text-xs font-semibold text-slate-300">
                    Track
                  </div>
                </div>

                {/* Team */}

                <div
                  className="
                    rounded-xl
                    border
                    border-white/5
                    bg-white/[0.045]
                    p-3
                  "
                >
                  <div className="mb-2 flex items-center gap-2">

                    <Users className="h-3.5 w-3.5 text-emerald-400" />

                    <span className="text-[10px] text-slate-500">
                      Team
                    </span>

                  </div>

                  <div className="text-xs font-semibold text-slate-300">
                    Collaborate
                  </div>
                </div>

              </div>

              {/* ==========================================
                  PROJECT ROW
              ========================================== */}

              <div className="mt-3 space-y-2">

                <div
                  className="
                    flex
                    items-center
                    gap-3
                    rounded-xl
                    border
                    border-white/5
                    bg-white/[0.035]
                    p-3
                  "
                >

                  <div
                    className="
                      flex
                      h-8
                      w-8
                      shrink-0
                      items-center
                      justify-center
                      rounded-lg
                      bg-violet-500/10
                    "
                  >
                    <FolderKanban className="h-3.5 w-3.5 text-violet-400" />
                  </div>

                  <div className="min-w-0 flex-1">

                    <div className="h-2.5 w-32 rounded-full bg-white/10" />

                    <div className="mt-2 h-2 w-20 rounded-full bg-white/5" />

                  </div>

                  <div className="h-5 w-14 rounded-full bg-violet-500/10" />

                </div>

                {/* ========================================
                    TEAM ROW
                ======================================== */}

                <div
                  className="
                    flex
                    items-center
                    gap-3
                    rounded-xl
                    border
                    border-white/5
                    bg-white/[0.035]
                    p-3
                  "
                >

                  <div
                    className="
                      flex
                      h-8
                      w-8
                      shrink-0
                      items-center
                      justify-center
                      rounded-lg
                      bg-blue-500/10
                    "
                  >
                    <Users className="h-3.5 w-3.5 text-blue-400" />
                  </div>

                  <div className="min-w-0 flex-1">

                    <div className="h-2.5 w-40 rounded-full bg-white/10" />

                    <div className="mt-2 h-2 w-24 rounded-full bg-white/5" />

                  </div>

                  <div className="flex -space-x-1.5">

                    <div
                      className="
                        h-5
                        w-5
                        rounded-full
                        bg-violet-500
                        ring-2
                        ring-[#11111d]
                      "
                    />

                    <div
                      className="
                        h-5
                        w-5
                        rounded-full
                        bg-blue-500
                        ring-2
                        ring-[#11111d]
                      "
                    />

                    <div
                      className="
                        h-5
                        w-5
                        rounded-full
                        bg-emerald-500
                        ring-2
                        ring-[#11111d]
                      "
                    />

                  </div>

                </div>

                {/* ========================================
                    PROGRESS ROW
                ======================================== */}

                <div
                  className="
                    flex
                    items-center
                    gap-3
                    rounded-xl
                    border
                    border-white/5
                    bg-white/[0.035]
                    p-3
                  "
                >

                  <div
                    className="
                      flex
                      h-8
                      w-8
                      shrink-0
                      items-center
                      justify-center
                      rounded-lg
                      bg-emerald-500/10
                    "
                  >
                    <BarChart3 className="h-3.5 w-3.5 text-emerald-400" />
                  </div>

                  <div className="min-w-0 flex-1">

                    <div className="h-2.5 w-28 rounded-full bg-white/10" />

                    <div className="mt-2 h-2 w-16 rounded-full bg-white/5" />

                  </div>

                  <div className="h-1.5 w-16 overflow-hidden rounded-full bg-white/10">

                    <div
                      className="
                        h-full
                        w-3/4
                        rounded-full
                        bg-gradient-to-r
                        from-violet-500
                        to-blue-500
                      "
                    />

                  </div>

                </div>

              </div>

              {/* Preview footer */}

              <div className="mt-4 flex items-center justify-center gap-2 text-[10px] text-slate-500">

               Your workspace, projects, tasks and team activity in one place

              </div>

            </div>

          </div>

        </div>

        {/* =================================================
            RIGHT SIDE — LOGIN
        ================================================= */}

        <div
          className="
            flex
            w-full
            items-center
            justify-center
            px-5
            py-10
            lg:w-[45%]
            xl:w-[42%]
          "
        >

          <div className="w-full max-w-md">

            {/* =============================================
                MOBILE LOGO
            ============================================= */}

            <div className="mb-8 flex items-center justify-center gap-3 lg:hidden">

              <div
                className="
                  flex
                  h-11
                  w-11
                  items-center
                  justify-center
                  rounded-xl
                  bg-gradient-to-br
                  from-violet-500
                  to-blue-500
                  shadow-lg
                  shadow-violet-500/30
                "
              >
                <span className="font-black text-white">
                  TF
                </span>
              </div>

              <div className="text-xl font-bold text-white">
                Team<span className="text-violet-400">Flow</span>
              </div>

            </div>

            {/* =============================================
                LOGIN CARD
            ============================================= */}

            <div
              className="
                rounded-[28px]
                border
                border-white/10
                bg-white/[0.065]
                p-6
                shadow-2xl
                backdrop-blur-2xl
                sm:p-8
              "
            >

              {/* ==========================================
                  HEADER
              ========================================== */}

              <div className="mb-7">

                <div
                  className="
                    mb-4
                    flex
                    h-12
                    w-12
                    items-center
                    justify-center
                    rounded-2xl
                    bg-gradient-to-br
                    from-violet-500/20
                    to-blue-500/20
                    ring-1
                    ring-white/10
                  "
                >
                  <LogIn className="h-5 w-5 text-violet-300" />
                </div>

                <h2 className="text-2xl font-bold tracking-tight text-white">
                  Welcome back
                </h2>

                <p className="mt-1.5 text-sm text-slate-400">
                  Sign in to continue to your workspace.
                </p>

              </div>

              {/* ==========================================
                  SESSION EXPIRED
              ========================================== */}

              {sessionExpired && (
                <div
                  className="
                    mb-5
                    flex
                    items-start
                    gap-3
                    rounded-xl
                    border
                    border-amber-400/20
                    bg-amber-400/10
                    p-3.5
                    text-xs
                    text-amber-200
                  "
                >
                  <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-amber-400" />

                  <span>
                    Your session has expired. Please sign in again.
                  </span>
                </div>
              )}

              {/* ==========================================
                  LOGIN ERROR
              ========================================== */}

              {error && (
                <div
                  className="
                    mb-5
                    flex
                    items-start
                    gap-3
                    rounded-xl
                    border
                    border-rose-400/20
                    bg-rose-400/10
                    p-3.5
                    text-xs
                    text-rose-200
                  "
                >
                  <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-rose-400" />

                  <span>{error}</span>
                </div>
              )}

              {/* ==========================================
                  LOGIN FORM
              ========================================== */}

              <form
                onSubmit={handleSubmit}
                className="space-y-5"
              >

                {/* EMAIL */}

                <div>

                  <label
                    htmlFor="email"
                    className="mb-2 block text-xs font-semibold text-slate-300"
                  >
                    Email address
                  </label>

                  <input
                    id="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    autoComplete="email"
                    disabled={isSubmitting}
                    className="
                      w-full
                      rounded-xl
                      border
                      border-white/10
                      bg-black/20
                      px-4
                      py-3.5
                      text-sm
                      text-white
                      outline-none
                      placeholder:text-slate-600
                      transition
                      focus:border-violet-400/60
                      focus:bg-black/30
                      focus:ring-4
                      focus:ring-violet-500/10
                      disabled:cursor-not-allowed
                      disabled:opacity-60
                    "
                  />

                </div>

                {/* PASSWORD */}

                <div>

                  <div className="mb-2 flex items-center justify-between">

                    <label
                      htmlFor="password"
                      className="block text-xs font-semibold text-slate-300"
                    >
                      Password
                    </label>

                    <span className="text-[10px] text-slate-500">
                      Keep it secure
                    </span>

                  </div>

                  <input
                    id="password"
                    type="password"
                    required
                    value={password}
                    onChange={(e) =>
                      setPassword(e.target.value)
                    }
                    placeholder="••••••••"
                    autoComplete="current-password"
                    disabled={isSubmitting}
                    className="
                      w-full
                      rounded-xl
                      border
                      border-white/10
                      bg-black/20
                      px-4
                      py-3.5
                      text-sm
                      text-white
                      outline-none
                      placeholder:text-slate-600
                      transition
                      focus:border-violet-400/60
                      focus:bg-black/30
                      focus:ring-4
                      focus:ring-violet-500/10
                      disabled:cursor-not-allowed
                      disabled:opacity-60
                    "
                  />

                </div>

                {/* SUBMIT */}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="
                    group
                    relative
                    flex
                    w-full
                    items-center
                    justify-center
                    gap-2
                    overflow-hidden
                    rounded-xl
                    bg-gradient-to-r
                    from-violet-600
                    to-blue-600
                    py-3.5
                    text-sm
                    font-semibold
                    text-white
                    shadow-lg
                    shadow-violet-900/30
                    transition-all
                    duration-200
                    hover:scale-[1.01]
                    hover:shadow-violet-500/20
                    disabled:cursor-not-allowed
                    disabled:opacity-50
                    disabled:hover:scale-100
                  "
                >

                  {/* Shine */}

                  <span
                    className="
                      absolute
                      inset-0
                      -translate-x-full
                      bg-gradient-to-r
                      from-transparent
                      via-white/10
                      to-transparent
                      transition-transform
                      duration-700
                      group-hover:translate-x-full
                    "
                  />

                  {isSubmitting ? (
                    <div
                      className="
                        h-4
                        w-4
                        animate-spin
                        rounded-full
                        border-2
                        border-white/30
                        border-t-white
                      "
                    />
                  ) : (
                    <>
                      <LogIn className="h-4 w-4" />

                      <span>
                        Sign in to TeamFlow
                      </span>

                      <ArrowRight
                        className="
                          h-4
                          w-4
                          transition-transform
                          group-hover:translate-x-1
                        "
                      />
                    </>
                  )}

                </button>

              </form>

              {/* ==========================================
                  SECURITY
              ========================================== */}

              <div
                className="
                  mt-7
                  flex
                  items-center
                  justify-center
                  gap-2
                  text-[10px]
                  text-slate-500
                "
              >
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />

                <span>
                  Secure team workspace
                </span>

                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
              </div>

              {/* ==========================================
                  REGISTER
              ========================================== */}

              <div className="mt-5 text-center text-xs text-slate-500">

                Don't have an account yet?{' '}

                <Link
                  href="/register"
                  className="
                    inline-flex
                    items-center
                    gap-1
                    font-semibold
                    text-violet-400
                    transition
                    hover:text-violet-300
                    hover:underline
                  "
                >
                  Create account

                  <ArrowRight className="h-3 w-3" />
                </Link>

              </div>

            </div>

            {/* =============================================
                FOOTER
            ============================================= */}

            <p className="mt-5 text-center text-[10px] text-slate-600">
              © {new Date().getFullYear()} TeamFlow · Built for better teamwork
            </p>

          </div>

        </div>

      </div>
    </div>
  );
}

/* =========================================================
   LOGIN PAGE
   ========================================================= */

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div
          className="
            flex
            min-h-screen
            items-center
            justify-center
            bg-[#080812]
            text-sm
            text-slate-400
          "
        >
          <div className="flex items-center gap-3">

            <div
              className="
                h-5
                w-5
                animate-spin
                rounded-full
                border-2
                border-white/20
                border-t-violet-400
              "
            />

            <span>
              Loading TeamFlow...
            </span>

          </div>
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}