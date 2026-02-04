import * as React from "react";
import { Moon, Sun } from "lucide-react";

import { Button } from "@/components/ui/button";

export function ModeToggle() {
  const [isDark, setIsDark] = React.useState(false);
  const isDarkRef = React.useRef(false);

  React.useEffect(() => {
    const savedTheme = window.localStorage.getItem("theme");
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)",
    ).matches;
    const initialIsDark =
      savedTheme === "dark" || (savedTheme === null && prefersDark);
    setIsDark(initialIsDark);
    isDarkRef.current = initialIsDark;

    document.documentElement.classList[isDarkRef.current ? "add" : "remove"](
      "dark",
    );
  }, []);

  React.useEffect(() => {
    isDarkRef.current = isDark;
    document.documentElement.classList[isDark ? "add" : "remove"]("dark");
    window.localStorage.setItem("theme", isDark ? "dark" : "light");
  }, [isDark]);

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={() => setIsDark((current) => !current)}
      aria-pressed={isDark}
    >
      <Sun className="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
      <Moon className="absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
