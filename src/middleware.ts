import { NextResponse, userAgent } from "next/server";
import type { NextRequest } from "next/server";
import { allowLocales, defaultLang, defaultTheme } from "./constans";

export function middleware(request: NextRequest) {
  let theme = request.cookies.get("theme");
  let lang = request.cookies.get("lang");

  const response = NextResponse.next();

  if (!theme) response.cookies.set("theme", defaultTheme);

  if (!lang) {
    const acceptLang = request.headers.get("accept-language");
    const userLang = acceptLang?.split(",")?.[0] || "";
    let lang = defaultLang;
    if (allowLocales.includes(userLang)) lang = userLang as Language;
    response.cookies.set("lang", defaultLang);
  }

  return response;
}
