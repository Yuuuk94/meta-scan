"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Globe, Bot, AlertCircle, Scan } from "lucide-react";
import { crrUrlKey, urlPattern } from "@/constans";
import { setDocumentCookies } from "@/utils/cookies";

export const HeroSection = ({ theme, lang, t }: DefaultPageProps) => {
  const router = useRouter();
  const [url, setUrl] = useState("");
  const [isValidUrl, setIsValidUrl] = useState(true);

  // URL validation
  useEffect(() => {
    if (!isValidUrl) {
      setIsValidUrl(url.length > 1 && urlPattern.test(url));
    }
  }, [url, isValidUrl]);

  const handleAnalyze = () => {
    const checkUrl = url.length > 1 && urlPattern.test(url);

    if (!checkUrl) {
      setIsValidUrl(checkUrl);
      return;
    }
    setDocumentCookies(crrUrlKey, encodeURI(url));
    router.push("/request-scan");
  };
  return (
    <section className="container mx-auto px-4 py-20">
      <div className="max-w-4xl mx-auto text-center">
        <Badge
          className={`mb-6 border   ${
            theme === "dark"
              ? "bg-gradient-to-r from-cyan-500/20 to-purple-500/20 text-cyan-300 border-cyan-400/30"
              : "bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700 border-blue-200"
          }`}
        >
          <Bot className="h-4 w-4 mr-2" />
          {theme === "dark" ? (
            <span className="text-transparent bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text">
              AIO・AEO・GEO・SEO Analysis
            </span>
          ) : (
            "AIO・AEO・GEO・SEO Analysis"
          )}
        </Badge>

        <h1
          className={`text-6xl font-bold mb-6   ${
            theme === "dark"
              ? "text-transparent bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text"
              : "text-transparent bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 bg-clip-text"
          }`}
        >
          {t.heroTitle}
        </h1>

        <p
          className={`text-xl mb-16 max-w-2xl mx-auto   ${
            theme === "dark" ? "text-gray-300" : "text-gray-600"
          }`}
        >
          {t.heroSubtitle}
        </p>

        {/* Enhanced URL Input Section */}
        <div className="max-w-3xl mx-auto mb-20">
          <div className="relative group">
            {/* Multiple glow layers for cyberpunk effect */}
            {theme === "dark" && (
              <>
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/30 via-purple-500/30 to-pink-500/30 rounded-3xl blur-2xl group-hover:blur-3xl   "></div>
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/20 via-purple-400/20 to-pink-400/20 rounded-3xl blur-xl group-hover:blur-2xl  "></div>
              </>
            )}
            <div
              className={`relative rounded-3xl p-3 border-2   ${
                theme === "dark"
                  ? "bg-black/40 backdrop-blur-md border-cyan-500/30 group-hover:border-cyan-400/50 shadow-2xl shadow-cyan-500/10"
                  : "bg-white border-gray-200 group-hover:border-blue-300 shadow-lg"
              }`}
            >
              <div className="flex items-center gap-4">
                <div
                  className={`flex items-center gap-3 flex-1 p-4 rounded-2xl   ${
                    theme === "dark"
                      ? "bg-gray-900/50 border border-gray-700/50"
                      : "bg-gray-50 border border-gray-200"
                  }`}
                >
                  <Globe
                    className={`h-5 w-5 ${
                      theme === "dark" ? "text-cyan-400" : "text-gray-500"
                    }`}
                  />
                  <Input
                    type="url"
                    placeholder={t.urlPlaceholder as string}
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    className={`flex-1 border-0 bg-transparent text-lg placeholder:opacity-60 focus-visible:ring-0 focus-visible:ring-offset-0   ${
                      theme === "dark"
                        ? "text-white placeholder:text-gray-400"
                        : "text-gray-900 placeholder:text-gray-500"
                    } ${
                      isValidUrl
                        ? theme === "dark"
                          ? "text-cyan-300"
                          : "text-gray-900"
                        : theme === "dark"
                        ? "text-red-400"
                        : "text-red-500"
                    }`}
                  />
                </div>

                <Button
                  onClick={handleAnalyze}
                  className={`cursor-pointer p-8 rounded-2xl font-semibold text-lg   relative overflow-hidden group ${
                    theme === "dark"
                      ? "bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-white shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/30"
                      : "bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white"
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  {theme === "dark" && (
                    <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/20 to-purple-400/20 opacity-0 group-hover:opacity-100  "></div>
                  )}
                  <span className="relative z-10 flex items-center gap-2">
                    {t.analyzeButton}
                    <Scan className="h-5 w-5" />
                  </span>
                </Button>
              </div>
            </div>

            {/* Enhanced validation feedback */}
            {
              <div className="mt-4 flex items-center justify-center gap-2">
                {!isValidUrl && (
                  <>
                    <AlertCircle
                      className={`h-5 w-5 ${
                        theme === "dark" ? "text-red-400" : "text-red-500"
                      }`}
                    />
                    <span
                      className={`${
                        theme === "dark" ? "text-red-300" : "text-red-500"
                      }`}
                    >
                      {lang === "en"
                        ? "Please enter a valid URL"
                        : "유효한 URL을 입력해주세요"}
                    </span>
                  </>
                )}
              </div>
            }
          </div>
        </div>
      </div>
    </section>
  );
};
