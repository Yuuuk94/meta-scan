import type { BlogPost } from "./types";
import { post as koSitemapXml } from "./ko/sitemap-xml";
import { post as koCanonicalTag } from "./ko/canonical-tag";
import { post as koNoindexCheck } from "./ko/noindex-check";
import { post as koAiSearchCitation } from "./ko/ai-search-citation";
import { post as koAiCrawlers } from "./ko/ai-crawlers";
import { post as koJsonLdBasics } from "./ko/json-ld-basics";
import { post as koTitleDescription } from "./ko/title-description";
import { post as koHreflang } from "./ko/hreflang";
import { post as koLighthouseScore } from "./ko/lighthouse-score";
import { post as koHeadingStructure } from "./ko/heading-structure";
import { post as koLlmsTxt } from "./ko/llms-txt";
import { post as koOgTagsPreview } from "./ko/og-tags-preview";
import { post as koRobotsTxt } from "./ko/robots-txt";
import { post as koSeoAeoGeo } from "./ko/seo-aeo-geo";
import { post as koSiteNotOnGoogle } from "./ko/site-not-on-google";

// issue #76 — every published post. Add new posts here.
export const posts: BlogPost[] = [
  koSeoAeoGeo,
  koSiteNotOnGoogle,
  koRobotsTxt,
  koLlmsTxt,
  koOgTagsPreview,
  koSitemapXml,
  koCanonicalTag,
  koNoindexCheck,
  koAiSearchCitation,
  koAiCrawlers,
  koJsonLdBasics,
  koTitleDescription,
  koHreflang,
  koLighthouseScore,
  koHeadingStructure,
];
