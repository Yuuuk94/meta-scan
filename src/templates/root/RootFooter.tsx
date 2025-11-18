import { ServiceStatus } from "./ServiceStatus";
import { Scan } from "lucide-react";

interface RootFooterProps extends DefautProps {
  ready: boolean;
}

export const RootFooter = ({ theme, ready }: RootFooterProps) => {
  return (
    <footer
      className={`border-t py-8 transition-all duration-300 ${
        theme === "dark"
          ? "bg-black/50 border-gray-800"
          : "bg-gray-50 border-gray-200"
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Scan
              className={`h-5 w-5 ${
                theme === "dark" ? "text-cyan-400" : "text-blue-600"
              }`}
            />
            <span
              className={`transition-colors duration-300 ${
                theme === "dark" ? "text-gray-400" : "text-gray-600"
              }`}
            >
              &copy; 2025 Meta-Scan. All rights reserved.
            </span>
          </div>
          <div className="flex items-center gap-4">
            <ServiceStatus fullLabel ready={ready} />
            <div
              className={`${
                theme === "dark" ? "text-gray-500" : "text-gray-400"
              } font-mono text-xs`}
            >
              v0.1.0 | UPTIME: 99.9% | SCANS: 247,891
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
