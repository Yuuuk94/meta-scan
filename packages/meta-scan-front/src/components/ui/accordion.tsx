"use client";

import * as React from "react";
import { Accordion as AccordionPrimitive } from "radix-ui";

import { cn } from "./utils";

function Accordion({
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Root>) {
  return <AccordionPrimitive.Root data-slot="accordion" {...props} />;
}

function AccordionItem({
  className,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Item>) {
  return (
    <AccordionPrimitive.Item
      data-slot="accordion-item"
      className={cn("border-b last:border-b-0", className)}
      {...props}
    />
  );
}

function AccordionTrigger({
  className,
  children,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Trigger>) {
  return (
    <AccordionPrimitive.Header className="flex">
      <AccordionPrimitive.Trigger
        data-slot="accordion-trigger"
        className={cn(
          "focus-visible:border-ring focus-visible:ring-ring/50 flex flex-1 items-start justify-between gap-4 py-4 text-left text-sm font-medium outline-none hover:underline focus-visible:ring-[3px] disabled:pointer-events-none disabled:opacity-50",
          className
        )}
        {...props}
      >
        {children}
        {/* +/- text toggle, no icon library (design-system.md §4:
         * "'+'/'−' 텍스트 토글만 사용"). */}
        <span
          aria-hidden
          className="pointer-events-none shrink-0 translate-y-0.5 font-display text-lg font-bold text-muted-foreground [[data-state=open]_&]:hidden"
        >
          +
        </span>
        <span
          aria-hidden
          className="pointer-events-none hidden shrink-0 translate-y-0.5 font-display text-lg font-bold text-muted-foreground [[data-state=open]_&]:inline"
        >
          −
        </span>
      </AccordionPrimitive.Trigger>
    </AccordionPrimitive.Header>
  );
}

function AccordionContent({
  className,
  children,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Content>) {
  return (
    // No open/close animation — instant transition, per design-system.md
    // §4 ("애니메이션 없이 즉시 전환"). bg-card lifts the expanded panel off
    // the page background, same §4 rule. At mobile widths the expanded panel
    // bleeds edge-to-edge past the page's 20px gutter (max-sm:-mx-5, matching
    // content-frame's mobile padding) instead of staying inset like collapsed
    // items — zine-index intake §3.1.
    <AccordionPrimitive.Content
      data-slot="accordion-content"
      className="overflow-hidden bg-card text-sm max-sm:-mx-5 max-sm:px-5"
      {...props}
    >
      <div className={cn("px-1 pt-0 pb-4", className)}>{children}</div>
    </AccordionPrimitive.Content>
  );
}

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent };
