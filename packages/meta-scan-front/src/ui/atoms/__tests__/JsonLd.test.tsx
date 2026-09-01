import React from "react";
import { render } from "@testing-library/react";

import { JsonLd } from "@/ui/atoms/JsonLd";

describe("JsonLd", () => {
  it("renders an application/ld+json script tag containing the serialized data", () => {
    const data = { "@context": "https://schema.org", "@type": "FAQPage" };
    const { container } = render(<JsonLd data={data} />);

    const script = container.querySelector(
      'script[type="application/ld+json"]'
    );

    expect(script).not.toBeNull();
    expect(JSON.parse(script?.innerHTML ?? "null")).toEqual(data);
  });
});
