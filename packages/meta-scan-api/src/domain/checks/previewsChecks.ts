/**
 * Pure judgement logic for the "미리보기(Previews)" checklist card (issue #5 previews-checklist).
 * All 4 checks come entirely from `crawling`'s own DOM extraction (+ one same-request HEAD
 * fallback for favicon), so — like buildBasicSeoChecks (issue #3) — there's a single composer
 * `ScanService.crawling` calls once and assigns straight to `checks.previews`, no cross-API merge
 * needed (unlike checks.indexing, issue #4).
 *
 * ogRequiredTags/twitterCard restore judgement logic that used to exist as
 * `og.missing_core`/`twitter.missing_card` in the pre-Hexagonal `runChecks` (removed in issue #3's
 * commit abca675, which explicitly deferred them to this issue). Re-derived here as pure functions
 * rather than resurrected verbatim — status vocabulary/ids follow this checklist card's own
 * convention (camelCase ids, pass/warning, no "info" level for these two — coordinator decision,
 * 2026-08-31), not the old flat-array shape.
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

// og:title/og:description/og:image are the "core" OG tags a card preview needs to render
// meaningfully — all 3 present = pass, any missing (or present-but-empty) = warning.
export function buildOgRequiredTagsCheck(
  openGraph: Record<string, string>
): PreviewsCheckItem {
  const hasAll =
    !!openGraph["og:title"] &&
    !!openGraph["og:description"] &&
    !!openGraph["og:image"];
  return { id: "ogRequiredTags", status: hasAll ? "pass" : "warning" };
}

// twitter:card presence only — which specific card type it declares doesn't matter here.
export function buildTwitterCardCheck(
  twitter: Record<string, string>
): PreviewsCheckItem {
  return { id: "twitterCard", status: twitter["twitter:card"] ? "pass" : "warning" };
}

/** Composes all 4 previews checks — `ScanService.crawling` calls this once (after resolving the
 * favicon fallback HEAD check) and assigns the result straight to `checks.previews`. */
export function buildPreviewsChecksFromCrawling(input: {
  ogImage?: string;
  hasIconLink: boolean;
  faviconFallbackOk: boolean;
  openGraph: Record<string, string>;
  twitter: Record<string, string>;
}): PreviewsCheckItem[] {
  return [
    buildOgImageDimensionsCheck(input.ogImage),
    buildFaviconCheck(input.hasIconLink, input.faviconFallbackOk),
    buildOgRequiredTagsCheck(input.openGraph),
    buildTwitterCardCheck(input.twitter),
  ];
}
