import type { Handler } from "@netlify/functions";
import { parseRates, type Rates } from "../../src/entities/exchange-rate/server";
import {
  buildRatesCacheControlHeader,
  getRatesCacheExpiresAt,
} from "../../src/shared/lib/rates-cache";

const CNB_DAILY_URL =
  "https://www.cnb.cz/en/financial-markets/foreign-exchange-market/central-bank-exchange-rate-fixing/central-bank-exchange-rate-fixing/daily.txt";

let cachedRates:
  | {
      value: Rates;
      expiresAt: number;
    }
  | null = null;

function createSuccessResponse(
  rates: Rates,
  expiresAt: Date,
  now = new Date(),
) {
  return {
    statusCode: 200,
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": buildRatesCacheControlHeader(expiresAt, now),
    },
    body: JSON.stringify(rates),
  };
}

export function resetRatesCacheForTests() {
  cachedRates = null;
}

export const handler: Handler = async () => {
  const now = new Date();
  const currentCachedRates = cachedRates;

  if (
    currentCachedRates !== null &&
    currentCachedRates.expiresAt > now.getTime()
  ) {
    return createSuccessResponse(
      currentCachedRates.value,
      new Date(currentCachedRates.expiresAt),
      now,
    );
  }

  try {
    const upstreamResponse = await fetch(CNB_DAILY_URL, {
      headers: {
        Accept: "text/plain",
      },
    });

    if (!upstreamResponse.ok) {
      return {
        statusCode: 502,
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "public, max-age=0",
        },
        body: JSON.stringify({
          message: `Failed to fetch CNB rates: ${upstreamResponse.status}`,
        }),
      };
    }

    const text = await upstreamResponse.text();
    const rates = parseRates(text);
    const expiresAt = getRatesCacheExpiresAt(rates.publishedAt, now);

    cachedRates = {
      value: rates,
      expiresAt: expiresAt.getTime(),
    };

    return createSuccessResponse(rates, expiresAt, now);
  } catch (error) {
    return {
      statusCode: 500,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "public, max-age=0",
      },
      body: JSON.stringify({
        message:
          error instanceof Error ? error.message : "Unexpected server error",
      }),
    };
  }
};
