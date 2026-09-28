import React from "react";
import { render, waitFor } from "@testing-library/react";

import { AutoAdsScript } from "@/ui/organisms/AutoAdsScript";

// issue #48 domain-migration — replaces the old manual AdSlot <ins> unit
// (issue #18) with Google Auto Ads: a single global loader script, no
// per-page markup. Same env-var gating pattern as AdSlot/AnalyticsGate so
// it stays safely inert pre-approval.
describe("AutoAdsScript", () => {
  const ORIGINAL_ENV = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID;

  afterEach(() => {
    if (ORIGINAL_ENV === undefined) {
      delete process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID;
    } else {
      process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID = ORIGINAL_ENV;
    }
    document
      .querySelectorAll('script[src*="adsbygoogle"]')
      .forEach((el) => el.remove());
  });

  it("renders nothing when NEXT_PUBLIC_ADSENSE_CLIENT_ID is unset", () => {
    delete process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID;

    const { container } = render(<AutoAdsScript />);

    expect(container).toBeEmptyDOMElement();
    expect(
      document.querySelector('script[src*="adsbygoogle"]')
    ).not.toBeInTheDocument();
  });

  it("renders nothing when NEXT_PUBLIC_ADSENSE_CLIENT_ID is an empty string", () => {
    process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID = "";

    const { container } = render(<AutoAdsScript />);

    expect(container).toBeEmptyDOMElement();
  });

  it("injects exactly one adsbygoogle loader script (afterInteractive) when the client ID is set", async () => {
    process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID = "ca-pub-9590914027828852";

    render(<AutoAdsScript />);

    await waitFor(() => {
      expect(
        document.querySelector('script[src*="adsbygoogle.js"]')
      ).toBeInTheDocument();
    });

    const scripts = document.querySelectorAll(
      'script[src*="adsbygoogle.js"]'
    );
    expect(scripts).toHaveLength(1);
    expect(scripts[0].getAttribute("src")).toContain(
      "client=ca-pub-9590914027828852"
    );
  });
});
