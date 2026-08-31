import React from "react";
import { render, screen } from "@testing-library/react";

import { IndexingCard } from "@/ui/organisms/IndexingCard";

const t = {
  indexing: "Indexing",
  indexingSitemapExistsPass: "sitemap.xml이 확인된다",
  indexingSitemapExistsWarning: "sitemap.xml을 찾을 수 없다",
  indexingSitemapDeclaredPass: "robots.txt에 sitemap이 선언되어 있다",
  indexingSitemapDeclaredInfo: "robots.txt에 sitemap이 선언되어 있지 않다",
  indexingCanonicalPass: "canonical 태그가 정상적으로 설정되어 있다",
  indexingCanonicalInfo: "canonical 태그가 없거나 상대경로다",
  indexingCanonicalMultiplePass: "canonical 태그가 하나만 있다",
  indexingCanonicalMultipleFail: "canonical 태그가 여러 개 있다",
  indexingMetaRobotsNoindexPass: "noindex 지시어가 없다",
  indexingMetaRobotsNoindexFail: "noindex 지시어가 있어 색인에서 제외된다",
};

const fiveRows: IndexingCheckItem[] = [
  { id: "sitemapExists", status: "pass" },
  { id: "sitemapDeclaredInRobots", status: "info" },
  { id: "canonical", status: "pass" },
  { id: "canonicalMultiple", status: "fail" },
  { id: "metaRobotsNoindex", status: "pass" },
];

describe("IndexingCard", () => {
  it("renders the card title from the dictionary", () => {
    render(<IndexingCard lang="ko" theme="dark" t={t} checks={fiveRows} />);
    expect(screen.getByText("Indexing")).toBeInTheDocument();
  });

  it("renders all 5 rows with a StatusBadge each and the assembled sentence", () => {
    render(<IndexingCard lang="ko" theme="dark" t={t} checks={fiveRows} />);

    expect(screen.getByText("sitemap.xml이 확인된다")).toBeInTheDocument();
    expect(
      screen.getByText("robots.txt에 sitemap이 선언되어 있지 않다")
    ).toBeInTheDocument();
    expect(
      screen.getByText("canonical 태그가 정상적으로 설정되어 있다")
    ).toBeInTheDocument();
    expect(
      screen.getByText("canonical 태그가 여러 개 있다")
    ).toBeInTheDocument();
    expect(screen.getByText("noindex 지시어가 없다")).toBeInTheDocument();

    expect(screen.getAllByText("PASS")).toHaveLength(3);
    expect(screen.getAllByText("INFO")).toHaveLength(1);
    expect(screen.getAllByText("FAIL")).toHaveLength(1);
  });

  it("renders nothing when there are no checks (e.g. all 3 source calls failed)", () => {
    const { container } = render(
      <IndexingCard lang="ko" theme="dark" t={t} checks={[]} />
    );
    expect(container).toBeEmptyDOMElement();
  });
});
