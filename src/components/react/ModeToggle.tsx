import * as React from "react";
import { Moon, Sun } from "lucide-react";

import { Button } from "@/components/ui/button";
import { motion } from "motion/react";

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
      new CustomEvent("themechange", { detail: { theme: newTheme } }),
    );
  };

  return (
    <Button
      variant="ghost"
      size="icon-lg"
      className="cursor-pointer rounded-full border border-transparent transition-all hover:border-white/20 hover:bg-black/15 hover:shadow-[inset_0_2px_8px_rgba(0,0,0,0.3)] dark:hover:border-white/10 dark:hover:bg-white/15 dark:hover:shadow-[inset_0_2px_8px_rgba(0,0,0,0.4)]"
      onClick={toggleTheme}
    >
      <motion.div
        initial={{ scale: 0.5 }}
        animate={{ scale: theme === "light" ? 1 : 0 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
      >
        <Sun className="h-[1.2rem] w-[1.2rem]" />
      </motion.div>
      <motion.div
        className="absolute"
        initial={{ scale: 0.5 }}
        animate={{ scale: theme === "dark" ? 1 : 0 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
      >
        <Moon className="h-[1.2rem] w-[1.2rem]" />
      </motion.div>
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
