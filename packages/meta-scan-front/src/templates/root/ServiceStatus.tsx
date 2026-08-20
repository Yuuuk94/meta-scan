// Judgement colors reused verbatim (bg-success/warning/destructive), but this
// is server-health telemetry, not a checklist verdict — deliberately not the
// <StatusBadge> primitive, which is reserved for checks[] pass/warning/fail/info
// (design-system.md §8).
const statusOptions = {
  online: {
    dot: "bg-success",
    text: "text-success",
    label: "ONLINE",
    fullLabel: "SYSTEM ONLINE",
  },
  warn: {
    dot: "bg-warning",
    text: "text-warning",
    label: "WARNING",
    fullLabel: "SYSTEM WARNING",
  },
  off: {
    dot: "bg-destructive",
    text: "text-destructive",
    label: "OFFLINE",
    fullLabel: "SYSTEM OFFLINE",
  },
};

interface ServiceStatusProps {
  ready: boolean;
  fullLabel?: boolean;
}

export const ServiceStatus = ({
  ready,
  fullLabel = false,
}: ServiceStatusProps) => {
  const status = ready ? "online" : "warn";

  const currentStatus = statusOptions[status];
  return (
    <div className="flex items-center gap-2">
      <div className={`h-2 w-2 rounded-full ${currentStatus.dot}`} />
      {/* No monospace — design-system.md §3 reserves numeric weight for
       * Big Shoulders Display, not a terminal-style mono face. */}
      <span
        className={`text-xs font-bold tracking-[.04em] ${currentStatus.text}`}
      >
        {fullLabel ? currentStatus.fullLabel : currentStatus.label}
      </span>
    </div>
  );
};
