import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";
import { Button } from "@/components/ui/button";
import { PenLine } from "lucide-react";

interface Props {
  date: string;
}

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

export default function ModifiedDateButton({ date }: Props) {
  const isMobile = useIsMobile();
  const formatted = new Date(date).toLocaleDateString("zh-TW", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <>
      <Toaster position={isMobile ? "top-center" : "bottom-center"} richColors={true} />
      <Button
        size="icon-sm"
        variant="ghost"
        className="rounded-full"
        onClick={() =>
          toast(`文章最後修改於 ${formatted}`, {
            icon: <PenLine className="size-4" />,
          })
        }
      >
        <PenLine className="size-4" />
      </Button>
    </>
  );
}
