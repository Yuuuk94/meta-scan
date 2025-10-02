import { z } from "zod";

export const UrlBodySchema = z.object({
  url: z.string().url("valid url is required"),
});

export type UrlBody = z.infer<typeof UrlBodySchema>;

export const UrlsBodySchema = z.object({
  urls: z.array(z.string().url("valid url is required")).min(1),
});

export type UrlsBody = z.infer<typeof UrlsBodySchema>;
