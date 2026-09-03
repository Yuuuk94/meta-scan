import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";

import { PreviewsCard } from "@/ui/organisms/PreviewsCard";

const t = {
  previews: "Previews — OG 태그",
  previewsOgImageDimensionsPass: "og:image가 설정되어 있다",
  previewsOgImageDimensionsWarning: "og:image가 없다",
  previewsFaviconPass: "favicon이 확인된다",
  previewsFaviconWarning: "favicon을 찾을 수 없다",
  previewsOgRequiredTagsPass: "OG 필수 태그가 모두 있다",
  previewsOgRequiredTagsWarning: "OG 필수 태그 중 일부가 없다",
  previewsTwitterCardPass: "twitter:card가 설정되어 있다",
  previewsTwitterCardWarning: "twitter:card가 없다",
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
    expect(screen.getByText("Previews — OG 태그")).toBeInTheDocument();
  });

  it("renders all 4 rows vertically stacked, each with a StatusBadge and the assembled sentence", () => {
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
    expect(screen.getAllByText("WARN")).toHaveLength(2);
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

  it("renders a single Google-style mockup with an uppercase domain and og:title/og:description", () => {
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
    expect(
      screen.getByText("meta-scan — 무료 SEO/AEO 체크리스트")
    ).toBeInTheDocument();
    expect(
      screen.getByText("URL 하나로 항목별로 점검한다")
    ).toBeInTheDocument();
  });

  it("falls back to title/description props when openGraph has no og:title/og:description", () => {
    render(
      <PreviewsCard
        lang="ko"
        theme="dark"
        t={t}
        checks={fourChecks}
        url="https://example.com/page"
        title="Fallback Title"
        description="Fallback description"
        openGraph={{}}
      />
    );

    expect(screen.getByText("Fallback Title")).toBeInTheDocument();
    expect(screen.getByText("Fallback description")).toBeInTheDocument();
  });

  it("renders a real <img> from og:image instead of the placeholder block (issue #24)", () => {
    render(
      <PreviewsCard
        lang="ko"
        theme="dark"
        t={t}
        checks={fourChecks}
        url="https://example.com/page"
        openGraph={{
          "og:title": "meta-scan",
          "og:image": "https://example.com/og.png",
        }}
      />
    );

    const img = screen.getByRole("img");
    expect(img).toHaveAttribute("src", "https://example.com/og.png");
    expect(
      screen.queryByLabelText(t.previewsImagePlaceholderLabel as string)
    ).not.toBeInTheDocument();
  });

  it("renders the placeholder block when there is no og:image (issue #24)", () => {
    render(
      <PreviewsCard
        lang="ko"
        theme="dark"
        t={t}
        checks={fourChecks}
        url="https://example.com/page"
        openGraph={{ "og:title": "meta-scan" }}
      />
    );

    expect(
      screen.getByLabelText(t.previewsImagePlaceholderLabel as string)
    ).toBeInTheDocument();
    expect(screen.queryByRole("img")).not.toBeInTheDocument();
  });

  it("falls back to the placeholder block when the og:image fails to load (issue #24)", () => {
    render(
      <PreviewsCard
        lang="ko"
        theme="dark"
        t={t}
        checks={fourChecks}
        url="https://example.com/page"
        openGraph={{
          "og:title": "meta-scan",
          "og:image": "https://example.com/broken.png",
        }}
      />
    );

    const img = screen.getByRole("img");
    fireEvent.error(img);

    expect(screen.queryByRole("img")).not.toBeInTheDocument();
    expect(
      screen.getByLabelText(t.previewsImagePlaceholderLabel as string)
    ).toBeInTheDocument();
  });
});
