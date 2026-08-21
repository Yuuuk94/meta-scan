import { ZodSchema } from "zod";
import { ApiError } from "@/core/http/ApiError.js";

export function validate<T>(schema: ZodSchema<T>, data: unknown): T {
  const parsed = schema.safeParse(data);
  if (!parsed.success) {
    const msg = parsed.error.issues.map((i) => i.message).join(", ");
    throw ApiError.badRequest(msg);
  }
  return parsed.data;
}
