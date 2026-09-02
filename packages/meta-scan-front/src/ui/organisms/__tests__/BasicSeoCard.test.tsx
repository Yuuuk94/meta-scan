import React from "react";
import { render, screen } from "@testing-library/react";

import { BasicSeoCard } from "@/ui/organisms/BasicSeoCard";

const t = {
  basicSeo: "기본 SEO",
  basicSeoTitleMissing: "title 태그가 없다",
  basicSeoTitleLengthWarning: "제목 길이가 권장 범위를 벗어났다 ({count}자)",
  basicSeoTitleLengthPass: "제목 길이가 적절하다 ({count}자)",
  basicSeoDescMissing: "meta description이 없다",
  basicSeoDescLengthWarning: "설명 길이가 권장 범위를 벗어났다 ({count}자)",
  basicSeoDescLengthPass: "설명 길이가 적절하다 ({count}자)",
  basicSeoKeywordsInfo: "keywords 메타 태그는 더 이상 사용되지 않는다",
  basicSeoKeywordsPass: "keywords 메타 태그를 사용하지 않고 있다",
  basicSeoImgAltWarning: "대체 텍스트(alt)가 없는 이미지가 {count}개 있다",
  basicSeoImgAltPass: "모든 이미지에 대체 텍스트(alt)가 있다",
  basicSeoMetaDuplicateInfo: "중복된 meta 태그가 {count}개 있다",
  basicSeoMetaDuplicatePass: "중복된 meta 태그가 없다",
};

const fiveRows: BasicSeoCheckItem[] = [
  { id: "title.length", status: "pass", detail: 42 },
  { id: "desc.missing", status: "warning" },
  { id: "keywords.deprecated", status: "info" },
  { id: "img.altMissing", status: "warning", detail: 2 },
  { id: "meta.duplicate", status: "pass", detail: 0 },
];

describe("BasicSeoCard", () => {
  it("renders the card title from the dictionary", () => {
    render(<BasicSeoCard lang="ko" theme="dark" t={t} checks={fiveRows} />);
    expect(screen.getByText("기본 SEO")).toBeInTheDocument();
  });

  it("renders all 5 rows with a StatusBadge each and the assembled sentence", () => {
    render(<BasicSeoCard lang="ko" theme="dark" t={t} checks={fiveRows} />);

    expect(screen.getByText("제목 길이가 적절하다 (42자)")).toBeInTheDocument();
    expect(screen.getByText("meta description이 없다")).toBeInTheDocument();
    expect(
      screen.getByText("keywords 메타 태그는 더 이상 사용되지 않는다")
    ).toBeInTheDocument();
    expect(
      screen.getByText("대체 텍스트(alt)가 없는 이미지가 2개 있다")
    ).toBeInTheDocument();
    expect(screen.getByText("중복된 meta 태그가 없다")).toBeInTheDocument();

    expect(screen.getAllByText("PASS")).toHaveLength(2);
    expect(screen.getAllByText("WARN")).toHaveLength(2);
    expect(screen.getAllByText("INFO")).toHaveLength(1);
  });

  it("renders nothing when there are no checks (e.g. crawling failed)", () => {
    const { container } = render(
      <BasicSeoCard lang="ko" theme="dark" t={t} checks={[]} />
    );
    expect(container).toBeEmptyDOMElement();
  });
});
