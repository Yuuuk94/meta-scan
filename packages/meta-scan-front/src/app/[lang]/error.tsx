"use client";

import { useEffect, useState } from "react";
import { AlertOctagon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { defaultLang, langKey } from "@/constans";

// Next.js requires error boundaries to be Client Components, so this can't
// load the dictionary via the server-only getDictionary() like the rest of
// the app — it reads the `lang` cookie directly instead (same cookie
// ToggleSetting.tsx writes).
const readLangCookie = (): Language => {
  if (typeof document === "undefined") return defaultLang;
  const match = document.cookie.match(new RegExp(`(?:^|; )${langKey}=([^;]*)`));
  return (match?.[1] as Language) || defaultLang;
};

const copy: Record<Language, { title: string; description: string; retry: string; home: string }> = {
  ko: {
    title: "문제가 발생했습니다",
    description: "요청을 처리하는 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.",
    retry: "다시 시도",
    home: "홈으로 돌아가기",
  },
  en: {
    title: "Something went wrong",
    description: "An error occurred while processing your request. Please try again in a moment.",
    retry: "Try again",
    home: "Back to home",
  },
};

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const [lang, setLang] = useState<Language>(defaultLang);

  useEffect(() => {
    setLang(readLangCookie());
    console.error(error);
  }, [error]);

  const t = copy[lang];

  return (
    <div className="flex items-center justify-center py-24">
      <div className="mx-auto max-w-md px-4 text-center">
        <div className="mx-auto mb-8 flex h-24 w-24 items-center justify-center rounded-full border border-destructive/30 bg-destructive/10">
          <AlertOctagon className="h-11 w-11 text-destructive" />
        </div>

        <h2 className="mb-3 text-3xl font-semibold text-foreground">
          {t.title}
        </h2>
        <p className="mb-10 text-muted-foreground">{t.description}</p>

        <div className="flex items-center justify-center gap-3">
          <Button variant="outline" onClick={() => (window.location.href = `/${lang}`)}>
            {t.home}
          </Button>
          <Button onClick={reset}>{t.retry}</Button>
        </div>
      </div>
    </div>
  );
}
