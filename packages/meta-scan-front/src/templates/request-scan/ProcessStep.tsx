interface ProcessStepProps extends DefaultProps {
  txt: string;
  isCompleted: boolean;
  isActive: boolean;
}

// Square tile in the step grid (RequestScanProcessZine wireframe) — a
// checkmark/dots/dash glyph instead of an icon library, per
// design-system.md §7 ("이모지를 아이콘으로 사용 금지... 없으면 텍스트/숫자
// 라벨로 대체"). Replaces the old rounded pill + lucide-icon row.
export const ProcessStep = ({ txt, isCompleted, isActive, lang }: ProcessStepProps) => {
  const state = isActive ? "active" : isCompleted ? "done" : "idle";

  const glyph = { active: "···", done: "✓", idle: "–" }[state];

  const glyphClass = {
    active: "border-2 border-accent text-accent",
    done: "bg-success text-success-foreground",
    idle: "border-2 border-muted-foreground text-muted-foreground",
  }[state];

  const statusText = {
    active: lang === "ko" ? "진행 중" : "In progress",
    done: lang === "ko" ? "완료" : "Done",
    idle: lang === "ko" ? "대기" : "Waiting",
  }[state];

  const statusClass = {
    active: "font-bold text-accent",
    done: "text-muted-foreground",
    idle: "text-muted-foreground",
  }[state];

  return (
    // Mobile row is horizontal (glyph left, label flex:1, status right); desktop
    // tile is vertical (glyph on top, label, status stacked) — the mobile artboard
    // is purely a 4-col-grid -> 4-stacked-rows change with this internal reshuffle,
    // no column-count-only collapse (zine-index intake §3.2).
    <div
      className={`flex items-center gap-3 bg-card px-5 py-4 sm:flex-col sm:items-center sm:gap-2.5 sm:p-6 ${
        state === "idle" ? "opacity-45" : ""
      }`}
    >
      <div
        className={`flex h-6 w-6 shrink-0 items-center justify-center text-xs font-extrabold sm:h-8 sm:w-8 sm:text-sm ${glyphClass}`}
      >
        {glyph}
      </div>
      <span className="flex-1 text-left text-[13px] font-bold text-foreground sm:flex-none sm:text-center">
        {txt}
      </span>
      <span className={`text-[11px] ${statusClass}`}>{statusText}</span>
    </div>
  );
};
