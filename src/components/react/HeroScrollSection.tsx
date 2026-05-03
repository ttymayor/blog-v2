import { motion, useScroll, useTransform } from "motion/react";
import { useRef, type ReactNode } from "react";
import { ChevronDown } from "lucide-react";

interface HeroScrollSectionProps {
  children: ReactNode;
}

export default function HeroScrollSection({
  children,
}: HeroScrollSectionProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.3]);
  const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [1, 0.5, 0]);
  const rotate = useTransform(scrollYProgress, [0, 1], [0, 45]);

  return (
    <div ref={containerRef} className="h-dvh">
      <motion.section
        style={{ scale, opacity, rotate }}
        className="fixed inset-0 z-0 flex flex-col items-center justify-center"
      >
        {children}
        <div className="to-background pointer-events-none absolute inset-x-0 bottom-0 h-48 bg-linear-to-b from-transparent" />
        <div className="pointer-events-none absolute bottom-12 left-1/2 -translate-x-1/2">
          <ChevronDown className="text-muted-foreground/40 size-6 animate-bounce" />
        </div>
      </motion.section>
    </div>
  );
}
