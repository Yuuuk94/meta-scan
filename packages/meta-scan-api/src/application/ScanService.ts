import { ApiError } from "@/core/http/ApiError.js";
// NOTE(ADR-011): application importing an inbound-adapter DTO type is a known impurity this
// migration pass didn't resolve — see docs/case-study/backend-hexagonal-architecture.md §5.
import type { SiteMapBody, UrlBody } from "@/adapters/inbound/http/scan/dto.js";
import type {
  BrowserAutomationPort,
  PuppeteerProcess,
} from "@/domain/ports/BrowserAutomationPort.js";
import crypto from "node:crypto";
import { buildBasicSeoChecks } from "@/domain/checks/basicSeoChecks.js";
import {
  buildCanonicalCheck,
  buildCanonicalMultipleCheck,
  buildMetaRobotsNoindexCheck,
  buildSitemapDeclaredInRobotsCheck,
  buildSitemapExistsCheck,
} from "@/domain/checks/indexingChecks.js";

export class ScanService {
  constructor(private readonly chrome: BrowserAutomationPort) {}
  private timeOut = 5000;

  async ping({ url }: UrlBody) {
    try {
      const result = await fetch(url, {
        method: "HEAD",
        signal: AbortSignal.timeout(this.timeOut),
      });
      if (result.status === 200) {
        return {
          redirected: result.redirected,
          url: result.url,
        };
      }
      throw Error;
    } catch (e) {
      throw ApiError.internal();
    }
  }

  private getUrl = (url: URL, path = "/") => {
    const scheme =
      url.protocol && url.protocol !== ":" ? url.protocol : "http:";
    const host = url.hostname;
    const port = url.port ? `:${url.port}` : "";
    return `${scheme}//${host}${port}${path}`;
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
      const robotsUrl = this.getUrl(parsedUrl, "/robots.txt");
      const result = await fetch(robotsUrl, {
        method: "GET",
        signal: AbortSignal.timeout(this.timeOut),
      });

      let has = false;

      if (result.status === 200) {
        has = true;
        const contents = await result.text();
        const t = this.parseRobotsTxt(contents);
        const sitemap = t.sitemaps;
        const allow = this.isAllowed(t.records, parsedUrl.pathname);
        return {
          url: result.url,
          redirected: result.redirected,
          has,
          allow,
          contents,
          sitemap,
        };
      }
      return { has };
    } catch (e) {
      throw ApiError.internal();
    }
  }

  private async headCheck(url: string) {
    try {
      const result = await fetch(url, {
        method: "HEAD",
        signal: AbortSignal.timeout(this.timeOut),
      });
      return result.status === 200 ? result : null;
    } catch (e) {
      // A single candidate failing to fetch (network error, DNS, timeout) shouldn't abort the
      // rest of the fallback sequence — treat it the same as a non-200 response.
      return null;
    }
  }

  async siteMap({ url, candidateSitemaps }: SiteMapBody) {
    try {
      const parsedUrl = new URL(url);
      const siteMapUrl = this.getUrl(parsedUrl, "/sitemap.xml");

      let matched = await this.headCheck(siteMapUrl);

      // /sitemap.xml itself 404s — fall back to robots.txt's declared sitemap locations
      // (already fetched by the frontend, passed through as candidateSitemaps) one at a time,
      // stopping at the first 200 (spec decision log #2/#3).
      if (!matched && candidateSitemaps?.length) {
        for (const candidate of candidateSitemaps) {
          matched = await this.headCheck(candidate);
          if (matched) break;
        }
      }

      const has = matched !== null;
      return {
        has,
        ...(matched ? { url: matched.url, redirected: matched.redirected } : {}),
        checks: { indexing: [buildSitemapExistsCheck(has)] },
      };
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
        checks: { basicSeo: [] },
      };

      result.checks.basicSeo = buildBasicSeoChecks(onload.extracted);
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

function ratio(a: number, b: number) {
  const m = Math.max(1, Math.max(a, b));
  return (b - a) / m;
}
