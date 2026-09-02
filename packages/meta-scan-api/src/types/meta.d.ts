// Judgement vocabulary shared with meta-scan-front's <StatusBadge> (pass/warning/fail/info —
// docs/design-system.md §8). "info" means "signal present but not a deduction", not "unknown".
type BasicSeoStatus = "pass" | "warning" | "fail" | "info";

// Result row for one basicSeo checklist item. `detail` is only populated for ids where a raw
// number is natural to show (title.length/desc.length/img.altMissing/meta.duplicate) — existence
// -only ids (title.missing/desc.missing/keywords.deprecated) omit it. Sentences are assembled by
// the frontend from dictionaries/{ko,en}.json, not returned here (issue #3 basic-seo-checklist).
type BasicSeoCheckItem = {
  id: string;
  status: BasicSeoStatus;
  detail?: number;
};

// Subset of MetaScanResult["extract"] that basicSeo judgement actually needs (no canonical/h1/
// openGraph/twitter — those belong to other checklist groups: indexing/content-stats/previews).
type BasicSeoExtractInput = {
  title?: string;
  description?: string;
  keywords?: string;
  images: { total: number; altMissing: number };
  duplicates: { metaName: string[]; metaProperty: string[] };
};

// Result row for one "indexing" checklist item (issue #4 indexing-checklist). Reuses
// BasicSeoStatus's pass/warning/fail/info vocabulary — it's a shared <StatusBadge> vocabulary,
// not something specific to the basicSeo group despite the type's name (see that type's doc
// comment). None of the current indexing checks carry a numeric `detail` (unlike basicSeo's
// title.length etc.), but the field is kept optional for parity/future use.
type IndexingCheckItem = {
  id: string;
  status: BasicSeoStatus;
  detail?: number;
};

// Result row for one "미리보기(Previews)" checklist item (issue #5 previews-checklist). Reuses
// BasicSeoStatus's pass/warning/fail/info vocabulary, same as indexing (IndexingCheckItem).
type PreviewsCheckItem = {
  id: string;
  status: BasicSeoStatus;
  detail?: number;
};

// Result row for one "AI 신호(AI Signals/AEO)" checklist item (issue #6 ai-signals-checklist).
// Reuses BasicSeoStatus's pass/warning/fail/info vocabulary, same as indexing/previews.
// `detail` carries the natural number for the id where one exists (promptsTxt's byte count,
// jsRenderDelta's raw deltaRatio) — promptObject/structuredData/faqSection are existence-only, no
// detail.
type AiSignalsCheckItem = {
  id: string;
  status: BasicSeoStatus;
  detail?: number;
};

// Raw heading-tag counts backing the "headings" content check's `detail` (issue #7
// content-stats-checklist) — h1 count together with h2/h3 presence.
type ContentHeadingCounts = { h1: number; h2: number; h3: number };

// Result row for one "콘텐츠 품질(Content Stats)" checklist item (issue #7
// content-stats-checklist). Reuses BasicSeoStatus's pass/warning/fail/info vocabulary, same as the
// other groups. `detail` is a plain number for charCount (raw character count), the raw heading
// counts object for headings, and omitted for tldr (existence-only).
type ContentCheckItem = {
  id: string;
  status: BasicSeoStatus;
  detail?: number | ContentHeadingCounts;
};

type MetaScanResult = {
  url: string;
  finalUrl: string;
  timingMs: { firstHtml: number; onload: number };
  html: {
    first: { length: number; sha1: string };
    onload: { length: number; sha1: string };
    deltaRatio: number;
  };
  extract: {
    title?: string;
    description?: string;
    keywords?: string;
    // First element of canonicalLinks, kept for backward compatibility with existing consumers
    // that only cared about "the" canonical value.
    canonical?: string;
    // All `link[rel="canonical"]` hrefs found, in document order (issue #4 indexing-checklist —
    // canonicalMultiple needs the full count, not just the first one).
    canonicalLinks: string[];
    // `<meta name="robots" content="...">` raw content, if present (issue #4 indexing-checklist).
    metaRobots?: string;
    h1: string[];
    images: { total: number; altMissing: number };
    openGraph: Record<string, string>;
    twitter: Record<string, string>;
    duplicates: { metaName: string[]; metaProperty: string[] };
    // Deduped `@type` values collected from every `script[type="application/ld+json"]` on the
    // page (including nested `@graph` arrays) — issue #6 ai-signals-checklist. Parse errors are
    // swallowed per-script (a malformed JSON-LD block just contributes no types); a dedicated
    // parse-error judgement is PRD §3.4 scope this issue doesn't cover (spec-fixed.md only asks
    // for promptsTxt/promptObject/structuredData/faqSection existence).
    structuredDataTypes: string[];
    // Raw result of the `/.well-known/prompts.txt` fetch run in parallel with the original-HTML
    // fetch in `ScanService.crawling` (issue #6 — ADR-003: no 5th API route for this).
    promptsTxt: { exists: boolean; byteCount?: number };
  };
  // Grouped by checklist card (issue #3 basic-seo-checklist introduces the first group,
  // `basicSeo`; issue #4 indexing-checklist adds `indexing` — though its `sitemapExists`/
  // `sitemapDeclaredInRobots` rows come from the siteMap/robotsTxt responses, not this one;
  // content-stats/previews land via their own issues, see
  // docs/feature/01-seo-aeo-geo-checker/*-checklist/spec-fixed.md). Replaces the previous flat
  // `checks: Array<{ id, level, message, target? }>` shape.
  // issue #5 previews-checklist adds `previews` — `ogImageDimensions`/`favicon` (both judged from
  // this response's own DOM extraction, no cross-API merge needed, same as basicSeo). The raw
  // og/twitter values used for the frontend's actual card preview render (not judgement) already
  // live under `extract.openGraph`/`extract.twitter` above (spec req #3 — passthrough, no new
  // field needed here).
  // issue #6 ai-signals-checklist adds `aiSignals` — `promptsTxt`/`promptObject`/
  // `structuredData`/`faqSection`/`jsRenderDelta`, all judged from this response's own
  // extraction (prompts.txt fetch + JSON-LD @type parsing + the already-computed
  // `html.deltaRatio`), same single-endpoint-composer pattern as basicSeo/previews.
  // issue #7 content-stats-checklist adds `content` — `charCount`/`headings`/`tldr`, all judged
  // from this response's own DOM extraction (body character count, h1/h2/h3 counts, TL;DR block
  // detection). `headings` absorbs the h1-count judgement that basicSeo never actually carried
  // (checked against code, not assumed — see contentChecks.ts doc comment).
  checks: {
    basicSeo: BasicSeoCheckItem[];
    indexing: IndexingCheckItem[];
    previews: PreviewsCheckItem[];
    aiSignals: AiSignalsCheckItem[];
    content: ContentCheckItem[];
  };
};
