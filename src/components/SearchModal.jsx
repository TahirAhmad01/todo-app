import React, { useState } from "react";
import { useAuth } from "../context/authContext";
import moment from "moment/moment";

function SearchModal({ isOpen, onClose, setFilter }) {
  const { todoList } = useAuth() || {};
  const [query, setQuery] = useState("");

  if (!isOpen) return null;

  const handleClose = (e) => {
    if (e.target.id === "modal-overlay") {
      onClose();
      setQuery("");
    }
  };

  const menuOptions = [
    {
      id: "menu-all_uncompleted",
      title: "Todo Lists (Menu)",
      type: "menu",
      filterValue: "all_uncompleted",
    },
    {
      id: "menu-today",
      title: "Today's Task (Menu)",
      type: "menu",
      filterValue: "today",
    },
    {
      id: "menu-upcoming",
      title: "Upcoming Task (Menu)",
      type: "menu",
      filterValue: "upcoming",
    },
    {
      id: "menu-completed",
      title: "Completed Task (Menu)",
      type: "menu",
      filterValue: "completed",
    },
  ];

  const results =
    query.trim() === ""
      ? []
      : [
          ...menuOptions.filter((m) =>
            m.title.toLowerCase().includes(query.toLowerCase()),
          ),
          ...todoList
            .filter((t) => t.title.toLowerCase().includes(query.toLowerCase()))
            .map((t) => ({ ...t, type: "task" })),
        ];

  return (
    <div
      id="modal-overlay"
      onClick={handleClose}
      className="fixed inset-0 z-[100] flex items-start justify-center pt-[10vh] bg-slate-900/50 backdrop-blur-sm transition-opacity duration-200"
    >
      <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-xl shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-800 animate-in fade-in zoom-in-95 duration-200">
        {/* Search Input */}
        <div className="relative border-b border-slate-200 dark:border-slate-800 flex items-center px-4 py-3">
          <svg
            className="w-6 h-6 text-slate-400 shrink-0"
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
          <input
            autoFocus
            type="text"
            className="flex-1 bg-transparent border-none outline-none text-slate-800 dark:text-slate-200 px-4 text-base placeholder-slate-400 w-full"
            placeholder="Search all tasks..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button
            onClick={() => {
              onClose();
              setQuery("");
            }}
            className="p-1 rounded-md text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 ml-2"
          >
            <span className="sr-only">Close</span>
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Search Results */}
        <div className="max-h-[60vh] overflow-y-auto w-full p-2">
          {query.trim().length > 0 && results.length === 0 ? (
            <div className="py-10 text-center text-slate-500 dark:text-slate-400 text-sm">
              No tasks found matching "{query}"
            </div>
          ) : query.trim().length > 0 ? (
            <ul className="space-y-1">
              {results.map((item) => (
                <li key={item.id}>
                  {item.type === "menu" ? (
                    <button
                      onClick={() => {
                        setFilter(item.filterValue);
                        onClose();
                        setQuery("");
                      }}
                      className="w-full text-left flex items-start gap-4 p-3 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800/50 transition-colors"
                    >
                      <div className="mt-0.5 shrink-0 text-indigo-500">
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm text-indigo-600 dark:text-indigo-400 truncate">
                          {item.title}
                        </p>
                        <p className="text-xs text-slate-500 mt-1">
                          Sidebar Navigation Menu
                        </p>
                      </div>
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        setFilter("all_uncompleted");
                        onClose();
                        setQuery("");
                      }}
                      className="w-full text-left flex items-start gap-4 p-3 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800/50 transition-colors"
                    >
                      <div
                        className={`mt-0.5 shrink-0 w-4 h-4 rounded-full border flex items-center justify-center ${
                          item.completed
                            ? "bg-green-500 border-green-500"
                            : "border-slate-300 dark:border-slate-600"
                        }`}
                      >
                        {item.completed && (
                          <svg
                            className="w-3 h-3 text-white"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p
                          className={`font-medium text-sm truncate ${item.completed ? "text-slate-400 line-through" : "text-slate-900 dark:text-slate-100"}`}
                        >
                          {item.title}
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                          {moment(item.Date, "YYYY-MM-DD").format("ll")} •{" "}
                          {item.time}
                        </p>
                      </div>
                    </button>
                  )}
                </li>
              ))}
            </ul>
          ) : (
            <div className="py-6 px-4">
              <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2">
                Filters
              </p>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => {
                    setFilter("all_uncompleted");
                    onClose();
                  }}
                  className="flex items-center p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800/50 text-slate-700 dark:text-slate-300 text-sm transition-colors"
                >
                  <span className="bg-indigo-100 text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-400 p-1.5 rounded-md mr-3">
                    <svg
                      className="w-4 h-4"
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
                  </span>
                  Todo Lists
                </button>
                <button
                  onClick={() => {
                    setFilter("today");
                    onClose();
                  }}
                  className="flex items-center p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800/50 text-slate-700 dark:text-slate-300 text-sm transition-colors"
                >
                  <span className="bg-emerald-100 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400 p-1.5 rounded-md mr-3">
                    <svg
                      className="w-4 h-4"
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
                  </span>
                  Today's Task
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default SearchModal;
