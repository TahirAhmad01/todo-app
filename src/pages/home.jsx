import React, { useState, useEffect } from "react";
import Nav from "./../components/nav";
import TodoBox from "./../components/Todobox";
import Sidebar from "./../components/Sidebar";
import SearchModal from "./../components/SearchModal";
import { ThemeProvider, createTheme } from "@mui/material/styles";

function Home() {
  const [filter, setFilter] = useState("all_uncompleted");
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const [isDark, setIsDark] = useState(() => {
    if (typeof window !== "undefined") {
      return (
        localStorage.getItem("theme") === "dark" ||
        (!("theme" in localStorage) &&
          window.matchMedia("(prefers-color-scheme: dark)").matches)
      );
    }
    return false;
  });

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [isDark]);

  const toggleTheme = () => setIsDark(!isDark);

  const muiTheme = createTheme({
    palette: {
      mode: isDark ? "dark" : "light",
      primary: {
        main: "#6366f1",
      },
    },
  });

  return (
    <ThemeProvider theme={muiTheme}>
      <div className="flex h-screen overflow-hidden bg-slate-50 dark:bg-[#0b1120] transition-colors duration-200">
        <div className="hidden md:block py-6 pl-6 h-full shrink-0">
          <Sidebar
            activeFilter={filter}
            setFilter={setFilter}
            onOpenSearch={() => setIsSearchOpen(true)}
          />
        </div>
        <div className="flex-1 flex flex-col h-screen relative w-full px-0 sm:px-6 md:px-8 pt-0 sm:pt-6 pb-6">
          <div className="bg-white/50 dark:bg-slate-900/40 rounded-3xl border border-slate-200 dark:border-slate-800/60 shadow-sm overflow-hidden flex flex-col flex-1 relative backdrop-blur-sm">
            <Nav toggleTheme={toggleTheme} isDark={isDark} />
            <div className="flex-1 overflow-y-auto custom-scrollbar">
              <TodoBox filter={filter} />
            </div>
          </div>
        </div>
        <SearchModal
          isOpen={isSearchOpen}
          onClose={() => setIsSearchOpen(false)}
          setFilter={setFilter}
        />
      </div>
    </ThemeProvider>
  );
}

export default Home;
