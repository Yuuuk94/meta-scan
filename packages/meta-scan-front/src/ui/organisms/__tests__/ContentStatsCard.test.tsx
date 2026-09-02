import React from "react";
import { render, screen } from "@testing-library/react";

import { ContentStatsCard } from "@/ui/organisms/ContentStatsCard";

const t = {
  contentStats: "Content Stats",
  contentCharCountPass: "본문 길이가 적절하다 ({count}자)",
  contentCharCountWarning: "본문 길이가 권장 범위(600~2,000자)를 벗어났다 ({count}자)",
  contentHeadingsPass: "제목 구조(H1 1개 + 소제목)가 적절하다",
  contentHeadingsWarning: "제목 구조가 권장 기준에 맞지 않는다 (H1 {count}개)",
  contentTldrPass: "TL;DR 섹션이 있다",
  contentTldrInfo: "TL;DR 섹션이 없다",
};

const threeRows: ContentCheckItem[] = [
  { id: "charCount", status: "pass", detail: 900 },
  { id: "headings", status: "pass", detail: { h1: 1, h2: 2, h3: 0 } },
  { id: "tldr", status: "info" },
];

describe("ContentStatsCard", () => {
  it("renders the card title from the dictionary", () => {
    render(<ContentStatsCard lang="ko" theme="dark" t={t} checks={threeRows} />);
    expect(screen.getByText("Content Stats")).toBeInTheDocument();
  });

  it("renders all 3 rows with a StatusBadge each and the assembled sentence", () => {
    render(<ContentStatsCard lang="ko" theme="dark" t={t} checks={threeRows} />);

    expect(screen.getByText("본문 길이가 적절하다 (900자)")).toBeInTheDocument();
    expect(
      screen.getByText("제목 구조(H1 1개 + 소제목)가 적절하다")
    ).toBeInTheDocument();
    expect(screen.getByText("TL;DR 섹션이 없다")).toBeInTheDocument();

    expect(screen.getAllByText("PASS")).toHaveLength(2);
    expect(screen.getAllByText("INFO")).toHaveLength(1);
  });

  it("renders a warning headings row with the h1 count from its object detail", () => {
    render(
      <ContentStatsCard
        lang="ko"
        theme="dark"
        t={t}
        checks={[
          { id: "charCount", status: "warning", detail: 42 },
          { id: "headings", status: "warning", detail: { h1: 0, h2: 0, h3: 0 } },
          { id: "tldr", status: "pass" },
        ]}
      />
    );

    expect(
      screen.getByText("본문 길이가 권장 범위(600~2,000자)를 벗어났다 (42자)")
    ).toBeInTheDocument();
    expect(
      screen.getByText("제목 구조가 권장 기준에 맞지 않는다 (H1 0개)")
    ).toBeInTheDocument();
    expect(screen.getByText("TL;DR 섹션이 있다")).toBeInTheDocument();

    expect(screen.getAllByText("WARN")).toHaveLength(2);
    expect(screen.getAllByText("PASS")).toHaveLength(1);
  });

  it("renders nothing when there are no checks (e.g. crawling failed)", () => {
    const { container } = render(
      <ContentStatsCard lang="ko" theme="dark" t={t} checks={[]} />
    );
    expect(container).toBeEmptyDOMElement();
  });
});
