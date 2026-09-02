import fs from "fs";
import path from "path";
import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { copy } from "@/app/[lang]/error";
import { hasInformalKoreanTone } from "@/utils/koTone";
import GlobalError from "@/app/[lang]/error";

const sourcePath = path.join(process.cwd(), "src/app/[lang]/error.tsx");

// 이슈 #17 AC5 — src/app/[lang]/error.tsx의 ko 카피를 합니다체로 교체하고, "다/라
// 자연스럽게 섞기"를 근거로 삼던 코드 주석을 제거한다.
describe("app/[lang]/error.tsx tone (issue #17 AC5)", () => {
  it("ko copy (title/description) is not 해라체/명령형", () => {
    expect(hasInformalKoreanTone(copy.ko.title)).toBe(false);
    expect(hasInformalKoreanTone(copy.ko.description)).toBe(false);
  });

  it("no longer carries the '다/라 자연스럽게 섞기' rationale comment", () => {
    const source = fs.readFileSync(sourcePath, "utf8");
    expect(source).not.toMatch(/다\/라 자연스럽게 섞기/);
  });

  it("renders the polite ko copy by default (defaultLang is ko, no cookie set)", () => {
    render(<GlobalError error={new Error("boom")} reset={jest.fn()} />);

    expect(screen.getByText(copy.ko.title)).toBeInTheDocument();
    expect(screen.getByText(copy.ko.description)).toBeInTheDocument();
  });
});
