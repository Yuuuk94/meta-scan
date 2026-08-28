import React from "react";
import { act, render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";

const replace = jest.fn();
const push = jest.fn();
jest.mock("next/navigation", () => ({
  useRouter: () => ({ replace, push }),
}));

jest.mock("@/api/scanApi", () => ({
  scanRobotsTxtApi: jest.fn(),
  scanSiteMapApi: jest.fn(),
  scanCrawlingApi: jest.fn(),
  lsRunApi: jest.fn(),
}));

import {
  lsRunApi,
  scanCrawlingApi,
  scanRobotsTxtApi,
  scanSiteMapApi,
} from "@/api/scanApi";
import { ProcessScreen } from "@/ui/organisms/ProcessScreen";

const mockedRobotsTxt = scanRobotsTxtApi as jest.Mock;
const mockedSiteMap = scanSiteMapApi as jest.Mock;
const mockedCrawling = scanCrawlingApi as jest.Mock;
const mockedLsRun = lsRunApi as jest.Mock;

const t = {
  analyzingText: "analyzing",
  analyzingSubtext: "sub",
  steps: ["robots.txt", "sitemap.xml", "crawl", "lighthouse"],
  stepsHint: "hint",
  errorTitle: "site cant be reached",
  errorSubtitle: "check url",
  retryButton: "retry",
  goBack: "home",
  blockedTitle: "site blocked",
  blockedDescription: "desc",
  blockedDescriptionMobile: "desc mobile",
  blockedTargetLabel: "target",
  blockedAction: "try another",
  blockedCaption: "caption",
  blockedCaptionMobile: "caption mobile",
};

const siteStatus: SiteStatusData = {
  status: "ok",
  url: "https://example.com",
  redirected: false,
};

const renderScreen = () =>
  render(
    <ProcessScreen theme="dark" lang="ko" t={t} siteStatus={siteStatus} />,
  );

beforeEach(() => {
  jest.clearAllMocks();
});

describe("ProcessScreen robots.txt 게이팅 (ADR-006, 이슈 #1)", () => {
  it("robotsTxt를 단독으로 먼저 호출하고, 응답이 오기 전까지 나머지 3개는 호출하지 않는다", async () => {
    let resolveRobots: (value: unknown) => void = () => {};
    mockedRobotsTxt.mockReturnValue(
      new Promise((resolve) => {
        resolveRobots = resolve;
      }),
    );
    mockedSiteMap.mockResolvedValue({ data: { status: "ok" } });
    mockedCrawling.mockResolvedValue({ data: { status: "ok" } });
    mockedLsRun.mockResolvedValue({ data: { status: "ok" } });

    renderScreen();

    expect(mockedRobotsTxt).toHaveBeenCalledTimes(1);
    expect(mockedSiteMap).not.toHaveBeenCalled();
    expect(mockedCrawling).not.toHaveBeenCalled();
    expect(mockedLsRun).not.toHaveBeenCalled();

    // Still the existing step-tile grid while waiting — no new loading UI.
    expect(screen.getByText(t.analyzingText)).toBeInTheDocument();

    await act(async () => {
      resolveRobots({
        data: { status: "ok", has: true, allow: { "*": true } },
      });
    });

    await waitFor(() => expect(mockedSiteMap).toHaveBeenCalledTimes(1));
    expect(mockedCrawling).toHaveBeenCalledTimes(1);
    expect(mockedLsRun).toHaveBeenCalledTimes(1);
  });

  it("robots.txt가 비허용이면 BlockedScreen을 렌더하고 나머지 3개 호출을 건너뛴다", async () => {
    mockedRobotsTxt.mockResolvedValue({
      data: { status: "ok", has: true, allow: { "*": false } },
    });

    renderScreen();

    await waitFor(() =>
      expect(screen.getByText(t.blockedTitle)).toBeInTheDocument(),
    );

    // Step grid is unmounted, replaced entirely by BlockedScreen.
    expect(screen.queryByText(t.analyzingText)).not.toBeInTheDocument();
    expect(mockedSiteMap).not.toHaveBeenCalled();
    expect(mockedCrawling).not.toHaveBeenCalled();
    expect(mockedLsRun).not.toHaveBeenCalled();
    expect(replace).not.toHaveBeenCalled();
  });

  it("robots.txt가 없으면(has: false) 허용으로 간주하고 진행한다", async () => {
    mockedRobotsTxt.mockResolvedValue({
      data: { status: "ok", has: false },
    });
    mockedSiteMap.mockResolvedValue({ data: { status: "ok" } });
    mockedCrawling.mockResolvedValue({ data: { status: "ok" } });
    mockedLsRun.mockResolvedValue({ data: { status: "ok" } });

    renderScreen();

    await waitFor(() => expect(replace).toHaveBeenCalledTimes(1));
    expect(replace.mock.calls[0][0]).toMatch(/^\/scan\/[0-9a-f-]{36}$/);
    expect(screen.queryByText(t.blockedTitle)).not.toBeInTheDocument();
  });

  it("robotsTxt 호출 자체가 실패하면 BlockedScreen이 아니라 ErrorScreen을 렌더한다", async () => {
    mockedRobotsTxt.mockRejectedValue(new Error("network error"));

    renderScreen();

    await waitFor(() =>
      expect(screen.getByText(t.errorTitle)).toBeInTheDocument(),
    );

    expect(screen.queryByText(t.blockedTitle)).not.toBeInTheDocument();
    expect(mockedSiteMap).not.toHaveBeenCalled();
    expect(mockedCrawling).not.toHaveBeenCalled();
    expect(mockedLsRun).not.toHaveBeenCalled();
  });

  it("renders ErrorScreen instead of throwing when robotsTxt resolves 2xx with an empty body", async () => {
    mockedRobotsTxt.mockResolvedValue({ data: null });

    renderScreen();

    await waitFor(() =>
      expect(screen.getByText(t.errorTitle)).toBeInTheDocument(),
    );

    expect(screen.queryByText(t.blockedTitle)).not.toBeInTheDocument();
    expect(mockedSiteMap).not.toHaveBeenCalled();
    expect(mockedCrawling).not.toHaveBeenCalled();
    expect(mockedLsRun).not.toHaveBeenCalled();
  });
});
