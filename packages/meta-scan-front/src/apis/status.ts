import { instance } from ".";

export const pingApi = async () =>
  await instance.get<OkStatus>("/api/v1/healthz");
