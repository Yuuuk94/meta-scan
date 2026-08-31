import { instance } from "@/api/instance";
import { lsRunApi } from "@/api/scanApi";

jest.mock("@/api/instance", () => ({
  instance: { post: jest.fn().mockResolvedValue({ data: {} }) },
}));

describe("lsRunApi", () => {
  it("requests all 4 Lighthouse categories (performance/seo/best-practices/accessibility)", async () => {
    await lsRunApi({ url: "https://example.com" });

    expect(instance.post).toHaveBeenCalledWith(
      "/api/v1/lighthouse/run",
      expect.objectContaining({
        onlyCategories: expect.arrayContaining([
          "performance",
          "seo",
          "best-practices",
          "accessibility",
        ]),
      })
    );

    const [, body] = (instance.post as jest.Mock).mock.calls[0];
    expect(body.onlyCategories).toHaveLength(4);
  });
});
