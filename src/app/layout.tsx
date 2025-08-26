import type { Metadata } from "next";
import { Roboto,Geist_Mono } from "next/font/google";

import "./globals.css";
import { RootBackground } from "@/components/RootBackground";
import { RootHeader } from "@/components/RootHeader";
import { pageTitle } from "./constans";

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
  title: meta.title,
  description: meta.description,
  openGraph: {
    title: meta.title,
    description: meta.description,
    url: "https://example.com",
    siteName: meta.title,
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
           {/* Status Footer */}
      <footer className="border-t border-cyan-500/20 bg-black/80 backdrop-blur-md py-6 relative z-10">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="font-mono text-xs text-green-400">SYSTEM_ONLINE</span>
              </div>
              <div className="text-gray-500 font-mono text-xs">
                v2.4.1 | UPTIME: 99.9% | SCANS: 247,891
              </div>
            </div>
            <div className="text-gray-500 font-mono text-xs">
              &copy; 2025 {pageTitle} | ALL_RIGHTS_RESERVED
            </div>
          </div>
        </div>
      </footer>
        </RootBackground>
        
     </body>
    </html>
  );
}
