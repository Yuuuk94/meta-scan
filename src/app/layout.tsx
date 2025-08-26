import type { Metadata } from "next";
import { Roboto,Geist_Mono } from "next/font/google";
import "./globals.css";
import { RootBackground } from "@/components/RootBackground";
import { RootHeader } from "@/components/RootHeader";
import { pageTitle } from "./constans";
import { RootFooter } from "@/components/RootFooter";

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

export default function RootLayout({
  children,
}: RootLayoutProps) {
  return (
    <html lang="en">
      <body className={`${RobotoSans.variable} ${geistMono.variable} antialiased`}>
        <RootBackground>
          <RootHeader/>
          {children}
          <RootFooter/>
        </RootBackground>
     </body>
    </html>
  );
}
