import React from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";

import { AnalyticsGate } from "@/ui/organisms/AnalyticsGate";
import { analyticsConsentKey } from "@/constans";

// issue #19 analytics-integration. GA4 script loading is gated on both
// `NEXT_PUBLIC_GA_MEASUREMENT_ID` being set (production only) *and* the
// user having granted consent — see spec-fixed comment "환경 분기"/"GA4
// 스크립트 로딩" ACs. `next/script`'s `afterInteractive` strategy appends
// the real <script> to document.body (see AdSlot.test.tsx's note), so we
// assert against `document` for the script-tag checks.
describe("AnalyticsGate", () => {
  const ORIGINAL_ENV = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
  const t = {
    message: "We use cookies for analytics.",
    accept: "Accept",
    reject: "Reject",
  };

  const gtagScriptSelector = 'script[src*="googletagmanager.com/gtag/js"]';

  afterEach(() => {
    if (ORIGINAL_ENV === undefined) {
      delete process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
    } else {
      process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID = ORIGINAL_ENV;
    }
    window.localStorage.clear();
    document.querySelectorAll(gtagScriptSelector).forEach((el) => el.remove());
    // Next's `afterInteractive` inline script actually runs in jsdom and
    // declares a top-level `function gtag(){}`, which becomes a
    // non-configurable window property (browsers do this for top-level
    // function declarations) — reassign rather than `delete`.
    (window as unknown as { gtag?: unknown }).gtag = undefined;
  });

  describe("production (measurement ID set)", () => {
    beforeEach(() => {
      process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID = "G-TEST123";
    });

    it("shows the consent banner on first visit and does not load GA4 yet", () => {
      render(<AnalyticsGate theme="dark" lang="en" t={t} />);

      expect(screen.getByText(t.message)).toBeInTheDocument();
      expect(document.querySelector(gtagScriptSelector)).not.toBeInTheDocument();
    });

    it("loads GA4 and hides the banner once the user accepts, and persists the decision", async () => {
      render(<AnalyticsGate theme="dark" lang="en" t={t} />);

      fireEvent.click(screen.getByRole("button", { name: t.accept }));

      expect(screen.queryByText(t.message)).not.toBeInTheDocument();
      expect(window.localStorage.getItem(analyticsConsentKey)).toBe("granted");
      await waitFor(() =>
        expect(document.querySelector(gtagScriptSelector)).toBeInTheDocument()
      );
      expect(
        document.querySelector(gtagScriptSelector)?.getAttribute("src")
      ).toContain("G-TEST123");
    });

    it("hides the banner and never loads GA4 once the user rejects, and persists the decision", () => {
      render(<AnalyticsGate theme="dark" lang="en" t={t} />);

      fireEvent.click(screen.getByRole("button", { name: t.reject }));

      expect(screen.queryByText(t.message)).not.toBeInTheDocument();
      expect(window.localStorage.getItem(analyticsConsentKey)).toBe("denied");
      expect(document.querySelector(gtagScriptSelector)).not.toBeInTheDocument();
    });

    it("does not show the banner again and loads GA4 immediately when consent was already granted", async () => {
      // Distinct measurement ID from the other cases in this describe block
      // — next/script tracks already-loaded `src`s in a module-level cache
      // that isn't reset between tests in the same file, so reusing
      // "G-TEST123" here would make this assertion pass even if the
      // "already granted -> load immediately" behavior were broken.
      process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID = "G-TEST-ALREADY-GRANTED";
      window.localStorage.setItem(analyticsConsentKey, "granted");

      render(<AnalyticsGate theme="dark" lang="en" t={t} />);

      expect(screen.queryByText(t.message)).not.toBeInTheDocument();
      await waitFor(() =>
        expect(
          document.querySelector('script[src*="G-TEST-ALREADY-GRANTED"]')
        ).toBeInTheDocument()
      );
    });

    it("does not show the banner again and never loads GA4 when consent was already denied", () => {
      window.localStorage.setItem(analyticsConsentKey, "denied");

      render(<AnalyticsGate theme="dark" lang="en" t={t} />);

      expect(screen.queryByText(t.message)).not.toBeInTheDocument();
      expect(document.querySelector(gtagScriptSelector)).not.toBeInTheDocument();
    });
  });

  describe("local development (measurement ID unset)", () => {
    beforeEach(() => {
      delete process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
    });

    it("never loads GA4 even if the user accepts", () => {
      window.localStorage.setItem(analyticsConsentKey, "granted");

      render(<AnalyticsGate theme="dark" lang="en" t={t} />);

      expect(document.querySelector(gtagScriptSelector)).not.toBeInTheDocument();
    });

    it("never loads GA4 with no stored consent either", () => {
      render(<AnalyticsGate theme="dark" lang="en" t={t} />);

      expect(document.querySelector(gtagScriptSelector)).not.toBeInTheDocument();
    });
  });
});
