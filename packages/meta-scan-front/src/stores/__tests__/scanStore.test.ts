import { useScanStore, SCAN_RESULT_TTL_MS } from "@/stores/scanStore";

const rawFixture: RawScanResponses = {
  robotsTxt: { status: "ok", has: true },
  siteMap: { status: "ok", has: true },
  crawling: null,
  lighthouse: null,
};

const combinedFixture: CombinedScanResult = {
  title: "Example",
  topIssues: [],
  failedApis: ["crawling", "lighthouse"],
};

const entryFixture = {
  url: "https://example.com",
  raw: rawFixture,
  combined: combinedFixture,
};

beforeEach(() => {
  window.localStorage.clear();
  useScanStore.setState({ results: {} });
  jest.useRealTimers();
});

describe("useScanStore", () => {
  it("saveScanResult generates a fresh UUID id and stores {url, raw, combined, scannedAt}", () => {
    const before = Date.now();
    const id = useScanStore.getState().saveScanResult(entryFixture);
    const after = Date.now();

    expect(id).toMatch(
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/
    );

    const stored = useScanStore.getState().results[id];
    expect(stored.url).toBe(entryFixture.url);
    expect(stored.raw).toEqual(rawFixture);
    expect(stored.combined).toEqual(combinedFixture);
    expect(stored.scannedAt).toBeGreaterThanOrEqual(before);
    expect(stored.scannedAt).toBeLessThanOrEqual(after);
  });

  it("re-scanning the same URL produces a new id, leaving the previous entry untouched", () => {
    const firstId = useScanStore.getState().saveScanResult(entryFixture);
    const secondId = useScanStore.getState().saveScanResult({
      ...entryFixture,
      combined: { ...combinedFixture, title: "Example v2" },
    });

    expect(firstId).not.toBe(secondId);
    expect(useScanStore.getState().results[firstId].combined.title).toBe(
      "Example"
    );
    expect(useScanStore.getState().results[secondId].combined.title).toBe(
      "Example v2"
    );
  });

  it("getScanResult returns the entry when it hasn't expired", () => {
    const id = useScanStore.getState().saveScanResult(entryFixture);
    expect(useScanStore.getState().getScanResult(id)?.url).toBe(
      "https://example.com"
    );
  });

  it("getScanResult returns undefined once scannedAt is older than the 10-minute TTL", () => {
    jest.useFakeTimers().setSystemTime(0);
    const id = useScanStore.getState().saveScanResult(entryFixture);

    jest.setSystemTime(SCAN_RESULT_TTL_MS + 1);
    expect(useScanStore.getState().getScanResult(id)).toBeUndefined();

    jest.useRealTimers();
  });

  it("getScanResult returns undefined for an unknown id", () => {
    expect(useScanStore.getState().getScanResult("does-not-exist")).toBeUndefined();
  });
});
