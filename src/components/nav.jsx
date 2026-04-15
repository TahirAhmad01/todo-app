import React from "react";
import Logo from "../assets/image/todo_logo.png";
import GoogleLogin from "./GoogleLogin";

function Nav({ toggleTheme, isDark }) {
  return (
    <div className="h-[70px] bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-black/5 dark:border-white/5 flex items-center px-8 sticky top-0 z-50 transition-colors duration-200">
      <div className="flex-grow text-xl font-bold text-slate-900 dark:text-slate-100 flex items-center tracking-tight">
        <img src={Logo} alt="logo" className="h-8 w-8 mr-3" />
        <span>Todo App</span>
      </div>
      <div className="flex items-center gap-4">
        <button
          onClick={toggleTheme}
          className="p-2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
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
        <GoogleLogin />
      </div>
    </div>
  );
}

export default Nav;
