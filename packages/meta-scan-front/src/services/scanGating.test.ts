import { shouldBlockScan } from "@/services/scanGating";

describe("shouldBlockScan", () => {
  it("robots.txt가 존재하고 모든 UA를 명시적으로 비허용하면 차단한다", () => {
    const result: RobotsTxtData = {
      status: "ok",
      has: true,
      allow: { "*": false },
    };

    expect(shouldBlockScan(result)).toBe(true);
  });

  it("robots.txt가 존재하고 모든 UA를 허용하면 차단하지 않는다", () => {
    const result: RobotsTxtData = {
      status: "ok",
      has: true,
      allow: { "*": true },
    };

    expect(shouldBlockScan(result)).toBe(false);
  });

  // ADR-006 decision log #1: no robots.txt at all is treated the same as an
  // explicit allow — most sites don't ship one.
  it("robots.txt가 존재하지 않으면 allow 값과 무관하게 차단하지 않는다", () => {
    const result: RobotsTxtData = {
      status: "ok",
      has: false,
      allow: { "*": false },
    };

    expect(shouldBlockScan(result)).toBe(false);
  });

  it("has는 true인데 allow가 없으면 차단하지 않는다", () => {
    const result: RobotsTxtData = {
      status: "ok",
      has: true,
    };

    expect(shouldBlockScan(result)).toBe(false);
  });
});
