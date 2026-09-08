import React from "react";
import { render, screen, waitFor } from "@testing-library/react";

import { ServiceStatus } from "@/ui/organisms/ServiceStatus";
import { pingApi } from "@/api/statusApi";

jest.mock("@/api/statusApi", () => ({
  pingApi: jest.fn(),
}));

const mockedPing = pingApi as jest.Mock;

// 이슈 #44 root-ping-cold-start — RootLayout이 SSR pingApi를 300ms 타임아웃과
// race시킨 뒤 못 받으면 "pending"을 내려주고, <ServiceStatus>가 그걸 받아
// 클라이언트에서 1회 재시도해 확정하는 쪽 (AC1~AC5).
describe("ServiceStatus (issue #44)", () => {
  beforeEach(() => {
    mockedPing.mockReset();
  });

  it("AC1: ready=online이면 ONLINE 뱃지를 렌더하고 pingApi를 재호출하지 않는다", () => {
    render(<ServiceStatus ready="online" />);

    expect(screen.getByText("ONLINE")).toBeInTheDocument();
    expect(mockedPing).not.toHaveBeenCalled();
  });

  it("AC6: ready=off(SSR 즉시 reject로 확정된 실패)면 OFFLINE을 렌더하고 재시도하지 않는다", () => {
    render(<ServiceStatus ready="off" />);

    expect(screen.getByText("OFFLINE")).toBeInTheDocument();
    expect(mockedPing).not.toHaveBeenCalled();
  });

  it("AC2: ready=pending이면 기존 WARNING 시각으로 즉시 렌더한다", () => {
    mockedPing.mockReturnValue(new Promise(() => {}));

    render(<ServiceStatus ready="pending" />);

    expect(screen.getByText("WARNING")).toBeInTheDocument();
  });

  it("AC3: ready=pending으로 mount되면 pingApi를 정확히 1회 호출하고, 성공하면 ONLINE으로 갱신한다", async () => {
    mockedPing.mockResolvedValue({ data: { status: "ok" } });

    render(<ServiceStatus ready="pending" />);

    await waitFor(() => expect(screen.getByText("ONLINE")).toBeInTheDocument());
    expect(mockedPing).toHaveBeenCalledTimes(1);
  });

  it("AC3: CSR 재시도가 실패(non-ok)하면 OFFLINE으로 갱신한다", async () => {
    mockedPing.mockResolvedValue({ data: { status: "fail" } });

    render(<ServiceStatus ready="pending" />);

    await waitFor(() => expect(screen.getByText("OFFLINE")).toBeInTheDocument());
  });

  it("AC3: CSR 재시도가 reject되면 OFFLINE으로 갱신한다", async () => {
    mockedPing.mockRejectedValue(new Error("network error"));

    render(<ServiceStatus ready="pending" />);

    await waitFor(() => expect(screen.getByText("OFFLINE")).toBeInTheDocument());
  });

  it("AC4: 헤더/푸터 두 인스턴스가 각자 독립적으로 pingApi를 호출한다(중복 2회 허용)", async () => {
    mockedPing.mockResolvedValue({ data: { status: "ok" } });

    render(
      <>
        <ServiceStatus ready="pending" />
        <ServiceStatus ready="pending" fullLabel />
      </>,
    );

    await waitFor(() => expect(mockedPing).toHaveBeenCalledTimes(2));
  });

  it("AC5: fullLabel일 때 SYSTEM ONLINE/OFFLINE/WARNING 전체 라벨을 쓴다", () => {
    render(<ServiceStatus ready="online" fullLabel />);

    expect(screen.getByText("SYSTEM ONLINE")).toBeInTheDocument();
  });
});
