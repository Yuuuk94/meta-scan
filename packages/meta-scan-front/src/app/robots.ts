import type { MetadataRoute } from "next";
import { siteUrl } from "@/constans";

// meta-scan's own robots.txt (issue #10, spec-fixed.md requirement #2) —
// full crawl allowed, points crawlers at the sitemap above.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
