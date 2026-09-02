import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/utils/cn";

/**
 * Judgement badge for meta-scan's own checklist semantics
 * (pass/warning/fail/info — docs/design-system.md §8). This is deliberately
 * a separate primitive from <Badge>, which is a generic tag/label and knows
 * nothing about this product's pass/warning/fail/info vocabulary.
 *
 * Purely presentational: it renders whichever `status` it's given. Deciding
 * what a check's status *is* — from checks[] returned by the backend — is
 * functionality (features/run-scan/model), not this component's job.
 *
 * pass/warning/fail always render as equal-weight filled boxes (2026-08-18
 * decision recorded in design-system.md §2 — no single status may look
 * heavier than the others). info is the one deliberate exception: outline
 * only, no fill, because an absent AEO/GEO signal isn't a deduction.
 */
const statusBadgeVariants = cva(
  // Fixed width (not w-fit) so PASS/WARN/FAIL/INFO badges line up evenly in
  // a column instead of each hugging its own text width (2026-09-02 user
  // request — "WARN" is now the same 4 characters as the other 3 labels,
  // but "W" is wider than "P"/"F"/"I" so w-fit still produced visibly
  // uneven badges).
  "inline-flex w-[62px] shrink-0 items-center justify-center gap-1 whitespace-nowrap border px-[9px] py-[3px] text-xs font-bold tracking-[.04em]",
  {
    variants: {
      status: {
        pass: "border-transparent bg-success text-success-foreground",
        warning: "border-transparent bg-warning text-warning-foreground",
        fail: "border-transparent bg-destructive text-destructive-foreground",
        info: "border-[1.5px] border-info-border text-info",
      },
    },
  }
);

export interface StatusBadgeProps
  extends Omit<React.ComponentProps<"span">, "children">,
    VariantProps<typeof statusBadgeVariants> {
  status: NonNullable<VariantProps<typeof statusBadgeVariants>["status"]>;
  children: React.ReactNode;
}

/**
 * Display label for a status — every checklist card renders this as the
 * badge's children (`<StatusBadge status={check.status}>{statusLabel(check.status)}</StatusBadge>`).
 * "warning" shortens to "WARN" (2026-09-02 user request — "WARNING" reads
 * visibly longer than PASS/FAIL/INFO, unbalancing the badge row); the other
 * 3 are just their own uppercased status.
 */
export function statusLabel(
  status: NonNullable<VariantProps<typeof statusBadgeVariants>["status"]>
): string {
  if (status === "warning") return "WARN";
  return status.toUpperCase();
}

function StatusBadge({ status, className, children, ...props }: StatusBadgeProps) {
  return (
    <span
      data-slot="status-badge"
      data-status={status}
      className={cn(statusBadgeVariants({ status }), className)}
      {...props}
    >
      {children}
    </span>
  );
}

export { StatusBadge, statusBadgeVariants };
