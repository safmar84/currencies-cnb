import { RatesSchema, type Rates } from "../model";

export async function fetchRates(): Promise<Rates> {
  const response = await fetch("/api/rates");

  if (!response.ok) {
    throw new Error(`Failed to fetch rates: ${response.status}`);
  }

  const json = await response.json();
  return RatesSchema.parse(json);
}
