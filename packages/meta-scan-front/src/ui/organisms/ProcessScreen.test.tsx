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
    <ProcessScreen theme="dark" lang="ko" t={t} siteStatus={siteStatus} />
  );

beforeEach(() => {
  jest.clearAllMocks();
});

describe("ProcessScreen robots.txt gating (ADR-006, issue #1)", () => {
  it("calls robotsTxt alone first and does not call the other 3 until it resolves", async () => {
    let resolveRobots: (value: unknown) => void = () => {};
    mockedRobotsTxt.mockReturnValue(
      new Promise((resolve) => {
        resolveRobots = resolve;
      })
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
      resolveRobots({ data: { status: "ok", has: true, allow: { "*": true } } });
    });

    await waitFor(() => expect(mockedSiteMap).toHaveBeenCalledTimes(1));
    expect(mockedCrawling).toHaveBeenCalledTimes(1);
    expect(mockedLsRun).toHaveBeenCalledTimes(1);
  });

  it("renders BlockedScreen and skips the other 3 calls when robots.txt disallows", async () => {
    mockedRobotsTxt.mockResolvedValue({
      data: { status: "ok", has: true, allow: { "*": false } },
    });

    renderScreen();

    await waitFor(() =>
      expect(screen.getByText(t.blockedTitle)).toBeInTheDocument()
    );

    // Step grid is unmounted, replaced entirely by BlockedScreen.
    expect(screen.queryByText(t.analyzingText)).not.toBeInTheDocument();
    expect(mockedSiteMap).not.toHaveBeenCalled();
    expect(mockedCrawling).not.toHaveBeenCalled();
    expect(mockedLsRun).not.toHaveBeenCalled();
    expect(replace).not.toHaveBeenCalled();
  });

  it("treats a missing robots.txt (has: false) as allowed and proceeds", async () => {
    mockedRobotsTxt.mockResolvedValue({
      data: { status: "ok", has: false },
    });
    mockedSiteMap.mockResolvedValue({ data: { status: "ok" } });
    mockedCrawling.mockResolvedValue({ data: { status: "ok" } });
    mockedLsRun.mockResolvedValue({ data: { status: "ok" } });

    renderScreen();

    await waitFor(() => expect(replace).toHaveBeenCalledWith("/scan"));
    expect(screen.queryByText(t.blockedTitle)).not.toBeInTheDocument();
  });

  it("renders ErrorScreen (not BlockedScreen) when the robotsTxt call itself fails", async () => {
    mockedRobotsTxt.mockRejectedValue(new Error("network error"));

    renderScreen();

    await waitFor(() =>
      expect(screen.getByText(t.errorTitle)).toBeInTheDocument()
    );

    expect(screen.queryByText(t.blockedTitle)).not.toBeInTheDocument();
    expect(mockedSiteMap).not.toHaveBeenCalled();
    expect(mockedCrawling).not.toHaveBeenCalled();
    expect(mockedLsRun).not.toHaveBeenCalled();
  });
});
