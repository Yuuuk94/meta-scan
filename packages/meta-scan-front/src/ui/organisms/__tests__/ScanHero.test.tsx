import React from "react";
import { render, screen } from "@testing-library/react";

import { ScanHero } from "@/ui/organisms/ScanHero";

const t = {
  topIssuesTitle: "지금 고쳐야 할 것",
  topIssuesEmpty: "지금까지 확인한 항목에서 심각한 문제가 없습니다",
};

describe("ScanHero", () => {
  it("renders each topIssue's message", () => {
    const topIssues: TopIssue[] = [
      { id: "title.missing", status: "fail", message: "title이 없습니다" },
      { id: "img.alt_missing", status: "warning", message: "alt 누락" },
    ];

    render(<ScanHero lang="ko" theme="dark" t={t} topIssues={topIssues} />);

    expect(screen.getByText("title이 없습니다")).toBeInTheDocument();
    expect(screen.getByText("alt 누락")).toBeInTheDocument();
  });

  it("renders the positive empty-state copy when there are no fail/warning issues", () => {
    render(<ScanHero lang="ko" theme="dark" t={t} topIssues={[]} />);

    expect(
      screen.getByText("지금까지 확인한 항목에서 심각한 문제가 없습니다")
    ).toBeInTheDocument();
  });
});
