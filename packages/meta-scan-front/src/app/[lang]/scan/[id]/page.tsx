import type { Metadata } from "next";
import { getDictionary } from "@/dictionaries";
import { getPageMetadata } from "@/services/getPageMetadata";
import { getSiteSetting } from "@/utils/siteSetting";
import { ScanResultScreen } from "@/ui/organisms/ScanResultScreen";

// issue #82 — result shells have no content of their own; keep them out of
// the index (noindex, follow) with /scan as canonical, same as /scan itself.
export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string; id: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  return getPageMetadata(lang, "seoScan", "/scan");
}

// Thin server shell (front CLAUDE.md "구현 패턴") — the store it reads from
// is a client-side zustand persist (localStorage), so all the actual
// rendering/lookup logic lives in the client organism below
// (spec-fixed.md "라우팅/스토어 구조 변경": /scan/:id, id = crypto.randomUUID()).
export default async function ScanResultPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { theme, lang } = await getSiteSetting();
  const t = (await getDictionary(lang)).scan;

  return <ScanResultScreen theme={theme} lang={lang} t={t} id={id} />;
}
