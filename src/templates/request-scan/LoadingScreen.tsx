"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Bot, Loader2, Search, Globe, Zap, Scan } from "lucide-react";

const steps = [
  { id: "meta", icon: Search, duration: 1000 },
  { id: "structure", icon: Globe, duration: 1500 },
  { id: "ai", icon: Bot, duration: 1200 },
  { id: "analysis", icon: Zap, duration: 800 },
];

export function LoadingScreen({ theme, lang, t }: DefautPageProps) {
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    let totalDuration = 0;
    const totalTime = steps.reduce((sum, step) => sum + step.duration, 0);

    steps.forEach((step, index) => {
      setTimeout(() => {
        setCurrentStep(index);

        // Animate progress during this step
        const startProgress = (totalDuration / totalTime) * 100;
        const endProgress = ((totalDuration + step.duration) / totalTime) * 100;

        let stepProgress = startProgress;
        const increment = (endProgress - startProgress) / (step.duration / 50);

        const progressInterval = setInterval(() => {
          stepProgress += increment;
          if (stepProgress >= endProgress) {
            stepProgress = endProgress;
            clearInterval(progressInterval);
          }
          setProgress(stepProgress);
        }, 50);

        totalDuration += step.duration;
      }, totalDuration);
    });
  }, []);

  return (
    <div
      className={`flex items-center justify-center transition-all duration-300`}
    >
      {/* Main Loading Content */}
      <div className="max-w-2xl mx-auto text-center px-4">
        {/* Animated Robot Icon */}
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
            const isActive = index === currentStep;
            const isCompleted = index < currentStep;

            return (
              <div
                key={step.id}
                className={`flex items-center gap-4 p-4 rounded-xl transition-all duration-300 border ${
                  theme === "dark"
                    ? isActive
                      ? "bg-cyan-500/10 border-cyan-400/30 scale-105 shadow-lg shadow-cyan-500/10"
                      : isCompleted
                      ? "bg-green-500/10 border-green-400/30"
                      : "bg-gray-800/30 border-gray-700/30"
                    : isActive
                    ? "bg-blue-50 border-blue-200 scale-105"
                    : isCompleted
                    ? "bg-green-50 border-green-200"
                    : "bg-gray-50 border-gray-200"
                }`}
              >
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 relative ${
                    theme === "dark"
                      ? isActive
                        ? "bg-cyan-500/20 text-cyan-400 border border-cyan-400/40"
                        : isCompleted
                        ? "bg-green-500/20 text-green-400 border border-green-400/40"
                        : "bg-gray-700/50 text-gray-500 border border-gray-600/40"
                      : isActive
                      ? "bg-blue-500 text-white"
                      : isCompleted
                      ? "bg-green-500 text-white"
                      : "bg-gray-300 text-gray-600"
                  }`}
                >
                  {theme === "dark" && isActive && (
                    <div className="absolute inset-0 bg-cyan-400/20 rounded-full blur animate-pulse"></div>
                  )}
                  {isActive ? (
                    <Loader2 className="h-6 w-6 animate-spin relative z-10" />
                  ) : (
                    <IconComponent className="h-6 w-6 relative z-10" />
                  )}
                </div>

                <span
                  className={`font-medium transition-all duration-300 ${
                    theme === "dark"
                      ? isActive
                        ? "text-cyan-300"
                        : isCompleted
                        ? "text-green-400"
                        : "text-gray-400"
                      : isActive
                      ? "text-blue-700"
                      : isCompleted
                      ? "text-green-700"
                      : "text-gray-500"
                  }`}
                >
                  {t.steps[index]}
                </span>
              </div>
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
