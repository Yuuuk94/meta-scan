import { ApiError } from "@core/http/ApiError.js";
import type { UrlBody } from "./dto.js";
import type { PuppeteerProcess, Puppeteer } from "@infra/Puppeteer.js";
import { statusOk } from "@constant/status.js";
import crypto from "node:crypto";
import { DESC_MAX, DESC_MIN, TITLE_MAX, TITLE_MIN } from "@constant/meta.js";

export class ScanService {
  constructor(private readonly chrome: Puppeteer) {}
  private timeOut = 5000;

  async ping({ url }: UrlBody) {
    try {
      const result = await fetch(url, {
        method: "HEAD",
        signal: AbortSignal.timeout(this.timeOut),
      });
      if (result.status === 200) {
        return {
          ...statusOk,
          redirected: result.redirected,
          url: result.url,
        };
      }
      throw Error;
    } catch (e) {
      throw ApiError.internal();
    }
  }

  private getRobotUrl = (url: URL) => {
    const scheme =
      url.protocol && url.protocol !== ":" ? url.protocol : "http:";
    const host = url.hostname;
    const port = url.port ? `:${url.port}` : "";
    return `${scheme}//${host}${port}/robots.txt`;
  };

  private parseRobotsTxt = (text: string): ParsedRobots => {
    const lines = text.split(/\r?\n/).map((l) => l.trim());
    const records = [];
    let current: RobotsRecords | null = null;
    const sitemaps = [];

    for (let rawLine of lines) {
      // 주석 제거 ( '#' 앞은 주석 )
      const hashIdx = rawLine.indexOf("#");
      if (hashIdx === 0) continue;
      if (hashIdx > 0) rawLine = rawLine.slice(0, hashIdx).trim();
      if (!rawLine) continue;

      const idx = rawLine.indexOf(":");
      if (idx === -1) continue;
      const field = rawLine.slice(0, idx).trim().toLowerCase();
      const value = rawLine.slice(idx + 1).trim();

      if (field === "user-agent") {
        if (current && current.rules.length > 0) {
          current._closed = true;
          records.push(current);
          current = null;
        }
        if (!current) {
          current = {
            userAgents: [],
            rules: [],
            _closed: false,
          };
        }
        current.userAgents.push(value);
      } else if (field === "disallow" || field === "allow") {
        if (!current) {
          // User-agent 없이 지시가 있으면 wildcard 그룹으로 취급
          current = {
            userAgents: ["*"],
            rules: [],
            _closed: false,
          };
        }
        const pattern =
          value === ""
            ? "/" + "" /* empty -> allow all? treat as empty pattern*/
            : value;
        const regex = patternToRegex(pattern);
        current.rules.push({ type: field, pattern, regex, raw: rawLine });
      } else if (field === "sitemap") {
        sitemaps.push(value);
      } else {
        // 그 외 룰
      }
    }

    if (current) {
      current._closed = true;
      records.push(current);
      current = null;
    }

    return { records, sitemaps };
  };

  private isAllowed = (parsedRobotsRecords: RobotsRecords[], path: string) => {
    const results: Record<string, boolean> = {};

    for (const record of parsedRobotsRecords) {
      for (const ua of record.userAgents) {
        let allowed = true;

        for (const rule of record.rules) {
          if (rule.regex && rule.regex.test(path)) {
            if (rule.type === "disallow") {
              allowed = false;
            } else if (rule.type === "allow") {
              allowed = true;
            }
          }
        }

        results[ua] = allowed;
      }
    }

    return results;
  };
  async robotsTxt({ url }: UrlBody) {
    try {
      const parsedUrl = new URL(url);
      const robotsUrl = this.getRobotUrl(parsedUrl);
      const result = await fetch(robotsUrl, {
        method: "GET",
        signal: AbortSignal.timeout(this.timeOut),
      });

      let has = false;
      let allow: Record<string, boolean> = { "*": true };
      let sitemap: string[] = [];
      let contents = "";

      if (result.status === 200) {
        has = true;
        contents = await result.text();
        const t = this.parseRobotsTxt(contents);
        sitemap = t.sitemaps;
        allow = this.isAllowed(t.records, parsedUrl.pathname);
      }
      return { has, allow, contents, sitemap };
    } catch (e) {
      throw ApiError.internal();
    }
  }

  private getSiteMapUrl = (url: URL) => {
    const scheme =
      url.protocol && url.protocol !== ":" ? url.protocol : "http:";
    const host = url.hostname;
    const port = url.port ? `:${url.port}` : "";
    return `${scheme}//${host}${port}/sitemap.xml`;
  };

  async siteMap({ url }: UrlBody) {
    try {
      const parsedUrl = new URL(url);
      const siteMapUrl = this.getSiteMapUrl(parsedUrl);
      const result = await fetch(siteMapUrl, {
        method: "HEAD",
        signal: AbortSignal.timeout(this.timeOut),
      });
      if (result.status === 200) {
        return {
          ...statusOk,
          redirected: result.redirected,
          url: result.url,
        };
      }
      throw Error;
    } catch (e) {
      throw ApiError.internal();
    }
  }

  private async fetchFirstHtml(url: string) {
    const t0 = Date.now();
    const res = await fetch(url, {
      redirect: "follow",
      headers: {
        "user-agent": "MetaScanBot/1.0 (+https://example.com/bot) Mozilla/5.0",
        accept: "text/html,application/xhtml+xml",
      },
    });
    const finalUrl = res.url || url;
    const text = await res.text();
    const t1 = Date.now();
    return {
      html: text,
      finalUrl,
      ms: t1 - t0,
    };
  }

  private async getOnloadHtml(url: string, browser: PuppeteerProcess) {
    const t0 = Date.now();
    const page = await browser.newPage();

    const resp = await page.goto(url, {
      waitUntil: "load", // 필요하면 "networkidle2"로 변경
      timeout: 45_000,
    });

    const finalUrl = resp?.url() || url;

    const html = await page.content();
    const fs = () => {
      const metas = Array.from(document.querySelectorAll("meta"));
      const metaByName: Record<string, string> = {};
      const metaByProp: Record<string, string> = {};
      const dupName: string[] = [];
      const dupProp: string[] = [];
      for (const m of metas) {
        const name = m.getAttribute("name")?.toLowerCase() ?? "";
        const prop = m.getAttribute("property")?.toLowerCase() ?? "";
        const content = m.getAttribute("content") ?? "";
        if (name) {
          if (metaByName[name]) dupName.push(name);
          else metaByName[name] = content;
        }
        if (prop) {
          if (metaByProp[prop]) dupProp.push(prop);
          else metaByProp[prop] = content;
        }
      }
      const og: Record<string, string> = {};
      const tw: Record<string, string> = {};
      for (const [k, v] of Object.entries(metaByProp)) {
        if (k.startsWith("og:")) og[k] = v;
        if (k.startsWith("twitter:")) tw[k] = v;
      }
      for (const [k, v] of Object.entries(metaByName)) {
        if (k.startsWith("twitter:")) tw[k] = v;
        // name=twitter:* 케이스
      }
      const canonical =
        document.querySelector('link[rel="canonical"]')?.getAttribute("href") ??
        undefined;
      const h1 = Array.from(document.querySelectorAll("h1"))
        .map((el) => (el.textContent || "").trim())
        .filter(Boolean);
      const imgs = Array.from(document.images || []);
      const totalImgs = imgs.length;
      const altMissing = imgs.filter(
        (i) => !(i.getAttribute("alt") ?? "").trim()
      ).length;
      return {
        title: document.title || undefined,
        description: metaByName["description"],
        keywords: metaByName["keywords"],
        canonical,
        h1,
        images: { total: totalImgs, altMissing },
        openGraph: og,
        twitter: tw,
        duplicates: {
          metaName: Array.from(new Set(dupName)),
          metaProperty: Array.from(new Set(dupProp)),
        },
      };
    };
    const extracted = await page.evaluate(fs);

    await page.close();

    const t1 = Date.now();
    return {
      html,
      finalUrl,
      extracted,
      ms: t1 - t0,
    };
  }

  private runChecks(
    url: string,
    ext: Awaited<ReturnType<typeof this.getOnloadHtml>>["extracted"]
  ): MetaScanResult["checks"] {
    const checks: MetaScanResult["checks"] = [];

    const title = norm(ext.title);
    const desc = norm(ext.description);

    if (!title) {
      checks.push({
        id: "title.missing",
        level: "error",
        message: "title 태그가 없습니다.",
        target: "title",
      });
    } else if (title.length < TITLE_MIN || title.length > TITLE_MAX) {
      checks.push({
        id: "title.length",
        level: "warn",
        message: `title 길이 비권장(${title.length}자). 권장: ${TITLE_MIN}–${TITLE_MAX}자.`,
        target: "title",
      });
    }

    if (!desc) {
      checks.push({
        id: "desc.missing",
        level: "warn",
        message: "meta[name=description]이 없습니다.",
        target: "description",
      });
    } else if (desc.length < DESC_MIN || desc.length > DESC_MAX) {
      checks.push({
        id: "desc.length",
        level: "warn",
        message: `description 길이 비권장(${desc.length}자). 권장: ${DESC_MIN}–${DESC_MAX}자.`,
        target: "description",
      });
    }

    if (ext.keywords) {
      checks.push({
        id: "keywords.deprecated",
        level: "info",
        message: "meta[name=keywords]는 현대 SEO에서 비권장입니다.",
        target: "keywords",
      });
    }

    if (
      !ext.openGraph["og:title"] ||
      !ext.openGraph["og:description"] ||
      !ext.openGraph["og:image"]
    ) {
      checks.push({
        id: "og.missing_core",
        level: "warn",
        message:
          "Open Graph 핵심 태그(og:title/og:description/og:image) 일부가 없습니다.",
        target: "openGraph",
      });
    }

    if (!ext.twitter["twitter:card"]) {
      checks.push({
        id: "twitter.missing_card",
        level: "info",
        message: "Twitter Card(twitter:card)가 없습니다.",
        target: "twitter",
      });
    }

    if (!ext.canonical) {
      checks.push({
        id: "canonical.missing",
        level: "info",
        message: "Canonical 링크가 없습니다.",
        target: "canonical",
      });
    } else if (/^\/(?!\/)/.test(ext.canonical)) {
      checks.push({
        id: "canonical.relative",
        level: "info",
        message: "Canonical이 상대경로입니다. 절대경로를 권장합니다.",
        target: "canonical",
      });
    }

    if (ext.h1.length === 0) {
      checks.push({
        id: "h1.none",
        level: "warn",
        message: "H1 태그가 없습니다.",
        target: "h1",
      });
    } else if (ext.h1.length > 1) {
      checks.push({
        id: "h1.multiple",
        level: "info",
        message: `H1 태그가 ${ext.h1.length}개입니다. 1개 권장(정보구조 따라 예외 가능).`,
        target: "h1",
      });
    }

    if (ext.images.altMissing > 0) {
      checks.push({
        id: "img.alt_missing",
        level: "warn",
        message: `ALT 누락 이미지 ${ext.images.altMissing}개.`,
        target: "img",
      });
    }

    if (
      ext.duplicates.metaName.length > 0 ||
      ext.duplicates.metaProperty.length > 0
    ) {
      const names = ext.duplicates.metaName.join(", ");
      const props = ext.duplicates.metaProperty.join(", ");
      checks.push({
        id: "meta.duplicate",
        level: "info",
        message: `중복 메타 태그 감지 name[${names}] property[${props}]`,
        target: "meta",
      });
    }

    return checks;
  }

  async crawling({ url }: UrlBody) {
    let proc: PuppeteerProcess | undefined;
    try {
      proc = await this.chrome.launch();
      // 1) 첫 HTML
      const first = await this.fetchFirstHtml(url);

      // 2) onload 이후 HTML + 메타 추출
      const onload = await this.getOnloadHtml(first.finalUrl, proc);

      const firstLen = first.html.length;
      const onloadLen = onload.html.length;

      const result: MetaScanResult = {
        url,
        finalUrl: onload.finalUrl,
        timingMs: { firstHtml: first.ms, onload: onload.ms },
        html: {
          first: { length: firstLen, sha1: sha1(first.html) },
          onload: { length: onloadLen, sha1: sha1(onload.html) },
          deltaRatio: ratio(firstLen, onloadLen),
        },
        extract: {
          title: onload.extracted.title,
          description: onload.extracted.description,
          keywords: onload.extracted.keywords,
          canonical: onload.extracted.canonical,
          h1: onload.extracted.h1,
          images: onload.extracted.images,
          openGraph: onload.extracted.openGraph,
          twitter: onload.extracted.twitter,
          duplicates: onload.extracted.duplicates,
        },
        checks: [],
      };

      result.checks = this.runChecks(url, onload.extracted);
      return result;
    } catch (e) {
      throw ApiError.internal();
    } finally {
      await this.chrome.close(proc);
    }
  }
}

function patternToRegex(pattern: string) {
  // 빈 패턴 (Disallow:) 은 "빈 문자열" -> 모든 경로 허용으로 취급 (매칭을 방지)
  if (pattern === "" || pattern === undefined) {
    // 절대 매칭 안되도록
    return /^$/;
  }

  // escape regex special except * and $
  let out = "";
  for (let i = 0; i < pattern.length; i++) {
    const ch = pattern[i];
    if (ch === "*") out += ".*";
    else if (ch === "$") out += "$";
    else out += ch?.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  }

  // robots 표준은 보통 접두사 매칭. 따라서 '^'로 시작.
  // 만약 사용자가 명시적으로 $를 넣으면 끝맞춤이 가능하도록 했음.
  if (!out.startsWith("^")) out = "^" + out;
  return new RegExp(out);
}

function sha1(s: string) {
  return crypto.createHash("sha1").update(s).digest("hex");
}

function norm(s?: string | null) {
  return (s ?? "").trim().replace(/\s+/g, " ");
}

function ratio(a: number, b: number) {
  const m = Math.max(1, Math.max(a, b));
  return (b - a) / m;
}
