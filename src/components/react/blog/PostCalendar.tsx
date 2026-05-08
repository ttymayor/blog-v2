import { useMemo, useState } from "react";
import type { BlogPost } from "@/types/blog";

const MONTH_NAMES = [
  "1",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "10",
  "11",
  "12",
];
const DAY_LABELS = ["Mon", "", "Wed", "", "Fri", "", "Sun"];

function toKey(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

interface Cell {
  key: string;
  date: Date;
  padding: boolean;
}

interface Props {
  posts: BlogPost[];
  numWeeks?: number;
  compact?: boolean;
}

export default function PostCalendar({
  posts,
  numWeeks = 52,
  compact = false,
}: Props) {
  const [hovered, setHovered] = useState<string | null>(null);

  const postsByDate = useMemo(() => {
    const map = new Map<string, BlogPost[]>();
    for (const post of posts) {
      const key = post.pubDate.slice(0, 10);
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(post);
    }
    return map;
  }, [posts]);

  const { weeks, monthLabels } = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const start = new Date(today);
    start.setDate(start.getDate() - numWeeks * 7);
    const dow = start.getDay();
    start.setDate(start.getDate() - (dow === 0 ? 6 : dow - 1));

    const weeks: Cell[][] = [];
    const monthLabels: { month: number; weekIdx: number }[] = [];
    let prevMonth = -1;
    const cur = new Date(start);

    while (cur <= today) {
      const week: Cell[] = [];
      for (let d = 0; d < 7; d++) {
        const date = new Date(cur);
        if (d === 0 && date.getMonth() !== prevMonth) {
          monthLabels.push({ month: date.getMonth(), weekIdx: weeks.length });
          prevMonth = date.getMonth();
        }
        week.push({ key: toKey(date), date, padding: date > today });
        cur.setDate(cur.getDate() + 1);
      }
      weeks.push(week);
    }

    return { weeks, monthLabels };
  }, [numWeeks]);

  const hoveredPosts = hovered ? postsByDate.get(hovered) : undefined;
  const gap = compact ? "gap-0.5" : "gap-1";

  if (compact) {
    return (
      <div className="flex w-full flex-col gap-0.5 select-none">
        {/* Month labels */}
        <div className="flex w-full gap-0.5">
          {weeks.map((_, wi) => {
            const label = monthLabels.find((m) => m.weekIdx === wi);
            return (
              <div
                key={wi}
                className="text-muted-foreground min-w-0 flex-1 overflow-visible text-[9px] leading-none whitespace-nowrap"
              >
                {label ? MONTH_NAMES[label.month] : ""}
              </div>
            );
          })}
        </div>

        {/* Week columns */}
        <div className="flex w-full gap-0.5">
          {weeks.map((week, wi) => (
            <div key={wi} className="flex min-w-0 flex-1 flex-col gap-0.5">
              {week.map((cell, di) => {
                if (cell.padding) {
                  return <div key={di} className="aspect-square w-full" />;
                }
                const hasPosts = postsByDate.has(cell.key);
                return (
                  <div
                    key={cell.key}
                    className={`aspect-square w-full rounded-sm transition-colors ${
                      hasPosts
                        ? "bg-primary hover:bg-primary/70 cursor-pointer"
                        : "bg-muted hover:bg-muted-foreground/30"
                    }`}
                    title={
                      hasPosts
                        ? postsByDate
                            .get(cell.key)!
                            .map((p) => p.title)
                            .join(", ")
                        : undefined
                    }
                  />
                );
              })}
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="overflow-x-auto">
        <div className={`inline-flex flex-col ${gap} select-none`}>
          {/* Month labels */}
          <div className={`flex ${gap} pl-8`}>
            {weeks.map((_, wi) => {
              const label = monthLabels.find((m) => m.weekIdx === wi);
              return (
                <div
                  key={wi}
                  className="text-muted-foreground size-3 shrink-0 overflow-visible text-[10px] leading-none whitespace-nowrap"
                >
                  {label ? MONTH_NAMES[label.month] : ""}
                </div>
              );
            })}
          </div>

          {/* Day labels + grid */}
          <div className={`flex ${gap}`}>
            {/* Day-of-week labels */}
            <div className={`flex flex-col ${gap} w-7 shrink-0`}>
              {DAY_LABELS.map((label, i) => (
                <div
                  key={i}
                  className="text-muted-foreground flex h-3 items-center justify-end pr-1 text-[10px] leading-none"
                >
                  {label}
                </div>
              ))}
            </div>

            {/* Week columns */}
            {weeks.map((week, wi) => (
              <div key={wi} className={`flex flex-col ${gap}`}>
                {week.map((cell, di) => {
                  if (cell.padding) {
                    return <div key={di} className="size-3 shrink-0" />;
                  }
                  const hasPosts = postsByDate.has(cell.key);
                  return (
                    <div
                      key={cell.key}
                      className={`size-3 shrink-0 rounded-[2px] transition-colors ${
                        hasPosts
                          ? "bg-primary hover:bg-primary/70 cursor-pointer"
                          : "bg-muted hover:bg-muted-foreground/30"
                      }`}
                      title={
                        hasPosts
                          ? postsByDate
                              .get(cell.key)!
                              .map((p) => p.title)
                              .join(", ")
                          : undefined
                      }
                      onMouseEnter={() => setHovered(cell.key)}
                      onMouseLeave={() => setHovered(null)}
                    />
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Hover info panel */}
      <div className="text-muted-foreground mt-2 h-5 text-xs">
        {hovered &&
          (hoveredPosts?.length ? (
            <span>
              <span className="text-foreground font-medium">{hovered}</span>
              {" — "}
              {hoveredPosts.map((p, i) => (
                <span key={p.id}>
                  {i > 0 && ", "}
                  <a
                    href={`/blog/${p.id}`}
                    className="text-foreground hover:underline"
                  >
                    {p.title}
                  </a>
                </span>
              ))}
            </span>
          ) : (
            <span>{hovered}</span>
          ))}
      </div>
    </div>
  );
}
