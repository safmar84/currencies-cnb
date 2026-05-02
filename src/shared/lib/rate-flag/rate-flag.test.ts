import { describe, expect, it } from "vitest";
import { getRateFlag } from "./rate-flag";

describe("getRateFlag", () => {
  it("returns country flags for standard CNB countries", () => {
    expect(getRateFlag("Australia")).toBe("🇦🇺");
    expect(getRateFlag("Japan")).toBe("🇯🇵");
    expect(getRateFlag("United Kingdom")).toBe("🇬🇧");
  });

  it("returns special symbols for non-country CNB entries", () => {
    expect(getRateFlag("EMU")).toBe("🇪🇺");
    expect(getRateFlag("IMF")).toBe("🌐");
  });

  it("falls back to a neutral flag for unknown countries", () => {
    expect(getRateFlag("Unknown")).toBe("🏳️");
  });
});
