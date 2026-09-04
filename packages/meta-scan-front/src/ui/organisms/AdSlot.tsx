"use client";

import Script from "next/script";

// Google AdSense placeholder slot (issue #18 adsense-integration,
// spec-fixed comment). Gated entirely on `NEXT_PUBLIC_ADSENSE_CLIENT_ID` —
// unset/empty (pre-approval) renders nothing at all: no <ins> markup, no
// loader script tag. This lets the page ship safely before AdSense
// approval and activates automatically once the env var is filled in
// post-approval — no code change needed.
//
// A real ad-unit (slot) ID can't be issued before approval, so this uses a
// fixed placeholder value rather than a second env var (spec-fixed
// explicitly leaves this choice to dev-front discretion, as long as the
// client-id-gating requirement holds).
const ADSENSE_PLACEHOLDER_SLOT_ID = "0000000000";

export const AdSlot = () => {
  const clientId = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID;
  if (!clientId) return null;

  return (
    <>
      {/* `afterInteractive` (not `beforeInteractive`/blocking) so the
       * loader doesn't compete with this page's own content for the
       * initial paint — this page's Lighthouse "performance" score is
       * itself part of what it reports on, so it shouldn't tank it. */}
      <Script
        async
        strategy="afterInteractive"
        src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${clientId}`}
        crossOrigin="anonymous"
      />
      {/* Google's standard adsbygoogle unit markup. Sharp-box wrapper
       * (hardline border, no shadow) to match design-system.md §4 even
       * though the ad content itself is outside our control. */}
      <div className="mt-8 border-[1.5px] border-foreground p-2">
        <ins
          data-testid="ad-slot"
          className="adsbygoogle block"
          style={{ display: "block" }}
          data-ad-client={clientId}
          data-ad-slot={ADSENSE_PLACEHOLDER_SLOT_ID}
          data-ad-format="auto"
          data-full-width-responsive="true"
        />
      </div>
    </>
  );
};
