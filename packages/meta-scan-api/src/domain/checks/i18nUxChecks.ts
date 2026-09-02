/**
 * Pure judgement logic for the "국제화/UX(i18n/UX)" checklist card (issue #8
 * i18n-ux-checklist). Both checks come entirely from `crawling`'s own DOM extraction
 * (`<link rel="alternate" hreflang="...">` presence and `<meta name="viewport">` presence) — same
 * single-endpoint-composer pattern as buildBasicSeoChecks/buildPreviewsChecksFromCrawling, no
 * cross-API merge needed.
 */

// Presence is a nice-to-have, not a deduction (spec req #1: "없음=info") — many single-locale
// sites legitimately have no hreflang alternates.
export function buildHreflangCheck(hasHreflang: boolean): I18nUxCheckItem {
  return { id: "hreflang", status: hasHreflang ? "pass" : "info" };
}

// A missing viewport meta tag breaks mobile rendering, so absence is a real warning (spec req
// #2), unlike hreflang.
export function buildViewportCheck(hasViewport: boolean): I18nUxCheckItem {
  return { id: "viewport", status: hasViewport ? "pass" : "warning" };
}

/** Composes both i18n/UX checks — `ScanService.crawling` calls this once (after the DOM
 * extraction) and assigns the result straight to `checks.i18nUx`. Order is hreflang then
 * viewport, matching spec req order (#1 then #2). */
export function buildI18nUxChecksFromCrawling(input: {
  hasHreflang: boolean;
  hasViewport: boolean;
}): I18nUxCheckItem[] {
  return [
    buildHreflangCheck(input.hasHreflang),
    buildViewportCheck(input.hasViewport),
  ];
}
