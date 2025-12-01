"use client";

import React from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { MessageCircleWarning } from "lucide-react";

export function ErrorScreen({ theme, lang, t }: DefaultPageProps) {
  const router = useRouter();

  const goBack = () => {
    router.push("/");
  };

  return (
    <div
      className={`flex items-center justify-center transition-all duration-300`}
    >
      <div className="max-w-2xl mx-auto text-center px-4">
        <div className="relative mb-8">
          <div
            className={`relative w-28 h-28 mx-auto rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
              theme === "dark" ? "border-red-400" : "border-red-500"
            }`}
          >
            <MessageCircleWarning
              className={`h-14 w-14 transition-colors duration-300 ${
                theme === "dark" ? "text-red-400" : "text-red-500"
              }`}
            />
          </div>
        </div>

        <h2
          className={`text-4xl font-bold mb-4 transition-colors duration-300 ${
            theme === "dark" ? "text-red-400" : "text-red-500"
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
        <Button
          onClick={goBack}
          className={`cursor-pointer px-8 py-6 rounded-2xl font-semibold text-lg transition-all duration-300 relative overflow-hidden group ${
            theme === "dark"
              ? "bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-white shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/30"
              : "bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white"
          } disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          {theme === "dark" && (
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/20 to-purple-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          )}
          <span className="relative z-10 flex items-center gap-2">GO BACK</span>
        </Button>
      </div>
    </div>
  );
}
