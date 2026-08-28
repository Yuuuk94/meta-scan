import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";

jest.mock("next/navigation", () => ({
  useRouter: () => ({ push: jest.fn(), replace: jest.fn() }),
}));

import { BlockedScreen } from "@/ui/organisms/BlockedScreen";

const t = {
  blockedTitle: "이 사이트는 검사할 수 없다",
  blockedDescription: "robots.txt가 이 사이트의 스캔을 차단하고 있다.",
  blockedDescriptionMobile: "robots.txt가 이 사이트의 스캔을 차단하고 있다.",
  blockedTargetLabel: "대상 URL",
  blockedAction: "다른 URL 시도",
};

describe("BlockedScreen", () => {
  it("renders copy from the t dictionary, not a hardcoded lang ternary", () => {
    render(<BlockedScreen t={t} url="https://example.com" />);

    expect(screen.getByText(t.blockedTitle)).toBeInTheDocument();
    expect(screen.getByText(t.blockedAction)).toBeInTheDocument();
  });

  it("renders without a disallow rule when disallowRule is omitted (per spec: generic copy only)", () => {
    render(<BlockedScreen t={t} url="https://example.com" />);

    expect(screen.queryByText(/— robots\.txt/)).not.toBeInTheDocument();
  });
});
