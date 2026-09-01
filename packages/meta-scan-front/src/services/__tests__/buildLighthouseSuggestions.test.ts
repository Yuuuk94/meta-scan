import { buildLighthouseSuggestions } from "@/services/buildLighthouseSuggestions";

describe("buildLighthouseSuggestions", () => {
  it("filters audits to score !== null && score < 0.9, sorted lowest-first (spec-fixed.md req #1)", () => {
    const lighthouse: LighthouseData = {
      audits: {
        "render-blocking-resources": {
          id: "render-blocking-resources",
          title: "Eliminate render-blocking resources",
          score: 0.4,
        },
        "uses-optimized-images": {
          id: "uses-optimized-images",
          title: "Efficiently encode images",
          score: 0.75,
        },
        "color-contrast": {
          id: "color-contrast",
          title: "Background/foreground colors have sufficient contrast",
          score: 1,
        },
      },
    };

    expect(buildLighthouseSuggestions(lighthouse)).toEqual([
      {
        id: "render-blocking-resources",
        title: "Eliminate render-blocking resources",
        description: undefined,
        score: 0.4,
      },
      {
        id: "uses-optimized-images",
        title: "Efficiently encode images",
        description: undefined,
        score: 0.75,
      },
    ]);
  });

  it("excludes audits whose score is null (not applicable/manual/informative)", () => {
    const lighthouse: LighthouseData = {
      audits: {
        "structured-data": {
          id: "structured-data",
          title: "Structured data is valid",
          score: null,
        },
      },
    };

    expect(buildLighthouseSuggestions(lighthouse)).toEqual([]);
  });

  it("caps the result at the top 5 lowest-scoring audits", () => {
    const audits: Record<string, LighthouseAuditResult> = {};
    for (let i = 0; i < 8; i += 1) {
      audits[`audit-${i}`] = {
        id: `audit-${i}`,
        title: `Audit ${i}`,
        score: i / 10, // 0, 0.1, ..., 0.7 — all < 0.9
      };
    }

    const result = buildLighthouseSuggestions({ audits });

    expect(result).toHaveLength(5);
    expect(result.map((s) => s.score)).toEqual([0, 0.1, 0.2, 0.3, 0.4]);
  });

  it("passes each audit's description through when present", () => {
    const lighthouse: LighthouseData = {
      audits: {
        "uses-text-compression": {
          id: "uses-text-compression",
          title: "Enable text compression",
          description: "Text-based resources should be served with compression.",
          score: 0.5,
        },
      },
    };

    expect(buildLighthouseSuggestions(lighthouse)[0].description).toBe(
      "Text-based resources should be served with compression."
    );
  });

  it("returns an empty array when lighthouse itself or its audits is null/undefined", () => {
    expect(buildLighthouseSuggestions(null)).toEqual([]);
    expect(buildLighthouseSuggestions(undefined)).toEqual([]);
    expect(buildLighthouseSuggestions({})).toEqual([]);
  });
});
