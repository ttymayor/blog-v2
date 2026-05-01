// Transitions.dev — Icon swap (React, self-contained)
// Drop into any React project — no extra CSS file needed.

import { type ReactNode, useState } from "react";

// ── Styles ──────────────────────────────────────────────
// Auto-injected on first import. Idempotent (guarded by
// the element id) and SSR-safe (no-ops without document).
const __TRANSITION_STYLES = `
:root {
  --icon-swap-dur: 200ms;
  --icon-swap-blur: 2px;
  --icon-swap-start-scale: 0.25;
  --icon-swap-ease: ease-in-out;
}

.t-icon-swap {
  position: relative;
  display: inline-grid;
}
.t-icon-swap .t-icon {
  grid-area: 1 / 1;
  transition:
    opacity   var(--icon-swap-dur) var(--icon-swap-ease),
    filter    var(--icon-swap-dur) var(--icon-swap-ease),
    transform var(--icon-swap-dur) var(--icon-swap-ease);
  will-change: opacity, filter, transform;
}
.t-icon-swap[data-state="a"] .t-icon[data-icon="a"],
.t-icon-swap[data-state="b"] .t-icon[data-icon="b"] {
  opacity: 1;
  filter: blur(0);
  transform: scale(1);
}
.t-icon-swap[data-state="a"] .t-icon[data-icon="b"],
.t-icon-swap[data-state="b"] .t-icon[data-icon="a"] {
  opacity: 0;
  filter: blur(var(--icon-swap-blur));
  transform: scale(var(--icon-swap-start-scale));
}

@media (prefers-reduced-motion: reduce) {
  .t-icon-swap .t-icon { transition: none !important; }
}
`;
if (
  typeof document !== "undefined" &&
  !document.getElementById("transitions-p5")
) {
  const __style = document.createElement("style");
  __style.id = "transitions-p5";
  __style.textContent = __TRANSITION_STYLES;
  document.head.appendChild(__style);
}

interface IconSwapProps {
  iconA: ReactNode;
  iconB: ReactNode;
  state?: "a" | "b";
  onToggle?: () => void;
  className?: string;
  ariaLabel?: string;
}

export function IconSwap({ iconA, iconB, state: controlledState, onToggle, className, ariaLabel }: IconSwapProps) {
  const [internalState, setInternalState] = useState<"a" | "b">("a");
  const state = controlledState ?? internalState;

  const handleClick = () => {
    if (onToggle) {
      onToggle();
    } else {
      setInternalState((s) => (s === "a" ? "b" : "a"));
    }
  };

  return (
    <button
      type="button"
      aria-label={ariaLabel ?? (state === "a" ? "Show B" : "Show A")}
      onClick={handleClick}
      className={`inline-flex items-center justify-center${className ? ` ${className}` : ""}`}
    >
      <span className="t-icon-swap" data-state={state}>
        <span className="t-icon" data-icon="a">
          {iconA}
        </span>
        <span className="t-icon" data-icon="b">
          {iconB}
        </span>
      </span>
    </button>
  );
}
