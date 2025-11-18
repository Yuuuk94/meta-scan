import { instance } from ".";

export const pingApi = instance.get<OkStatus>("/healthz", {
  adapter: "fetch",
  //   fetchOptions: { cache: "force-cache" },
});
