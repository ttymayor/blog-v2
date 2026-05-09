import { type HTMLAttributes, type ReactNode } from "react";

interface IconSwapProps extends HTMLAttributes<HTMLSpanElement> {
  iconA: ReactNode;
  iconB: ReactNode;
  state?: "a" | "b";
}

export function IconSwap({
  iconA,
  iconB,
  state = "a",
  className,
  ...rest
}: IconSwapProps) {
  return (
    <span
      className={`t-icon-swap${className ? ` ${className}` : ""}`}
      data-state={state}
      {...rest}
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
