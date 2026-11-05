import { getSiteSetting } from "@/utils/siteSetting";

const mockCookies = jest.fn();
const mockHeaders = jest.fn();
jest.mock("next/headers", () => ({
  cookies: () => mockCookies(),
  headers: () => mockHeaders(),
}));

const setup = (cookie: Record<string, string>, header: Record<string, string>) => {
  mockCookies.mockResolvedValue({
    get: (k: string) => (k in cookie ? { value: cookie[k] } : undefined),
  });
  mockHeaders.mockResolvedValue({ get: (k: string) => header[k] ?? null });
};

describe("getSiteSetting locale source (issue #64)", () => {
  it("uses the URL locale header over the lang cookie", async () => {
    setup({ lang: "ko" }, { "x-locale": "en" });
    expect((await getSiteSetting()).lang).toBe("en");
  });

  it("falls back to the cookie when there is no locale header (bare /)", async () => {
    setup({ lang: "en" }, {});
    expect((await getSiteSetting()).lang).toBe("en");
  });

  it("falls back to default when neither exists, and ignores invalid header", async () => {
    setup({}, { "x-locale": "fr" });
    expect((await getSiteSetting()).lang).toBe("ko");
  });
});
