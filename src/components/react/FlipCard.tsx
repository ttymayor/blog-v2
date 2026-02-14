import { useCallback, useEffect, useRef, useState } from "react";

interface FlipCardProps {
  avatarSrc: string;
}

const TILT_MAX = 15; // degrees
const TILT_LERP = 0.08;
const FLIP_LERP = 0.08;

export default function FlipCard({ avatarSrc }: FlipCardProps) {
  const [flipped, setFlipped] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const tiltRef = useRef({ x: 0, y: 0 });
  const currentTilt = useRef({ x: 0, y: 0 });
  const flipTarget = useRef(0);
  const currentFlip = useRef(0);
  const isFlipping = useRef(false);
  const rafRef = useRef<number>(0);

  // Update flip target when state changes
  useEffect(() => {
    flipTarget.current = flipped ? 180 : 0;
    isFlipping.current = true;
  }, [flipped]);

  // Smooth animation loop for both tilt and flip
  useEffect(() => {
    const animate = () => {
      // Lerp tilt (pause during flip)
      const tx = isFlipping.current ? 0 : tiltRef.current.x;
      const ty = isFlipping.current ? 0 : tiltRef.current.y;
      currentTilt.current.x += (tx - currentTilt.current.x) * TILT_LERP;
      currentTilt.current.y += (ty - currentTilt.current.y) * TILT_LERP;

      // Lerp flip
      currentFlip.current +=
        (flipTarget.current - currentFlip.current) * FLIP_LERP;
      if (
        isFlipping.current &&
        Math.abs(currentFlip.current - flipTarget.current) < 0.5
      ) {
        isFlipping.current = false;
      }

      if (cardRef.current) {
        const rx = currentTilt.current.x.toFixed(2);
        const ry = currentTilt.current.y.toFixed(2);
        const fy = currentFlip.current.toFixed(2);
        cardRef.current.style.transform = `rotateX(${rx}deg) rotateY(${fy}deg) rotateZ(${(-Number(ry) * 0.3).toFixed(2)}deg)`;
      }
      rafRef.current = requestAnimationFrame(animate);
    };
    rafRef.current = requestAnimationFrame(animate);
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
          className="dark:bg-card absolute inset-0 flex flex-col items-center justify-center rounded-xl bg-[#eeeeee] p-6 shadow-2xl"
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
              <p className="text-muted-foreground mt-1 text-base">
                Web Developer．Student
              </p>
              <div className="mt-2 flex items-center gap-2">
                {/* Next.js */}
                <svg
                  viewBox="0 0 128 128"
                  className="text-card-foreground size-5"
                >
                  <circle cx="64" cy="64" r="64"></circle>
                  <path
                    fill="url(#a)"
                    d="M106.317 112.014 49.167 38.4H38.4v51.179h8.614v-40.24l52.54 67.884a64.216 64.216 0 0 0 6.763-5.209z"
                  ></path>
                  <path
                    fill="url(#b)"
                    d="M81.778 38.4h8.533v51.2h-8.533z"
                  ></path>
                  <defs>
                    <linearGradient
                      id="a"
                      x1="109"
                      x2="144.5"
                      y1="116.5"
                      y2="160.5"
                      gradientTransform="scale(.71111)"
                      gradientUnits="userSpaceOnUse"
                    >
                      <stop stop-color="#fff"></stop>
                      <stop
                        offset="1"
                        stop-color="#fff"
                        stop-opacity="0"
                      ></stop>
                    </linearGradient>
                    <linearGradient
                      id="b"
                      x1="121"
                      x2="120.799"
                      y1="54"
                      y2="106.875"
                      gradientTransform="scale(.71111)"
                      gradientUnits="userSpaceOnUse"
                    >
                      <stop stop-color="#fff"></stop>
                      <stop
                        offset="1"
                        stop-color="#fff"
                        stop-opacity="0"
                      ></stop>
                    </linearGradient>
                  </defs>
                </svg>
                {/* Laravel */}
                <svg
                  viewBox="0 0 128 128"
                  className="text-card-foreground size-5"
                >
                  <path
                    fill="#f0513f"
                    d="M27.271.11c-.2.078-5.82 3.28-12.487 7.112-8.078 4.644-12.227 7.09-12.449 7.32-.19.225-.34.482-.438.76-.167.564-.179 82.985-.01 83.578.061.23.26.568.44.754.436.46 48.664 28.19 49.25 28.324.272.065.577.054.88-.03.658-.165 48.76-27.834 49.188-28.286.175-.195.375-.532.44-.761.084-.273.115-4.58.115-13.655v-13.26l11.726-6.735c11.056-6.357 11.733-6.755 12.017-7.191l.29-.47V43.287c0-15.548.03-14.673-.585-15.235-.165-.146-5.798-3.433-12.53-7.31L100.89 13.71h-1.359l-11.963 6.87c-6.586 3.788-12.184 7.027-12.457 7.203-.272.18-.597.512-.73.753l-.242.417-.054 13.455-.048 13.46-9.879 5.69c-5.434 3.124-9.957 5.71-10.053 5.734-.175.049-.187-1.232-.187-25.966V15.293l-.26-.447c-.326-.545 1.136.324-13.544-8.114C27.803-.348 28.098-.2 27.27.11zm11.317 10.307c5.15 2.955 9.364 5.4 9.364 5.43 0 .031-4.516 2.641-10.035 5.813l-10.041 5.765-10.023-5.764c-5.507-3.173-10.02-5.783-10.02-5.814 0-.03 4.505-2.64 10.013-5.805l9.999-5.752.69.376c3.357 1.907 6.708 3.824 10.053 5.751zm71.668 13.261c5.422 3.122 9.908 5.702 9.95 5.744.114.103-19.774 11.535-20.046 11.523-.272-.008-19.915-11.335-19.907-11.473.01-.157 19.773-11.527 19.973-11.496.091.022 4.607 2.59 10.03 5.702zM16.3 25.328l9.558 5.503.055 27.247.05 27.252.233.368c.122.194.352.459.52.581.158.115 5.477 3.146 11.818 6.724l11.52 6.506v11.527c0 6.326-.043 11.516-.097 11.516-.041 0-10-5.699-22.124-12.676L5.793 97.201l-.03-38.966-.019-38.954.49.271c.283.15 4.807 2.748 10.065 5.775zm33.754 19.18v25.109l-.387.253c-.525.332-19.667 11.335-19.732 11.335-.03 0-.054-11.336-.054-25.193l.012-25.182 10-5.752c5.499-3.165 10.034-5.733 10.088-5.714.039.024.073 11.34.073 25.144zm38.15-5.775 10.023 5.763V55.92c0 10.838-.011 11.42-.176 11.357-.107-.041-4.642-2.64-10.083-5.774l-9.91-5.69v-11.42c0-6.287.032-11.424.062-11.424.043 0 4.577 2.592 10.084 5.764zm34.164 5.587c0 6.254-.042 11.412-.084 11.462-.072.115-19.896 11.538-20.022 11.538-.031 0-.062-5.135-.062-11.423v-11.42l10-5.756c5.507-3.16 10.042-5.752 10.084-5.752.053 0 .084 5.105.084 11.351zM95.993 70.933 52.005 96.04 32.056 84.693S76 59.277 76.176 59.343zm2.215 14.827-.034 11.442-22.028 12.676c-12.12 6.976-22.082 12.675-22.132 12.675-.053 0-.095-4.658-.095-11.516V99.51l22.08-12.592c12.132-6.923 22.101-12.59 22.154-12.602.043 0 .062 5.148.054 11.443z"
                  ></path>
                </svg>
              </div>
            </div>
          </div>
          <p className="text-muted-foreground/50 absolute bottom-3 text-xs">
            Click to flip
          </p>
        </div>

        {/* Back face */}
        <div
          className="dark:bg-card absolute inset-0 flex flex-col justify-center gap-4 rounded-xl bg-[#eeeeee] px-8 shadow-lg"
          style={{
            backfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
          }}
        >
          <div className="text-card-foreground flex items-center gap-3 text-base">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="text-muted-foreground size-5 shrink-0"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect width="20" height="16" x="2" y="4" rx="2" />
              <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
            </svg>
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
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="text-muted-foreground size-5 shrink-0"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
            </svg>
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
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="text-muted-foreground size-5 shrink-0"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
              <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
            </svg>
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
