import { sitePingApi } from "@/apis/scan";
import { getDictionary } from "@/dictionaries";
import { ErrorScreen } from "@/templates/request-scan/ErrorScreen";
import { ProcessScreen } from "@/templates/request-scan/ProcessScreen";
import { getSiteSetting } from "@/utils/siteSetting";

interface ScanPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}
export default async function RequestScanPage({ searchParams }: ScanPageProps) {
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
    return <ErrorScreen theme={theme} lang={lang} t={t} />;
  }
}
