// issue #19 analytics-integration — the 3 custom events the confirmed spec
// scopes in: scan_requested/scan_completed/robots_blocked. GA4 gating
// (production env var + user consent) is entirely owned by
// `@/ui/organisms/AnalyticsGate`, which only ever defines `window.gtag` once
// both conditions hold — so this file doesn't re-check either condition
// itself, it just needs to be a safe no-op whenever that global isn't
// present yet (dev environment, consent not yet granted/denied, or denied).

export type AnalyticsEventName =
  | "scan_requested"
  | "scan_completed"
  | "robots_blocked";

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

export function trackEvent(
  name: AnalyticsEventName,
  params?: Record<string, unknown>
): void {
  if (typeof window === "undefined") return;
  if (typeof window.gtag !== "function") return;
  window.gtag("event", name, params);
}
