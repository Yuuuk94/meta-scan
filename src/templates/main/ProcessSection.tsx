import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Globe, Search, Zap } from "lucide-react";

interface ProcessSectionProps extends DefautPageProps {}

export const ProcessSection = ({ theme, lang, t }: ProcessSectionProps) => {
  return (
    <section
      className={`relative py-20 transition-all duration-300 overflow-hidden ${
        theme === "dark"
          ? "bg-gradient-to-br from-gray-900 via-black to-purple-900/50"
          : "bg-gradient-to-br from-white via-blue-50/30 to-purple-50/50"
      }`}
    >
      {/* Background Effects */}
      {theme === "dark" && (
        <>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_40%,rgba(120,119,198,0.1),transparent_50%)]"></div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_60%,rgba(6,182,212,0.1),transparent_50%)]"></div>
          <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-cyan-400/50 to-transparent"></div>
        </>
      )}

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            {/* Enhanced Title with Cyberpunk Effects */}
            <div className="relative mb-8">
              {theme === "dark" && (
                <>
                  <div className="absolute inset-0 blur-2xl bg-gradient-to-r from-cyan-500/30 via-purple-500/30 to-pink-500/30 animate-pulse"></div>
                  <div className="absolute -top-2 -left-2 w-6 h-6 border-l-2 border-t-2 border-cyan-400/50"></div>
                  <div className="absolute -top-2 -right-2 w-6 h-6 border-r-2 border-t-2 border-purple-400/50"></div>
                  <div className="absolute -bottom-2 -left-2 w-6 h-6 border-l-2 border-b-2 border-purple-400/50"></div>
                  <div className="absolute -bottom-2 -right-2 w-6 h-6 border-r-2 border-b-2 border-pink-400/50"></div>
                </>
              )}

              <h2
                className={`relative text-5xl md:text-6xl font-black mb-4 transition-all duration-500 ${
                  theme === "dark"
                    ? "text-cyan-300 drop-shadow-[0_0_30px_rgba(6,182,212,0.5)]"
                    : "text-gray-900"
                }`}
              >
                <span
                  className={`relative ${
                    theme === "dark"
                      ? "bg-gradient-to-r from-cyan-300 via-purple-300 to-pink-300 bg-clip-text text-transparent"
                      : "bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-800 bg-clip-text text-transparent"
                  }`}
                >
                  {t.howItWorksTitle}
                </span>
                {theme === "dark" && (
                  <span className="absolute inset-0 bg-gradient-to-r from-cyan-300 via-purple-300 to-pink-300 bg-clip-text text-transparent animate-pulse opacity-30 pointer-events-none">
                    {t.howItWorksTitle}
                  </span>
                )}
              </h2>

              {/* Animated Underline */}
              <div className="relative mx-auto w-48 h-2">
                <div
                  className={`absolute inset-0 rounded-full transition-all duration-300 ${
                    theme === "dark"
                      ? "bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400"
                      : "bg-gradient-to-r from-blue-500 via-purple-600 to-indigo-700"
                  }`}
                ></div>
                {theme === "dark" && (
                  <>
                    <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 rounded-full blur-md opacity-50 animate-pulse"></div>
                    <div className="absolute -left-1 -right-1 -top-1 -bottom-1 bg-gradient-to-r from-cyan-400/20 via-purple-400/20 to-pink-400/20 rounded-full blur-lg animate-pulse"></div>
                  </>
                )}
              </div>
            </div>

            {/* Subtext */}
            <p
              className={`text-lg md:text-xl max-w-2xl mx-auto transition-colors duration-300 ${
                theme === "dark"
                  ? "text-gray-300 drop-shadow-[0_0_10px_rgba(6,182,212,0.3)]"
                  : "text-gray-600"
              }`}
            >
              {lang === "en"
                ? "Discover how our AI-powered analysis transforms your website's SEO potential"
                : "AI 기반 분석으로 웹사이트의 SEO 잠재력을 발견하는 방법"}
            </p>
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
