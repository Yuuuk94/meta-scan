import { NextResponse } from "next/server";

// meta-scan's own `ads.txt` (issue #48 domain-migration) — AdSense's "site
// not found" review failure may partly stem from this file never existing.
// Folder-named-`ads.txt` + `route.ts` is the standard Next.js App Router
// trick for serving a custom static-like text response at `/ads.txt` (there
// is no built-in `ads.ts` metadata-file convention the way there is for
// `robots.ts`/`sitemap.ts`).
//
// The pub-id is *derived* from `NEXT_PUBLIC_ADSENSE_CLIENT_ID`
// (`ca-pub-<id>` -> `pub-<id>`), never hardcoded, so this can never drift
// out of sync with whatever client ID prod actually has configured.
function derivePublisherId(clientId?: string): string | null {
  if (!clientId) return null;
  return clientId.startsWith("ca-") ? clientId.slice(3) : clientId;
}

export function GET() {
  const publisherId = derivePublisherId(
    process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID
  );

  // Unset (pre-approval/local dev) -> empty body rather than a line with a
  // literal "undefined" pub-id, same "safe no-op until the env var is
  // filled in" gating as AdSlot/AutoAdsScript/AnalyticsGate.
  const body = publisherId
    ? `google.com, ${publisherId}, DIRECT, f08c47fec0942fa0\n`
    : "";

  return new NextResponse(body, {
    headers: { "content-type": "text/plain" },
  });
}
