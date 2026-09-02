import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";

const push = jest.fn();
jest.mock("next/navigation", () => ({
  useRouter: () => ({ push }),
}));

jest.mock("@/services/analyticsEvents", () => ({
  trackEvent: jest.fn(),
}));

import { HeroSection } from "@/ui/organisms/HeroSection";
import { heroUrlInputId } from "@/constans";
import { trackEvent } from "@/services/analyticsEvents";

const t = {
  heroEyebrow: "eyebrow",
  heroTitleLead: "lead",
  heroTitleHighlight: "highlight",
  heroTitleTail: "tail",
  heroSubtitle: "subtitle",
  urlPlaceholder: "https://example.com",
  analyzeButton: "analyze",
  urlInvalid: "invalid url",
};

describe("HeroSection", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("exposes the URL input under the shared heroUrlInputId so other sections (e.g. FAQSection's CTA) can focus it", () => {
    render(<HeroSection theme="dark" lang="ko" t={t} />);

    expect(screen.getByPlaceholderText(t.urlPlaceholder)).toHaveAttribute(
      "id",
      heroUrlInputId
    );
  });

  // issue #19 analytics-integration — scan_requested fires at the same
  // point the crrUrl cookie gets set / navigation to /request-scan happens.
  it("fires a scan_requested analytics event when a valid URL is submitted", () => {
    render(<HeroSection theme="dark" lang="ko" t={t} />);

    fireEvent.change(screen.getByPlaceholderText(t.urlPlaceholder), {
      target: { value: "https://example.com" },
    });
    fireEvent.click(screen.getByRole("button", { name: t.analyzeButton }));

    expect(trackEvent).toHaveBeenCalledWith("scan_requested", {
      url: "https://example.com",
    });
    expect(push).toHaveBeenCalledWith("/request-scan");
  });

  it("does not fire scan_requested when the URL is invalid", () => {
    render(<HeroSection theme="dark" lang="ko" t={t} />);

    fireEvent.change(screen.getByPlaceholderText(t.urlPlaceholder), {
      target: { value: "not-a-url" },
    });
    fireEvent.click(screen.getByRole("button", { name: t.analyzeButton }));

    expect(trackEvent).not.toHaveBeenCalled();
  });
});
