import { ApiError } from "@core/http/ApiError.js";
import type { UrlBody, UrlsBody } from "./dto.js";
import type { PuppeteerProcess } from "@infra/Puppeteer.js";
import { Puppeteer } from "@infra/Puppeteer.js";
import { statusOk } from "@constant/status.js";

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

  async siteMap({ urls }: UrlsBody) {}

  async crawling() {
    let proc: PuppeteerProcess | undefined;
    try {
      proc = await this.chrome.launch();
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
