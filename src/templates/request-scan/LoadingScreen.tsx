"use client";

import React, { Suspense, useEffect, useState } from "react";
import { Bot, Loader2, Search, Globe, Zap, Scan, Check } from "lucide-react";
import { okStatus } from "@/constans";
import {
  lsRunApi,
  scanCrawlingApi,
  scanRobotsTxtApi,
  scanSiteMapApi,
} from "@/apis/scan";
import { ProcessStep } from "./ProcessStep";

const steps = [
  { id: "ping", icon: Search },
  { id: "ai", icon: Bot },
  { id: "meta", icon: Globe },
  { id: "analysis", icon: Zap },
  { id: "gen", icon: Check },
];

interface LoadingScreenProps extends DefaultPageProps {
  siteStatus: SiteStatus;
}
export function LoadingScreen({
  lang,
  theme,
  t,
  siteStatus,
}: LoadingScreenProps) {
  const [progress, setProgress] = useState(10);
  const [currentProcess, setCurrentProcess] = useState<Array<null | boolean>>([
    siteStatus.status === okStatus,
    ...Array(steps.length - 1).fill(null),
  ]);

  useEffect(() => {
    scanSiteMapApi({ url: siteStatus.url });
  }, []);
  return (
    <div
      className={`py-20 flex items-center justify-center transition-all duration-300`}
    >
      <div className="max-w-2xl mx-auto text-center px-4">
        <div className="relative mb-8">
          {theme === "dark" ? (
            <>
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/30 via-purple-500/30 to-pink-500/30 rounded-full blur-2xl animate-pulse"></div>
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/20 via-purple-400/20 to-pink-400/20 rounded-full blur-xl animate-pulse [animation-delay:0.5s]"></div>
            </>
          ) : (
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-blue-500/20 rounded-full blur-xl animate-pulse"></div>
          )}
          <div
            className={`relative w-28 h-28 mx-auto rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
              theme === "dark"
                ? "bg-gradient-to-r from-cyan-500/20 to-purple-500/20 border-cyan-400/40"
                : "bg-gradient-to-r from-blue-500 to-purple-600 border-blue-400/30"
            }`}
          >
            <Scan
              className={`h-14 w-14 animate-spin transition-colors duration-300 ${
                theme === "dark" ? "text-cyan-400" : "text-white"
              }`}
            />
          </div>
        </div>

        <h2
          className={`text-4xl font-bold mb-4 transition-colors duration-300 ${
            theme === "dark"
              ? "text-transparent bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text"
              : "text-gray-900"
          }`}
        >
          {t.analyzingText}
        </h2>
        <p
          className={`text-lg mb-12 transition-colors duration-300 ${
            theme === "dark" ? "text-gray-300" : "text-gray-600"
          }`}
        >
          {t.analyzingSubtext}
        </p>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <span
              className={`text-sm transition-colors duration-300 ${
                theme === "dark" ? "text-gray-400" : "text-gray-600"
              }`}
            >
              Progress
            </span>
            <span
              className={`text-sm font-medium transition-colors duration-300 ${
                theme === "dark" ? "text-cyan-400" : "text-blue-600"
              }`}
            >
              {Math.round(progress)}%
            </span>
          </div>
          <div
            className={`h-3 rounded-full overflow-hidden transition-colors duration-300 ${
              theme === "dark" ? "bg-gray-800/50" : "bg-gray-200"
            }`}
          >
            <div
              className={`h-full transition-all duration-300 rounded-full ${
                theme === "dark"
                  ? "bg-gradient-to-r from-cyan-500 to-purple-500 shadow-lg shadow-cyan-500/20"
                  : "bg-gradient-to-r from-blue-500 to-purple-600"
              }`}
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Current Step */}
        <div className="space-y-4">
          {steps.map((step, index) => {
            const IconComponent = step.icon;
            const isActive = currentProcess[index] === null;
            const isCompleted = currentProcess[index] === true;

            return (
              <Suspense
                key={step.id}
                fallback={
                  <ProcessStep
                    key={step.id}
                    isCompleted={isCompleted}
                    isActive={isActive}
                    IconComponent={IconComponent}
                    txt={t.steps[index]}
                    lang={lang}
                    theme={theme}
                  />
                }
              >
                <ProcessStep
                  isCompleted={isCompleted}
                  isActive={isActive}
                  IconComponent={IconComponent}
                  txt={t.steps[index]}
                  lang={lang}
                  theme={theme}
                />
              </Suspense>
            );
          })}
        </div>

        {/* Loading Animation */}
        <div className="mt-12 flex justify-center space-x-3">
          <div
            className={`w-3 h-3 rounded-full animate-bounce ${
              theme === "dark"
                ? "bg-cyan-400 shadow-lg shadow-cyan-400/50"
                : "bg-blue-500"
            }`}
          ></div>
          <div
            className={`w-3 h-3 rounded-full animate-bounce [animation-delay:0.1s] ${
              theme === "dark"
                ? "bg-purple-400 shadow-lg shadow-purple-400/50"
                : "bg-purple-500"
            }`}
          ></div>
          <div
            className={`w-3 h-3 rounded-full animate-bounce [animation-delay:0.2s] ${
              theme === "dark"
                ? "bg-pink-400 shadow-lg shadow-pink-400/50"
                : "bg-blue-500"
            }`}
          ></div>
        </div>
      </div>
    </div>
  );
}
