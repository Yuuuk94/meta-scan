import type { BlogPost } from "./types";
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
];
