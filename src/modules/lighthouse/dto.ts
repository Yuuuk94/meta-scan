import { z } from "zod";

export const RunBodySchema = z.object({
  url: z.string().url("valid url is required"),
  formFactor: z.enum(["mobile", "desktop"]).default("mobile"),
  onlyCategories: z
    .array(z.enum(["performance", "seo", "best-practices", "accessibility"]))
    .default(["performance", "seo", "best-practices", "accessibility"]),
  format: z.enum(["html", "json"]).default("html"),
});

export type RunBody = z.infer<typeof RunBodySchema>;
