import { siteUrl } from "@/constans";

// issue #48 domain-migration — RootLayout's openGraph metadata used to
// hardcode `https://example.com` instead of referencing the same `siteUrl`
// constant robots.ts/sitemap.ts already use, so it never followed the real
// deployed domain (withmay.com -> meta-scan.biz). Also covers the
// `google-adsense-account` verification meta tag added for the same
// AdSense "site not found" review failure.
describe("RootLayout metadata (issue #48)", () => {
  it("uses siteUrl (not a hardcoded example.com) for the Open Graph url", async () => {
    const { metadata } = await import("@/app/[lang]/layout");

    expect(metadata.openGraph?.url).toBe(siteUrl);
  });

  it("uses siteUrl (not a hardcoded example.com) for the Open Graph image url", async () => {
    const { metadata } = await import("@/app/[lang]/layout");

    const images = metadata.openGraph?.images;
    const first = Array.isArray(images) ? images[0] : images;
    expect(first).toEqual(
      expect.objectContaining({ url: `${siteUrl}/og.png` })
    );
  });

  describe("google-adsense-account verification meta", () => {
    const ORIGINAL_ENV = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID;

    afterEach(() => {
      if (ORIGINAL_ENV === undefined) {
        delete process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID;
      } else {
        process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID = ORIGINAL_ENV;
      }
      jest.resetModules();
    });

    it("renders the meta tag content from NEXT_PUBLIC_ADSENSE_CLIENT_ID when set", async () => {
      process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID = "ca-pub-9590914027828852";
      jest.resetModules();

      const { metadata } = await import("@/app/[lang]/layout");

      expect(metadata.other).toEqual(
        expect.objectContaining({
          "google-adsense-account": "ca-pub-9590914027828852",
        })
      );
    });

    it("omits the meta tag entirely when NEXT_PUBLIC_ADSENSE_CLIENT_ID is unset", async () => {
      delete process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID;
      jest.resetModules();

      const { metadata } = await import("@/app/[lang]/layout");

      expect(metadata.other).toBeUndefined();
    });
  });
});
