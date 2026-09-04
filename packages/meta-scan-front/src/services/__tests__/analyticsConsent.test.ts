import {
  getStoredConsent,
  storeConsent,
} from "@/services/analyticsConsent";
import { analyticsConsentKey } from "@/constans";

// issue #19 analytics-integration — consent status persistence.
// GA4 is cookie-based, so the script must never load before the user has
// made an explicit choice; that choice is persisted in localStorage so a
// returning visitor isn't asked again (spec-fixed comment, "동의 배너" ACs).
describe("analyticsConsent", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("returns null when nothing has been stored yet (first visit)", () => {
    expect(getStoredConsent()).toBeNull();
  });

  it("persists a granted decision and reflects it back", () => {
    storeConsent("granted");
    expect(getStoredConsent()).toBe("granted");
  });

  it("persists a denied decision and reflects it back", () => {
    storeConsent("denied");
    expect(getStoredConsent()).toBe("denied");
  });

  it("treats an unrecognized stored value as no decision made", () => {
    window.localStorage.setItem(analyticsConsentKey, "garbage");
    expect(getStoredConsent()).toBeNull();
  });
});
