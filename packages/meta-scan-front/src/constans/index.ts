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

// Shared DOM id so FAQSection's "지금 스캔하기" CTA (issue #15) can locate and
// focus HeroSection's URL input across sibling organisms without a shared
// context/store — same "read via DOM, no Context" style as the cookie helpers.
export const heroUrlInputId = "hero-url-input";
