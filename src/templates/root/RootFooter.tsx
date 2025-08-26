import { pageTitle } from "@/app/constans";
import { ServiceStatus } from "../../components/ServiceStatus";

export const RootFooter = () => {
  // TODO: 버전, 업타임, 스캔수 카운팅 로직 필요
  return (
    <footer className="border-t border-cyan-500/20 bg-black/80 backdrop-blur-md py-6 relative z-10">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <ServiceStatus fullLabel />
            </div>
            {/* <div className="text-gray-500 font-mono text-xs">
              v0.1.0 | UPTIME: 99.9% | SCANS: 247,891
            </div> */}
          </div>
          <div className="text-gray-500 font-mono text-xs">
            &copy; 2025 {pageTitle} | ALL_RIGHTS_RESERVED
          </div>
        </div>
      </div>
    </footer>
  );
};
