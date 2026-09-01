import { buildLighthouseScores } from "@/services/buildLighthouseScores";

describe("buildLighthouseScores", () => {
  it("passes the 4 category scores through as-is, no re-judging (spec-fixed.md req #3)", () => {
    const lighthouse: LighthouseData = {
      categories: {
        performance: { title: "Performance", score: 0.98 },
        seo: { title: "SEO", score: 1 },
        accessibility: { title: "Accessibility", score: 0.55 },
        "best-practices": { title: "Best Practices", score: 0.75 },
      },
    };

    expect(buildLighthouseScores(lighthouse)).toEqual({
      performance: 0.98,
      seo: 1,
      accessibility: 0.55,
      bestPractices: 0.75,
    });
  });

  it("maps the hyphenated best-practices category key to bestPractices", () => {
    const lighthouse: LighthouseData = {
      categories: {
        "best-practices": { title: "Best Practices", score: 0.4 },
      },
    };

    expect(buildLighthouseScores(lighthouse).bestPractices).toBe(0.4);
  });

  it("defaults missing categories to null instead of throwing", () => {
    expect(buildLighthouseScores({})).toEqual({
      performance: null,
      seo: null,
      accessibility: null,
      bestPractices: null,
    });
  });

  it("defaults to all-null when lighthouse itself is null/undefined", () => {
    expect(buildLighthouseScores(null)).toEqual({
      performance: null,
      seo: null,
      accessibility: null,
      bestPractices: null,
    });
    expect(buildLighthouseScores(undefined)).toEqual({
      performance: null,
      seo: null,
      accessibility: null,
      bestPractices: null,
    });
  });
});
