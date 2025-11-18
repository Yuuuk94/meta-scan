const statusOptions = {
  online: {
    bgColor: "bg-green-400",
    color: "text-green-400",
    label: "ONLINE",
    fullLabel: "SYSTEM_ONLINE",
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
  const status = ready ? "online" : "online";

  const currentStatus = statusOptions[status!];
  return (
    <div className="flex items-center gap-2">
      <div
        className={`w-2 h-2 ${currentStatus.bgColor} rounded-full animate-pulse`}
      />
      <span className={`text-xs font-mono ${currentStatus.color}`}>
        {fullLabel ? currentStatus.fullLabel : currentStatus.label}
      </span>
    </div>
  );
};
