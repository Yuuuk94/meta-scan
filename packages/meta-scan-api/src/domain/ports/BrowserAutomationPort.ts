import type puppeteer from "puppeteer";

// NOTE(ADR-011, docs/case-study/backend-hexagonal-architecture.md): this is a pragmatic port, not
// a fully pure one — `PuppeteerProcess` is still `puppeteer.Browser` (a concrete library type),
// because `ScanService` uses the full Puppeteer page API (newPage/goto/evaluate/...) well beyond
// just launch/close. Abstracting that entire surface is a bigger redesign than this migration
// pass covers ("순수 이동" scope — see the decision doc's "아직 안 정한 것" section). What this
// port does buy: `ScanService` depends on this interface, not on the concrete `PuppeteerAdapter`
// class, so a test double only needs to satisfy these 2 methods.
export type PuppeteerProcess = puppeteer.Browser;

export interface BrowserAutomationPort {
  launch(): Promise<PuppeteerProcess>;
  close(proc?: PuppeteerProcess): Promise<void>;
}
