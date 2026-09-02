import React from "react";
import { render, screen } from "@testing-library/react";

import { AdSlot } from "@/ui/organisms/AdSlot";

// issue #18 adsense-integration — client ID env var is the sole gate.
// `next/script`'s `afterInteractive` strategy appends the real <script>
// element to document.body (not inside the render container) once mounted
// (see node_modules/next/dist/client/script.js), so we assert against
// `document` rather than the RTL container for the script-tag checks.
describe("AdSlot", () => {
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

    const { container } = render(<AdSlot />);

    expect(container).toBeEmptyDOMElement();
    expect(screen.queryByTestId("ad-slot")).not.toBeInTheDocument();
    expect(
      document.querySelector('script[src*="adsbygoogle"]')
    ).not.toBeInTheDocument();
  });

  it("renders nothing when NEXT_PUBLIC_ADSENSE_CLIENT_ID is an empty string", () => {
    process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID = "";

    const { container } = render(<AdSlot />);

    expect(container).toBeEmptyDOMElement();
  });

  it("renders the adsbygoogle <ins> with data-ad-client and injects the loader script when the client ID is set", async () => {
    process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID = "ca-pub-1234567890123456";

    render(<AdSlot />);

    const ins = await screen.findByTestId("ad-slot");
    expect(ins.tagName).toBe("INS");
    expect(ins).toHaveClass("adsbygoogle");
    expect(ins).toHaveAttribute(
      "data-ad-client",
      "ca-pub-1234567890123456"
    );

    const script = document.querySelector('script[src*="adsbygoogle.js"]');
    expect(script).toBeInTheDocument();
    expect(script?.getAttribute("src")).toContain(
      "client=ca-pub-1234567890123456"
    );
  });
});
