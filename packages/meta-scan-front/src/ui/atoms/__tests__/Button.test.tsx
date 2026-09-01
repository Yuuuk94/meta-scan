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
});
