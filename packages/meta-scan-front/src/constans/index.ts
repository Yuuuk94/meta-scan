export const pageTitle = "META_SCAN.BIZ";

export const allowLanguages = ["en", "ko"];
export const allowTheme = ["dark", "light"];

export const defaultTheme: Theme = "dark";
export const defaultLang: Language = "ko";

export const themeKey = "theme";
export const langKey = "lang";

// Request header the middleware uses to hand the URL locale to server
// components (issue #64).
export const localeHeaderKey = "x-locale";

export const crrUrlKey = "crrUrl";

// Protocol is optional (issue #34 url-input-protocol-ux) — HeroSection's
// handleAnalyze auto-prepends https:// when missing before proceeding, but
// this pattern itself also needs to accept protocol-less input directly
// since it's reused as-is for the live useEffect revalidation. Whitespace
// anywhere and a missing "." are still rejected (both sides of the "."
// disallow \s so a stray space anywhere in the string can never match the
// full anchored pattern).
export const urlPattern = /^(https?:\/\/)?[^\s]+\.[^\s]+$/;

export const okStatus = "ok";

// Shared DOM id so FAQSection's "지금 스캔하기" CTA (issue #15) can locate and
// focus HeroSection's URL input across sibling organisms without a shared
// context/store — same "read via DOM, no Context" style as the cookie helpers.
export const heroUrlInputId = "hero-url-input";

// meta-scan's own site URL (own sitemap.xml/robots.txt, issue #10) —
// distinct from a scanned target's URL. Same placeholder domain
// RootLayout's openGraph metadata already hardcodes; kept here as a single
// source of truth for the sitemap/robots routes.
export const siteUrl = process.env.NEXT_PUBLIC_META_SCAN_URL;

// Real routes that get indexed per-locale in sitemap.xml. Tool screens
// (`/scan`, `/request-scan`, `/scan/:id`) are noindex and excluded (issue
// #76 — AdSense low-value-content rejection); blog posts are added
// separately from the post registry.
export const siteRoutes = ["", "/about", "/privacy", "/terms"];

// Site blog author (issue #76) — shown in the author box and Article JSON-LD.
export const blogAuthorName = "Yuuuk94";

// localStorage key for the GA4 cookie-consent decision (issue #19
// analytics-integration). Distinct namespace prefix (`ms_`) since this is
// localStorage, not one of the `document.cookie` keys above.
export const analyticsConsentKey = "ms_analytics_consent";
