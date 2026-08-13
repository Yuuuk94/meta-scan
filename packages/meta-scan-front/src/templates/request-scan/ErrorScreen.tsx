"use client";

import React from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { MessageCircleWarning } from "lucide-react";

export function ErrorScreen({ t }: DefaultPageProps) {
  const router = useRouter();

  const goBack = () => {
    router.push("/");
  };

  return (
    <div className="flex items-center justify-center py-20">
      <div className="mx-auto max-w-lg px-4 text-center">
        <div className="mx-auto mb-8 flex h-24 w-24 items-center justify-center rounded-full border border-destructive/30 bg-destructive/10">
          <MessageCircleWarning className="h-11 w-11 text-destructive" />
        </div>

        <h2 className="mb-3 text-3xl font-semibold text-foreground">
          {t.errorTitle}
        </h2>
        <p className="mb-10 text-muted-foreground">{t.errorSubtitle}</p>

        <Button onClick={goBack} size="lg" className="rounded-xl px-8">
          {t.goBack}
        </Button>
      </div>
    </div>
  );
}
