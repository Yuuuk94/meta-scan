import { z } from "zod";

export const UrlBodySchema = z.object({
  url: z.string().url("valid url is required"),
});

export type UrlBody = z.infer<typeof UrlBodySchema>;

export const UrlsBodySchema = z.object({
  urls: z.array(z.string().url("valid url is required")).min(1),
});

export type UrlsBody = z.infer<typeof UrlsBodySchema>;

// issue #4 indexing-checklist: the frontend already holds robots-gating's `robotsTxt().sitemap`
// (declared sitemap URLs) by the time it calls siteMap, and forwards them here so the backend can
// sequentially HEAD-check fallback locations without re-fetching/re-parsing robots.txt itself
// (spec decision log #3 — keeps ADR-003's 4-API independence).
export const SiteMapBodySchema = UrlBodySchema.extend({
  candidateSitemaps: z.array(z.string().url("valid url is required")).optional(),
});

export type SiteMapBody = z.infer<typeof SiteMapBodySchema>;
