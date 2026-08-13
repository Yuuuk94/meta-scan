const statusOptions = {
  online: {
    dot: "bg-success",
    text: "text-success",
    label: "ONLINE",
    fullLabel: "SYSTEM_ONLINE",
  },
  warn: {
    dot: "bg-warning",
    text: "text-warning",
    label: "WARNING",
    fullLabel: "SYSTEM_WARNING",
  },
  off: {
    dot: "bg-destructive",
    text: "text-destructive",
    label: "OFFLINE",
    fullLabel: "SYSTEM_OFFLINE",
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
      <span className={`font-mono text-xs ${currentStatus.text}`}>
        {fullLabel ? currentStatus.fullLabel : currentStatus.label}
      </span>
    </div>
  );
};
