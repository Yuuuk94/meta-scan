import React from "react";

import { getAiSignalsDetailSuffix, getAiSignalsLabel } from "@/services/buildAiSignalsMessage";
import { buildBasicSeoMessage } from "@/services/buildBasicSeoMessage";
import { buildContentMessage } from "@/services/buildContentMessage";
import { buildI18nUxMessage } from "@/services/buildI18nUxMessage";
import { buildIndexingMessage } from "@/services/buildIndexingMessage";
import { buildPreviewsMessage } from "@/services/buildPreviewsMessage";
import { StatusBadge, statusLabel } from "@/ui/molecules/StatusBadge";

// Replaces the old "AI Preparedness Score" big-number Hero (ADR-005 scrapped
// the scoring engine) with topIssues — fail-first, backfilled with warning,
// capped at 3 (combineScanResults). Copy tone is "지금 고쳐야 할 것" ("what to
// fix now"), not "your score is low" (spec-fixed.md "Hero 교체").
interface ScanHeroProps extends DefaultPageProps {
  topIssues: TopIssue[];
}

// Dispatches to the right group's message builder — topIssues now pulls
// from all 6 checklist groups, not just basicSeo (2026-09-02, see
// combineScanResults.ts's buildTopIssues comment), so a single hardcoded
// buildBasicSeoMessage call is no longer correct for every row. AI Signals
// doesn't have its own "assembled sentence" builder like the others (its
// card renders label + muted detail text as two separate pieces, see
// AiSignalsCard) — joined here into one sentence to fit this row's
// single-line layout.
function buildTopIssueMessage(
  t: DefaultPageProps["t"],
  issue: TopIssue
): string {
  switch (issue.group) {
    case "indexing":
      return buildIndexingMessage(t, issue as unknown as IndexingCheckItem);
    case "previews":
      return buildPreviewsMessage(t, issue as unknown as PreviewsCheckItem);
    case "content":
      return buildContentMessage(t, issue as unknown as ContentCheckItem);
    case "i18nUx":
      return buildI18nUxMessage(t, issue as unknown as I18nUxCheckItem);
    case "aiSignals": {
      const label = getAiSignalsLabel(t, issue.id);
      const suffix = getAiSignalsDetailSuffix(
        t,
        issue as unknown as AiSignalsCheckItem
      );
      return suffix ? `${label} ${suffix}` : label;
    }
    case "basicSeo":
    default:
      return buildBasicSeoMessage(t, issue as unknown as BasicSeoCheckItem);
  }
}

export const ScanHero = ({ t, topIssues }: ScanHeroProps) => {
  return (
    <div className="border-[1.5px] border-foreground bg-card p-5 sm:p-7">
      <h2 className="font-display text-2xl font-extrabold text-foreground">
        {t.topIssuesTitle}
      </h2>

      {topIssues.length === 0 ? (
        // fail/warning 둘 다 없을 때는 겁주지 않는 긍정 문구로 대체
        // (spec-fixed.md req #8).
        <p className="mt-3 text-sm text-foreground-secondary">
          {t.topIssuesEmpty}
        </p>
      ) : (
        // This section's box+dark-rule pattern (gap-px + bg-foreground +
        // border-foreground, badge-first/left, items-center) is
        // deliberately different from <BasicSeoCard>/<IndexingCard>'s
        // hairline `.row` pattern — confirmed against ScanZine.dc.html
        // (the "지금 고쳐야 할 것" artboard uses this exact box treatment,
        // badge on the left), not a bug. Don't "fix" this to match the
        // checklist cards.
        <div className="mt-4 flex flex-col gap-px border-[1.5px] border-foreground bg-foreground">
          {topIssues.map((issue) => (
            <div
              key={issue.id}
              className={`flex items-center gap-4 px-5 py-3.5 ${
                issue.status === "fail" ? "bg-fail-tint" : "bg-warning-tint"
              }`}
            >
              <StatusBadge status={issue.status}>
                {statusLabel(issue.status)}
              </StatusBadge>
              {/* Sentence assembled here (render time), not stored as text
               * on TopIssue — issue #3 basic-seo-checklist req #3.
               * Dispatches by `issue.group` (buildTopIssueMessage above) —
               * topIssues now pulls from all 6 checklist groups, not just
               * basicSeo (2026-09-02). */}
              <span className="text-sm font-medium text-foreground">
                {buildTopIssueMessage(t, issue)}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
