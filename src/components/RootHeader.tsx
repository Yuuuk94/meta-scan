import { pageTitle } from "@/app/constans";
import { Terminal } from "lucide-react";
import { ServiceStatus } from "./ServiceStatus";

export const RootHeader = () => {
  return (
    <header className="border-b border-cyan-500/20 bg-black/80 backdrop-blur-md relative z-10">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-cyan-500/10 border border-cyan-500/30 rounded-lg">
            <Terminal className="h-6 w-6 text-cyan-400" />
          </div>
          <h1 className="text-xl font-mono text-cyan-400">{pageTitle}</h1>
          <div className="ml-auto flex items-center gap-2">
            <ServiceStatus />
          </div>
        </div>
      </div>
    </header>
  );
};
