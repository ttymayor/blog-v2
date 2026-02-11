import { useState, useEffect } from "react";
import { Toaster as Sonner, type ToasterProps } from "sonner";

function useIsMobile(breakpoint = 768) {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${breakpoint - 1}px)`);
    setIsMobile(mql.matches);
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mql.addEventListener("change", handler);
    return () => mql.removeEventListener("change", handler);
  }, [breakpoint]);
  return isMobile;
}

function Toaster({ ...props }: ToasterProps) {
  const isMobile = useIsMobile();
  return (
    <Sonner
      className="toaster group"
      position={isMobile ? "top-center" : "bottom-center"}
      richColors={true}
      {...props}
    />
  );
}

export { Toaster };
