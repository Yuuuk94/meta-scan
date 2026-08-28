// Per ADR-006 (docs/adr/index.html#adr-006): robots.txt is checked alone first; if it explicitly
// disallows every UA ("*"), the other three scans (siteMap/crawling/lighthouse) must not be
// called at all. If robots.txt doesn't exist (`has === false`), that's treated the same as an
// explicit allow (decision log #1 in the confirmed spec, issue #1) — most sites don't ship one.
export function shouldBlockScan(robotsTxtResult: RobotsTxtData): boolean {
  return robotsTxtResult.has === true && robotsTxtResult.allow?.["*"] === false;
}
