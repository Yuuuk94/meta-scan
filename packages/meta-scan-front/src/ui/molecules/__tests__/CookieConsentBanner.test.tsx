import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";

import { CookieConsentBanner } from "@/ui/molecules/CookieConsentBanner";

// issue #19 analytics-integration — pure presentational banner (no
// localStorage/GA4 knowledge here, that belongs to
// `@/ui/organisms/AnalyticsGate`). Message/labels are passed in as props so
// this molecule stays domain-free per ADR-010.
describe("CookieConsentBanner", () => {
  const baseProps = {
    theme: "dark" as const,
    message: "We use cookies for analytics.",
    acceptLabel: "Accept",
    rejectLabel: "Reject",
    onAccept: jest.fn(),
    onReject: jest.fn(),
  };

  it("renders the message and both action buttons", () => {
    render(<CookieConsentBanner {...baseProps} />);

    expect(screen.getByText(baseProps.message)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: baseProps.acceptLabel })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: baseProps.rejectLabel })
    ).toBeInTheDocument();
  });

  it("calls onAccept when the accept button is clicked", async () => {
    const onAccept = jest.fn();
    render(<CookieConsentBanner {...baseProps} onAccept={onAccept} />);

    fireEvent.click(
      screen.getByRole("button", { name: baseProps.acceptLabel })
    );

    expect(onAccept).toHaveBeenCalledTimes(1);
  });

  it("calls onReject when the reject button is clicked", async () => {
    const onReject = jest.fn();
    render(<CookieConsentBanner {...baseProps} onReject={onReject} />);

    fireEvent.click(
      screen.getByRole("button", { name: baseProps.rejectLabel })
    );

    expect(onReject).toHaveBeenCalledTimes(1);
  });
});
