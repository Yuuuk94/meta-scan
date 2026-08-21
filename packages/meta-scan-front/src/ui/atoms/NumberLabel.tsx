import * as React from "react";

import { cn } from "@/utils/cn";

/**
 * "01" / "02" / "03" style numbering — this system's recurring motif for
 * process steps, FAQ items, and improvement-suggestion cards
 * (design-system.md §4). Big Shoulders Display + the brand accent color,
 * zero-padded to 2 digits by default.
 */
export interface NumberLabelProps extends React.ComponentProps<"span"> {
  value: number | string;
  /** Zero-pad numeric values to this length (default 2 — "01", "02", ...). Ignored for string values. */
  pad?: number;
}

function NumberLabel({ value, pad = 2, className, ...props }: NumberLabelProps) {
  const label =
    typeof value === "number" ? String(value).padStart(pad, "0") : value;

  return (
    <span
      data-slot="number-label"
      className={cn(
        "font-display font-black leading-none tracking-tight text-accent",
        className
      )}
      {...props}
    >
      {label}
    </span>
  );
}

export { NumberLabel };
