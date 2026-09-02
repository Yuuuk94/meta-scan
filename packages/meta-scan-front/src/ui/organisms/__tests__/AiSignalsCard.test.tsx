import React from "react";
import { render, screen } from "@testing-library/react";

import { AiSignalsCard } from "@/ui/organisms/AiSignalsCard";

const t = {
  aiSignals: "AI SIGNALS",
  aiSignalsPromptsTxtLabel: "prompts.txt",
  aiSignalsPromptObjectLabel: "PromptObject",
  aiSignalsStructuredDataLabel: "구조화 데이터",
  aiSignalsFaqSectionLabel: "FAQ 섹션",
  aiSignalsJsRenderDeltaLabel: "JS 렌더링 의존도",
  aiSignalsPromptsTxtPassSuffix: "{count}바이트",
  aiSignalsPromptsTxtInfoSuffix: "내용 부족",
  aiSignalsPromptsTxtWarningSuffix: "없음",
  aiSignalsPromptObjectPassSuffix: "발견됨",
  aiSignalsPromptObjectWarningSuffix: "없음",
  aiSignalsStructuredDataPassSuffix: "발견됨",
  aiSignalsStructuredDataWarningSuffix: "없음",
  aiSignalsFaqSectionPassSuffix: "발견됨",
  aiSignalsFaqSectionWarningSuffix: "없음",
  aiSignalsJsRenderDeltaPassSuffix: "{count}%",
  aiSignalsJsRenderDeltaWarningSuffix: "{count}%",
  aiSignalsJsRenderDeltaFailSuffix: "{count}%",
};

const fiveChecks: AiSignalsCheckItem[] = [
  { id: "promptsTxt", status: "warning" },
  { id: "promptObject", status: "warning" },
  { id: "structuredData", status: "pass" },
  { id: "faqSection", status: "pass" },
  { id: "jsRenderDelta", status: "pass", detail: 0.05 },
];

describe("AiSignalsCard", () => {
  it("renders the headline from the dictionary", () => {
    render(
      <AiSignalsCard lang="ko" theme="dark" t={t} checks={fiveChecks} />
    );

    expect(screen.getByText("AI SIGNALS")).toBeInTheDocument();
  });

  it("renders each row as a label + muted detail text, with a plain-status badge", () => {
    render(
      <AiSignalsCard lang="ko" theme="dark" t={t} checks={fiveChecks} />
    );

    expect(screen.getByText("prompts.txt")).toBeInTheDocument();
    expect(screen.getByText("PromptObject")).toBeInTheDocument();
    expect(screen.getByText("구조화 데이터")).toBeInTheDocument();
    expect(screen.getByText("FAQ 섹션")).toBeInTheDocument();
    expect(screen.getByText("JS 렌더링 의존도")).toBeInTheDocument();

    expect(screen.getAllByText("없음")).toHaveLength(2);
    expect(screen.getAllByText("발견됨")).toHaveLength(2);
    expect(screen.getByText("5%")).toBeInTheDocument();

    expect(screen.getAllByText("WARN")).toHaveLength(2);
    expect(screen.getAllByText("PASS")).toHaveLength(3);
  });

  it("shows structuredDataTypes as the detail text next to the label when structuredData passed", () => {
    render(
      <AiSignalsCard
        lang="ko"
        theme="dark"
        t={t}
        checks={fiveChecks}
        structuredDataTypes={["WebPage", "FAQPage"]}
      />
    );

    expect(screen.getByText("WebPage, FAQPage")).toBeInTheDocument();
    // The generic "발견됨" suffix is superseded by the type list for this
    // one row — only faqSection's own "발견됨" should remain.
    expect(screen.getAllByText("발견됨")).toHaveLength(1);
  });

  it("falls back to the generic '발견됨' suffix when structuredData is pass but no structuredDataTypes were given", () => {
    render(
      <AiSignalsCard lang="ko" theme="dark" t={t} checks={fiveChecks} />
    );

    expect(screen.getAllByText("발견됨")).toHaveLength(2);
  });

  it("doesn't show the type list when structuredData is warning, even if structuredDataTypes is non-empty (stale/inconsistent data)", () => {
    render(
      <AiSignalsCard
        lang="ko"
        theme="dark"
        t={t}
        checks={[
          { id: "promptsTxt", status: "warning" },
          { id: "promptObject", status: "warning" },
          { id: "structuredData", status: "warning" },
          { id: "faqSection", status: "pass" },
          { id: "jsRenderDelta", status: "pass", detail: 0.05 },
        ]}
        structuredDataTypes={["WebPage"]}
      />
    );

    expect(screen.queryByText("WebPage")).not.toBeInTheDocument();
  });

  it("renders promptsTxt's info status (present but nearly empty) as an outline badge via StatusBadge's own info variant", () => {
    render(
      <AiSignalsCard
        lang="ko"
        theme="dark"
        t={t}
        checks={[
          { id: "promptsTxt", status: "info", detail: 8 },
          { id: "promptObject", status: "pass" },
          { id: "structuredData", status: "pass" },
          { id: "faqSection", status: "pass" },
          { id: "jsRenderDelta", status: "pass", detail: 0.05 },
        ]}
      />
    );

    expect(screen.getByText("내용 부족")).toBeInTheDocument();
    const infoBadge = screen.getByText("INFO");
    expect(infoBadge).toHaveAttribute("data-status", "info");
  });

  it("renders nothing when there are no checks (e.g. crawling failed)", () => {
    const { container } = render(
      <AiSignalsCard lang="ko" theme="dark" t={t} checks={[]} />
    );
    expect(container).toBeEmptyDOMElement();
  });

  it("renders a warning/fail jsRenderDelta row with the matching status and formatted percentage", () => {
    render(
      <AiSignalsCard
        lang="ko"
        theme="dark"
        t={t}
        checks={[
          { id: "promptsTxt", status: "pass", detail: 512 },
          { id: "promptObject", status: "warning" },
          { id: "structuredData", status: "warning" },
          { id: "faqSection", status: "warning" },
          { id: "jsRenderDelta", status: "fail", detail: 0.6 },
        ]}
      />
    );

    expect(screen.getByText("512바이트")).toBeInTheDocument();
    expect(screen.getByText("60%")).toBeInTheDocument();
    expect(screen.getByText("FAIL")).toBeInTheDocument();
  });
});
