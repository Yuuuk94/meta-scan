"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Globe, Bot, AlertCircle, Scan } from "lucide-react";
import { crrUrlKey, urlPattern } from "@/constans";
import { setDocumentCookies } from "@/utils/cookies";

export const HeroSection = ({ lang, t }: DefaultPageProps) => {
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
    <section className="container mx-auto px-4 py-24">
      <div className="mx-auto max-w-3xl text-center">
        <Badge
          variant="secondary"
          className="mb-6 border-transparent px-3 py-1"
        >
          <Bot className="mr-1.5 h-3.5 w-3.5" />
          AIO・AEO・GEO・SEO Analysis
        </Badge>

        <h1 className="mb-6 text-5xl font-semibold tracking-tight text-balance text-foreground">
          {t.heroTitle}
        </h1>

        <p className="mx-auto mb-14 max-w-xl text-lg text-muted-foreground">
          {t.heroSubtitle}
        </p>

        {/* URL Input */}
        <div className="mx-auto max-w-2xl">
          <div className="rounded-2xl border border-border bg-card p-2 shadow-md transition-shadow focus-within:border-ring focus-within:shadow-lg">
            <div className="flex flex-col items-stretch gap-2 sm:flex-row sm:items-center">
              <div className="flex flex-1 items-center gap-3 rounded-xl px-4 py-3">
                <Globe className="h-5 w-5 shrink-0 text-muted-foreground" />
                <Input
                  type="url"
                  placeholder={t.urlPlaceholder as string}
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  className="flex-1 border-0 bg-transparent p-0 text-base shadow-none placeholder:text-muted-foreground focus-visible:ring-0"
                />
              </div>

              <Button
                onClick={handleAnalyze}
                size="lg"
                className="h-12 rounded-xl px-6 text-base font-medium"
              >
                {t.analyzeButton}
                <Scan className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {!isValidUrl && (
            <div className="mt-3 flex items-center justify-center gap-2 text-destructive">
              <AlertCircle className="h-4 w-4" />
              <span className="text-sm">
                {lang === "en"
                  ? "Please enter a valid URL"
                  : "유효한 URL을 입력해주세요"}
              </span>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
