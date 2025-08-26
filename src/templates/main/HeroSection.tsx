"use client";

import { useEffect, useState } from "react";
import { Badge } from "../../components/badge";
import { Scan, Terminal } from "lucide-react";
import { Input } from "../../components/input";
import { Button } from "../../components/button";

export const HeroSection = () => {
  const [url, setUrl] = useState("");
  const [isValidUrl, setIsValidUrl] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // URL 유효성 검사
  useEffect(() => {
    const urlPattern = /^https?:\/\/.+\..+/;
    setIsValidUrl(url.length > 0 && urlPattern.test(url));
  }, [url]);

  const handleAnalyze = () => {
    if (url && isValidUrl) {
      setIsAnalyzing(true);
      console.log("Analyzing URL:", url);

      // 실제 분석 로직이 여기에 들어갈 예정
      // 현재는 3초 후 완료되도록 시뮬레이션
      setTimeout(() => {
        setIsAnalyzing(false);
      }, 3000);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleAnalyze();
    }
  };

  // 시스템 상태 계산
  const getSystemStatus = () => {
    if (isAnalyzing) {
      return {
        ready: {
          active: false,
          label: "ANALYZING",
          color: "text-yellow-400",
          bgColor: "bg-yellow-400",
        },
        engines: {
          active: true,
          label: "ENGINES_RUNNING",
          color: "text-cyan-400",
          bgColor: "bg-cyan-400",
        },
        standby: {
          active: false,
          label: "PROCESSING",
          color: "text-purple-400",
          bgColor: "bg-purple-400",
        },
      };
    } else if (isValidUrl) {
      return {
        ready: {
          active: true,
          label: "READY",
          color: "text-green-400",
          bgColor: "bg-green-400",
        },
        engines: {
          active: true,
          label: "ENGINES_ACTIVE",
          color: "text-cyan-400",
          bgColor: "bg-cyan-400",
        },
        standby: {
          active: true,
          label: "ARMED",
          color: "text-purple-400",
          bgColor: "bg-purple-400",
        },
      };
    } else if (url.length > 0) {
      return {
        ready: {
          active: false,
          label: "INVALID_URL",
          color: "text-red-400",
          bgColor: "bg-red-400",
        },
        engines: {
          active: true,
          label: "ENGINES_ACTIVE",
          color: "text-cyan-400",
          bgColor: "bg-cyan-400",
        },
        standby: {
          active: false,
          label: "WAITING",
          color: "text-gray-400",
          bgColor: "bg-gray-400",
        },
      };
    } else {
      return {
        ready: {
          active: false,
          label: "AWAITING_INPUT",
          color: "text-gray-400",
          bgColor: "bg-gray-400",
        },
        engines: {
          active: true,
          label: "ENGINES_ACTIVE",
          color: "text-cyan-400",
          bgColor: "bg-cyan-400",
        },
        standby: {
          active: false,
          label: "STANDBY",
          color: "text-gray-400",
          bgColor: "bg-gray-400",
        },
      };
    }
  };

  const systemStatus = getSystemStatus();

  return (
    <section className="px-4 py-20 relative z-10">
      <div className="max-w-5xl mx-auto text-center">
        <div className="mb-12">
          <Badge className="mb-6 bg-cyan-500/10 text-cyan-400 border-cyan-500/30 font-mono">
            PERFORMANCE.ANALYSIS.SYSTEM
          </Badge>
          <h1 className="text-5xl font-mono font-bold mb-6 text-white leading-tight">
            <span className="text-cyan-400">&gt;_</span> WEBSITE
            <span className="text-transparent bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text">
              FORENSICS
            </span>
          </h1>
          <p className="text-xl text-gray-300 font-mono mb-12 leading-relaxed">
            URL 입력 → 사이트맵 크롤링 → Lighthouse 스캔 → SEO 분석
            <br />
            <span className="text-cyan-400">
              완전 자동화된 웹사이트 진단 시스템
            </span>
          </p>
        </div>

        {/* URL Input Section - Enhanced Visibility */}
        <div className="max-w-4xl mx-auto mb-16">
          <div className="relative group">
            {/* Multiple Animated Glow Layers */}
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/40 via-purple-500/40 to-pink-500/40 rounded-2xl blur-xl animate-pulse"></div>
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/30 via-purple-400/30 to-pink-400/30 rounded-2xl blur-lg animate-pulse [animation-delay:0.5s]"></div>
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-300/20 via-purple-300/20 to-pink-300/20 rounded-2xl blur-md animate-pulse [animation-delay:1s]"></div>

            {/* Main Input Container */}
            <div className="relative bg-gradient-to-r from-black/95 via-gray-900/95 to-black/95 border-2 border-transparent bg-clip-padding rounded-2xl p-8 backdrop-blur-sm">
              {/* Animated Border */}
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 rounded-2xl opacity-50 blur-sm animate-pulse"></div>
              <div className="absolute inset-[2px] bg-black rounded-2xl"></div>

              {/* Content */}
              <div className="relative z-10">
                {/* Header with blinking cursor */}
                <div className="flex items-center justify-center mb-6">
                  <div className="flex items-center text-cyan-400 text-lg font-mono">
                    <Terminal className="h-6 w-6 mr-3 animate-pulse" />
                    <span>ENTER TARGET URL</span>
                    <span className="animate-pulse text-cyan-300">|</span>
                  </div>
                </div>

                {/* Input and Button */}
                <div className="flex items-center gap-4 max-w-3xl mx-auto">
                  <div className="flex-1 relative">
                    <Input
                      type="url"
                      placeholder="https://target-website.com"
                      value={url}
                      onChange={(e) => setUrl(e.target.value)}
                      onKeyPress={handleKeyPress}
                      className={`bg-black/70 border-2 text-white font-mono text-lg placeholder:text-gray-400 focus:ring-4 focus:ring-cyan-400/30 focus:shadow-[0_0_30px_rgba(0,255,255,0.3)] transition-all duration-300 h-14 px-6 rounded-xl ${
                        url.length > 0
                          ? isValidUrl
                            ? "border-green-500/50 focus:border-green-400"
                            : "border-red-500/50 focus:border-red-400"
                          : "border-cyan-500/50 focus:border-cyan-400"
                      }`}
                    />
                    {/* Input glow effect */}
                    <div
                      className={`absolute inset-0 border-2 rounded-xl pointer-events-none animate-pulse ${
                        url.length > 0
                          ? isValidUrl
                            ? "border-green-400/20"
                            : "border-red-400/20"
                          : "border-cyan-400/20"
                      }`}
                    ></div>
                  </div>

                  <Button
                    onClick={handleAnalyze}
                    disabled={!isValidUrl || isAnalyzing}
                    className="bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 hover:from-cyan-400 hover:via-purple-400 hover:to-pink-400 text-black font-mono font-bold text-lg px-10 h-14 border-0 rounded-xl shadow-[0_0_30px_rgba(0,255,255,0.5)] hover:shadow-[0_0_50px_rgba(0,255,255,0.8)] transition-all duration-300 disabled:opacity-50 disabled:shadow-none"
                  >
                    {isAnalyzing ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-black mr-3"></div>
                        SCANNING
                      </>
                    ) : (
                      <>
                        <Scan className="h-5 w-5 mr-3" />
                        SCAN
                      </>
                    )}
                  </Button>
                </div>

                {/* Dynamic Status indicators */}
                <div className="flex items-center justify-center gap-6 mt-6">
                  <div
                    className={`flex items-center gap-2 text-sm font-mono transition-all duration-300 ${systemStatus.ready.color}`}
                  >
                    <div
                      className={`w-2 h-2 rounded-full ${
                        systemStatus.ready.bgColor
                      } ${
                        systemStatus.ready.active
                          ? "animate-pulse"
                          : "opacity-50"
                      }`}
                    ></div>
                    <span>{systemStatus.ready.label}</span>
                  </div>
                  <div
                    className={`flex items-center gap-2 text-sm font-mono transition-all duration-300 ${systemStatus.engines.color}`}
                  >
                    <div
                      className={`w-2 h-2 rounded-full ${
                        systemStatus.engines.bgColor
                      } ${
                        systemStatus.engines.active
                          ? "animate-pulse [animation-delay:0.3s]"
                          : "opacity-50"
                      }`}
                    ></div>
                    <span>{systemStatus.engines.label}</span>
                  </div>
                  <div
                    className={`flex items-center gap-2 text-sm font-mono transition-all duration-300 ${systemStatus.standby.color}`}
                  >
                    <div
                      className={`w-2 h-2 rounded-full ${
                        systemStatus.standby.bgColor
                      } ${
                        systemStatus.standby.active
                          ? "animate-pulse [animation-delay:0.6s]"
                          : "opacity-50"
                      }`}
                    ></div>
                    <span>{systemStatus.standby.label}</span>
                  </div>
                </div>

                {/* URL Status Message */}
                {url.length > 0 && (
                  <div className="mt-4 text-center">
                    {isValidUrl ? (
                      <div className="text-green-400 font-mono text-sm">
                        ✓ VALID URL DETECTED - READY FOR ANALYSIS
                      </div>
                    ) : (
                      <div className="text-red-400 font-mono text-sm">
                        ⚠ INVALID URL FORMAT - PLEASE CHECK SYNTAX
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Floating particles effect */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 pointer-events-none">
            <div className="absolute top-0 left-0 w-2 h-2 bg-cyan-400 rounded-full animate-bounce [animation-delay:0s] [animation-duration:3s]"></div>
            <div className="absolute top-1/4 right-0 w-1 h-1 bg-purple-400 rounded-full animate-bounce [animation-delay:0.5s] [animation-duration:4s]"></div>
            <div className="absolute bottom-0 left-1/4 w-1.5 h-1.5 bg-pink-400 rounded-full animate-bounce [animation-delay:1s] [animation-duration:3.5s]"></div>
            <div className="absolute bottom-1/4 right-1/4 w-1 h-1 bg-cyan-300 rounded-full animate-bounce [animation-delay:1.5s] [animation-duration:2.5s]"></div>
          </div>
        </div>
      </div>
    </section>
  );
};
