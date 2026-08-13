import { Loader2, LucideProps } from "lucide-react";

interface ProcessStep extends DefaultProps {
  txt: string;
  isCompleted: boolean;
  isActive: boolean;
  IconComponent: React.ForwardRefExoticComponent<
    Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>
  >;
}
export const ProcessStep = ({
  lang,
  txt,
  isCompleted,
  isActive,
  IconComponent,
}: ProcessStep) => {
  const state = isActive ? "active" : isCompleted ? "done" : "idle";

  const rowClass = {
    active: "border-primary/30 bg-primary/5",
    done: "border-success/30 bg-success/5",
    idle: "border-border bg-muted/30",
  }[state];

  const badgeClass = {
    active: "border border-primary/40 bg-primary/10 text-primary",
    done: "border border-success/40 bg-success/10 text-success",
    idle: "border border-border bg-muted text-muted-foreground",
  }[state];

  const textClass = {
    active: "text-primary",
    done: "text-success",
    idle: "text-muted-foreground",
  }[state];

  return (
    <div className={`flex items-center gap-4 rounded-xl border p-4 ${rowClass}`}>
      <div
        className={`flex h-12 w-12 items-center justify-center rounded-full ${badgeClass}`}
      >
        {isActive ? (
          <Loader2 className="h-6 w-6 animate-spin" />
        ) : (
          <IconComponent className="h-6 w-6" />
        )}
      </div>

      <span className={`font-medium ${textClass}`}>
        {txt}
        {lang === "ko"
          ? isActive
            ? " 중..."
            : isCompleted
            ? " 완료"
            : " 실패"
          : isActive
          ? "..."
          : isCompleted
          ? " complete"
          : " failed"}
      </span>
    </div>
  );
};
