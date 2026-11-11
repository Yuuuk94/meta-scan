import { render, screen } from "@testing-library/react";
import { CheckGroupsSection } from "@/ui/organisms/CheckGroupsSection";

// issue #76 — home "무엇을 검사하나요": real explanatory text per check group.
describe("CheckGroupsSection", () => {
  const groups = [
    { title: "기본 SEO", body: "title과 description", href: "/ko/blog/a" },
    { title: "색인", body: "robots.txt와 sitemap" },
  ];

  it("renders each group with its explanation", () => {
    render(<CheckGroupsSection title="무엇을 검사하나요" groups={groups} linkLabel="자세히" />);
    expect(screen.getByRole("heading", { name: "무엇을 검사하나요" })).toBeInTheDocument();
    expect(screen.getByText("title과 description")).toBeInTheDocument();
    expect(screen.getByText("robots.txt와 sitemap")).toBeInTheDocument();
  });

  it("links a group to its guide only when it has one", () => {
    render(<CheckGroupsSection title="t" groups={groups} linkLabel="자세히" />);
    const links = screen.getAllByRole("link", { name: /자세히/ });
    expect(links).toHaveLength(1);
    expect(links[0]).toHaveAttribute("href", "/ko/blog/a");
  });
});
