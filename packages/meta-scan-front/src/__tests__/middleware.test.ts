/** @jest-environment node */
import { NextRequest } from "next/server";
import { middleware } from "@/middleware";

const run = (path: string, cookie?: string) =>
  middleware(
    new NextRequest(`http://localhost:3000${path}`, {
      headers: cookie ? { cookie } : {},
    }),
  );

// NextResponse.next({request:{headers}}) surfaces overridden request headers
// as `x-middleware-request-<name>` on the response.
const forwarded = (res: Response) => res.headers.get("x-middleware-request-x-locale");

describe("middleware locale forwarding (issue #64)", () => {
  it("forwards the URL locale even when the lang cookie says otherwise", () => {
    expect(forwarded(run("/en", "lang=ko"))).toBe("en");
    expect(forwarded(run("/ko/privacy", "lang=en"))).toBe("ko");
  });

  it("does not forward a locale for bare / (cookie decides there)", () => {
    expect(forwarded(run("/", "lang=en"))).toBeNull();
  });

  it("still redirects prefix-less paths using the cookie", () => {
    const res = run("/privacy", "lang=en");
    expect(res.status).toBe(307);
    expect(res.headers.get("location")).toBe("http://localhost:3000/en/privacy");
  });
});
