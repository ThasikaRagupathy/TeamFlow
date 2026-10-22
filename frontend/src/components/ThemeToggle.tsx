'use client';

import React from 'react';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../context/ThemeProvider';

export default function ThemeToggle() {
  const { resolvedTheme, toggleTheme } = useTheme();

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={
        resolvedTheme === 'dark'
          ? 'Switch to light mode'
          : 'Switch to dark mode'
      }
      title={
        resolvedTheme === 'dark'
          ? 'Switch to light mode'
          : 'Switch to dark mode'
      }
      className="
        relative
        flex
        h-10
        w-10
        items-center
        justify-center
        rounded-xl
        border
        border-[var(--border)]
        bg-[var(--surface)]
        text-[var(--muted)]
        shadow-sm
        transition-all
        duration-200
        hover:border-indigo-300
        hover:text-indigo-600
        hover:shadow-md
        dark:hover:border-indigo-500/40
        dark:hover:text-indigo-300
      "
    >
      <span
        className="
          absolute
          inset-0
          rounded-xl
          bg-indigo-500/0
          transition
          duration-200
          hover:bg-indigo-500/5
        "
      />

      {resolvedTheme === 'dark' ? (
        <Sun
          size={18}
          strokeWidth={2}
          className="relative z-10"
        />
      ) : (
        <Moon
          size={18}
          strokeWidth={2}
          className="relative z-10"
        />
      )}
    </button>
  );
}