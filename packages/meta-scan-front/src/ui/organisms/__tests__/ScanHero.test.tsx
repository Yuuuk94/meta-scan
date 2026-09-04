import React from "react";
import { render, screen } from "@testing-library/react";

import { ScanHero } from "@/ui/organisms/ScanHero";

const t = {
  topIssuesTitle: "지금 고쳐야 할 것",
  topIssuesEmpty: "지금까지 확인한 항목에서 심각한 문제가 없습니다",
  basicSeoTitleMissing: "title 태그가 없다",
  basicSeoImgAltWarning: "대체 텍스트(alt)가 없는 이미지가 {count}개 있다",
};

describe("ScanHero", () => {
  it("assembles and renders each topIssue's message from the dictionary + detail", () => {
    const topIssues: TopIssue[] = [
      { id: "title.missing", status: "fail", group: "basicSeo" },
      { id: "img.altMissing", status: "warning", detail: 2, group: "basicSeo" },
    ];

    render(<ScanHero lang="ko" theme="dark" t={t} topIssues={topIssues} />);

    expect(screen.getByText("title 태그가 없다")).toBeInTheDocument();
    expect(
      screen.getByText("대체 텍스트(alt)가 없는 이미지가 2개 있다")
    ).toBeInTheDocument();
  });

  it("renders the positive empty-state copy when there are no fail/warning issues", () => {
    render(<ScanHero lang="ko" theme="dark" t={t} topIssues={[]} />);

    expect(
      screen.getByText("지금까지 확인한 항목에서 심각한 문제가 없습니다")
    ).toBeInTheDocument();
  });
});
