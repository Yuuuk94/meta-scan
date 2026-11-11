import { parseInline } from "@/services/parseInline";

// issue #76 — blog text supports `code` and [text](url) inline only.
describe("parseInline", () => {
  it("returns plain text as one token", () => {
    expect(parseInline("hello")).toEqual([{ type: "text", value: "hello" }]);
  });

  it("splits code spans and links", () => {
    expect(parseInline("see `robots.txt` and [Google](https://g.co) now")).toEqual([
      { type: "text", value: "see " },
      { type: "code", value: "robots.txt" },
      { type: "text", value: " and " },
      { type: "link", value: "Google", href: "https://g.co" },
      { type: "text", value: " now" },
    ]);
  });
});
