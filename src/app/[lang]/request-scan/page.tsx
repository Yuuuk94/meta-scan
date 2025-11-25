import { sitePingApi } from "@/apis/scan";
import { getDictionary } from "@/dictionaries";
import { ErrorScreen } from "@/templates/request-scan/ErrorScreen";
import { LoadingScreen } from "@/templates/request-scan/LoadingScreen";
import { getSiteSetting } from "@/utils/siteSetting";

interface ScanPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}
export default async function ScanPage({ searchParams }: ScanPageProps) {
  const { theme, lang } = await getSiteSetting();
  const t = (await getDictionary(lang)).scan;
  try {
    const requestUrl = (await searchParams).url;
    const siteStatus = await sitePingApi({
      url: decodeURI(requestUrl as string),
    }).then((res) => res.data);

    return (
      <LoadingScreen theme={theme} lang={lang} t={t} siteStatus={siteStatus} />
    );
  } catch (error) {
    return <ErrorScreen theme={theme} lang={lang} t={t} />;
  }
}
