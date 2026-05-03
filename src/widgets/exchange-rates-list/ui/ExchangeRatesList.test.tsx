// @vitest-environment jsdom

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { cleanup, render, screen } from "@testing-library/react";
import { ThemeProvider } from "styled-components";
import { afterAll, afterEach, describe, expect, it, vi } from "vitest";
import { lightTheme } from "../../../shared/config/theme";
import { validDailyRates } from "../../../shared/lib/testing/fixtures";
import { ExchangeRatesList } from "./ExchangeRatesList";

const fetchMock = vi.fn<typeof fetch>();

vi.stubGlobal("fetch", fetchMock);

function renderList(highlightedCurrencyCode?: string) {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  return render(
    <ThemeProvider theme={lightTheme}>
      <QueryClientProvider client={queryClient}>
        <ExchangeRatesList highlightedCurrencyCode={highlightedCurrencyCode} />
      </QueryClientProvider>
    </ThemeProvider>,
  );
}

afterEach(() => {
  cleanup();
  fetchMock.mockReset();
});

afterAll(() => {
  vi.unstubAllGlobals();
});

describe("ExchangeRatesList", () => {
  it("shows loading first, then renders metadata and moves the highlighted rate to the top", async () => {
    fetchMock.mockResolvedValue(
      new Response(JSON.stringify(validDailyRates), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }),
    );

    renderList("JPY");

    expect(screen.getByText("Loading rates...")).toBeTruthy();

    await screen.findByText("Exchange rates");

    expect(screen.getByText(/Published at:/).textContent).toContain("27 Apr 2026");
    expect(screen.getByText(/Published at:/).textContent).toContain("#80");

    const rateItems = screen.getAllByRole("listitem");
    expect(rateItems[0].textContent).toContain("Japan - yen");
    expect(rateItems[0].textContent).toContain("100 JPY = 13.020 CZK");
  });

  it("renders an error state when the rates request fails", async () => {
    fetchMock.mockResolvedValue(
      new Response(JSON.stringify({ message: "upstream error" }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }),
    );

    renderList();

    expect(
      await screen.findByText(/Failed to load rates:\s*Failed to fetch rates: 500/),
    ).toBeTruthy();
  });
});
