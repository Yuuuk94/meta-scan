import { sitePingApi } from "@/api/scanApi";
import { getDictionary } from "@/dictionaries";
import { ErrorScreen } from "@/ui/organisms/ErrorScreen";
import { ProcessScreen } from "@/ui/organisms/ProcessScreen";
import { getSiteSetting } from "@/utils/siteSetting";

export default async function RequestScanPage() {
  const { theme, lang, crrUrl } = await getSiteSetting();
  const t = (await getDictionary(lang)).requestScan;
  try {
    if (!crrUrl) throw Error;
    const siteStatus = await sitePingApi({
      url: decodeURI(crrUrl),
    }).then((res) => res.data);

    return (
      <ProcessScreen theme={theme} lang={lang} t={t} siteStatus={siteStatus} />
    );
  } catch (error) {
    console.error(error);
    return <ErrorScreen theme={theme} lang={lang} t={t} />;
  }
}
