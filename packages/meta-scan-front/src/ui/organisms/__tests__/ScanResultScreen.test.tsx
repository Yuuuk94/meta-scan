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
  aiSignalsPromptsTxtLabel: "prompts.txt",
  aiSignalsPromptsTxtInfoSuffix: "내용 부족",
  contentStats: "Content Stats",
  contentCharCountPass: "본문 길이가 적절하다 ({count}자)",
  intlUx: "국제화·UX",
  i18nUxHreflangPass: "hreflang 대체 링크가 있다",
  lighthouseScores: "Lighthouse 점수",
  performance: "Performance",
  seo: "SEO",
  accessibility: "Accessibility",
  bestPractices: "Best Practices",
  lighthouseSuggestions: "Lighthouse 개선 제안",
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
    i18nUx: [],
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

  it("renders real stored data (url header) and the empty-topIssues message", () => {
    const id = useScanStore.getState().saveScanResult({
      url: "https://example.com",
      raw: { robotsTxt: null, siteMap: null, crawling: null, lighthouse: null },
      combined,
    });

    render(<ScanResultScreen lang="ko" theme="dark" t={t} id={id} />);

    expect(screen.getByText("https://example.com")).toBeInTheDocument();
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
          i18nUx: [],
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
    expect(screen.getByText("Example OG Title")).toBeInTheDocument();
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

  it("renders the Content Stats card from combined.checks.content when present (issue #7)", () => {
    const id = useScanStore.getState().saveScanResult({
      url: "https://example.com",
      raw: { robotsTxt: null, siteMap: null, crawling: null, lighthouse: null },
      combined: {
        ...combined,
        checks: {
          ...combined.checks,
          content: [{ id: "charCount", status: "pass", detail: 900 }],
        },
      },
    });

    render(<ScanResultScreen lang="ko" theme="dark" t={t} id={id} />);

    expect(screen.getByText("Content Stats")).toBeInTheDocument();
    expect(screen.getByText("본문 길이가 적절하다 (900자)")).toBeInTheDocument();
  });

  it("renders the I18nUxCard from combined.checks.i18nUx when present (issue #8)", () => {
    const id = useScanStore.getState().saveScanResult({
      url: "https://example.com",
      raw: { robotsTxt: null, siteMap: null, crawling: null, lighthouse: null },
      combined: {
        ...combined,
        checks: {
          ...combined.checks,
          i18nUx: [{ id: "hreflang", status: "pass" }],
        },
      },
    });

    render(<ScanResultScreen lang="ko" theme="dark" t={t} id={id} />);

    expect(screen.getByText("국제화·UX")).toBeInTheDocument();
    expect(screen.getByText("hreflang 대체 링크가 있다")).toBeInTheDocument();
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

  // issue #18 adsense-integration
  describe("AdSlot placement (issue #18)", () => {
    const ORIGINAL_ENV = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID;

    afterEach(() => {
      if (ORIGINAL_ENV === undefined) {
        delete process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID;
      } else {
        process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID = ORIGINAL_ENV;
      }
    });

    it("does not render an ad slot when NEXT_PUBLIC_ADSENSE_CLIENT_ID is unset, even with a valid result", () => {
      delete process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID;
      const id = useScanStore.getState().saveScanResult({
        url: "https://example.com",
        raw: { robotsTxt: null, siteMap: null, crawling: null, lighthouse: null },
        combined,
      });

      render(<ScanResultScreen lang="ko" theme="dark" t={t} id={id} />);

      expect(screen.queryByTestId("ad-slot")).not.toBeInTheDocument();
      expect(
        document.querySelector('script[src*="adsbygoogle"]')
      ).not.toBeInTheDocument();
    });

    it("renders exactly one ad slot at the bottom of the page content when the client ID is set and a result exists", () => {
      process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID = "ca-pub-test-1234";
      const id = useScanStore.getState().saveScanResult({
        url: "https://example.com",
        raw: { robotsTxt: null, siteMap: null, crawling: null, lighthouse: null },
        combined,
      });

      render(<ScanResultScreen lang="ko" theme="dark" t={t} id={id} />);

      const slots = screen.getAllByTestId("ad-slot");
      expect(slots).toHaveLength(1);
      expect(slots[0]).toHaveAttribute("data-ad-client", "ca-pub-test-1234");

      // last rendered element among the page's content-frame children —
      // i.e. content-frame's own last child is (a wrapper containing) the
      // ad slot, not one of the checklist/preview/lighthouse cards above it.
      const frame = document.querySelector(".content-frame");
      expect(frame?.lastElementChild?.contains(slots[0])).toBe(true);
    });

    it("does not render an ad slot on the not-found screen even when the client ID is set", () => {
      process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID = "ca-pub-test-1234";

      render(<ScanResultScreen lang="ko" theme="dark" t={t} id="unknown-id" />);

      expect(screen.getByText("표시할 결과가 없습니다")).toBeInTheDocument();
      expect(screen.queryByTestId("ad-slot")).not.toBeInTheDocument();
    });

    it("does not render an ad slot on bare /scan (no id) even when the client ID is set", () => {
      process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID = "ca-pub-test-1234";

      render(<ScanResultScreen lang="ko" theme="dark" t={t} />);

      expect(screen.queryByTestId("ad-slot")).not.toBeInTheDocument();
    });
  });
});
