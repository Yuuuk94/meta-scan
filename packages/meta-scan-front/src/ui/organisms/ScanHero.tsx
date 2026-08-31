import React from "react";

import { buildBasicSeoMessage } from "@/services/buildBasicSeoMessage";
import { StatusBadge } from "@/ui/molecules/StatusBadge";

// Replaces the old "AI Preparedness Score" big-number Hero (ADR-005 scrapped
// the scoring engine) with topIssues — fail-first, backfilled with warning,
// capped at 3 (combineScanResults). Copy tone is "지금 고쳐야 할 것" ("what to
// fix now"), not "your score is low" (spec-fixed.md "Hero 교체").
interface ScanHeroProps extends DefaultPageProps {
  topIssues: TopIssue[];
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
                {issue.status.toUpperCase()}
              </StatusBadge>
              {/* Sentence assembled here (render time), not stored as text
               * on TopIssue — issue #3 basic-seo-checklist req #3. Every
               * topIssue is currently sourced from checks.basicSeo (the
               * only checklist group wired up so far); once other groups
               * (indexing/content-stats/previews) land, this'll need to
               * dispatch by id namespace instead of assuming basicSeo. */}
              <span className="text-sm font-medium text-foreground">
                {buildBasicSeoMessage(t, issue)}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
