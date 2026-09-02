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
  buildIndexingChecksFromCrawling,
  buildSitemapDeclaredInRobotsCheck,
  buildSitemapExistsCheck,
} from "@/domain/checks/indexingChecks.js";
import { buildPreviewsChecksFromCrawling } from "@/domain/checks/previewsChecks.js";
import { buildAiSignalsChecksFromCrawling } from "@/domain/checks/aiSignalsChecks.js";
import { buildContentChecksFromCrawling } from "@/domain/checks/contentChecks.js";

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
          checks: { indexing: [buildSitemapDeclaredInRobotsCheck(sitemap)] },
        };
      }
      return { has, checks: { indexing: [buildSitemapDeclaredInRobotsCheck([])] } };
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

  // Plain existence/byte-count fetch against `/.well-known/prompts.txt`, run in parallel with
  // `fetchFirstHtml` from `crawling` (issue #6 ai-signals-checklist req #1) — same fetch-only
  // pattern `robotsTxt`/`headCheck` already use, deliberately not a 5th API route (ADR-003: a new
  // route would break ProcessScreen's 4-step composition). A failed/non-200 fetch is treated as
  // "doesn't exist", same swallow-errors philosophy as `headCheck`.
  private async fetchPromptsTxt(
    url: string
  ): Promise<{ exists: boolean; byteCount?: number }> {
    try {
      const parsedUrl = new URL(url);
      const promptsTxtUrl = this.getUrl(parsedUrl, "/.well-known/prompts.txt");
      const result = await fetch(promptsTxtUrl, {
        method: "GET",
        signal: AbortSignal.timeout(this.timeOut),
      });
      if (result.status !== 200) return { exists: false };
      const text = await result.text();
      return { exists: true, byteCount: Buffer.byteLength(text, "utf-8") };
    } catch (e) {
      return { exists: false };
    }
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
      // All canonical link tags, not just the first — canonicalMultiple (issue #4
      // indexing-checklist) needs the full count regardless of href value equality.
      const canonicalLinks = Array.from(
        document.querySelectorAll('link[rel="canonical"]')
      )
        .map((el) => el.getAttribute("href") ?? "")
        .filter(Boolean);
      const canonical = canonicalLinks[0];
      // issue #5 previews-checklist: only checks for the <link> tag itself, no fetch — the
      // conventional /favicon.ico fallback (spec decision log #1) is checked afterwards by
      // ScanService, outside page.evaluate (this callback only has DOM access, not `fetch`).
      const hasIconLink = !!document.querySelector('link[rel~="icon"]');
      const h1 = Array.from(document.querySelectorAll("h1"))
        .map((el) => (el.textContent || "").trim())
        .filter(Boolean);
      // issue #7 content-stats-checklist: h2/h3 counts collected alongside h1 (spec req #1) — only
      // counts are needed (not the text content, unlike h1 which the frontend renders directly).
      const headings = {
        h1: h1.length,
        h2: document.querySelectorAll("h2").length,
        h3: document.querySelectorAll("h3").length,
      };
      // Body character count (spec-fixed.md decision log #1: character count, not word count,
      // despite the PRD's original "본문 단어 수" label — its own 600–2,000 thresholds were already
      // in characters). `innerText` (not `textContent`) so hidden/script/style content that isn't
      // actually rendered doesn't inflate the count.
      const charCount = (document.body?.innerText || "").trim().length;
      // PRD §3.5: a `[role="doc-abstract"]` element, or literal "TL;DR" text anywhere in the
      // rendered body, counts as a TL;DR/summary block.
      const hasTldr =
        !!document.querySelector('[role="doc-abstract"]') ||
        /tl;?dr/i.test(document.body?.innerText || "");
      const imgs = Array.from(document.images || []);
      const totalImgs = imgs.length;
      const altMissing = imgs.filter(
        (i) => !(i.getAttribute("alt") ?? "").trim()
      ).length;
      // issue #6 ai-signals-checklist: deduped `@type` values across every JSON-LD script,
      // including nested `@graph` arrays — feeds promptObject/structuredData/faqSection
      // judgement. A malformed script just contributes no types (a dedicated parse-error
      // judgement is PRD §3.4 scope this issue doesn't cover).
      const structuredDataTypesSet = new Set<string>();
      const collectTypes = (node: unknown): void => {
        if (Array.isArray(node)) {
          node.forEach(collectTypes);
          return;
        }
        if (!node || typeof node !== "object") return;
        const obj = node as Record<string, unknown>;
        const t = obj["@type"];
        if (typeof t === "string") structuredDataTypesSet.add(t);
        else if (Array.isArray(t)) {
          t.forEach((tt) => typeof tt === "string" && structuredDataTypesSet.add(tt));
        }
        if (Array.isArray(obj["@graph"])) collectTypes(obj["@graph"]);
      };
      const jsonLdScripts = Array.from(
        document.querySelectorAll('script[type="application/ld+json"]')
      );
      for (const script of jsonLdScripts) {
        try {
          collectTypes(JSON.parse(script.textContent || ""));
        } catch {
          // malformed JSON-LD — skip, see comment above
        }
      }
      const structuredDataTypes = Array.from(structuredDataTypesSet);
      return {
        title: document.title || undefined,
        description: metaByName["description"],
        keywords: metaByName["keywords"],
        canonical,
        // Full list, alongside `canonical` (its first element, kept for backward
        // compatibility with existing consumers of extract.canonical).
        canonicalLinks,
        // `<meta name="robots" content="...">` — metaByName already lower-cases the name, so
        // this is just surfacing it under an explicit key (issue #4 indexing-checklist).
        metaRobots: metaByName["robots"],
        hasIconLink,
        h1,
        // issue #7 content-stats-checklist
        charCount,
        headings,
        hasTldr,
        images: { total: totalImgs, altMissing },
        openGraph: og,
        twitter: tw,
        duplicates: {
          metaName: Array.from(new Set(dupName)),
          metaProperty: Array.from(new Set(dupProp)),
        },
        // issue #6 ai-signals-checklist
        structuredDataTypes,
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
      // 1) 첫 HTML + prompts.txt(issue #6 ai-signals-checklist req #1) 병렬 fetch — 같은
      // "원본 HTML을 fetch하는 지점"에서 실행, 별도 API 라우트 신설 없음(ADR-003).
      const [first, promptsTxt] = await Promise.all([
        this.fetchFirstHtml(url),
        this.fetchPromptsTxt(url),
      ]);

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
          canonicalLinks: onload.extracted.canonicalLinks,
          metaRobots: onload.extracted.metaRobots,
          h1: onload.extracted.h1,
          images: onload.extracted.images,
          openGraph: onload.extracted.openGraph,
          twitter: onload.extracted.twitter,
          duplicates: onload.extracted.duplicates,
          structuredDataTypes: onload.extracted.structuredDataTypes,
          promptsTxt,
        },
        checks: { basicSeo: [], indexing: [], previews: [], aiSignals: [], content: [] },
      };

      result.checks.basicSeo = buildBasicSeoChecks(onload.extracted);
      result.checks.indexing = buildIndexingChecksFromCrawling({
        canonicalLinks: onload.extracted.canonicalLinks,
        metaRobotsContent: onload.extracted.metaRobots,
      });

      // No <link rel~="icon"> tag found — fall back to a HEAD check against the conventional
      // /favicon.ico path before judging (spec decision log #1), same network-check style as
      // siteMap's headCheck. Skipped entirely (no extra request) when the <link> tag was already
      // found.
      const faviconFallbackOk = onload.extracted.hasIconLink
        ? false
        : (await this.headCheck(
            this.getUrl(new URL(onload.finalUrl), "/favicon.ico")
          )) !== null;

      result.checks.previews = buildPreviewsChecksFromCrawling({
        ogImage: onload.extracted.openGraph["og:image"],
        hasIconLink: onload.extracted.hasIconLink,
        faviconFallbackOk,
        openGraph: onload.extracted.openGraph,
        twitter: onload.extracted.twitter,
      });

      result.checks.aiSignals = buildAiSignalsChecksFromCrawling({
        promptsTxt,
        structuredDataTypes: onload.extracted.structuredDataTypes,
        deltaRatio: result.html.deltaRatio,
      });

      result.checks.content = buildContentChecksFromCrawling({
        charCount: onload.extracted.charCount,
        headings: onload.extracted.headings,
        hasTldr: onload.extracted.hasTldr,
      });

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
