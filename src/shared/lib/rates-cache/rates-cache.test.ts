import { describe, expect, it } from "vitest";
import {
  buildRatesCacheControlHeader,
  getExpectedRatesPublishedAt,
  getRatesCacheExpiresAt,
  getNextRatesRefreshAt,
  getRatesCacheTtlMilliseconds,
  getRatesCacheTtlMillisecondsForPublishedAt,
  isRatesPublishedAtOlderThanExpected,
} from "./rates-cache";

describe("rates cache helpers", () => {
  it("refreshes later the same working day before the CNB update window", () => {
    const now = new Date("2026-04-27T07:00:00Z");
    const expiresAt = getNextRatesRefreshAt(now);

    expect(expiresAt.toISOString()).toBe("2026-04-27T12:30:00.000Z");
    expect(getRatesCacheTtlMilliseconds(now)).toBe(19_800_000);
    expect(buildRatesCacheControlHeader(expiresAt, now)).toBe(
      "public, max-age=300, s-maxage=19800, stale-while-revalidate=60",
    );
  });

  it("refreshes on the next working day after the daily update has passed", () => {
    const now = new Date("2026-04-27T13:00:00Z");

    expect(getNextRatesRefreshAt(now).toISOString()).toBe("2026-04-28T12:30:00.000Z");
  });

  it("skips weekends and waits for the next Monday update window", () => {
    const now = new Date("2026-05-02T10:00:00Z");

    expect(getNextRatesRefreshAt(now).toISOString()).toBe("2026-05-04T12:30:00.000Z");
  });

  it("expects the previous working day before the daily update window", () => {
    const now = new Date("2026-04-27T07:00:00Z");

    expect(getExpectedRatesPublishedAt(now)).toBe("24 Apr 2026");
    expect(isRatesPublishedAtOlderThanExpected("23 Apr 2026", now)).toBe(true);
    expect(isRatesPublishedAtOlderThanExpected("24 Apr 2026", now)).toBe(false);
  });

  it("expects the same day after the update window and short-caches older data", () => {
    const now = new Date("2026-04-27T13:00:00Z");

    expect(getExpectedRatesPublishedAt(now)).toBe("27 Apr 2026");
    expect(isRatesPublishedAtOlderThanExpected("24 Apr 2026", now)).toBe(true);
    expect(getRatesCacheExpiresAt("24 Apr 2026", now).toISOString()).toBe(
      "2026-04-27T13:05:00.000Z",
    );
    expect(getRatesCacheTtlMillisecondsForPublishedAt("24 Apr 2026", now)).toBe(
      300_000,
    );
    expect(
      buildRatesCacheControlHeader(getRatesCacheExpiresAt("24 Apr 2026", now), now),
    ).toBe("public, max-age=300, s-maxage=300, stale-while-revalidate=60");
  });

  it("treats Friday data as current during the weekend", () => {
    const now = new Date("2026-05-02T10:00:00Z");

    expect(getExpectedRatesPublishedAt(now)).toBe("01 May 2026");
    expect(isRatesPublishedAtOlderThanExpected("01 May 2026", now)).toBe(false);
  });
});
