import * as React from "react";
import { Moon, Sun } from "lucide-react";

import { IconSwap } from "@/components/react/IconSwap";

export function ModeToggle() {
  const [theme, setThemeState] = React.useState<"light" | "dark">("dark");

  React.useEffect(() => {
    const isDarkMode = document.documentElement.classList.contains("dark");
    setThemeState(isDarkMode ? "dark" : "light");
  }, []);

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

    document.documentElement.classList[isDark ? "add" : "remove"]("dark");
    localStorage.setItem("theme", newTheme);
    setThemeState(newTheme);

    document.dispatchEvent(
      new CustomEvent("themechange", { detail: { theme: newTheme } }),
    );
  };

  return (
    <IconSwap
      iconA={<Sun className="h-[1.2rem] w-[1.2rem]" />}
      iconB={<Moon className="h-[1.2rem] w-[1.2rem]" />}
      state={theme === "light" ? "a" : "b"}
      onToggle={toggleTheme}
      ariaLabel="Toggle theme"
      className="size-10 cursor-pointer rounded-full transition-all hover:bg-black/15 dark:hover:bg-white/15"
    />
  );
}
