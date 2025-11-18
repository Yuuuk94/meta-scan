import swaggerUi from "swagger-ui-express";

export { swaggerUi };

export const swaggerSpec = {
  openapi: "3.0.3",
  info: {
    title: "Meta Scan API",
    version: "0.1.0",
    description:
      "POST /run 으로 Lighthouse LHR(JSON) 또는 HTML 리포트를 반환합니다.",
  },
  servers: [{ url: process.env.PUBLIC_URL || "http://localhost:8080" }],
  paths: {
    "/api/v1/lighthouse/run": {
      post: {
        summary: "Lighthouse 실행",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/RunRequest" },
              examples: {
                jsonExample: {
                  summary: "JSON LHR 반환",
                  value: {
                    url: "https://dev-portfolio.withmay.com/",
                    formFactor: "mobile",
                    onlyCategories: ["seo", "performance"],
                    format: "json",
                  },
                },
                htmlExample: {
                  summary: "HTML 리포트 반환(다운로드)",
                  value: {
                    url: "https://dev-portfolio.withmay.com/",
                    formFactor: "desktop",
                    onlyCategories: [
                      "seo",
                      "performance",
                      "best-practices",
                      "accessibility",
                    ],
                    format: "html",
                    download: true,
                  },
                },
              },
            },
          },
        },
        responses: {
          200: {
            description: "성공",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/LighthouseResult" },
              },
              "text/html": {
                schema: {
                  type: "string",
                  description: "Lighthouse HTML report",
                },
              },
            },
          },
          400: {
            description: "잘못된 요청",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
          500: {
            description: "실행 오류",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
        },
      },
    },
    "/api/v1/healthz": {
      get: {
        summary: "헬스체크",
        responses: { 200: { description: "ok (text/plain)" } },
      },
    },
    "/api/v1/scan/ping": {
      post: {
        summary: "사이트 존재 확인",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              examples: {
                jsonExample: {
                  summary: "defalut",
                  value: {
                    url: "https://dev-portfolio.withmay.com/",
                  },
                },
              },
            },
          },
        },
        responses: { 200: { description: "ok (text/plain)" } },
      },
    },
    "/api/v1/scan/robotsTxt": {
      post: {
        summary: "사이트 robot.txt 확인",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              examples: {
                jsonExample: {
                  summary: "defalut",
                  value: {
                    url: "https://dev-portfolio.withmay.com/",
                  },
                },
              },
            },
          },
        },
        responses: { 200: { description: "ok (text/plain)" } },
      },
    },
    "/api/v1/scan/siteMap": {
      post: {
        summary: "사이트 sitemap 확인",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              examples: {
                jsonExample: {
                  summary: "defalut",
                  value: {
                    url: "https://dev-portfolio.withmay.com/",
                  },
                },
              },
            },
          },
        },
        responses: { 200: { description: "ok (text/plain)" } },
      },
    },
    "/api/v1/scan/crawling": {
      post: {
        summary: "사이트 crawling",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              examples: {
                jsonExample: {
                  summary: "defalut",
                  value: {},
                },
              },
            },
          },
        },
        responses: { 200: { description: "ok (text/plain)" } },
      },
    },
  },
  components: {
    schemas: {
      RunRequest: {
        type: "object",
        required: ["url"],
        properties: {
          url: { type: "string", format: "uri" },
          formFactor: {
            type: "string",
            enum: ["mobile", "desktop"],
            default: "mobile",
          },
          onlyCategories: {
            type: "array",
            items: {
              type: "string",
              enum: [
                "performance",
                "seo",
                "best-practices",
                "accessibility",
                "pwa",
              ],
            },
            default: ["performance", "seo", "best-practices", "accessibility"],
          },
          format: { type: "string", enum: ["json", "html"], default: "json" },
          download: { type: "boolean", default: false },
        },
      },
      LighthouseResult: {
        type: "object",
        description: "Lighthouse LHR(JSON) 전체 구조",
        additionalProperties: true,
      },
      ErrorResponse: {
        type: "object",
        properties: {
          error: { type: "string" },
          detail: { type: "string" },
          stack: { type: "string" },
        },
      },
    },
  },
};
