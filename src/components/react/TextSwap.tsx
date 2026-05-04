import { useEffect, useRef, useState } from "react";

interface TextSwapProps {
  textA: string;
  textB: string;
  state: "a" | "b";
  className?: string;
}

export function TextSwap({ textA, textB, state: controlledState, className }: TextSwapProps) {
  const target = controlledState === "a" ? textA : textB;
  const [displayed, setDisplayed] = useState(target);
  const ref = useRef<HTMLSpanElement>(null);
  const busy = useRef(false);

  useEffect(() => {
    if (target === displayed || busy.current) return;
    const el = ref.current;
    if (!el) return;

    busy.current = true;
    const raw = getComputedStyle(document.documentElement).getPropertyValue("--text-swap-dur").trim();
    const dur = parseFloat(raw) || 200;

    el.classList.add("is-exit");
    window.setTimeout(() => {
      setDisplayed(target);
      el.classList.remove("is-exit");
      el.classList.add("is-enter-start");
      void el.offsetWidth;
      el.classList.remove("is-enter-start");
      busy.current = false;
    }, dur);
  }, [target, displayed]);

  return (
    <span className={`t-text-swap${className ? ` ${className}` : ""}`} ref={ref}>
      {displayed}
    </span>
  );
}
