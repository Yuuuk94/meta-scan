import { shouldBlockScan } from "@/services/scanGating";

describe("shouldBlockScan", () => {
  it("blocks when robots.txt exists and explicitly disallows all UAs", () => {
    const result: RobotsTxtData = {
      status: "ok",
      has: true,
      allow: { "*": false },
    };

    expect(shouldBlockScan(result)).toBe(true);
  });

  it("does not block when robots.txt exists and allows all UAs", () => {
    const result: RobotsTxtData = {
      status: "ok",
      has: true,
      allow: { "*": true },
    };

    expect(shouldBlockScan(result)).toBe(false);
  });

  // ADR-006 decision log #1: no robots.txt at all is treated the same as an
  // explicit allow — most sites don't ship one.
  it("does not block when robots.txt does not exist, regardless of allow", () => {
    const result: RobotsTxtData = {
      status: "ok",
      has: false,
      allow: { "*": false },
    };

    expect(shouldBlockScan(result)).toBe(false);
  });

  it("does not block when has is true but allow is missing", () => {
    const result: RobotsTxtData = {
      status: "ok",
      has: true,
    };

    expect(shouldBlockScan(result)).toBe(false);
  });
});
