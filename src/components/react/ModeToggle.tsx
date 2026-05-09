import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { IconSwap } from "@/components/react/IconSwap";

export function ModeToggle() {
  const [theme, setThemeState] = useState<"light" | "dark">("light");

  useEffect(() => {
    setThemeState(
      document.documentElement.classList.contains("dark") ? "dark" : "light",
    );

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
    <Button
      variant="full-ghost"
      size="icon"
      aria-label="Toggle theme"
      onClick={toggleTheme}
      className="cursor-pointer rounded-full"
    >
      <IconSwap
        iconA={<Sun className="h-[1.2rem] w-[1.2rem]" />}
        iconB={<Moon className="h-[1.2rem] w-[1.2rem]" />}
        state={theme === "light" ? "a" : "b"}
        data-theme-icon=""
      />
    </Button>
  );
}
