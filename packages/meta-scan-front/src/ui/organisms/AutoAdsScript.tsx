"use client";

import Script from "next/script";

// Google Auto Ads global loader (issue #48 domain-migration, replaces the
// manual AdSlot <ins> unit from issue #18 — Auto Ads and manual slots
// aren't meant to run side by side per Google's own guidance). Mounted
// once in the root layout so it covers every route, not just the scan
// result page. Same env-var gating pattern as AdSlot/AnalyticsGate:
// unset/empty `NEXT_PUBLIC_ADSENSE_CLIENT_ID` (pre-approval) renders
// nothing at all, so this ships safely before AdSense approval and
// activates automatically once the value is filled in.
export const AutoAdsScript = () => {
  const clientId = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID;
  if (!clientId) return null;

  return (
    // `afterInteractive` (not `beforeInteractive`/blocking) so the loader
    // doesn't compete with initial paint — same Lighthouse-performance
    // reasoning AdSlot used to carry.
    <Script
      async
      strategy="afterInteractive"
      src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${clientId}`}
      crossOrigin="anonymous"
    />
  );
};
