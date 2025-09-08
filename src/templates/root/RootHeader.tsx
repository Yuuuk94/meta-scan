import { getDictionary } from "@/dictionaries";
import { Scan } from "lucide-react";
import { ToggleSetting } from "./ToggleSetting";
import { ServiceStatus } from "@/components/ServiceStatus";

interface RootHeaderProps extends DefautProps {}

export const RootHeader = async ({ theme, lang }: RootHeaderProps) => {
  const t = (await getDictionary(lang)).head;

  return (
    <header
      className={`border-b sticky top-0 z-50 backdrop-blur-md transition-all duration-300 ${
        theme === "dark"
          ? "bg-black/50 border-cyan-500/20"
          : "bg-white/80 border-gray-200"
      }`}
    >
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Cyberpunk Logo */}
            <div
              className={`relative p-3 rounded-xl transition-all duration-300 ${
                theme === "dark"
                  ? "bg-gradient-to-r from-cyan-500/20 to-purple-500/20 border border-cyan-400/30"
                  : "bg-gradient-to-r from-blue-500 to-purple-600"
              }`}
            >
              {theme === "dark" && (
                <div className="absolute inset-0 bg-cyan-400/10 rounded-xl blur animate-pulse"></div>
              )}
              <Scan
                className={`h-6 w-6 relative z-10 ${
                  theme === "dark" ? "text-cyan-400" : "text-white"
                }`}
              />
            </div>
            <div>
              <p
                className={`text-xl font-bold transition-colors duration-300 ${
                  theme === "dark"
                    ? "text-transparent bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text"
                    : "text-gray-900"
                }`}
              >
                {t.title}
              </p>
              <p
                className={`text-sm transition-colors duration-300 font-mono ${
                  theme === "dark" ? "text-gray-400" : "text-gray-600"
                }`}
              >
                {t.subtitle}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <ToggleSetting theme={theme} lang={lang} />
            <ServiceStatus />
          </div>
        </div>
      </div>
    </header>
  );
};
