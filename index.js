import express from "express";
import lighthouse from "lighthouse";
import * as chromeLauncher from "chrome-launcher";
import swaggerUi from "swagger-ui-express";
import { openapiSpec } from "./sw.js";

const app = express();
app.use(express.json({ limit: "1mb" }));

app.use("/docs", swaggerUi.serve, swaggerUi.setup(openapiSpec));
app.get("/openapi.json", (_req, res) => res.json(openapiSpec));

app.post("/run", async (req, res) => {
  const {
    url,
    formFactor = "mobile",
    onlyCategories = ["performance", "seo", "best-practices", "accessibility"],
    format = "html", // ← 'html' | 'json'
    download = false, // ← true면 파일 다운로드로 내려줌
  } = req.body || {};

  if (!url) return res.status(400).json({ error: "url is required" });

  let chrome;
  try {
    chrome = await chromeLauncher.launch({
      // 로컬: chromePath 생략, Cloud Run: CHROME_PATH 지정(기존처럼)
      ...(process.env.CHROME_PATH
        ? { chromePath: process.env.CHROME_PATH }
        : {}),
      chromeFlags: [
        "--headless=new",
        "--disable-dev-shm-usage",
        "--no-sandbox",
        "--ignore-certificate-errors",
      ],
    });

    const flags = {
      port: chrome.port,
      logLevel: "error",
      emulatedFormFactor: formFactor,
      onlyCategories,
    };

    // ── 포맷별 실행 ──────────────────────────────────────────
    if (format === "html") {
      const result = await lighthouse(url, { ...flags, output: "html" });
      const html = /** @type {string} */ result.report;

      if (download) {
        const safe = url
          .replace(/[^a-z0-9]+/gi, "-")
          .replace(/^-+|-+$/g, "")
          .toLowerCase();
        const ts = new Date().toISOString().replace(/[:.]/g, "-");
        res.setHeader(
          "Content-Disposition",
          `attachment; filename="lighthouse-${safe}-${ts}.html"`
        );
      }
      res.setHeader("Content-Type", "text/html; charset=utf-8");
      return res.status(200).send(html);
    }

    // 기본: JSON(LHR)
    const result = await lighthouse(url, { ...flags, output: "json" });
    await chrome.kill();
    return res.status(200).json(result.lhr);
  } catch (e) {
    if (chrome)
      try {
        await chrome.kill();
      } catch {}
    return res.status(500).json({ error: e.message, stack: e.stack });
  }
});

app.get("/healthz", (_req, res) => res.send("ok"));

app.listen(process.env.PORT || 8080, () =>
  console.log("mata-scan-api runner(local) on :8080")
);
