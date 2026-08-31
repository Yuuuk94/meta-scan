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
    canonical?: string;
    h1: string[];
    images: { total: number; altMissing: number };
    openGraph: Record<string, string>;
    twitter: Record<string, string>;
    duplicates: { metaName: string[]; metaProperty: string[] };
  };
  // Grouped by checklist card (issue #3 basic-seo-checklist introduces the first group,
  // `basicSeo`; other groups — previews/indexing/content — land via their own issues, see
  // docs/feature/01-seo-aeo-geo-checker/*-checklist/spec-fixed.md). Replaces the previous flat
  // `checks: Array<{ id, level, message, target? }>` shape.
  checks: {
    basicSeo: BasicSeoCheckItem[];
  };
};
