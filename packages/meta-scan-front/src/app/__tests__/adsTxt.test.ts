/**
 * @jest-environment node
 */
// route.ts imports next/server (NextResponse), which needs the Fetch API
// globals (Request/Response/Headers) Node provides natively — jsdom (this
// package's default test environment) doesn't carry those over, so this
// file overrides to the node environment.
//
// issue #48 domain-migration — ads.txt was missing entirely (a plausible
// contributor to AdSense's "site not found" review failure). The line's
// pub-id must be *derived* from NEXT_PUBLIC_ADSENSE_CLIENT_ID, not
// hardcoded, so it can never drift from whatever client ID is actually
// configured for the deployed site.
describe("ads.txt (issue #48)", () => {
  const ORIGINAL_ENV = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID;

  afterEach(() => {
    if (ORIGINAL_ENV === undefined) {
      delete process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID;
    } else {
      process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID = ORIGINAL_ENV;
    }
  });

  it("responds text/plain with a google.com/pub-<id>/DIRECT line derived from the current prod client ID", async () => {
    process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID = "ca-pub-9590914027828852";
    const { GET } = await import("@/app/ads.txt/route");

    const response = GET();
    const text = (await response.text()).trim();

    expect(response.headers.get("content-type")).toBe("text/plain");
    expect(text).toBe(
      "google.com, pub-9590914027828852, DIRECT, f08c47fec0942fa0"
    );
  });

  it("derives the pub id from a different client id rather than a hardcoded literal", async () => {
    process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID = "ca-pub-1111111111111111";
    const { GET } = await import("@/app/ads.txt/route");

    const text = (await GET().text()).trim();

    expect(text).toBe(
      "google.com, pub-1111111111111111, DIRECT, f08c47fec0942fa0"
    );
  });

  it("returns an empty body without crashing when the client id is unset", async () => {
    delete process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID;
    const { GET } = await import("@/app/ads.txt/route");

    const text = await GET().text();

    expect(text).toBe("");
  });
});
