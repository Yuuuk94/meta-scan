import { NextResponse, userAgent } from "next/server";
import type { NextRequest } from "next/server";
import {
  allowLanguages,
  defaultLang,
  defaultTheme,
  langKey,
  themeKey,
} from "./constans";

export function middleware(request: NextRequest) {
  let theme = request.cookies.get(themeKey);
  let lang = request.cookies.get(langKey);

  const response = NextResponse.next();

  if (!theme) response.cookies.set(themeKey, defaultTheme, { httpOnly: false });

  if (!lang) {
    const acceptLang = request.headers.get("accept-language");
    const userLang = acceptLang?.split(",")?.[0] || "";
    let lang = defaultLang;
    if (allowLanguages.includes(userLang)) lang = userLang as Language;
    response.cookies.set(langKey, defaultLang, { httpOnly: false });
  }

  return response;
}
