import { type ReactNode } from "react";

interface IconSwapProps {
  iconA: ReactNode;
  iconB: ReactNode;
  state?: "a" | "b";
  className?: string;
}

export function IconSwap({
  iconA,
  iconB,
  state = "a",
  className,
}: IconSwapProps) {
  return (
    <span
      className={`t-icon-swap${className ? ` ${className}` : ""}`}
      data-state={state}
    >
      <span className="t-icon" data-icon="a">
        {iconA}
      </span>
      <span className="t-icon" data-icon="b">
        {iconB}
      </span>
    </span>
  );
}
