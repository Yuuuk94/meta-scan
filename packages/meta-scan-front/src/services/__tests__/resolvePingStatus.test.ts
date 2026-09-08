import { resolvePingStatus, pingTimeoutMs } from "@/services/resolvePingStatus";

// 이슈 #44 root-ping-cold-start — RootLayout의 SSR pingApi await을 300ms
// 타임아웃과 경합(race)시키는 순수 로직. RootLayout 자체(html/body 렌더링,
// server-only 사전 로딩 등)는 RTL로 검증하기 어려운 영역이라, 여기서 racing
// 판정 로직만 분리해 단위 테스트한다 (front CLAUDE.md api/services/hooks 분리).
describe("resolvePingStatus (issue #44 AC1/AC2/AC6)", () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("AC1: pingApi가 타임아웃 이전에 status ok로 resolve되면 online을 반환한다", async () => {
    const ping = jest.fn().mockResolvedValue({ data: { status: "ok" } });

    const promise = resolvePingStatus(ping);

    await expect(promise).resolves.toBe("online");
  });

  it("pingApi가 타임아웃 이전에 non-ok status로 resolve되면 off를 반환한다", async () => {
    const ping = jest.fn().mockResolvedValue({ data: { status: "fail" } });

    const promise = resolvePingStatus(ping);

    await expect(promise).resolves.toBe("off");
  });

  it("AC6: pingApi가 타임아웃 이전에 즉시 reject되면 pending이 아니라 확정된 off를 반환한다", async () => {
    const ping = jest.fn().mockRejectedValue(new Error("connection refused"));

    const promise = resolvePingStatus(ping);

    await expect(promise).resolves.toBe("off");
  });

  it("AC2: pingApi가 300ms 안에 settle되지 않으면 pending을 반환한다", async () => {
    const ping = jest.fn().mockReturnValue(new Promise(() => {}));

    const promise = resolvePingStatus(ping);
    jest.advanceTimersByTime(pingTimeoutMs);

    await expect(promise).resolves.toBe("pending");
  });

  it("pingApi가 타임아웃 이후에 resolve되어도 이미 pending으로 확정된 결과는 바뀌지 않는다", async () => {
    let resolvePing: (v: { data: OkStatus }) => void;
    const ping = jest.fn(
      () =>
        new Promise<{ data: OkStatus }>((resolve) => {
          resolvePing = resolve;
        }),
    );

    const promise = resolvePingStatus(ping);
    jest.advanceTimersByTime(pingTimeoutMs);
    const result = await promise;

    resolvePing!({ data: { status: "ok" } });

    expect(result).toBe("pending");
  });

  it("타임아웃 값은 300ms로 하드코딩돼 있다", () => {
    expect(pingTimeoutMs).toBe(300);
  });
});
