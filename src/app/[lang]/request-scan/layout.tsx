import { Loading } from "@/components/Loading";
import { getSiteSetting } from "@/utils/siteSetting";
import { Suspense } from "react";

export default async function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { theme, lang } = await getSiteSetting();

  return (
    <Suspense fallback={<Loading theme={theme} lang={lang} />}>
      {children}
    </Suspense>
  );
}
