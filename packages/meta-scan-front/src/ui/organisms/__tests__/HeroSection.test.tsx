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
import { crrUrlKey, heroUrlInputId } from "@/constans";
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
    document.cookie = `${crrUrlKey}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
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

  // issue #34 url-input-protocol-ux
  describe("protocol-optional URL normalization (issue #34)", () => {
    it("auto-prepends https:// for a protocol-less domain and proceeds", () => {
      render(<HeroSection theme="dark" lang="ko" t={t} />);

      const input = screen.getByPlaceholderText(t.urlPlaceholder);
      fireEvent.change(input, { target: { value: "example.com" } });
      fireEvent.click(screen.getByRole("button", { name: t.analyzeButton }));

      expect(input).toHaveValue("https://example.com");
      expect(document.cookie).toContain(
        `${crrUrlKey}=${encodeURI("https://example.com")}`
      );
      expect(trackEvent).toHaveBeenCalledWith("scan_requested", {
        url: "https://example.com",
      });
      expect(push).toHaveBeenCalledWith("/request-scan");
      expect(screen.queryByText(t.urlInvalid)).not.toBeInTheDocument();
    });

    it("respects an already-present http:// protocol instead of forcing https://", () => {
      render(<HeroSection theme="dark" lang="ko" t={t} />);

      const input = screen.getByPlaceholderText(t.urlPlaceholder);
      fireEvent.change(input, { target: { value: "http://example.com" } });
      fireEvent.click(screen.getByRole("button", { name: t.analyzeButton }));

      expect(input).toHaveValue("http://example.com");
      expect(document.cookie).toContain(
        `${crrUrlKey}=${encodeURI("http://example.com")}`
      );
      expect(trackEvent).toHaveBeenCalledWith("scan_requested", {
        url: "http://example.com",
      });
      expect(push).toHaveBeenCalledWith("/request-scan");
    });

    it("leaves an already-present https:// URL unchanged (regression)", () => {
      render(<HeroSection theme="dark" lang="ko" t={t} />);

      const input = screen.getByPlaceholderText(t.urlPlaceholder);
      fireEvent.change(input, { target: { value: "https://example.com" } });
      fireEvent.click(screen.getByRole("button", { name: t.analyzeButton }));

      expect(input).toHaveValue("https://example.com");
      expect(push).toHaveBeenCalledWith("/request-scan");
    });

    it("normalizes a protocol-less URL with a path", () => {
      render(<HeroSection theme="dark" lang="ko" t={t} />);

      const input = screen.getByPlaceholderText(t.urlPlaceholder);
      fireEvent.change(input, { target: { value: "example.com/path" } });
      fireEvent.click(screen.getByRole("button", { name: t.analyzeButton }));

      expect(input).toHaveValue("https://example.com/path");
      expect(push).toHaveBeenCalledWith("/request-scan");
    });

    it("normalizes a protocol-less URL with a query string", () => {
      render(<HeroSection theme="dark" lang="ko" t={t} />);

      const input = screen.getByPlaceholderText(t.urlPlaceholder);
      fireEvent.change(input, { target: { value: "example.com?q=1" } });
      fireEvent.click(screen.getByRole("button", { name: t.analyzeButton }));

      expect(input).toHaveValue("https://example.com?q=1");
      expect(push).toHaveBeenCalledWith("/request-scan");
    });

    it("rejects input containing whitespace in the middle", () => {
      render(<HeroSection theme="dark" lang="ko" t={t} />);

      fireEvent.change(screen.getByPlaceholderText(t.urlPlaceholder), {
        target: { value: "exa mple.com" },
      });
      fireEvent.click(screen.getByRole("button", { name: t.analyzeButton }));

      expect(screen.getByText(t.urlInvalid)).toBeInTheDocument();
      expect(push).not.toHaveBeenCalled();
    });

    // Note: `<input type="url">` applies the HTML value-sanitization
    // algorithm natively (verified against real browsers, not a jsdom
    // artifact) — leading/trailing whitespace never reaches React's change
    // handler at all (it's stripped before `onChange` fires), only internal
    // whitespace (covered above) does. So a leading-space input simply
    // arrives already-trimmed and proceeds like any other valid domain.
    it("proceeds normally once native input sanitization has already trimmed leading/trailing whitespace", () => {
      render(<HeroSection theme="dark" lang="ko" t={t} />);

      const input = screen.getByPlaceholderText(t.urlPlaceholder);
      fireEvent.change(input, { target: { value: "  example.com  " } });
      fireEvent.click(screen.getByRole("button", { name: t.analyzeButton }));

      expect(input).toHaveValue("https://example.com");
      expect(push).toHaveBeenCalledWith("/request-scan");
    });

    it("rejects input with no dot at all (out of scope, e.g. localhost)", () => {
      render(<HeroSection theme="dark" lang="ko" t={t} />);

      fireEvent.change(screen.getByPlaceholderText(t.urlPlaceholder), {
        target: { value: "localhost" },
      });
      fireEvent.click(screen.getByRole("button", { name: t.analyzeButton }));

      expect(screen.getByText(t.urlInvalid)).toBeInTheDocument();
      expect(push).not.toHaveBeenCalled();
    });

    it("still rejects an empty or single-character input (regression)", () => {
      render(<HeroSection theme="dark" lang="ko" t={t} />);

      fireEvent.change(screen.getByPlaceholderText(t.urlPlaceholder), {
        target: { value: "a" },
      });
      fireEvent.click(screen.getByRole("button", { name: t.analyzeButton }));

      expect(screen.getByText(t.urlInvalid)).toBeInTheDocument();
      expect(push).not.toHaveBeenCalled();
    });

    it("re-validates with the relaxed pattern once the user edits an invalid value", () => {
      render(<HeroSection theme="dark" lang="ko" t={t} />);

      const input = screen.getByPlaceholderText(t.urlPlaceholder);
      fireEvent.change(input, { target: { value: "not a url" } });
      fireEvent.click(screen.getByRole("button", { name: t.analyzeButton }));
      expect(screen.getByText(t.urlInvalid)).toBeInTheDocument();

      // Editing to a protocol-less but otherwise valid domain should clear
      // the error via the existing useEffect-based live revalidation.
      fireEvent.change(input, { target: { value: "example.com" } });
      expect(screen.queryByText(t.urlInvalid)).not.toBeInTheDocument();
    });
  });
});
