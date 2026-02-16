import { useCallback, useEffect, useRef, useState } from "react";
import { Mail, Link } from "lucide-react";
import {
  ClaudeIcon,
  NextJsIcon,
  LaravelIcon,
  VueIcon,
  GitHubIcon,
  GeminiIcon,
} from "@/components/icons/brands";

interface FlipCardProps {
  avatarSrc: string;
}

const TILT_MAX = 15; // degrees
const TILT_LERP = 0.08;
const FLIP_LERP = 0.08;
const INITIAL_SPIN_DEG = 720;
const INITIAL_SPIN_DURATION = 2000; // ms

// ease-out-cubic: fast start, slow finish
function easeOutCubic(t: number) {
  return 1 - (1 - t) ** 3;
}

export default function FlipCard({ avatarSrc }: FlipCardProps) {
  const [flipped, setFlipped] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const tiltRef = useRef({ x: 0, y: 0 });
  const currentTilt = useRef({ x: 0, y: 0 });
  const flipTarget = useRef(0);
  const currentFlip = useRef(INITIAL_SPIN_DEG);
  const isFlipping = useRef(true);
  const rafRef = useRef<number>(0);
  const initialSpin = useRef(true);
  const spinStart = useRef(0);

  // Update flip target when state changes
  useEffect(() => {
    if (initialSpin.current) return;
    flipTarget.current = flipped ? 180 : 0;
    isFlipping.current = true;
  }, [flipped]);

  // Smooth animation loop for both tilt and flip
  useEffect(() => {
    const animate = (now: number) => {
      // Lerp tilt (pause during flip)
      const tx = isFlipping.current ? 0 : tiltRef.current.x;
      const ty = isFlipping.current ? 0 : tiltRef.current.y;
      currentTilt.current.x += (tx - currentTilt.current.x) * TILT_LERP;
      currentTilt.current.y += (ty - currentTilt.current.y) * TILT_LERP;

      // Initial spin: time-based ease-out over 2 seconds
      if (initialSpin.current) {
        if (spinStart.current === 0) spinStart.current = now;
        const elapsed = now - spinStart.current;
        const t = Math.min(elapsed / INITIAL_SPIN_DURATION, 1);
        currentFlip.current = INITIAL_SPIN_DEG * (1 - easeOutCubic(t));
        if (t >= 1) {
          currentFlip.current = 0;
          initialSpin.current = false;
          isFlipping.current = false;
        }
      } else {
        // Lerp flip for user-triggered flips
        currentFlip.current +=
          (flipTarget.current - currentFlip.current) * FLIP_LERP;
        if (
          isFlipping.current &&
          Math.abs(currentFlip.current - flipTarget.current) < 0.5
        ) {
          isFlipping.current = false;
        }
      }

      if (cardRef.current) {
        const rx = currentTilt.current.x.toFixed(2);
        const ry = currentTilt.current.y.toFixed(2);
        const fy = currentFlip.current.toFixed(2);
        cardRef.current.style.transform = `rotateX(${rx}deg) rotateY(${fy}deg) rotateZ(${(-Number(ry) * 0.3).toFixed(2)}deg)`;
      }
      rafRef.current = requestAnimationFrame(animate);
    };
    rafRef.current = requestAnimationFrame((now) => animate(now));
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (isFlipping.current) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const nx = (e.clientX - rect.left) / rect.width - 0.5;
    const ny = (e.clientY - rect.top) / rect.height - 0.5;
    tiltRef.current = { x: -ny * TILT_MAX, y: nx * TILT_MAX };
  }, []);

  const handleMouseLeave = useCallback(() => {
    tiltRef.current = { x: 0, y: 0 };
  }, []);

  const handleClick = useCallback(() => {
    setFlipped((f) => !f);
  }, []);

  return (
    <div
      className="mx-auto w-full max-w-xl cursor-pointer px-4 select-none"
      style={{ perspective: "1000px", aspectRatio: "1.66 / 1" }}
      onClick={handleClick}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <div
        ref={cardRef}
        className="relative h-full w-full"
        style={{
          transformStyle: "preserve-3d",
          transition: "none",
        }}
      >
        {/* Front face */}
        <div
          className="absolute inset-0 flex flex-col items-center justify-center rounded-2xl border border-white/20 bg-linear-to-br from-black/10 to-black/5 p-10 shadow-2xl shadow-black/20 backdrop-blur-sm dark:border-white/10 dark:bg-linear-to-br dark:from-white/10 dark:to-white/5 dark:shadow-black/60"
          style={{ backfaceVisibility: "hidden" }}
        >
          <div className="flex items-center gap-6">
            <img
              src={avatarSrc}
              alt="avatar"
              className="size-20 shrink-0 rounded-full border object-cover"
            />
            <div className="h-16 w-px shrink-0 bg-[#6a7282]" />
            <div className="min-w-0">
              <h2 className="text-card-foreground text-2xl font-bold">
                tantuyu
              </h2>
              <p className="text-muted-foreground mt-1 text-sm md:text-base">
                Web Developer．Student
              </p>
              <div className="mt-2 flex items-center gap-2 text-sm">
                <NextJsIcon className="text-card-foreground size-5" />
                <LaravelIcon className="text-card-foreground size-5" />
                <VueIcon className="text-card-foreground size-5" />
                <span className="text-muted-foreground">with</span>
                <ClaudeIcon className="size-5" />
                <GeminiIcon className="size-5" />
              </div>
            </div>
          </div>
          <p className="text-muted-foreground/50 absolute bottom-3 text-xs">
            Click to flip
          </p>
        </div>

        {/* Back face */}
        <div
          className="absolute inset-0 flex flex-col justify-center gap-4 rounded-2xl border border-white/20 bg-linear-to-br from-black/10 to-black/5 p-10 shadow-2xl shadow-black/20 backdrop-blur-sm dark:border-white/10 dark:bg-linear-to-br dark:from-white/10 dark:to-white/5 dark:shadow-black/60"
          style={{
            backfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
          }}
        >
          <div className="text-card-foreground flex items-center gap-3 text-base">
            <Mail className="text-muted-foreground size-5 shrink-0" />
            <a
              href="mailto:hi@ttymayor.com"
              className="text-card-foreground -my-2 truncate py-2 hover:underline"
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
            >
              hi@ttymayor.com
            </a>
          </div>
          <div className="text-card-foreground flex items-center gap-3 text-base">
            <GitHubIcon className="text-muted-foreground size-5 shrink-0" />
            <a
              href="https://github.com/ttymayor"
              className="text-card-foreground -my-2 truncate py-2 hover:underline"
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
            >
              github.com/ttymayor
            </a>
          </div>
          <div className="text-card-foreground flex items-center gap-3 text-base">
            <Link className="text-muted-foreground size-5 shrink-0" />
            <a
              href="https://v2.ttymayor.com"
              className="text-card-foreground -my-2 truncate py-2 hover:underline"
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
            >
              v2.ttymayor.com
            </a>
          </div>
          <p className="text-muted-foreground/50 absolute bottom-3 left-0 w-full text-center text-xs">
            Click to flip back
          </p>
        </div>
      </div>
    </div>
  );
}
