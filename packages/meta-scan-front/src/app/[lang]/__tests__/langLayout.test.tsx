import LangLayout from "@/app/[lang]/layout";

jest.mock("next/navigation", () => ({
  notFound: () => {
    throw new Error("NEXT_NOT_FOUND");
  },
}));

// issue #76 — any unknown first segment (e.g. /llms.txt before it had a
// route, /foo.txt) used to render the home page with 200 (soft 404).
describe("[lang] layout", () => {
  it("404s on an unsupported locale segment", async () => {
    await expect(
      LangLayout({ children: null, params: Promise.resolve({ lang: "llms.txt" }) }),
    ).rejects.toThrow("NEXT_NOT_FOUND");
  });

  it("renders children for a supported locale", async () => {
    const out = await LangLayout({ children: "x", params: Promise.resolve({ lang: "ko" }) });
    expect(out).toBeTruthy();
  });
});
