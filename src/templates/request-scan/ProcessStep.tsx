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
  theme,
  lang,
  txt,
  isCompleted,
  isActive,
  IconComponent,
}: ProcessStep) => {
  return (
    <div
      className={`flex items-center gap-4 p-4 rounded-xl   border ${
        theme === "dark"
          ? isActive
            ? "bg-cyan-500/10 border-cyan-400/30 shadow-lg shadow-cyan-500/10"
            : isCompleted
            ? "bg-green-500/10 border-green-400/30"
            : "bg-gray-800/30 border-gray-700/30"
          : isActive
          ? "bg-blue-50 border-blue-200"
          : isCompleted
          ? "bg-green-50 border-green-200"
          : "bg-gray-50 border-gray-200"
      }`}
    >
      <div
        className={`w-12 h-12 rounded-full flex items-center justify-center   relative ${
          theme === "dark"
            ? isActive
              ? "bg-cyan-500/20 text-cyan-400 border border-cyan-400/40"
              : isCompleted
              ? "bg-green-500/20 text-green-400 border border-green-400/40"
              : "bg-gray-700/50 text-gray-500 border border-gray-600/40"
            : isActive
            ? "bg-blue-500 text-white"
            : isCompleted
            ? "bg-green-500 text-white"
            : "bg-gray-300 text-gray-600"
        }`}
      >
        {theme === "dark" && isActive && (
          <div className="absolute inset-0 bg-cyan-400/20 rounded-full blur "></div>
        )}
        {isActive ? (
          <Loader2 className="h-6 w-6 animate-spin relative z-10" />
        ) : (
          <IconComponent className="h-6 w-6 relative z-10" />
        )}
      </div>

      <span
        className={`font-medium   ${
          theme === "dark"
            ? isActive
              ? "text-cyan-300"
              : isCompleted
              ? "text-green-400"
              : "text-gray-400"
            : isActive
            ? "text-blue-700"
            : isCompleted
            ? "text-green-700"
            : "text-gray-500"
        }`}
      >
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
          ? " complite"
          : " failed"}
      </span>
    </div>
  );
};
