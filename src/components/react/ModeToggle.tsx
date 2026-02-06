import * as React from "react";
import { Moon, Sun } from "lucide-react";

import { Button } from "@/components/ui/button";

export function ModeToggle() {
  const [theme, setThemeState] = React.useState<"light" | "dark">("dark");

  // Initialize: read current theme from DOM
  React.useEffect(() => {
    const isDarkMode = document.documentElement.classList.contains("dark");
    setThemeState(isDarkMode ? "dark" : "light");
  }, []);

  // Listen for external theme changes
  React.useEffect(() => {
    const handleThemeChange = (e: CustomEvent) => {
      setThemeState(e.detail.theme);
    };

    document.addEventListener(
      "themechange",
      handleThemeChange as EventListener,
    );

    return () => {
      document.removeEventListener(
        "themechange",
        handleThemeChange as EventListener,
      );
    };
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    const isDark = newTheme === "dark";

    // Update DOM
    document.documentElement.classList[isDark ? "add" : "remove"]("dark");

    // Update localStorage
    localStorage.setItem("theme", newTheme);

    // Update local state
    setThemeState(newTheme);

    // Dispatch event for other components
    document.dispatchEvent(
      new CustomEvent("themechange", { detail: { theme: newTheme } })
    );
  };

  return (
    <Button variant="ghost" size="icon" onClick={toggleTheme}>
      <Sun className="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
      <Moon className="absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
