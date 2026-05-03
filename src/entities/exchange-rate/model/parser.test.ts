import { describe, expect, it } from "vitest";
import {
  historicalDailyRates,
  historicalDailyRatesText,
  validDailyRates,
  validDailyRatesText,
} from "../../../shared/lib/testing/fixtures";
import { parseRates } from "./parser";

describe("parseRates", () => {
  it("parses a valid CNB daily payload", () => {
    expect(parseRates(validDailyRatesText)).toEqual(validDailyRates);
  });

  it("ignores the historical calculated-rates block after the first blank line", () => {
    expect(parseRates(historicalDailyRatesText)).toEqual(historicalDailyRates);
  });

  it("throws on an unexpected header", () => {
    expect(() =>
      parseRates(`27 Apr 2026 #80
currency|country|Amount|Code|Rate
Australia|dollar|1|AUD|14.909`),
    ).toThrow("Unexpected CNB header line format");
  });

  it("throws on an unexpected date line", () => {
    expect(() =>
      parseRates(`27.Apr.2026 #80
Country|Currency|Amount|Code|Rate
Australia|dollar|1|AUD|14.909`),
    ).toThrow("Unexpected CNB date line format");
  });

  it("throws when the date line is missing", () => {
    expect(() =>
      parseRates(`Country|Currency|Amount|Code|Rate
Australia|dollar|1|AUD|14.909`),
    ).toThrow("Unexpected CNB header line format");
  });

  it("throws when a data row has an unexpected column count", () => {
    expect(() =>
      parseRates(`27 Apr 2026 #80
Country|Currency|Amount|Code|Rate
Australia|dollar|1|AUD`),
    ).toThrow("Unexpected CNB data line format");
  });

  it("throws when amount is not a valid positive integer", () => {
    expect(() =>
      parseRates(`27 Apr 2026 #80
Country|Currency|Amount|Code|Rate
Australia|dollar|wrong|AUD|14.909`),
    ).toThrow();
  });

  it("throws when rate is not a valid positive number", () => {
    expect(() =>
      parseRates(`27 Apr 2026 #80
Country|Currency|Amount|Code|Rate
Australia|dollar|1|AUD|wrong`),
    ).toThrow();
  });
});
