import { generateMetadata } from "../page";

// issue #82 — /scan/:id is a client-only result shell with no content of its
// own; it must stay out of the index like /scan (AdSense thin-page review).
describe("/scan/:id metadata", () => {
  it("is noindex, follow", async () => {
    const meta = await generateMetadata({ params: Promise.resolve({ lang: "ko", id: "abc" }) });
    expect(meta.robots).toEqual({ index: false, follow: true });
  });
});
