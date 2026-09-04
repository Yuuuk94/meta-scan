import React from "react";
import { render, screen } from "@testing-library/react";

import { I18nUxCard } from "@/ui/organisms/I18nUxCard";

const t = {
  intlUx: "국제화·UX",
  i18nUxHreflangPass: "hreflang 대체 링크가 있다",
  i18nUxHreflangInfo: "hreflang 대체 링크가 없다",
  i18nUxViewportPass: "viewport 메타 태그가 있다",
  i18nUxViewportWarning: "viewport 메타 태그가 없다",
};

const twoRows: I18nUxCheckItem[] = [
  { id: "hreflang", status: "pass" },
  { id: "viewport", status: "pass" },
];

describe("I18nUxCard", () => {
  it("renders the card title from the dictionary", () => {
    render(<I18nUxCard lang="ko" theme="dark" t={t} checks={twoRows} />);
    expect(screen.getByText("국제화·UX")).toBeInTheDocument();
  });

  it("renders both rows with a StatusBadge each and the assembled sentence", () => {
    render(<I18nUxCard lang="ko" theme="dark" t={t} checks={twoRows} />);

    expect(screen.getByText("hreflang 대체 링크가 있다")).toBeInTheDocument();
    expect(screen.getByText("viewport 메타 태그가 있다")).toBeInTheDocument();
    expect(screen.getAllByText("PASS")).toHaveLength(2);
  });

  it("renders info/warning rows when the checks are absent", () => {
    render(
      <I18nUxCard
        lang="ko"
        theme="dark"
        t={t}
        checks={[
          { id: "hreflang", status: "info" },
          { id: "viewport", status: "warning" },
        ]}
      />
    );

    expect(screen.getByText("hreflang 대체 링크가 없다")).toBeInTheDocument();
    expect(screen.getByText("viewport 메타 태그가 없다")).toBeInTheDocument();
    expect(screen.getByText("INFO")).toBeInTheDocument();
    expect(screen.getByText("WARN")).toBeInTheDocument();
  });

  it("renders nothing when there are no checks (e.g. crawling failed)", () => {
    const { container } = render(
      <I18nUxCard lang="ko" theme="dark" t={t} checks={[]} />
    );
    expect(container).toBeEmptyDOMElement();
  });
});
