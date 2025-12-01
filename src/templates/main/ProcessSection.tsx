import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Globe, Search, Zap } from "lucide-react";

export const ProcessSection = ({ theme, t }: DefaultPageProps) => {
  return (
    <section
      className={`relative pt-20 pb-40 transition-all duration-300 overflow-hidden`}
    >
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2
              className={`text-4xl font-bold mb-6 transition-colors duration-300 ${
                theme === "dark"
                  ? "text-transparent bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text"
                  : "text-gray-900"
              }`}
            >
              {t.howItWorksTitle}
            </h2>
            <div className="relative mx-auto w-32 h-1.5">
              <div
                className={`absolute inset-0 rounded-full transition-all duration-300 ${
                  theme === "dark"
                    ? "bg-gradient-to-r from-purple-400 via-cyan-400 to-pink-400"
                    : "bg-gradient-to-r from-purple-500 via-blue-500 to-indigo-600"
                }`}
              ></div>
              {theme === "dark" && (
                <div className="absolute inset-0 bg-gradient-to-r from-purple-400 via-cyan-400 to-pink-400 rounded-full blur-sm opacity-50 animate-pulse"></div>
              )}
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <Card
              className={`relative group transition-all duration-500 border overflow-hidden ${
                theme === "dark"
                  ? "bg-gradient-to-br from-gray-900/80 to-black/60 border-cyan-500/20 hover:border-cyan-400/40 backdrop-blur-md hover:shadow-2xl hover:shadow-cyan-500/20"
                  : "bg-gradient-to-br from-blue-50 to-white border-0 hover:shadow-xl"
              }`}
            >
              {theme === "dark" && (
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              )}
              <CardHeader className="text-center pb-4 relative z-10">
                <div
                  className={`mx-auto mb-4 w-18 h-18 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-all duration-300 relative ${
                    theme === "dark"
                      ? "bg-gradient-to-r from-cyan-500/20 to-cyan-600/20 border border-cyan-400/30"
                      : "bg-gradient-to-r from-blue-500 to-blue-600"
                  }`}
                >
                  {theme === "dark" && (
                    <div className="absolute inset-0 bg-cyan-400/10 rounded-2xl blur animate-pulse"></div>
                  )}
                  <Globe
                    className={`h-8 w-8 relative z-10 ${
                      theme === "dark" ? "text-cyan-400" : "text-white"
                    }`}
                  />
                </div>

                <CardTitle
                  className={`transition-colors duration-300 ${
                    theme === "dark" ? "text-cyan-300" : "text-blue-700"
                  }`}
                >
                  {t.step1Title}
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center relative z-10">
                <p
                  className={`transition-colors duration-300 ${
                    theme === "dark" ? "text-gray-300" : "text-gray-600"
                  }`}
                >
                  {t.step1Desc}
                </p>
              </CardContent>
            </Card>

            {/* Step 2 */}
            <Card
              className={`relative group transition-all duration-500 border overflow-hidden ${
                theme === "dark"
                  ? "bg-gradient-to-br from-gray-900/80 to-black/60 border-purple-500/20 hover:border-purple-400/40 backdrop-blur-md hover:shadow-2xl hover:shadow-purple-500/20"
                  : "bg-gradient-to-br from-purple-50 to-white border-0 hover:shadow-xl"
              }`}
            >
              {theme === "dark" && (
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              )}
              <CardHeader className="text-center pb-4 relative z-10">
                <div
                  className={`mx-auto mb-4 w-18 h-18 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-all duration-300 relative ${
                    theme === "dark"
                      ? "bg-gradient-to-r from-purple-500/20 to-purple-600/20 border border-purple-400/30"
                      : "bg-gradient-to-r from-purple-500 to-purple-600"
                  }`}
                >
                  {theme === "dark" && (
                    <div className="absolute inset-0 bg-purple-400/10 rounded-2xl blur animate-pulse"></div>
                  )}
                  <Zap
                    className={`h-8 w-8 relative z-10 ${
                      theme === "dark" ? "text-purple-400" : "text-white"
                    }`}
                  />
                </div>

                <CardTitle
                  className={`transition-colors duration-300 ${
                    theme === "dark" ? "text-purple-300" : "text-purple-700"
                  }`}
                >
                  {t.step2Title}
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center relative z-10">
                <p
                  className={`transition-colors duration-300 ${
                    theme === "dark" ? "text-gray-300" : "text-gray-600"
                  }`}
                >
                  {t.step2Desc}
                </p>
              </CardContent>
            </Card>

            {/* Step 3 */}
            <Card
              className={`relative group transition-all duration-500 border overflow-hidden ${
                theme === "dark"
                  ? "bg-gradient-to-br from-gray-900/80 to-black/60 border-pink-500/20 hover:border-pink-400/40 backdrop-blur-md hover:shadow-2xl hover:shadow-pink-500/20"
                  : "bg-gradient-to-br from-green-50 to-white border-0 hover:shadow-xl"
              }`}
            >
              {theme === "dark" && (
                <div className="absolute inset-0 bg-gradient-to-br from-pink-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              )}
              <CardHeader className="text-center pb-4 relative z-10">
                <div
                  className={`mx-auto mb-4 w-18 h-18 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-all duration-300 relative ${
                    theme === "dark"
                      ? "bg-gradient-to-r from-pink-500/20 to-pink-600/20 border border-pink-400/30"
                      : "bg-gradient-to-r from-green-500 to-green-600"
                  }`}
                >
                  {theme === "dark" && (
                    <div className="absolute inset-0 bg-pink-400/10 rounded-2xl blur animate-pulse"></div>
                  )}
                  <Search
                    className={`h-8 w-8 relative z-10 ${
                      theme === "dark" ? "text-pink-400" : "text-white"
                    }`}
                  />
                </div>

                <CardTitle
                  className={`transition-colors duration-300 ${
                    theme === "dark" ? "text-pink-300" : "text-green-700"
                  }`}
                >
                  {t.step3Title}
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center relative z-10">
                <p
                  className={`transition-colors duration-300 ${
                    theme === "dark" ? "text-gray-300" : "text-gray-600"
                  }`}
                >
                  {t.step3Desc}
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};
