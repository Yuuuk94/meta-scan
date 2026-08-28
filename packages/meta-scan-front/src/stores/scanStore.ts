import { create } from "zustand";
import { persist } from "zustand/middleware";

// Replaces the previous dead `useBearStore` zustand boilerplate (front
// CLAUDE.md "상태관리 방식") with the actual domain store this product needs:
// scan results keyed by a random id (not URL — see spec-fixed.md §"라우팅/
// 스토어 구조 변경"), so re-scanning the same URL never overwrites a
// previously shared /scan/:id link.

/** 10 minutes — spec-fixed.md req #3. Filtered at read time (getScanResult)
 * and pruned at write time (saveScanResult) so expired entries don't sit
 * in localStorage indefinitely (each entry can carry a full Lighthouse
 * report body, so unbounded growth risks hitting the per-origin quota). */
export const SCAN_RESULT_TTL_MS = 10 * 60 * 1000;

interface ScanStoreState {
  results: Record<string, ScanResultEntry>;
  /** Stores a fresh entry under a new crypto.randomUUID() id and returns it. */
  saveScanResult: (entry: Omit<ScanResultEntry, "scannedAt">) => string;
  /** Returns the entry for `id`, or undefined if it doesn't exist or its
   * scannedAt is older than SCAN_RESULT_TTL_MS. */
  getScanResult: (id: string) => ScanResultEntry | undefined;
}

export const useScanStore = create<ScanStoreState>()(
  persist(
    (set, get) => ({
      results: {},
      saveScanResult: (entry) => {
        const id = crypto.randomUUID();
        const scannedAt = Date.now();
        set((state) => {
          const fresh = Object.fromEntries(
            Object.entries(state.results).filter(
              ([, v]) => scannedAt - v.scannedAt <= SCAN_RESULT_TTL_MS
            )
          );
          return {
            results: { ...fresh, [id]: { ...entry, scannedAt } },
          };
        });
        return id;
      },
      getScanResult: (id) => {
        const entry = get().results[id];
        if (!entry) return undefined;
        if (Date.now() - entry.scannedAt > SCAN_RESULT_TTL_MS) return undefined;
        return entry;
      },
    }),
    { name: "scan-results" }
  )
);
