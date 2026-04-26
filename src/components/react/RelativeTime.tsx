import { useState, useEffect } from "react";
import { relativeTime } from "@/lib/utils";

interface Props {
  dateStr: string;
}

export default function RelativeTime({ dateStr }: Props) {
  const [text, setText] = useState(() => relativeTime(dateStr));

  useEffect(() => {
    const id = setInterval(() => setText(relativeTime(dateStr)), 60000);
    return () => clearInterval(id);
  }, [dateStr]);

  return <>{text}</>;
}
