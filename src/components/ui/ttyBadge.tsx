import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Slot } from "radix-ui";

import { cn } from "@/lib/utils";

const ttyBadgeVariants = cva(
  "inline-flex items-center justify-center rounded-sm border px-2 py-0.5 text-xs font-medium w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1 [&>svg]:pointer-events-none transition-[color,box-shadow] overflow-hidden",
  {
    variants: {
      variant: {
        default: "border-border text-foreground bg-muted",
        category:
          "border-[#687afc] text-[#687afc] bg-[#687afc]/10 dark:border-[#eebbc3] dark:text-[#eebbc3] dark:bg-[#eebbc3]/10",
        tag: "border-transparent bg-[#ecefff] dark:bg-[#1e2238]",
        outline: "border-border text-foreground",
        accent:
          "border-transparent bg-[#687afc]/15 text-[#687afc] dark:bg-[#eebbc3]/15 dark:text-[#eebbc3]",
      },
      size: {
        default: "text-xs px-2 py-0.5",
        sm: "text-[10px] px-1.5 py-px",
        lg: "text-sm px-2.5 py-1",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

function TtyBadge({
  className,
  variant = "default",
  size = "default",
  asChild = false,
  ...props
}: React.ComponentProps<"span"> &
  VariantProps<typeof ttyBadgeVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot.Root : "span";

  return (
    <Comp
      data-slot="tty-badge"
      className={cn(ttyBadgeVariants({ variant, size }), className)}
      {...props}
    />
  );
}

export { TtyBadge, ttyBadgeVariants };
