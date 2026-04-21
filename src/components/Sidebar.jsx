import React, { useMemo } from "react";
import { useAuth } from "../context/authContext";
import GoogleLogin from "./GoogleLogin";

function Sidebar({ activeFilter, setFilter, onOpenSearch }) {
  const { currentUser, todoList } = useAuth() || {};

  // Extract unique labels from all tasks
  const uniqueLabels = useMemo(() => {
    if (!todoList) return [];
    const labels = new Set();
    todoList.forEach((todo) => {
      if (todo.label) {
        labels.add(todo.label.toLowerCase().trim());
      }
    });
    return Array.from(labels);
  }, [todoList]);

  const getMenuClass = (filterName) => {
    return activeFilter === filterName
      ? "flex items-center gap-3 px-3 py-2 text-slate-700 dark:text-slate-300 bg-indigo-50/50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-semibold rounded-lg transition-colors"
      : "flex items-center gap-3 px-3 py-2 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-200 font-medium rounded-lg transition-colors";
  };

  return (
    <div className="flex flex-col w-full h-full bg-white/50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800/60 rounded-3xl transition-colors duration-200 shrink-0 shadow-sm backdrop-blur-sm overflow-hidden">
      {/* App Branding / Title (Optional placeholder for standard sidebar spacing) */}
      <div className="p-6">
        <h2 className="text-xl font-bold tracking-tight text-slate-800 dark:text-slate-100">
          Tasks Menu
        </h2>
      </div>

      {/* Menu Options */}
      <div className="flex-1 overflow-y-auto py-2">
        <ul className="space-y-1.5 px-3">
          <li>
            <button
              onClick={onOpenSearch}
              className="w-full flex items-center gap-3 px-3 py-2 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-200 font-medium rounded-lg transition-colors"
            >
              <svg
                className="w-5 h-5 shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              <span className="text-sm">Search...</span>
            </button>
          </li>
          <li>
            <button
              onClick={() => setFilter("all_uncompleted")}
              className={`w-full ${getMenuClass("all_uncompleted")}`}
            >
              <svg
                className="w-5 h-5 shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
                />
              </svg>
              <span className="text-sm">Todo Lists</span>
            </button>
          </li>
          <li>
            <button
              onClick={() => setFilter("today")}
              className={`w-full ${getMenuClass("today")}`}
            >
              <svg
                className="w-5 h-5 shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                />
              </svg>
              <span className="text-sm">Today's Task</span>
            </button>
          </li>
          <li>
            <button
              onClick={() => setFilter("upcoming")}
              className={`w-full ${getMenuClass("upcoming")}`}
            >
              <svg
                className="w-5 h-5 shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              <span className="text-sm">Upcoming Task</span>
            </button>
          </li>
          <li>
            <button
              onClick={() => setFilter("completed")}
              className={`w-full ${getMenuClass("completed")}`}
            >
              <svg
                className="w-5 h-5 shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span className="text-sm">Completed Task</span>
            </button>
          </li>
        </ul>

        {uniqueLabels.length > 0 && (
          <div className="mt-8 px-3">
            <h3 className="px-3 mb-2 text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
              Labels
            </h3>
            <ul className="space-y-1.5">
              {uniqueLabels.map((lbl) => (
                <li key={lbl}>
                  <button
                    onClick={() => setFilter(`label_${lbl}`)}
                    className={`w-full flex items-center gap-3 px-3 py-2 ${
                      activeFilter === `label_${lbl}`
                        ? "bg-indigo-50/50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-semibold"
                        : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-200 font-medium"
                    } rounded-lg transition-colors`}
                  >
                    <span className="w-2.5 h-2.5 rounded-full bg-indigo-400 dark:bg-indigo-500 shrink-0"></span>
                    <span className="text-sm capitalize">{lbl}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* User Profile Section */}
      <div className="p-4 border-t border-slate-200 dark:border-slate-800/60 bg-slate-50/50 dark:bg-slate-800/30">
        <GoogleLogin />
      </div>
    </div>
  );
}

export default Sidebar;
