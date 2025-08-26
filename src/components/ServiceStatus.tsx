const statusOptions = {
  online: {
    bgColor: "bg-green-400",
    color: "text-green-400",
    label: "ONLINE",
    fullLabel: "SYSTEM_ONLINE",
  },
};

interface ServiceStatusProps {
  status?: "online";
  fullLabel?: boolean;
}

export const ServiceStatus = ({
  status = "online",
  fullLabel = false,
}: ServiceStatusProps) => {
  // TODO: status 가져오기

  const currentStatus = statusOptions[status];
  return (
    <>
      <div
        className={`w-2 h-2 ${currentStatus.bgColor} rounded-full animate-pulse`}
      />
      <span className={`text-xs font-mono ${currentStatus.color}`}>
        {fullLabel ? currentStatus.fullLabel : currentStatus.label}
      </span>
    </>
  );
};
