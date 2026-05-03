// @vitest-environment jsdom

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterAll, afterEach, describe, expect, it, vi } from "vitest";
import { AppThemeProvider } from "../../../app/providers/theme";
import { RatesPage } from "./RatesPage";

const fetchMock = vi.fn<typeof fetch>();

vi.stubGlobal("fetch", fetchMock);

const rates = {
  publishedAt: "27 Apr 2026",
  sequence: 80,
  rows: [
    { country: "Australia", currency: "dollar", amount: 1, code: "AUD", rate: 14.909 },
    { country: "EMU", currency: "euro", amount: 1, code: "EUR", rate: 25 },
    { country: "Japan", currency: "yen", amount: 100, code: "JPY", rate: 20 },
  ],
};

function mockMatchMedia() {
  Object.defineProperty(window, "matchMedia", {
    configurable: true,
    writable: true,
    value: vi.fn(() => ({
      matches: false,
      media: "(prefers-color-scheme: dark)",
      onchange: null,
      addEventListener: () => undefined,
      removeEventListener: () => undefined,
      addListener: () => undefined,
      removeListener: () => undefined,
      dispatchEvent: () => true,
    })),
  });
}

function renderRatesPage() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  return render(
    <AppThemeProvider>
      <QueryClientProvider client={queryClient}>
        <RatesPage />
      </QueryClientProvider>
    </AppThemeProvider>,
  );
}

afterEach(() => {
  cleanup();
  fetchMock.mockReset();
  window.localStorage.clear();
  vi.restoreAllMocks();
});

afterAll(() => {
  vi.unstubAllGlobals();
});

describe("RatesPage", () => {
  it("propagates the converter target currency to the exchange-rates highlight order", async () => {
    mockMatchMedia();
    fetchMock.mockResolvedValue(
      new Response(JSON.stringify(rates), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }),
    );

    renderRatesPage();

    await screen.findByText("Exchange rates");

    await waitFor(() =>
      expect(screen.getAllByRole("listitem")[0].textContent).toContain("EMU - euro"),
    );

    const targetCurrencySelect = document.getElementById("To-currency") as HTMLSelectElement | null;
    fireEvent.change(targetCurrencySelect as HTMLSelectElement, { target: { value: "JPY" } });

    await waitFor(() =>
      expect(screen.getAllByRole("listitem")[0].textContent).toContain("Japan - yen"),
    );
  });
});
