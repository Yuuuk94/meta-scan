import React from "react";
import { render, screen } from "@testing-library/react";

import { LighthouseCard } from "@/ui/organisms/LighthouseCard";

const t = {
  lighthouseScores: "Lighthouse 점수",
  performance: "Performance",
  seo: "SEO",
  accessibility: "Accessibility",
  bestPractices: "Best Practices",
  lighthouseSuggestions: "Lighthouse 개선 제안",
};

const lighthouse: CombinedLighthouse = {
  scores: {
    performance: 0.42,
    seo: 1,
    accessibility: 0.876,
    bestPractices: 0.75,
  },
  suggestions: [
    {
      id: "render-blocking-resources",
      title: "Eliminate render-blocking resources",
      description: "These resources block the first paint of your page.",
      score: 0.4,
    },
    {
      id: "uses-optimized-images",
      title: "Efficiently encode images",
      score: 0.65,
    },
  ],
};

describe("LighthouseCard", () => {
  it("renders the 4 category scores as-is, rounded to whole percentages (req #3, no re-judging)", () => {
    render(<LighthouseCard lang="ko" theme="dark" t={t} lighthouse={lighthouse} />);

    expect(screen.getByText("Lighthouse 점수")).toBeInTheDocument();
    expect(screen.getByText("42")).toBeInTheDocument();
    expect(screen.getByText("100")).toBeInTheDocument();
    expect(screen.getByText("88")).toBeInTheDocument();
    expect(screen.getByText("75")).toBeInTheDocument();
  });

  it("renders the top suggestions with title and description", () => {
    render(<LighthouseCard lang="ko" theme="dark" t={t} lighthouse={lighthouse} />);

    expect(
      screen.getByText("Eliminate render-blocking resources")
    ).toBeInTheDocument();
    expect(
      screen.getByText("These resources block the first paint of your page.")
    ).toBeInTheDocument();
    expect(screen.getByText("Efficiently encode images")).toBeInTheDocument();
  });

  it("never renders our own pass/warning/fail/info StatusBadge vocabulary (req #2, source distinction)", () => {
    render(<LighthouseCard lang="ko" theme="dark" t={t} lighthouse={lighthouse} />);

    expect(screen.queryByText("PASS")).not.toBeInTheDocument();
    expect(screen.queryByText("FAIL")).not.toBeInTheDocument();
    expect(screen.queryByText("WARNING")).not.toBeInTheDocument();
    expect(document.querySelector('[data-slot="status-badge"]')).toBeNull();
  });

  it("stays absent when there are no scores at all and no suggestions (lighthouse call failed)", () => {
    const empty: CombinedLighthouse = {
      scores: {
        performance: null,
        seo: null,
        accessibility: null,
        bestPractices: null,
      },
      suggestions: [],
    };

    const { container } = render(
      <LighthouseCard lang="ko" theme="dark" t={t} lighthouse={empty} />
    );
    expect(container).toBeEmptyDOMElement();
  });

  it("still renders scores when suggestions is empty (all audits scored >= 0.9)", () => {
    const noSuggestions: CombinedLighthouse = {
      scores: { performance: 1, seo: 1, accessibility: 1, bestPractices: 1 },
      suggestions: [],
    };

    render(
      <LighthouseCard lang="ko" theme="dark" t={t} lighthouse={noSuggestions} />
    );
    expect(screen.getAllByText("100")).toHaveLength(4);
  });
});
