import { sitePingApi } from "@/apis/scan";
import { getDictionary } from "@/dictionaries";
import { ErrorScreen } from "@/templates/request-scan/ErrorScreen";
import { ProcessScreen } from "@/templates/request-scan/ProcessScreen";
import { getSiteSetting } from "@/utils/siteSetting";

interface ScanPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}
export default async function ScanPage({ searchParams }: ScanPageProps) {
  const { theme, lang } = await getSiteSetting();
  const t = (await getDictionary(lang)).scan;
  try {
    const requestUrl = (await searchParams).url as string;
    const siteStatus = await sitePingApi({
      url: decodeURI(requestUrl),
    }).then((res) => res.data);

    return (
      <ProcessScreen theme={theme} lang={lang} t={t} siteStatus={siteStatus} />
    );
  } catch (error) {
    return <ErrorScreen theme={theme} lang={lang} t={t} />;
  }
}
