import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { PenLine } from "lucide-react";

interface Props {
  date: string;
}

export default function ModifiedDateButton({ date }: Props) {
  const formatted = new Date(date).toLocaleDateString("zh-TW", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
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
  );
}
