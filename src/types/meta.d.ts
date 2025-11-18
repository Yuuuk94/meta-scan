type CheckLevel = "error" | "warn" | "info";

type MetaScanResult = {
  url: string;
  finalUrl: string;
  timingMs: { firstHtml: number; onload: number };
  html: {
    first: { length: number; sha1: string };
    onload: { length: number; sha1: string };
    deltaRatio: number;
  };
  extract: {
    title?: string;
    description?: string;
    keywords?: string;
    canonical?: string;
    h1: string[];
    images: { total: number; altMissing: number };
    openGraph: Record<string, string>;
    twitter: Record<string, string>;
    duplicates: { metaName: string[]; metaProperty: string[] };
  };
  checks: Array<{
    id: string;
    level: CheckLevel;
    message: string;
    target?: string;
  }>;
};
