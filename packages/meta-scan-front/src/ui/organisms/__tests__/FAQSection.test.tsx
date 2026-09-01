import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";

import { FAQSection } from "@/ui/organisms/FAQSection";
import { heroUrlInputId } from "@/constans";

const t = {
  faqTitle: "FAQ",
  faqSubtitle: "sub",
  faq1Q: "q1",
  faq1A: "a1",
  faq2Q: "q2",
  faq2A: "a2",
  faq3Q: "q3",
  faq3A: "a3",
  faq4Q: "q4",
  faq4A: "a4",
  faq5Q: "q5",
  faq5A: "a5",
  faq6Q: "q6",
  faq6A: "a6",
  faqCtaText: "cta text",
  faqCtaButton: "지금 스캔하기",
};

describe("FAQSection", () => {
  it("scrolls to top and focuses the Hero URL input when the CTA button is clicked", () => {
    const scrollToMock = jest.fn();
    window.scrollTo = scrollToMock;

    // Stand-in for HeroSection's URL input, identified by the shared
    // heroUrlInputId — FAQSection and HeroSection are rendered as siblings
    // on the real page (app/[lang]/page.tsx), so the CTA reaches it via DOM
    // id rather than a shared context/store (matches this codebase's
    // no-Context style).
    render(
      <>
        <input id={heroUrlInputId} aria-label="url-input" />
        <FAQSection theme="dark" lang="ko" t={t} />
      </>
    );

    const heroInput = screen.getByLabelText("url-input");
    expect(heroInput).not.toHaveFocus();

    fireEvent.click(screen.getByRole("button", { name: /지금 스캔하기/ }));

    expect(scrollToMock).toHaveBeenCalledWith({ top: 0, behavior: "smooth" });
    expect(heroInput).toHaveFocus();
  });
});
