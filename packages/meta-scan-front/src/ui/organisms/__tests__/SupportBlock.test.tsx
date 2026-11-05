import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";

import { SupportBlock } from "@/ui/organisms/SupportBlock";
import { DonateButton } from "@/ui/molecules/DonateButton";

// issue #63 — Ko-fi donation links, gated on NEXT_PUBLIC_KOFI_URL.
describe("Ko-fi donation links", () => {
  const ORIGINAL_ENV = process.env.NEXT_PUBLIC_KOFI_URL;
  const t = {
    supportEyebrow: "SUPPORT",
    supportTitle: "진단이 도움이 되셨다면",
    supportBody: "본문입니다",
    supportButton: "Ko-fi로 후원하기",
  };

  afterEach(() => {
    if (ORIGINAL_ENV === undefined) delete process.env.NEXT_PUBLIC_KOFI_URL;
    else process.env.NEXT_PUBLIC_KOFI_URL = ORIGINAL_ENV;
  });

  it("renders nothing when NEXT_PUBLIC_KOFI_URL is unset", () => {
    delete process.env.NEXT_PUBLIC_KOFI_URL;
    const a = render(<SupportBlock t={t} />);
    const b = render(
      <DonateButton label="후원하기" ariaLabel="Ko-fi로 후원하기" />,
    );
    expect(a.container).toBeEmptyDOMElement();
    expect(b.container).toBeEmptyDOMElement();
  });

  it("renders nothing when NEXT_PUBLIC_KOFI_URL is empty", () => {
    process.env.NEXT_PUBLIC_KOFI_URL = "";
    const a = render(<SupportBlock t={t} />);
    expect(a.container).toBeEmptyDOMElement();
  });

  it("SupportBlock links to the URL in a new tab with noopener noreferrer", () => {
    process.env.NEXT_PUBLIC_KOFI_URL = "https://ko-fi.com/example";
    render(<SupportBlock t={t} />);
    const link = screen.getByRole("link", { name: /Ko-fi로 후원하기/ });
    expect(link).toHaveAttribute("href", "https://ko-fi.com/example");
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", "noopener noreferrer");
  });

  it("DonateButton exposes an aria-label and the same link attributes", () => {
    process.env.NEXT_PUBLIC_KOFI_URL = "https://ko-fi.com/example";
    render(<DonateButton label="후원하기" ariaLabel="Ko-fi로 후원하기" />);
    const link = screen.getByRole("link", { name: "Ko-fi로 후원하기" });
    expect(link).toHaveAttribute("href", "https://ko-fi.com/example");
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", "noopener noreferrer");
  });
});
