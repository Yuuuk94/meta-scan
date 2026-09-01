export const pageTitle = "META_SCAN.LAB";

export const allowLanguages = ["en", "ko"];
export const allowTheme = ["dark", "light"];

export const defaultTheme: Theme = "dark";
export const defaultLang: Language = "ko";

export const themeKey = "theme";
export const langKey = "lang";

export const crrUrlKey = "crrUrl";

export const urlPattern = /^https?:\/\/.+\..+/;

export const okStatus = "ok";

// meta-scan's own site URL (own sitemap.xml/robots.txt, issue #10) —
// distinct from a scanned target's URL. Same placeholder domain
// RootLayout's openGraph metadata already hardcodes; kept here as a single
// source of truth for the sitemap/robots routes.
export const siteUrl = process.env.NEXT_PUBLIC_META_SCAN_URL;

// Real routes that get indexed per-locale in sitemap.xml. `/scan/:id` is a
// personalized result page (pipe-connection, issue #2) and intentionally
// excluded.
export const siteRoutes = ["", "/request-scan", "/scan", "/privacy", "/terms"];
