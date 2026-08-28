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
  it("하드코딩된 lang 삼항 연산자가 아니라 t 딕셔너리에서 카피를 렌더한다", () => {
    render(<BlockedScreen t={t} url="https://example.com" />);

    expect(screen.getByText(t.blockedTitle)).toBeInTheDocument();
    expect(screen.getByText(t.blockedAction)).toBeInTheDocument();
  });

  it("disallowRule이 없으면 규칙 텍스트 없이 렌더한다(스펙: 일반 문구만 표시)", () => {
    render(<BlockedScreen t={t} url="https://example.com" />);

    expect(screen.queryByText(/— robots\.txt/)).not.toBeInTheDocument();
  });
});
