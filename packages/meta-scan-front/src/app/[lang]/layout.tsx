import { notFound } from "next/navigation";
import { allowLanguages } from "@/constans";

// issue #76 — an unknown first segment (e.g. /foo.txt, which the middleware
// lets through as a "public file") used to render the home page with 200.
export default async function LangLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!allowLanguages.includes(lang)) notFound();
  return <>{children}</>;
}
