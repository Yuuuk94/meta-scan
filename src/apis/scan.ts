import { instance } from ".";

export const sitePingApi = async (data: UrlData) =>
  await instance.post<any>("/scan/ping", data, {
    adapter: "fetch",
  });
