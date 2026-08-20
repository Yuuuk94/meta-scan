import { getDictionary } from "@/dictionaries";
import { getSiteSetting } from "@/utils/siteSetting";
import { StatusBadge, type StatusBadgeProps } from "@/components/ui/status-badge";

type Status = StatusBadgeProps["status"];

interface Row {
  label: string;
  status?: Status;
  detail?: string;
  /** Plain stat value instead of a pass/warning/fail/info verdict (word count, heading counts). */
  value?: string;
}

interface Group {
  title: string;
  rows: Row[];
}

interface FixItem {
  status: "fail" | "warning";
  text: string;
}

// NOTE: still mock data — wiring this to the real 4-API orchestration
// (ADR-003: robotsTxt/siteMap/crawling/lighthouse, combined client-side by
// combineScanResults) is out of scope for this pass, see
// docs/meta-scan-plus-prd.md and CLAUDE.md "현재 상태". This mock's *shape*
// mirrors the checklist model backend `checks[]` will return (pass/warning/
// fail/info per item) — the previous 0-100 "AI Preparedness Score" mock was
// the scoring engine ADR-005 scrapped and has been replaced here.
const mock: Record<
  Language,
  {
    aiSignals: Row[];
    fixNow: FixItem[];
    groups: Group[];
    previewChecks: Row[];
    previewCards: { eyebrow?: string; title: string; desc: string }[];
    lighthouse: { label: string; score: number }[];
    suggestions: { label: string; source: string }[];
  }
> = {
  ko: {
    aiSignals: [
      { label: "prompts.txt", status: "info", detail: "없음" },
      { label: "PromptObject", status: "info", detail: "없음" },
      { label: "FAQ 섹션", status: "pass", detail: "발견됨" },
      { label: "구조화 데이터", status: "pass", detail: "WebPage, FAQPage" },
      { label: "JS 렌더링 의존도", status: "pass", detail: "12%" },
    ],
    fixNow: [
      { status: "fail", text: "meta robots에 noindex가 설정돼 있어 색인되지 않는다" },
      { status: "fail", text: "canonical 태그가 2개 이상 발견됐다" },
      { status: "warning", text: "og:image 크기 메타가 없다" },
    ],
    groups: [
      {
        title: "기본 SEO",
        rows: [
          { label: "title", status: "pass" },
          { label: "description", status: "warning" },
          { label: "keywords 태그", status: "info" },
          { label: "이미지 alt 누락", status: "warning" },
          { label: "중복 meta", status: "pass" },
        ],
      },
      {
        title: "Indexing",
        rows: [
          { label: "sitemap.xml 존재", status: "pass" },
          { label: "robots.txt에 sitemap", status: "pass" },
          { label: "canonical 존재", status: "pass" },
          { label: "canonical 다중", status: "fail" },
          { label: "noindex", status: "fail" },
        ],
      },
      {
        title: "Content Stats",
        rows: [
          { label: "본문 단어 수", value: "1,340" },
          { label: "헤딩 구조", value: "H1:1 H2:6 H3:12" },
          { label: "TL;DR", status: "info" },
        ],
      },
      {
        title: "국제화·UX",
        rows: [
          { label: "hreflang", status: "info" },
          { label: "viewport", status: "pass" },
        ],
      },
    ],
    previewChecks: [
      { label: "OG 필수 태그", status: "pass" },
      { label: "Twitter Card", status: "warning" },
      { label: "og:image 크기", status: "warning" },
      { label: "favicon", status: "pass" },
    ],
    previewCards: [
      { eyebrow: "example.com", title: "meta-scan — 무료 SEO/AEO 체크리스트", desc: "URL 하나로 항목별로 점검한다" },
      { title: "meta-scan — 무료 SEO/AEO 체크리스트", desc: "URL 하나로 항목별로 점검한다", eyebrow: "example.com" },
    ],
    lighthouse: [
      { label: "Performance", score: 88 },
      { label: "SEO", score: 92 },
      { label: "Accessibility", score: 76 },
      { label: "Best Practices", score: 93 },
    ],
    suggestions: [
      { label: "이미지 크기 최적화", source: "Properly size images" },
      { label: "렌더링 차단 리소스 제거", source: "Eliminate render-blocking" },
      { label: "차세대 이미지 포맷", source: "Next-gen formats" },
    ],
  },
  en: {
    aiSignals: [
      { label: "prompts.txt", status: "info", detail: "Not found" },
      { label: "PromptObject", status: "info", detail: "Not found" },
      { label: "FAQ section", status: "pass", detail: "Found" },
      { label: "Structured data", status: "pass", detail: "WebPage, FAQPage" },
      { label: "JS render dependency", status: "pass", detail: "12%" },
    ],
    fixNow: [
      { status: "fail", text: "meta robots sets noindex, so this page won't be indexed" },
      { status: "fail", text: "Two or more canonical tags were found" },
      { status: "warning", text: "og:image is missing its size meta" },
    ],
    groups: [
      {
        title: "Basic SEO",
        rows: [
          { label: "title", status: "pass" },
          { label: "description", status: "warning" },
          { label: "keywords tag", status: "info" },
          { label: "Missing image alt", status: "warning" },
          { label: "Duplicate meta", status: "pass" },
        ],
      },
      {
        title: "Indexing",
        rows: [
          { label: "sitemap.xml exists", status: "pass" },
          { label: "sitemap in robots.txt", status: "pass" },
          { label: "canonical exists", status: "pass" },
          { label: "Multiple canonicals", status: "fail" },
          { label: "noindex", status: "fail" },
        ],
      },
      {
        title: "Content Stats",
        rows: [
          { label: "Word count", value: "1,340" },
          { label: "Heading structure", value: "H1:1 H2:6 H3:12" },
          { label: "TL;DR", status: "info" },
        ],
      },
      {
        title: "Intl & UX",
        rows: [
          { label: "hreflang", status: "info" },
          { label: "viewport", status: "pass" },
        ],
      },
    ],
    previewChecks: [
      { label: "Required OG tags", status: "pass" },
      { label: "Twitter Card", status: "warning" },
      { label: "og:image size", status: "warning" },
      { label: "favicon", status: "pass" },
    ],
    previewCards: [
      { eyebrow: "example.com", title: "meta-scan — a free SEO/AEO checklist", desc: "Check every item with a single URL" },
      { title: "meta-scan — a free SEO/AEO checklist", desc: "Check every item with a single URL", eyebrow: "example.com" },
    ],
    lighthouse: [
      { label: "Performance", score: 88 },
      { label: "SEO", score: 92 },
      { label: "Accessibility", score: 76 },
      { label: "Best Practices", score: 93 },
    ],
    suggestions: [
      { label: "Optimize image sizes", source: "Properly size images" },
      { label: "Remove render-blocking resources", source: "Eliminate render-blocking" },
      { label: "Use next-gen image formats", source: "Next-gen formats" },
    ],
  },
};

const StatusOrValue = ({ row }: { row: Row }) =>
  row.status ? (
    <StatusBadge status={row.status}>
      {row.status.toUpperCase()}
      {row.detail ? ` · ${row.detail}` : ""}
    </StatusBadge>
  ) : (
    <span className="text-xs text-info">{row.value}</span>
  );

export default async function ScanPage() {
  const { lang, crrUrl } = await getSiteSetting();
  const t = (await getDictionary(lang)).scan;
  const m = mock[lang];
  const url = crrUrl ? decodeURI(crrUrl) : "https://example.com";
  const timestamp = new Date().toLocaleString(lang === "ko" ? "ko-KR" : "en-US");

  return (
    <div className="content-frame py-8">
      {/* URL row — flat, no card (design-system.md §5). Mobile is two stacked
       * block-level lines rather than an inline row that happens to wrap
       * (zine-index intake §3.5). */}
      <div className="flex flex-col sm:flex-row sm:items-baseline sm:gap-3">
        <span className="text-[15px] font-bold text-foreground">{url}</span>
        <span className="mt-0.5 text-xs text-muted-foreground sm:mt-0">
          {t.analyzedAt} {timestamp}
        </span>
      </div>

      {/* AI Signals — the product's own differentiator, hardline card */}
      <div className="mt-6 border-[1.5px] border-foreground bg-card p-5 sm:p-7">
        <div className="flex items-center justify-between">
          <div>
            {/* Desktop keeps the full "핵심 차별화 영역 —" prefix; mobile drops it
             * and shows only the suffix (zine-index intake §3.5). */}
            <span className="text-[10.5px] font-bold uppercase tracking-[.06em] text-muted-foreground">
              <span className="hidden sm:inline">{t.aiSignalsEyebrow}</span>
              <span className="sm:hidden">{t.aiSignalsEyebrowMobile}</span>
            </span>
            <h2 className="mt-1 font-display text-2xl font-extrabold text-foreground">
              {t.aiSignals}
            </h2>
          </div>
          {/* Hint is dropped entirely at mobile, not just repositioned
           * (zine-index intake §3.5). */}
          <span className="hidden text-xs text-muted-foreground sm:block">
            {t.aiSignalsHint}
          </span>
        </div>
        <div className="mt-4 flex flex-col">
          {m.aiSignals.map((row) => (
            <div
              key={row.label}
              className="flex items-center justify-between border-b-[1.5px] border-border py-2.5 last:border-none"
            >
              <span className="text-sm text-foreground">{row.label}</span>
              <StatusOrValue row={row} />
            </div>
          ))}
        </div>
      </div>

      {/* Fix now */}
      <div className="mt-8">
        <h2 className="font-display text-xl font-extrabold text-foreground">
          {t.fixNowTitle}
        </h2>
        <div className="mt-3 flex flex-col gap-px border-[1.5px] border-foreground bg-foreground">
          {m.fixNow.map((item) => (
            <div
              key={item.text}
              className={`flex items-center gap-4 px-5 py-3.5 ${
                item.status === "fail" ? "bg-fail-tint" : "bg-warning-tint"
              }`}
            >
              <StatusBadge status={item.status}>
                {item.status.toUpperCase()}
              </StatusBadge>
              <span className="text-sm font-medium text-foreground">{item.text}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Grouped checklist cards — hardline rule between cards instead of a
       * real gap (zine-index intake §6 결정 2: 문서 규칙 "갭 대신 룰 라인"으로 통일,
       * design-system.md §4 "카드 그룹(그리드) 사이는 1px 검정 룰로 셀을 구분"). */}
      <div className="mt-8 grid grid-cols-1 gap-px border-[1.5px] border-foreground bg-foreground sm:grid-cols-2 lg:grid-cols-4">
        {m.groups.map((group) => (
          <div key={group.title} className="bg-card p-5">
            <h3 className="mb-2 font-display text-[15px] font-extrabold text-foreground">
              {group.title}
            </h3>
            <div className="flex flex-col">
              {group.rows.map((row) => (
                <div
                  key={row.label}
                  className="flex items-center justify-between gap-2 border-b-[1.5px] border-border py-2.5 last:border-none"
                >
                  <span className="text-[12.5px] text-foreground">{row.label}</span>
                  <StatusOrValue row={row} />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Previews */}
      <div className="mt-8 border-[1.5px] border-foreground bg-card p-6">
        <h3 className="mb-4 font-display text-[15px] font-extrabold text-foreground">
          {t.previews}
        </h3>
        <div className="grid grid-cols-2 gap-3.5 sm:grid-cols-4">
          {m.previewChecks.map((row) => (
            <div key={row.label} className="flex items-center justify-between gap-2">
              <span className="text-[11.5px] text-muted-foreground">{row.label}</span>
              <StatusOrValue row={row} />
            </div>
          ))}
        </div>
        {/* Hardline rule between the two preview cards instead of a real gap
         * (zine-index intake §6 결정 2). Each cell needs its own opaque
         * background (bg-popover) — a transparent cell over the bg-foreground
         * gap-px parent would otherwise show black through the gap. */}
        <div className="mt-5 grid grid-cols-1 gap-px border-[1.5px] border-foreground bg-foreground sm:grid-cols-2">
          {m.previewCards.map((card, i) => (
            // Mobile shows only the first (Google-result-style) preview card —
            // the design drops the second (Twitter-style) card entirely at mobile
            // width rather than stacking both (zine-index intake §3.5).
            <div
              key={i}
              className={`bg-popover ${i === 1 ? "hidden sm:block" : ""}`}
            >
              <div className="h-[120px] bg-muted" />
              <div className="p-3.5">
                {i === 0 ? (
                  <span className="text-[10px] uppercase text-muted-foreground">
                    {card.eyebrow}
                  </span>
                ) : null}
                <div className="mt-1 text-sm font-bold text-foreground">{card.title}</div>
                <div className="mt-0.5 text-xs text-muted-foreground">{card.desc}</div>
                {i === 1 ? (
                  <span className="mt-1 block text-[10px] text-muted-foreground">
                    {card.eyebrow}
                  </span>
                ) : null}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Lighthouse — exception to the checklist model: kept as Google's own
       * raw scores (design-system.md §2 rationale in CLAUDE.md). */}
      <div className="mt-10 border-t-4 border-foreground pt-9">
        <h3 className="font-display text-[15px] font-extrabold text-foreground">
          {t.lighthouseScores}
        </h3>
        <div className="mt-3 grid grid-cols-2 gap-px border-[1.5px] border-foreground bg-foreground sm:grid-cols-4">
          {m.lighthouse.map((item) => (
            <div key={item.label} className="bg-card p-5">
              <span className="font-display text-3xl font-black text-foreground">
                {item.score}
              </span>
              <div className="mt-1 text-[11.5px] text-muted-foreground">{item.label}</div>
            </div>
          ))}
        </div>

        <div className="mt-6 border-[1.5px] border-foreground bg-card p-6">
          <div className="text-[13px] font-bold text-foreground">
            {t.lighthouseSuggestions}
          </div>
          {/* Desktop: "Hero(위, 자체 판정)와 출처가 다름 — lhr.audits 기반". Mobile:
           * shorter, reordered "lhr.audits 기반, Hero와 출처 다름" (zine-index intake
           * §3.5 / §6 결정 1 — verbatim meta-commentary copy, not rewritten). */}
          <div className="mt-0.5 text-[11px] text-muted-foreground">
            <span className="hidden sm:inline">{t.lighthouseSuggestionsHint}</span>
            <span className="sm:hidden">{t.lighthouseSuggestionsHintMobile}</span>
          </div>
          <div className="mt-3.5 flex flex-col">
            {m.suggestions.map((s) => (
              <div
                key={s.label}
                className="flex items-center justify-between border-b-[1.5px] border-border py-2.5 last:border-none"
              >
                <span className="text-[12.5px] text-foreground">{s.label}</span>
                {/* Mobile drops the English lhr.audits source id entirely — not just
                 * repositioned (zine-index intake §3.5). */}
                <span className="hidden text-[11px] text-muted-foreground sm:inline">
                  {s.source}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
