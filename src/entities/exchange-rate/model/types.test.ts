import { describe, expect, it } from "vitest";
import { validDailyRates } from "../../../shared/lib/testing/fixtures";
import { RatesSchema } from "./types";

describe("RatesSchema", () => {
  const validPayload = {
    ...validDailyRates,
    rows: [validDailyRates.rows[0]],
  };

  it("accepts a valid rates payload", () => {
    const result = RatesSchema.safeParse(validPayload);

    expect(result.success).toBe(true);
  });

  it("rejects an invalid publishedAt format", () => {
    const result = RatesSchema.safeParse({
      ...validPayload,
      publishedAt: "27.Apr.2026",
    });

    expect(result.success).toBe(false);
  });

  it("rejects a non-positive sequence", () => {
    const result = RatesSchema.safeParse({
      ...validPayload,
      sequence: 0,
    });

    expect(result.success).toBe(false);
  });

  it("rejects an empty rows array", () => {
    const result = RatesSchema.safeParse({
      ...validPayload,
      rows: [],
    });

    expect(result.success).toBe(false);
  });

  it("rejects a row with an invalid currency code", () => {
    const result = RatesSchema.safeParse({
      ...validPayload,
      rows: [
        {
          ...validPayload.rows[0],
          code: "aud",
        },
      ],
    });

    expect(result.success).toBe(false);
  });

  it("rejects a row with a non-positive rate", () => {
    const result = RatesSchema.safeParse({
      ...validPayload,
      rows: [
        {
          ...validPayload.rows[0],
          rate: 0,
        },
      ],
    });

    expect(result.success).toBe(false);
  });

  it("rejects a row with a non-integer amount", () => {
    const result = RatesSchema.safeParse({
      ...validPayload,
      rows: [
        {
          ...validPayload.rows[0],
          amount: 1.5,
        },
      ],
    });

    expect(result.success).toBe(false);
  });
});
