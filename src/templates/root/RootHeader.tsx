import { pageTitle } from "@/app/constans";
import { ServiceStatus } from "../../components/ServiceStatus";
import { Button } from "@/components/button";
import { useState } from "react";
import {
  Search,
  Globe,
  Zap,
  Target,
  BarChart3,
  CheckCircle,
  Scan,
  Terminal,
  Code,
  Sun,
  Moon,
  Languages,
} from "lucide-react";

export const RootHeader = () => {
  const theme = "dark";
  const language = "ko";

  // const [language, setLanguage] = useState<"ko" | "en">("ko");
  // const [theme, setTheme] = useState<"dark" | "light">("dark");
  return (
    <header className="border-b border-cyan-500/20 bg-black/80 backdrop-blur-md relative z-10">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-cyan-500/10 border border-cyan-500/30 rounded-lg">
            <Terminal className="h-6 w-6 text-cyan-400" />
          </div>
          <p className="text-xl font-mono text-cyan-400">{pageTitle}</p>
          <div className="flex items-center gap-4">
            <div className="ml-auto flex items-center gap-2">
              <ServiceStatus />
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                // onClick={() => setLanguage(language === "ko" ? "en" : "ko")}
                className={`font-mono ${
                  theme === "dark"
                    ? "text-cyan-400 hover:bg-cyan-500/10"
                    : "text-blue-600 hover:bg-blue-100"
                }`}
              >
                <Languages className="h-4 w-4 mr-1" />
                {language.toUpperCase()}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                // onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className={`${
                  theme === "dark"
                    ? "text-cyan-400 hover:bg-cyan-500/10"
                    : "text-blue-600 hover:bg-blue-100"
                }`}
              >
                {theme === "dark" ? (
                  <Sun className="h-4 w-4" />
                ) : (
                  <Moon className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
