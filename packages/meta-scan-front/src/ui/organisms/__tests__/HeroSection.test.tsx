import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";

jest.mock("next/navigation", () => ({
  useRouter: () => ({ push: jest.fn() }),
}));

import { HeroSection } from "@/ui/organisms/HeroSection";
import { heroUrlInputId } from "@/constans";

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
  it("exposes the URL input under the shared heroUrlInputId so other sections (e.g. FAQSection's CTA) can focus it", () => {
    render(<HeroSection theme="dark" lang="ko" t={t} />);

    expect(screen.getByPlaceholderText(t.urlPlaceholder)).toHaveAttribute(
      "id",
      heroUrlInputId
    );
  });
});
