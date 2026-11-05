import { getLocaleFromPath } from "@/services/getLocaleFromPath";

describe("getLocaleFromPath (issue #64)", () => {
  it.each([
    ["/en", "en"],
    ["/en/privacy", "en"],
    ["/ko/scan/abc", "ko"],
    ["/ko", "ko"],
  ])("%s -> %s", (p, l) => expect(getLocaleFromPath(p)).toBe(l));

  it.each(["/", "", "/english", "/privacy", "/xx/en"])(
    "%s -> null",
    (p) => expect(getLocaleFromPath(p)).toBeNull(),
  );
});
