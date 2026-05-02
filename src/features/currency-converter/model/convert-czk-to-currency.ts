import type { RateRow } from "../../../entities/exchange-rate";

export function convertCzkToCurrency(amountInCzk: number, rateRow: RateRow) {
  return amountInCzk / (rateRow.rate / rateRow.amount);
}
