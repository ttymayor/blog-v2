import { useVercount } from "vercount-react";
import { useMotionValue, useSpring, useInView } from "motion/react";
import { useEffect, useRef } from "react";

function SpringCounter({ value }: { value: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const motionValue = useMotionValue(0);
  const springValue = useSpring(motionValue, {
    damping: 60,
    stiffness: 100,
  });
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (isInView && value > 0) {
      motionValue.set(value);
    }
  }, [isInView, value, motionValue]);

  useEffect(
    () =>
      springValue.on("change", (latest) => {
        if (ref.current) {
          ref.current.textContent = Math.round(latest).toLocaleString();
        }
      }),
    [springValue],
  );

  return (
    <span
      ref={ref}
      className={`inline-block cursor-default font-mono tabular-nums transition-[filter] duration-700 ${isInView ? "blur-none" : "blur"}`}
    >
      0
    </span>
  );
}

export default function Vercount() {
  const { sitePv, siteUv } = useVercount();

  return (
    <div>
      <p>
        總訪問量 <SpringCounter value={Number(sitePv) || 0} />
      </p>
      <p>
        瀏覽人數 <SpringCounter value={Number(siteUv) || 0} />
      </p>
    </div>
  );
}
