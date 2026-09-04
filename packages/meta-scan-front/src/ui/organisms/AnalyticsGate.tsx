"use client";

import { useEffect, useState } from "react";
import Script from "next/script";

import { CookieConsentBanner } from "@/ui/molecules/CookieConsentBanner";
import {
  ConsentStatus,
  getStoredConsent,
  storeConsent,
} from "@/services/analyticsConsent";

// GA4 consent gate (issue #19 analytics-integration). Mirrors AdSlot's
// "fully disabled without the env var" pattern, plus a consent layer on top
// since GA4 is cookie-based:
//
//   NEXT_PUBLIC_GA_MEASUREMENT_ID unset (local dev)  -> nothing ever renders,
//     not even the banner (asking for consent that can never lead to a load
//     is pointless UX — spec-fixed leaves this to dev-front discretion).
//   set + no stored decision                          -> banner only.
//   set + stored "granted" (or just clicked accept)    -> gtag.js loads.
//   set + stored "denied"  (or just clicked reject)    -> nothing loads.
//
// Deliberately reads consent from localStorage only after mount (not
// during the initial render) so this never diverges between server and
// client render output — same reasoning as AdSlot reading its env var
// directly, but here the source (localStorage) genuinely doesn't exist on
// the server at all.
interface AnalyticsGateProps extends DefaultProps {
  t: { message: string; accept: string; reject: string };
}

export const AnalyticsGate = ({ theme, t }: AnalyticsGateProps) => {
  const measurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
  const [consent, setConsent] = useState<ConsentStatus | null>(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    if (!measurementId) return;
    setConsent(getStoredConsent());
    setHydrated(true);
    // Only needs to run once on mount — `measurementId` comes from a
    // build-time env var, it can't change between renders.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!measurementId) return null;

  const decide = (status: ConsentStatus) => {
    storeConsent(status);
    setConsent(status);
  };

  return (
    <>
      {hydrated && consent === null && (
        <CookieConsentBanner
          theme={theme}
          message={t.message}
          acceptLabel={t.accept}
          rejectLabel={t.reject}
          onAccept={() => decide("granted")}
          onReject={() => decide("denied")}
        />
      )}

      {consent === "granted" && (
        <>
          <Script
            async
            strategy="afterInteractive"
            src={`https://www.googletagmanager.com/gtag/js?id=${measurementId}`}
          />
          <Script id="ga4-init" strategy="afterInteractive">
            {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
window.gtag = gtag;
gtag('js', new Date());
gtag('config', '${measurementId}');`}
          </Script>
        </>
      )}
    </>
  );
};
