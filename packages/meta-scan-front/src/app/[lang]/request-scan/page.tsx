import { getDictionary } from "@/dictionaries";
import { ErrorScreen } from "@/ui/organisms/ErrorScreen";
import { ProcessScreen } from "@/ui/organisms/ProcessScreen";
import { getSiteSetting } from "@/utils/siteSetting";

// Site ping used to be awaited here (server-side) before rendering anything,
// which blocked the whole /request-scan transition on a real network round
// trip. Now this shell renders immediately with just the cookie-read URL,
// and <ProcessScreen> does the ping itself client-side as its first step
// (perf fix, 2026-09-02) — the only thing still checked here is that a URL
// exists at all, since that's free (no network call).
export default async function RequestScanPage() {
  const { theme, lang, crrUrl } = await getSiteSetting();
  const t = (await getDictionary(lang)).requestScan;

  if (!crrUrl) {
    return <ErrorScreen theme={theme} lang={lang} t={t} />;
  }

  return (
    <ProcessScreen theme={theme} lang={lang} t={t} url={decodeURI(crrUrl)} />
  );
}
