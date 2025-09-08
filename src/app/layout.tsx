import type { Metadata } from "next";
import { Roboto, Geist_Mono } from "next/font/google";
import "./globals.css";
import { RootBackground } from "@/templates/root/RootBackground";
import { RootHeader } from "@/templates/root/RootHeader";
import { defaultLang, defaultTheme, pageTitle } from "../constans";
import { RootFooter } from "@/templates/root/RootFooter";
import { getSiteSetting } from "@/utils/cookies";

const RobotoSans = Roboto({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
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

export default async function RootLayout({ children }: RootLayoutProps) {
  const { theme, lang } = await getSiteSetting();
  return (
    <html lang={lang} data-theme={theme}>
      <body
        className={`${RobotoSans.variable} ${geistMono.variable} antialiased`}
      >
        <RootBackground>
          <RootHeader />
          <main className="container mx-auto">{children}</main>
          <RootFooter />
        </RootBackground>
      </body>
    </html>
  );
}
