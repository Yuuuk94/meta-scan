"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/ui/atoms/Button";
import { Input } from "@/ui/atoms/Input";
import { AlertCircle, Scan } from "lucide-react";
import { crrUrlKey, urlPattern } from "@/constans";
import { setDocumentCookies } from "@/utils/cookies";

export const HeroSection = ({ t }: DefaultPageProps) => {
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
    // Left-aligned — Main-Zine.png has no centering anywhere in the hero
    // (eyebrow/headline/subcopy/input all sit flush left in content-frame).
    <section className="content-frame py-22">
      <span className="text-xs font-bold uppercase tracking-[.1em] text-muted-foreground">
        {t.heroEyebrow}
      </span>

      <h1 className="mt-4 max-w-3xl break-keep font-display text-5xl font-black leading-[0.95] tracking-tight text-foreground sm:text-6xl">
        {t.heroTitleLead}{" "}
        {/* Headline highlight block — this system's signature emphasis
         * treatment instead of color-only or bold-only text (design-system.md
         * §3/§4). */}
        <span className="bg-accent px-2.5 text-accent-foreground">
          {t.heroTitleHighlight}
        </span>{" "}
        {t.heroTitleTail}
      </h1>

      <p className="mt-6 max-w-xl text-base text-foreground-secondary">
        {t.heroSubtitle}
      </p>

      {/* URL Input — hard 2px border, sharp corners, no shadow (design-system.md §4) */}
      <div className="mt-10 max-w-2xl">
        <div className="flex flex-col items-stretch gap-3 sm:flex-row">
          <Input
            type="url"
            placeholder={t.urlPlaceholder as string}
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="h-14 flex-1 border-2 border-foreground bg-card px-5 text-base"
          />
          <Button
            onClick={handleAnalyze}
            className="h-14 shrink-0 px-8 text-base"
          >
            {t.analyzeButton}
            <Scan className="h-4 w-4" />
          </Button>
        </div>

        {!isValidUrl && (
          <div className="mt-3 flex items-center gap-2 text-destructive">
            <AlertCircle className="h-4 w-4" />
            <span className="text-sm">{t.urlInvalid}</span>
          </div>
        )}
      </div>
    </section>
  );
};
