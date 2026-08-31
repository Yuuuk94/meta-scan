/**
 * Pure judgement logic for the "미리보기(Previews)" checklist card (issue #5 previews-checklist).
 * Both checks come entirely from `crawling`'s own DOM extraction (+ one same-request HEAD
 * fallback for favicon), so — like buildBasicSeoChecks (issue #3) — there's a single composer
 * `ScanService.crawling` calls once and assigns straight to `checks.previews`, no cross-API merge
 * needed (unlike checks.indexing, issue #4).
 */

// Existence-only check — not a real pixel-dimension measurement (out of scope per spec-fixed.md
// "비고": actual image download/decode is a v0.2 candidate). A present-but-empty og:image content
// is treated the same as missing.
export function buildOgImageDimensionsCheck(ogImage?: string): PreviewsCheckItem {
  return {
    id: "ogImageDimensions",
    status: ogImage ? "pass" : "warning",
  };
}

// `link[rel~="icon"]` in the DOM is checked first; if absent, ScanService falls back to a HEAD
// request against the conventional `/favicon.ico` path and passes the result in here as
// `faviconFallbackOk` (spec decision log #1 — many real sites only rely on this convention, no
// explicit <link> tag, so treating that as "no favicon" would be a false negative).
export function buildFaviconCheck(
  hasIconLink: boolean,
  faviconFallbackOk: boolean
): PreviewsCheckItem {
  return {
    id: "favicon",
    status: hasIconLink || faviconFallbackOk ? "pass" : "warning",
  };
}

/** Composes the 2 previews checks — `ScanService.crawling` calls this once (after resolving the
 * favicon fallback HEAD check) and assigns the result straight to `checks.previews`. */
export function buildPreviewsChecksFromCrawling(input: {
  ogImage?: string;
  hasIconLink: boolean;
  faviconFallbackOk: boolean;
}): PreviewsCheckItem[] {
  return [
    buildOgImageDimensionsCheck(input.ogImage),
    buildFaviconCheck(input.hasIconLink, input.faviconFallbackOk),
  ];
}
