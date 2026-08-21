import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/utils/cn";

/**
 * The rule line this system uses instead of card shadows/gaps to separate
 * content (design-system.md §5). "hairline" is the default 1.5px divider
 * (column rules inside a card grid, list-item separators); "thick" is the
 * 4-5px section boundary used at page/section breaks (also what the header
 * bottom / footer top rules are, per §5).
 */
const ruleVariants = cva("w-full border-0 border-t", {
  variants: {
    weight: {
      hairline: "border-t-[1.5px] border-border",
      thick: "border-t-[5px] border-foreground",
    },
  },
  defaultVariants: {
    weight: "hairline",
  },
});

export interface RuleProps
  extends React.ComponentProps<"hr">,
    VariantProps<typeof ruleVariants> {}

function Rule({ weight, className, ...props }: RuleProps) {
  return (
    <hr
      data-slot="rule"
      className={cn(ruleVariants({ weight }), className)}
      {...props}
    />
  );
}

export { Rule, ruleVariants };
