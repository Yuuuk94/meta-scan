import { sitePingApi } from "@/apis/scan";
import { getDictionary } from "@/dictionaries";
import { ErrorScreen } from "@/templates/request-scan/ErrorScreen";
import { LoadingScreen } from "@/templates/request-scan/LoadingScreen";
import { getSiteSetting } from "@/utils/cookies";

export default async function ScanPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { theme, lang } = await getSiteSetting();
  const t = (await getDictionary(lang)).scan;
  try {
    const requestUrl = (await searchParams).url;
    console.log(requestUrl);
    const sitePingStatus = await sitePingApi({
      url: decodeURI(requestUrl as string),
    }).then((res) => console.log(res.data));

    return <LoadingScreen theme={theme} lang={lang} t={t} />;
  } catch (error) {
    return <ErrorScreen theme={theme} lang={lang} t={t} />;
  }
}
