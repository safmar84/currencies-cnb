import { afterAll, afterEach, describe, expect, it, vi } from "vitest";
import { validDailyRates } from "../../../shared/lib/testing/fixtures";
import { fetchRates } from "./fetch-rates";

const fetchMock = vi.fn<typeof fetch>();

vi.stubGlobal("fetch", fetchMock);

afterEach(() => {
  fetchMock.mockReset();
});

afterAll(() => {
  vi.unstubAllGlobals();
});

describe("fetchRates", () => {
  it("reads /api/rates and returns validated rates", async () => {
    fetchMock.mockResolvedValue(
      new Response(JSON.stringify(validDailyRates), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }),
    );

    await expect(fetchRates()).resolves.toEqual(validDailyRates);
    expect(fetchMock).toHaveBeenCalledWith("/api/rates");
  });

  it("throws on a non-ok response", async () => {
    fetchMock.mockResolvedValue(
      new Response(JSON.stringify({ message: "upstream error" }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }),
    );

    await expect(fetchRates()).rejects.toThrow("Failed to fetch rates: 500");
  });

  it("throws when response JSON does not match RatesSchema", async () => {
    fetchMock.mockResolvedValue(
      new Response(
        JSON.stringify({
          ...validDailyRates,
          rows: [],
        }),
        {
          status: 200,
          headers: { "Content-Type": "application/json" },
        },
      ),
    );

    await expect(fetchRates()).rejects.toThrow();
  });
});
