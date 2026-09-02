"use client";

import { useEffect, useState } from "react";
import { Button } from "@/ui/atoms/Button";
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

export const copy: Record<
  Language,
  { title: string; description: string; retry: string; home: string }
> = {
  ko: {
    title: "문제가 발생했습니다",
    description: "일시적인 오류일 수 있습니다. 다시 시도해 주세요.",
    retry: "다시 시도",
    home: "홈으로",
  },
  en: {
    title: "Something went wrong",
    description: "This may be temporary. Please try again.",
    retry: "Try again",
    home: "Home",
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
    <div className="content-frame flex flex-col items-center justify-center gap-4 py-16 text-center sm:py-28">
      <div className="flex h-14 w-14 items-center justify-center border-[2.5px] border-foreground sm:h-16 sm:w-16">
        <span className="font-display text-2xl font-black text-foreground sm:text-3xl">
          !
        </span>
      </div>

      <h2 className="font-display text-xl font-extrabold text-foreground sm:text-2xl">
        {t.title}
      </h2>
      <p className="max-w-sm text-foreground-secondary">{t.description}</p>

      {/* Design order is filled "다시 시도" (retry) first, outline "홈으로" (home)
       * second — full-width stacked column at mobile, side-by-side row at desktop
       * (zine-index intake §2.4). */}
      <div className="mt-3 flex w-full max-w-xs flex-col gap-2.5 sm:w-auto sm:max-w-none sm:flex-row sm:items-center sm:justify-center sm:gap-3">
        <Button onClick={reset} className="w-full sm:w-auto">
          {t.retry}
        </Button>
        <Button
          variant="outline"
          onClick={() => (window.location.href = `/${lang}`)}
          className="w-full sm:w-auto"
        >
          {t.home}
        </Button>
      </div>
    </div>
  );
}
