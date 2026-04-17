import React from "react";
import Logo from "../assets/image/todo_logo.png";

function Nav({ toggleTheme, isDark }) {
  return (
    <div className="py-2.5 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b flex items-center justify-between px-8 sticky top-0 z-50 transition-colors duration-200 border-slate-200 dark:border-slate-800/60 shadow-sm">
      <div className="flex items-center gap-3">
        <div className="bg-indigo-500/10 dark:bg-indigo-500/20 p-2 rounded-xl">
          <img src={Logo} alt="logo" className="h-6 w-6 object-contain" />
        </div>
        <span className="text-xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300 bg-clip-text text-transparent tracking-tight">
          Todo App
        </span>
      </div>

      <div className="flex items-center gap-6">
        <button
          onClick={toggleTheme}
          className="p-2.5 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-400 transition-all duration-200 hover:rotate-12"
          aria-label="Toggle theme"
        >
          {isDark ? (
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
              />
            </svg>
          ) : (
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
              />
            </svg>
          )}
        </button>
      </div>
    </div>
  );
}

export default Nav;
