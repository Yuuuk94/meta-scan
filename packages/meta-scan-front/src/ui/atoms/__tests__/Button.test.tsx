import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";

import { Button } from "@/ui/atoms/Button";

describe("Button", () => {
  it("호버 시 cursor: pointer가 적용되도록 cursor-pointer 클래스를 가진다 (#16)", () => {
    render(<Button>클릭</Button>);

    expect(screen.getByRole("button", { name: "클릭" })).toHaveClass(
      "cursor-pointer"
    );
  });

  it("support variant에는 hover 클래스가 없다 (#63)", () => {
    render(<Button variant="support">후원</Button>);

    const cls = screen.getByRole("button", { name: "후원" }).className;
    expect(cls).toContain("bg-primary");
    expect(cls).toContain("dark:bg-accent/50");
    expect(cls).not.toMatch(/hover:/);
  });
});
