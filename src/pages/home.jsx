import React, { useState, useEffect } from "react";
import Nav from "./../components/nav";
import TodoBox from "./../components/Todobox";
import { ThemeProvider, createTheme } from "@mui/material/styles";

function Home() {
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
      <Nav toggleTheme={toggleTheme} isDark={isDark} />
      <TodoBox />
    </ThemeProvider>
  );
}

export default Home;
