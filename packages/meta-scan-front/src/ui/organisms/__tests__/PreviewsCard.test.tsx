import React from "react";
import { render, screen } from "@testing-library/react";

import { PreviewsCard } from "@/ui/organisms/PreviewsCard";

const t = {
  previews: "Previews — OG · Twitter",
  previewsOgImageDimensionsPass: "og:image가 설정되어 있다",
  previewsOgImageDimensionsWarning: "og:image가 없다",
  previewsFaviconPass: "favicon이 확인된다",
  previewsFaviconWarning: "favicon을 찾을 수 없다",
  previewsOgRequiredTagsPass: "OG 필수 태그가 모두 있다",
  previewsOgRequiredTagsWarning: "OG 필수 태그 중 일부가 없다",
  previewsTwitterCardPass: "twitter:card가 설정되어 있다",
  previewsTwitterCardWarning: "twitter:card가 없다",
  previewsGoogleMockupLabel: "구글 검색 미리보기",
  previewsTwitterMockupLabel: "트위터 카드 미리보기",
  previewsImagePlaceholderLabel: "이미지 없음",
};

const fourChecks: PreviewsCheckItem[] = [
  { id: "ogImageDimensions", status: "pass" },
  { id: "favicon", status: "warning" },
  { id: "ogRequiredTags", status: "pass" },
  { id: "twitterCard", status: "warning" },
];

describe("PreviewsCard", () => {
  it("renders the card title from the dictionary", () => {
    render(
      <PreviewsCard
        lang="ko"
        theme="dark"
        t={t}
        checks={fourChecks}
        url="https://example.com"
      />
    );
    expect(screen.getByText("Previews — OG · Twitter")).toBeInTheDocument();
  });

  it("renders all 4 badge rows with a StatusBadge each and the assembled sentence", () => {
    render(
      <PreviewsCard
        lang="ko"
        theme="dark"
        t={t}
        checks={fourChecks}
        url="https://example.com"
      />
    );

    expect(screen.getByText("og:image가 설정되어 있다")).toBeInTheDocument();
    expect(screen.getByText("favicon을 찾을 수 없다")).toBeInTheDocument();
    expect(screen.getByText("OG 필수 태그가 모두 있다")).toBeInTheDocument();
    expect(screen.getByText("twitter:card가 없다")).toBeInTheDocument();

    expect(screen.getAllByText("PASS")).toHaveLength(2);
    expect(screen.getAllByText("WARNING")).toHaveLength(2);
  });

  it("renders nothing when there are no checks (e.g. crawling failed)", () => {
    const { container } = render(
      <PreviewsCard
        lang="ko"
        theme="dark"
        t={t}
        checks={[]}
        url="https://example.com"
      />
    );
    expect(container).toBeEmptyDOMElement();
  });

  it("renders a Google-style mockup with an uppercase domain and og:title/og:description", () => {
    render(
      <PreviewsCard
        lang="ko"
        theme="dark"
        t={t}
        checks={fourChecks}
        url="https://example.com/page"
        title="Fallback Title"
        description="Fallback description"
        openGraph={{
          "og:title": "meta-scan — 무료 SEO/AEO 체크리스트",
          "og:description": "URL 하나로 항목별로 점검한다",
          "og:image": "https://example.com/og.png",
        }}
      />
    );

    expect(screen.getByText("EXAMPLE.COM")).toBeInTheDocument();
    // No `twitter` prop given, so the Twitter-style mockup falls all the
    // way back to the same og:* values — appears once per mockup.
    expect(
      screen.getAllByText("meta-scan — 무료 SEO/AEO 체크리스트")
    ).toHaveLength(2);
    expect(
      screen.getAllByText("URL 하나로 항목별로 점검한다")
    ).toHaveLength(2);
  });

  it("renders a Twitter-style mockup with a lowercase domain, falling back to og:*/base title-description when twitter:* is missing", () => {
    render(
      <PreviewsCard
        lang="ko"
        theme="dark"
        t={t}
        checks={fourChecks}
        url="https://example.com/page"
        title="Fallback Title"
        description="Fallback description"
        openGraph={{
          "og:title": "OG Title",
          "og:description": "OG description",
        }}
        twitter={{}}
      />
    );

    expect(screen.getByText("example.com")).toBeInTheDocument();
    // Both mockups fall back to the same og:*/base values here (openGraph
    // has no separate values from twitter), so this appears once per
    // mockup — 2 total.
    expect(screen.getAllByText("OG Title")).toHaveLength(2);
    expect(screen.getAllByText("OG description")).toHaveLength(2);
  });

  it("prefers twitter:title/twitter:description over og:*/base for the Twitter-style mockup when present", () => {
    render(
      <PreviewsCard
        lang="ko"
        theme="dark"
        t={t}
        checks={fourChecks}
        url="https://example.com/page"
        title="Fallback Title"
        openGraph={{ "og:title": "OG Title" }}
        twitter={{
          "twitter:title": "Twitter Title",
          "twitter:description": "Twitter description",
        }}
      />
    );

    expect(screen.getByText("Twitter Title")).toBeInTheDocument();
    expect(screen.getByText("Twitter description")).toBeInTheDocument();
  });
});
