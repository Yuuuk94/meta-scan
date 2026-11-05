import { allowLanguages } from "@/constans";

// issue #64 — the URL's locale prefix is the source of truth for rendering;
// returns null for paths without one (bare "/", prefix-less paths).
export function getLocaleFromPath(pathname: string): Language | null {
  const first = pathname.split("/")[1];
  return allowLanguages.includes(first) ? (first as Language) : null;
}
