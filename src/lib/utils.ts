import { clsx, type ClassValue } from "cnfast";
import { twMerge } from "cnfast";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const LOCALE = "zh-TW";
const TIME_ZONE = "Asia/Taipei";
const DAY_IN_MS = 86_400_000;
const WEEK_IN_MS = 7 * DAY_IN_MS;

const rtf = new Intl.RelativeTimeFormat(LOCALE, { numeric: "auto" });
const monthDayFormatter = new Intl.DateTimeFormat(LOCALE, {
  month: "long",
  day: "numeric",
  timeZone: TIME_ZONE,
});
const yearMonthDayFormatter = new Intl.DateTimeFormat(LOCALE, {
  year: "numeric",
  month: "long",
  day: "numeric",
  timeZone: TIME_ZONE,
});
const yearFormatter = new Intl.DateTimeFormat(LOCALE, {
  year: "numeric",
  timeZone: TIME_ZONE,
});

export function relativeTime(dateStr: string, now = new Date()): string {
  const date = new Date(dateStr);
  const diff = date.getTime() - now.getTime();

  if (Math.abs(diff) > WEEK_IN_MS) {
    const isSameYear = yearFormatter.format(date) === yearFormatter.format(now);
    return (isSameYear ? monthDayFormatter : yearMonthDayFormatter).format(date);
  }

  const days = Math.round(diff / DAY_IN_MS);
  const minutes = Math.round(diff / 60_000);
  if (Math.abs(minutes) < 60) return rtf.format(minutes, "minute");
  if (Math.abs(days) < 1) return rtf.format(Math.round(diff / 3_600_000), "hour");
  return rtf.format(days, "day");
}
