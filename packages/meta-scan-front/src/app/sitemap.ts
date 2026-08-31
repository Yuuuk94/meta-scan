import type { MetadataRoute } from "next";
import { allowLanguages, siteRoutes, siteUrl } from "@/constans";

// meta-scan's own sitemap.xml (issue #10, spec-fixed.md requirement #1) —
// one entry per locale x static route, so search engines index each
// language page separately. `/scan/:id` (personalized result page) is
// deliberately not included here.
export default function sitemap(): MetadataRoute.Sitemap {
  return allowLanguages.flatMap((locale) =>
    siteRoutes.map((route) => ({
      url: `${siteUrl}/${locale}${route}`,
    }))
  );
}
