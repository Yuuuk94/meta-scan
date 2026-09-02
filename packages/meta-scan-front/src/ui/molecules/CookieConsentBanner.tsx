import React from "react";

import { Button } from "@/ui/atoms/Button";

// Generic cookie-consent banner molecule (issue #19 analytics-integration).
// No GA4/localStorage knowledge here — that's `@/ui/organisms/AnalyticsGate`'s
// job (ADR-010: molecules combine atoms with no domain knowledge). Message
// and button labels are passed in so this could be reused for a non-GA4
// consent purpose later without changes.
interface CookieConsentBannerProps {
  theme: Theme;
  message: string;
  acceptLabel: string;
  rejectLabel: string;
  onAccept: () => void;
  onReject: () => void;
}

export const CookieConsentBanner = ({
  message,
  acceptLabel,
  rejectLabel,
  onAccept,
  onReject,
}: CookieConsentBannerProps) => {
  return (
    // Fixed bottom bar, hard rule instead of a shadow (design-system.md §4/§7
    // — no shadow/glassmorphism anywhere in this system).
    <div
      role="region"
      aria-label="cookie consent"
      className="fixed inset-x-0 bottom-0 z-50 border-t-[1.5px] border-foreground bg-card"
    >
      <div className="content-frame flex flex-col items-center justify-between gap-3 py-4 sm:flex-row">
        <p className="text-sm text-foreground-secondary">{message}</p>
        <div className="flex shrink-0 gap-2">
          <Button variant="outline" size="sm" onClick={onReject}>
            {rejectLabel}
          </Button>
          <Button variant="accent" size="sm" onClick={onAccept}>
            {acceptLabel}
          </Button>
        </div>
      </div>
    </div>
  );
};
