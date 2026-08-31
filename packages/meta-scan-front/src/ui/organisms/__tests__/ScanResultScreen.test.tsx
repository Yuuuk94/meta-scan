import React from "react";
import { render, screen } from "@testing-library/react";

import { ScanResultScreen } from "@/ui/organisms/ScanResultScreen";
import { useScanStore, SCAN_RESULT_TTL_MS } from "@/stores/scanStore";

const push = jest.fn();
jest.mock("next/navigation", () => ({
  useRouter: () => ({ push }),
}));

const t = {
  analyzedAt: "분석 시각",
  topIssuesTitle: "지금 고쳐야 할 것",
  topIssuesEmpty: "지금까지 확인한 항목에서 심각한 문제가 없습니다",
  rawResultsTitle: "스캔 결과",
  rawSiteMapLabel: "sitemap.xml",
  rawCrawlingLabel: "페이지 크롤링",
  rawLighthouseLabel: "Lighthouse",
  unavailable: "확인 불가",
  notFoundTitle: "표시할 결과가 없습니다",
  notFoundDescription: "결과가 없거나 만료됐다",
  notFoundAction: "홈으로",
};

const combined: CombinedScanResult = {
  title: "Example Domain",
  description: "An example page used in docs",
  topIssues: [],
  failedApis: ["lighthouse"],
};

beforeEach(() => {
  jest.clearAllMocks();
  window.localStorage.clear();
  useScanStore.setState({ results: {} });
});

describe("ScanResultScreen", () => {
  it("shows the not-found screen when no id is given (bare /scan)", () => {
    render(<ScanResultScreen lang="ko" theme="dark" t={t} />);
    expect(screen.getByText("표시할 결과가 없습니다")).toBeInTheDocument();
  });

  it("shows the not-found screen when the id doesn't exist in the store", () => {
    render(<ScanResultScreen lang="ko" theme="dark" t={t} id="unknown-id" />);
    expect(screen.getByText("표시할 결과가 없습니다")).toBeInTheDocument();
  });

  it("shows the not-found screen when the entry has expired (>10min TTL)", () => {
    jest.useFakeTimers().setSystemTime(0);
    const id = useScanStore.getState().saveScanResult({
      url: "https://example.com",
      raw: { robotsTxt: null, siteMap: null, crawling: null, lighthouse: null },
      combined,
    });
    jest.setSystemTime(SCAN_RESULT_TTL_MS + 1);

    render(<ScanResultScreen lang="ko" theme="dark" t={t} id={id} />);
    expect(screen.getByText("표시할 결과가 없습니다")).toBeInTheDocument();
    jest.useRealTimers();
  });

  it("renders real stored data (title) and a gray 확인 불가 placeholder for the failed API", () => {
    const id = useScanStore.getState().saveScanResult({
      url: "https://example.com",
      raw: { robotsTxt: null, siteMap: null, crawling: null, lighthouse: null },
      combined,
    });

    render(<ScanResultScreen lang="ko" theme="dark" t={t} id={id} />);

    expect(screen.getByText("https://example.com")).toBeInTheDocument();
    expect(screen.getByText("Example Domain")).toBeInTheDocument();
    expect(screen.getByText("확인 불가")).toBeInTheDocument();
    expect(screen.getByText("지금까지 확인한 항목에서 심각한 문제가 없습니다")).toBeInTheDocument();
  });
});
