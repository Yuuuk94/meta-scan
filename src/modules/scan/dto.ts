import { z } from "zod";

export const RunBodySchema = z.object({
  url: z.string().url("valid url is required"),
});

export type RunBody = z.infer<typeof RunBodySchema>;
