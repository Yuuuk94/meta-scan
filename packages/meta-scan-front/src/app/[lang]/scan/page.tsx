import { getDictionary } from "@/dictionaries";
import { getSiteSetting } from "@/utils/siteSetting";
import { ScanResultScreen } from "@/ui/organisms/ScanResultScreen";

// Bare /scan (no id) — spec-fixed.md req #9 requires the exact same
// "표시할 결과가 없습니다" + home-button treatment as an unknown/expired
// /scan/:id, not a silent redirect. Results now live at /scan/:id
// (spec-fixed.md "라우팅/스토어 구조 변경"); this route no longer renders
// mock data.
export default async function ScanPage() {
  const { theme, lang } = await getSiteSetting();
  const t = (await getDictionary(lang)).scan;

  return <ScanResultScreen theme={theme} lang={lang} t={t} />;
}
