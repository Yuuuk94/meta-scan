import { render, screen } from "@testing-library/react";
import { LatestPostsSection } from "@/ui/organisms/LatestPostsSection";

const post = (n: number) => ({
  slug: `post-${n}`,
  title: `Post ${n}`,
  description: `Desc ${n}`,
  publishedAt: `2026-11-1${n}`,
});

// issue #76 — home links the newest blog posts (crawl path + real text).
describe("LatestPostsSection", () => {
  it("links up to 3 posts plus the blog index", () => {
    render(
      <LatestPostsSection
        lang="ko"
        title="최신 글"
        moreLabel="전체 보기"
        posts={[post(1), post(2), post(3), post(4)]}
      />,
    );
    expect(screen.getAllByRole("link", { name: /Post/ })).toHaveLength(3);
    expect(screen.getByRole("link", { name: "Post 1" })).toHaveAttribute("href", "/ko/blog/post-1");
    expect(screen.getByRole("link", { name: "전체 보기" })).toHaveAttribute("href", "/ko/blog");
  });

  it("renders nothing without posts", () => {
    const { container } = render(
      <LatestPostsSection lang="en" title="Latest" moreLabel="All" posts={[]} />,
    );
    expect(container).toBeEmptyDOMElement();
  });
});
