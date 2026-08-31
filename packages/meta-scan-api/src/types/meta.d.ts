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
  checks: {
    basicSeo: BasicSeoCheckItem[];
    indexing: IndexingCheckItem[];
    previews: PreviewsCheckItem[];
  };
};
