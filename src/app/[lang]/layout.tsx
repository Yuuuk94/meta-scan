import type { Metadata } from "next";
import { Roboto, Geist_Mono } from "next/font/google";
import { pageTitle } from "@/constans";
import { RootHeader } from "@/templates/root/RootHeader";
import { RootFooter } from "@/templates/root/RootFooter";
import { getSiteSetting } from "@/utils/cookies";
import "../globals.css";

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

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { theme, lang } = await getSiteSetting();
  return (
    <html lang={lang} data-theme={theme}>
      <body
        className={`${RobotoSans.variable} ${geistMono.variable} antialiased`}
      >
        <div
          className={`min-h-screen transition-all duration-300 ${
            theme === "dark"
              ? "bg-gradient-to-br from-gray-900 via-black to-purple-900"
              : "bg-gradient-to-br from-blue-50 via-white to-purple-50"
          }`}
        >
          <RootHeader theme={theme} lang={lang} />
          <main className="container mx-auto">{children}</main>
          <RootFooter theme={theme} lang={lang} />
        </div>
      </body>
    </html>
  );
}
