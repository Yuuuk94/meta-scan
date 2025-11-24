import { instance } from ".";

export const sitePingApi = async (data: UrlData) =>
  await instance.post<SiteStatus>("/scan/ping", data, {
    adapter: "fetch",
  });
