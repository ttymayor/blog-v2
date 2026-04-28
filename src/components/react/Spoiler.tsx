import { useState, type ReactNode } from "react";

interface SpoilerProps {
  children: ReactNode;
}

export default function Spoiler({ children }: SpoilerProps) {
  const [revealed, setReveal] = useState(false);

  return (
    <span
      onClick={() => setReveal(true)}
      className="inline-block cursor-pointer transition-[filter] duration-300"
      style={{ filter: revealed ? "none" : "blur(4px)" }}
    >
      {children}
    </span>
  );
}
