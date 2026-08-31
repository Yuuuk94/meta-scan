import React from "react";
import { render, screen } from "@testing-library/react";

import { AiSignalsCard } from "@/ui/organisms/AiSignalsCard";

const t = {
  aiSignals: "AI SIGNALS",
  aiSignalsEyebrow: "Lighthouse가 다루지 않는 항목",
  aiSignalsHint: "채워두면 AEO 준비도가 올라간다",
  aiSignalsPromptsTxtPass: "prompts.txt가 확인된다 ({count}바이트)",
  aiSignalsPromptsTxtInfo: "prompts.txt가 있지만 내용이 거의 없다 ({count}바이트)",
  aiSignalsPromptsTxtWarning: "prompts.txt가 없다",
  aiSignalsPromptObjectPass: "PromptObject 구조화 데이터가 확인된다",
  aiSignalsPromptObjectWarning: "PromptObject 구조화 데이터가 없다",
  aiSignalsStructuredDataPass: "구조화 데이터(JSON-LD)가 확인된다",
  aiSignalsStructuredDataWarning: "구조화 데이터가 없다",
  aiSignalsFaqSectionPass: "FAQPage 구조화 데이터가 확인된다",
  aiSignalsFaqSectionWarning: "FAQPage 구조화 데이터가 없다",
  aiSignalsJsRenderDeltaPass: "JS 렌더링 전후 차이가 적다 ({count}%)",
  aiSignalsJsRenderDeltaWarning: "JS 렌더링 전후 차이가 크다 ({count}%)",
  aiSignalsJsRenderDeltaFail: "JS 렌더링 의존도가 매우 높다 ({count}%)",
};

const fiveChecks: AiSignalsCheckItem[] = [
  { id: "promptsTxt", status: "warning" },
  { id: "promptObject", status: "warning" },
  { id: "structuredData", status: "pass" },
  { id: "faqSection", status: "pass" },
  { id: "jsRenderDelta", status: "pass", detail: 0.05 },
];

describe("AiSignalsCard", () => {
  it("renders the headline, eyebrow, and hint from the dictionary", () => {
    render(
      <AiSignalsCard lang="ko" theme="dark" t={t} checks={fiveChecks} />
    );

    expect(screen.getByText("AI SIGNALS")).toBeInTheDocument();
    expect(screen.getByText("Lighthouse가 다루지 않는 항목")).toBeInTheDocument();
    expect(screen.getByText("채워두면 AEO 준비도가 올라간다")).toBeInTheDocument();
  });

  it("renders all 5 rows with a StatusBadge each and the assembled sentence", () => {
    render(
      <AiSignalsCard lang="ko" theme="dark" t={t} checks={fiveChecks} />
    );

    expect(screen.getByText("prompts.txt가 없다")).toBeInTheDocument();
    expect(
      screen.getByText("PromptObject 구조화 데이터가 없다")
    ).toBeInTheDocument();
    expect(
      screen.getByText("구조화 데이터(JSON-LD)가 확인된다")
    ).toBeInTheDocument();
    expect(
      screen.getByText("FAQPage 구조화 데이터가 확인된다")
    ).toBeInTheDocument();
    expect(
      screen.getByText("JS 렌더링 전후 차이가 적다 (5%)")
    ).toBeInTheDocument();

    expect(screen.getAllByText("WARNING")).toHaveLength(2);
    expect(screen.getAllByText("PASS")).toHaveLength(3);
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

    expect(
      screen.getByText("prompts.txt가 있지만 내용이 거의 없다 (8바이트)")
    ).toBeInTheDocument();
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

    expect(
      screen.getByText("prompts.txt가 확인된다 (512바이트)")
    ).toBeInTheDocument();
    expect(
      screen.getByText("JS 렌더링 의존도가 매우 높다 (60%)")
    ).toBeInTheDocument();
    expect(screen.getByText("FAIL")).toBeInTheDocument();
  });
});
