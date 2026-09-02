import { trackEvent } from "@/services/analyticsEvents";

// issue #19 analytics-integration — custom event dispatch. This is a thin
// wrapper around `window.gtag`; the real gating (env var + consent) lives in
// whether `window.gtag` exists at all (AnalyticsGate only defines it once
// GA4 is actually allowed to load), so trackEvent itself just needs to be a
// safe no-op whenever that global isn't there yet.
describe("trackEvent", () => {
  afterEach(() => {
    delete (window as unknown as { gtag?: unknown }).gtag;
  });

  it("does nothing and does not throw when window.gtag is not defined (GA4 not loaded)", () => {
    expect(() => trackEvent("scan_requested")).not.toThrow();
  });

  it("forwards the event name and params to window.gtag when it is defined", () => {
    const gtag = jest.fn();
    (window as unknown as { gtag: typeof gtag }).gtag = gtag;

    trackEvent("scan_completed", { url: "https://example.com" });

    expect(gtag).toHaveBeenCalledWith("event", "scan_completed", {
      url: "https://example.com",
    });
  });

  it("calls window.gtag with undefined params when none are given", () => {
    const gtag = jest.fn();
    (window as unknown as { gtag: typeof gtag }).gtag = gtag;

    trackEvent("robots_blocked");

    expect(gtag).toHaveBeenCalledWith("event", "robots_blocked", undefined);
  });
});
