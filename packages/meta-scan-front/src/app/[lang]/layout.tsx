import { Suspense } from "react";
import type { Metadata } from "next";
import { Big_Shoulders, IBM_Plex_Sans } from "next/font/google";
import { okStatus, pageTitle } from "@/constans";
import { RootHeader } from "@/ui/organisms/RootHeader";
import { RootFooter } from "@/ui/organisms/RootFooter";
import { Loading } from "@/ui/atoms/Loading";
import { getSiteSetting } from "@/utils/siteSetting";
import { pingApi } from "@/api/statusApi";

import "@/css/globals.css";

// Zine Index typography (docs/design-system.md §3): condensed display face
// for headlines/numbers, IBM Plex Sans for everything else. Replaces the
// prior Roboto/Geist Mono pairing from the superseded ADR-004 palette.
//
// design-system.md names "Big Shoulders Display" specifically, but Google
// Fonts has since folded Display/Text/Inline/Stencil into one variable
// family ("Big Shoulders") — next/font/google only exposes the merged
// family, so this loads that at the same 700/800/900 weights instead.
const bigShoulders = Big_Shoulders({
  variable: "--font-big-shoulders",
  weight: ["700", "800", "900"],
  subsets: ["latin"],
});

const ibmPlexSans = IBM_Plex_Sans({
  variable: "--font-ibm-plex-sans",
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
});

const meta = {
  title: pageTitle,
  description: "Based url, meta tag scanner, seo checker",
};

export const metadata: Metadata = {
  ...meta,
  openGraph: {
    ...meta,
    url: "https://example.com",
    siteName: "meta scan lab",
    images: [{ url: "https://example.com/og.png" }],
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { theme, lang } = await getSiteSetting();
  const ready = await pingApi()
    .then((res) => res.data.status === okStatus)
    .catch((e) => {
      console.log(e);
      return false;
    });
  return (
    <html lang={lang} data-theme={theme} suppressHydrationWarning>
      <body
        className={`${bigShoulders.variable} ${ibmPlexSans.variable} antialiased`}
      >
        <div className="min-h-screen bg-background">
          <RootHeader theme={theme} lang={lang} ready={ready} />
          <main className="min-h-screen">
            <Suspense fallback={<Loading />}>{children}</Suspense>
          </main>
          <RootFooter theme={theme} lang={lang} ready={ready} />
        </div>
      </body>
    </html>
  );
}
