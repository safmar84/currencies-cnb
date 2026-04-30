import type {
  HandlerContext,
  HandlerEvent,
  HandlerResponse,
} from "@netlify/functions";
import { afterAll, afterEach, describe, expect, it, vi } from "vitest";
import { handler } from "./rates";
import {
  validDailyRates,
  validDailyRatesText,
} from "../../src/test/fixtures/rates";

const fetchMock = vi.fn<typeof fetch>();

vi.stubGlobal("fetch", fetchMock);

const event = {} as HandlerEvent;
const context = {} as HandlerContext;

async function invokeHandler(): Promise<HandlerResponse> {
  const result = await handler(event, context);

  if (!result) {
    throw new Error("Handler returned no response");
  }

  return result;
}

function parseJsonBody(result: HandlerResponse): unknown {
  if (!result.body) {
    throw new Error("Handler response body is missing");
  }

  return JSON.parse(result.body);
}

afterEach(() => {
  fetchMock.mockReset();
});

afterAll(() => {
  vi.unstubAllGlobals();
});

describe("rates netlify function", () => {
  it("returns parsed rates JSON when CNB request succeeds", async () => {
    fetchMock.mockResolvedValue(
      new Response(validDailyRatesText, {
        status: 200,
        headers: { "Content-Type": "text/plain" },
      }),
    );

    const result = await invokeHandler();

    expect(fetchMock).toHaveBeenCalledWith(
      "https://www.cnb.cz/en/financial-markets/foreign-exchange-market/central-bank-exchange-rate-fixing/central-bank-exchange-rate-fixing/daily.txt",
      {
        headers: {
          Accept: "text/plain",
        },
      },
    );

    expect(result).toMatchObject({
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "public, max-age=1800",
      },
    });

    expect(parseJsonBody(result)).toEqual(validDailyRates);
  });

  it("returns 502 when upstream responds with a non-ok status", async () => {
    fetchMock.mockResolvedValue(new Response("upstream error", { status: 503 }));

    const result = await invokeHandler();

    expect(result).toMatchObject({
      statusCode: 502,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "public, max-age=0",
      },
    });
    expect(parseJsonBody(result)).toEqual({
      message: "Failed to fetch CNB rates: 503",
    });
  });

  it("returns 500 when upstream fetch throws", async () => {
    fetchMock.mockRejectedValue(new Error("network down"));

    const result = await invokeHandler();

    expect(result).toMatchObject({
      statusCode: 500,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "public, max-age=0",
      },
    });
    expect(parseJsonBody(result)).toEqual({
      message: "network down",
    });
  });

  it("returns 500 when upstream payload cannot be parsed", async () => {
    fetchMock.mockResolvedValue(
      new Response(
        `27.Apr.2026 #80
Country|Currency|Amount|Code|Rate
Australia|dollar|1|AUD|14.909`,
        { status: 200 },
      ),
    );

    const result = await invokeHandler();

    expect(result).toMatchObject({
      statusCode: 500,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "public, max-age=0",
      },
    });
    expect(parseJsonBody(result)).toEqual({
      message: "Unexpected CNB date line format",
    });
  });
});
