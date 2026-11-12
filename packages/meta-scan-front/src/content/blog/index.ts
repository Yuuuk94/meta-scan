import type { BlogPost } from "./types";
import { post as enSeoAeoGeo } from "./en/seo-aeo-geo";
import { post as enSiteNotOnGoogle } from "./en/site-not-on-google";
import { post as enRobotsTxt } from "./en/robots-txt";
import { post as enLlmsTxt } from "./en/llms-txt";
import { post as enOgTagsPreview } from "./en/og-tags-preview";
import { post as enSitemapXml } from "./en/sitemap-xml";
import { post as enCanonicalTag } from "./en/canonical-tag";
import { post as enNoindexCheck } from "./en/noindex-check";
import { post as enAiSearchCitation } from "./en/ai-search-citation";
import { post as enAiCrawlers } from "./en/ai-crawlers";
import { post as enJsonLdBasics } from "./en/json-ld-basics";
import { post as enTitleDescription } from "./en/title-description";
import { post as enHreflang } from "./en/hreflang";
import { post as enLighthouseScore } from "./en/lighthouse-score";
import { post as enHeadingStructure } from "./en/heading-structure";
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
  enSeoAeoGeo,
  enSiteNotOnGoogle,
  enRobotsTxt,
  enLlmsTxt,
  enOgTagsPreview,
  enSitemapXml,
  enCanonicalTag,
  enNoindexCheck,
  enAiSearchCitation,
  enAiCrawlers,
  enJsonLdBasics,
  enTitleDescription,
  enHreflang,
  enLighthouseScore,
  enHeadingStructure,
];
