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
  basicSeo: "기본 SEO",
  basicSeoTitleLengthPass: "제목 길이가 적절하다 ({count}자)",
  indexing: "Indexing",
  indexingSitemapExistsPass: "sitemap.xml이 확인된다",
  previews: "Previews — OG · Twitter",
  previewsOgImageDimensionsPass: "og:image가 설정되어 있다",
  previewsGoogleMockupLabel: "구글 검색 미리보기",
  previewsTwitterMockupLabel: "트위터 카드 미리보기",
  previewsImagePlaceholderLabel: "이미지 없음",
  aiSignals: "AI SIGNALS",
  aiSignalsEyebrow: "Lighthouse가 다루지 않는 항목",
  aiSignalsHint: "없어도 감점되지 않는다",
  aiSignalsPromptsTxtLabel: "prompts.txt",
  aiSignalsPromptsTxtInfoSuffix: "내용 부족",
  lighthouseScores: "Lighthouse 점수",
  performance: "Performance",
  seo: "SEO",
  accessibility: "Accessibility",
  bestPractices: "Best Practices",
  lighthouseSuggestions: "Lighthouse 개선 제안",
  lighthouseSuggestionsHint: "Lighthouse가 직접 제안하는 개선 항목이다",
  lighthouseSuggestionsHintMobile: "Lighthouse가 직접 제안하는 개선 항목이다",
};

const combined: CombinedScanResult = {
  title: "Example Domain",
  description: "An example page used in docs",
  topIssues: [],
  failedApis: ["lighthouse"],
  checks: {
    basicSeo: [],
    indexing: [],
    previews: [],
    aiSignals: [],
    content: [],
  },
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

  it("renders the 기본 SEO card from combined.checks.basicSeo when present", () => {
    const id = useScanStore.getState().saveScanResult({
      url: "https://example.com",
      raw: { robotsTxt: null, siteMap: null, crawling: null, lighthouse: null },
      combined: {
        ...combined,
        checks: {
          basicSeo: [{ id: "title.length", status: "pass", detail: 42 }],
          indexing: [],
          previews: [],
          aiSignals: [],
          content: [],
        },
      },
    });

    render(<ScanResultScreen lang="ko" theme="dark" t={t} id={id} />);

    expect(screen.getByText("기본 SEO")).toBeInTheDocument();
    expect(screen.getByText("제목 길이가 적절하다 (42자)")).toBeInTheDocument();
  });

  it("renders the Indexing card from combined.checks.indexing when present", () => {
    const id = useScanStore.getState().saveScanResult({
      url: "https://example.com",
      raw: { robotsTxt: null, siteMap: null, crawling: null, lighthouse: null },
      combined: {
        ...combined,
        checks: {
          ...combined.checks,
          indexing: [{ id: "sitemapExists", status: "pass" }],
        },
      },
    });

    render(<ScanResultScreen lang="ko" theme="dark" t={t} id={id} />);

    expect(screen.getByText("Indexing")).toBeInTheDocument();
    expect(screen.getByText("sitemap.xml이 확인된다")).toBeInTheDocument();
  });

  it("renders the Previews card from combined.checks.previews when present (issue #5)", () => {
    const id = useScanStore.getState().saveScanResult({
      url: "https://example.com",
      raw: { robotsTxt: null, siteMap: null, crawling: null, lighthouse: null },
      combined: {
        ...combined,
        openGraph: { "og:title": "Example OG Title" },
        checks: {
          ...combined.checks,
          previews: [{ id: "ogImageDimensions", status: "pass" }],
        },
      },
    });

    render(<ScanResultScreen lang="ko" theme="dark" t={t} id={id} />);

    expect(screen.getByText("Previews — OG · Twitter")).toBeInTheDocument();
    expect(screen.getByText("og:image가 설정되어 있다")).toBeInTheDocument();
    expect(screen.getAllByText("Example OG Title")).toHaveLength(2);
  });

  it("renders the AI Signals card from combined.checks.aiSignals when present (issue #6)", () => {
    const id = useScanStore.getState().saveScanResult({
      url: "https://example.com",
      raw: { robotsTxt: null, siteMap: null, crawling: null, lighthouse: null },
      combined: {
        ...combined,
        checks: {
          ...combined.checks,
          aiSignals: [{ id: "promptsTxt", status: "info" }],
        },
      },
    });

    render(<ScanResultScreen lang="ko" theme="dark" t={t} id={id} />);

    expect(screen.getByText("AI SIGNALS")).toBeInTheDocument();
    expect(screen.getByText("prompts.txt")).toBeInTheDocument();
  });

  it("renders the Lighthouse card from combined.lighthouse when present (issue #9)", () => {
    const id = useScanStore.getState().saveScanResult({
      url: "https://example.com",
      raw: { robotsTxt: null, siteMap: null, crawling: null, lighthouse: null },
      combined: {
        ...combined,
        lighthouse: {
          scores: { performance: 0.9, seo: 1, accessibility: 0.8, bestPractices: 0.75 },
          suggestions: [
            { id: "uses-text-compression", title: "Enable text compression", score: 0.5 },
          ],
        },
      },
    });

    render(<ScanResultScreen lang="ko" theme="dark" t={t} id={id} />);

    expect(screen.getByText("Lighthouse 개선 제안")).toBeInTheDocument();
    expect(screen.getByText("Enable text compression")).toBeInTheDocument();
  });

  it("doesn't crash and omits the Lighthouse card when combined.lighthouse is absent (older/hand-built entries)", () => {
    const id = useScanStore.getState().saveScanResult({
      url: "https://example.com",
      raw: { robotsTxt: null, siteMap: null, crawling: null, lighthouse: null },
      combined,
    });

    render(<ScanResultScreen lang="ko" theme="dark" t={t} id={id} />);

    expect(screen.queryByText("Lighthouse 개선 제안")).not.toBeInTheDocument();
  });
});
