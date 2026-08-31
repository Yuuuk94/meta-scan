import { DESC_MAX, DESC_MIN, TITLE_MAX, TITLE_MIN } from "@/constant/meta.js";

// NOTE: this duplicates ScanService's private `norm` helper rather than importing it — domain/
// shouldn't depend on application/ (ADR-011 layering), and it's a two-line pure string helper, not
// worth a shared-util detour for. Mirrors the "known, tolerated impurities" already documented in
// packages/meta-scan-api/CLAUDE.md for this migration.
function norm(s?: string | null): string {
  return (s ?? "").trim().replace(/\s+/g, " ");
}

/**
 * Pure judgement logic for the "기본 SEO" checklist card (issue #3 basic-seo-checklist). Always
 * returns exactly 5 rows regardless of pass/fail state (front renders 5 <StatusBadge> slots), so
 * callers don't need to special-case "item omitted because it passed" the way the legacy
 * ScanService.runChecks push-only-on-problem approach did.
 */
export function buildBasicSeoChecks(ext: BasicSeoExtractInput): BasicSeoCheckItem[] {
  const checks: BasicSeoCheckItem[] = [];

  const title = norm(ext.title);
  if (!title) {
    checks.push({ id: "title.missing", status: "fail" });
  } else if (title.length < TITLE_MIN || title.length > TITLE_MAX) {
    checks.push({ id: "title.length", status: "warning", detail: title.length });
  } else {
    checks.push({ id: "title.length", status: "pass", detail: title.length });
  }

  const description = norm(ext.description);
  if (!description) {
    checks.push({ id: "desc.missing", status: "warning" });
  } else if (description.length < DESC_MIN || description.length > DESC_MAX) {
    checks.push({
      id: "desc.length",
      status: "warning",
      detail: description.length,
    });
  } else {
    checks.push({ id: "desc.length", status: "pass", detail: description.length });
  }

  // Empty content ("") is treated the same as "no keywords meta at all" — a tag with no
  // substance isn't worth flagging (spec decision log #5). ScanService's extraction already
  // folds both cases into a falsy `keywords`, so no extra check needed here.
  checks.push({
    id: "keywords.deprecated",
    status: ext.keywords ? "info" : "pass",
  });

  // Counts both `alt` missing entirely and `alt=""` as missing (spec decision log #4) — that
  // distinction is made upstream during extraction, not here.
  checks.push({
    id: "img.altMissing",
    status: ext.images.altMissing > 0 ? "warning" : "pass",
    detail: ext.images.altMissing,
  });

  const duplicateCount =
    ext.duplicates.metaName.length + ext.duplicates.metaProperty.length;
  checks.push({
    id: "meta.duplicate",
    status: duplicateCount > 0 ? "info" : "pass",
    detail: duplicateCount,
  });

  return checks;
}
