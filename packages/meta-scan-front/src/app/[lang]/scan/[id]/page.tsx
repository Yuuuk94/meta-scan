import { getDictionary } from "@/dictionaries";
import { getSiteSetting } from "@/utils/siteSetting";
import { ScanResultScreen } from "@/ui/organisms/ScanResultScreen";

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
