import { analyticsConsentKey } from "@/constans";

// issue #19 analytics-integration — GA4 is cookie-based, so the consent
// banner's choice must be persisted so a returning visitor isn't asked
// again and so `AnalyticsGate` knows whether it's allowed to load the GA4
// script on this visit. Pure localStorage read/write, no React state here —
// `AnalyticsGate` owns the render-time decision of what to show.

export type ConsentStatus = "granted" | "denied";

function isConsentStatus(value: string | null): value is ConsentStatus {
  return value === "granted" || value === "denied";
}

/** Returns the previously stored decision, or `null` if the user hasn't
 * decided yet (first visit) or the stored value isn't recognized. */
export function getStoredConsent(): ConsentStatus | null {
  if (typeof window === "undefined") return null;
  const raw = window.localStorage.getItem(analyticsConsentKey);
  return isConsentStatus(raw) ? raw : null;
}

export function storeConsent(status: ConsentStatus): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(analyticsConsentKey, status);
}
