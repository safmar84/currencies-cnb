import { describe, expect, it } from "vitest";
import { convertCzkToCurrency } from "./convert-czk-to-currency";

describe("convertCzkToCurrency", () => {
  it("converts CZK to a currency quoted per single unit", () => {
    expect(
      convertCzkToCurrency(148.81, {
        country: "Australia",
        currency: "dollar",
        amount: 1,
        code: "AUD",
        rate: 14.881,
      }),
    ).toBeCloseTo(10, 8);
  });

  it("converts CZK to a currency quoted per multiple units", () => {
    expect(
      convertCzkToCurrency(130.2, {
        country: "Japan",
        currency: "yen",
        amount: 100,
        code: "JPY",
        rate: 13.02,
      }),
    ).toBeCloseTo(1000, 8);
  });
});
