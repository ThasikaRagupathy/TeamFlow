'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../context/AuthContext';

export default function Home() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      if (user) {
        router.replace('/projects');
      } else {
        router.replace('/login');
      }
    }
  }, [user, isLoading, router]);

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#080812] flex items-center justify-center">
      {/* Background Glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-violet-600/20 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-blue-600/10 rounded-full blur-3xl" />
      </div>

      {/* Grid Background */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px',
        }}
      />

      {/* Loading Card */}
      <div className="relative z-10 flex flex-col items-center">
        {/* Logo */}
        <div className="relative mb-6">
          <div className="absolute inset-0 bg-indigo-500/30 blur-xl rounded-2xl" />

          <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-2xl shadow-indigo-500/20">
            <span className="text-white font-black text-2xl tracking-tight">
              TF
            </span>
          </div>
        </div>

        {/* Spinner */}
        <div className="relative w-10 h-10 mb-5">
          <div className="absolute inset-0 rounded-full border-4 border-white/10" />

          <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-indigo-400 border-r-violet-400 animate-spin" />
        </div>

        {/* Text */}
        <h1 className="text-white text-lg font-semibold tracking-tight">
          TeamFlow
        </h1>

        <p className="mt-1 text-sm text-slate-400">
          Loading your workspace...
        </p>

        {/* Small status */}
        <div className="mt-5 flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-[11px] text-slate-400">
            Checking your session
          </span>
        </div>
      </div>
    </main>
  );
}