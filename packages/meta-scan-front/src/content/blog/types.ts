// issue #76 — site blog content model. Posts are typed TS data (no MDX
// dependency) so every post renders through the same template: summary →
// numbered sections → FAQ → related → references → scan CTA.
export type BlogHub =
  | "basics"
  | "basicSeo"
  | "indexing"
  | "previews"
  | "aiSignals"
  | "content"
  | "i18n"
  | "lighthouse";

export type BlogBlock =
  | { type: "p"; text: string }
  | { type: "h3"; text: string }
  | { type: "list"; items: string[]; ordered?: boolean }
  | { type: "table"; head: string[]; rows: string[][] }
  | { type: "callout"; label: string; text: string }
  | { type: "code"; text: string };

export interface BlogSection {
  heading: string;
  blocks: BlogBlock[];
}

export interface BlogPost {
  slug: string;
  lang: Language;
  title: string;
  description: string;
  publishedAt: string;
  updatedAt?: string;
  hub: BlogHub;
  isHub?: boolean;
  summary: string[];
  sections: BlogSection[];
  faq: { q: string; a: string }[];
  related: string[];
  references: { title: string; url: string }[];
}
