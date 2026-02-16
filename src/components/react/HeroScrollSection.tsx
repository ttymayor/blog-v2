import { motion, useScroll, useTransform } from "motion/react";
import { useRef, type ReactNode } from "react";

interface HeroScrollSectionProps {
  children: ReactNode;
}

export default function HeroScrollSection({ children }: HeroScrollSectionProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.3]);
  const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [1, 0.5, 0]);
  const rotate = useTransform(scrollYProgress, [0, 1], [0, 45]);

  return (
    <div ref={containerRef} className="h-dvh">
      <motion.section
        style={{ scale, opacity, rotate }}
        className="fixed inset-0 flex flex-col items-center justify-center z-0"
      >
        {children}
      </motion.section>
    </div>
  );
}
