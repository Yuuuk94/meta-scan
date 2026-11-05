import type { Metadata } from "next";
import { defaultLang } from "@/constans";
import { getPageMetadata } from "@/services/getPageMetadata";
import { getSiteSetting } from "@/utils/siteSetting";

// Bare "/" renders by the lang cookie (no locale prefix to read), but its
// canonical points at the default-locale page (issue #64).
export async function generateMetadata(): Promise<Metadata> {
  const { lang } = await getSiteSetting();
  return getPageMetadata(lang, "seoHome", "", defaultLang);
}

export { default } from "@/app/[lang]/page";
