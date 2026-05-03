// @vitest-environment jsdom

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { ThemeProvider } from "styled-components";
import { afterAll, afterEach, describe, expect, it, vi } from "vitest";
import { lightTheme } from "../../../shared/config/theme";
import { CurrencyConverter } from "./CurrencyConverter";

const fetchMock = vi.fn<typeof fetch>();

vi.stubGlobal("fetch", fetchMock);

const ratesWithEur = {
  publishedAt: "27 Apr 2026",
  sequence: 80,
  rows: [
    { country: "Australia", currency: "dollar", amount: 1, code: "AUD", rate: 14.909 },
    { country: "EMU", currency: "euro", amount: 1, code: "EUR", rate: 25 },
    { country: "Japan", currency: "yen", amount: 100, code: "JPY", rate: 20 },
  ],
};

const ratesWithoutEur = {
  publishedAt: "27 Apr 2026",
  sequence: 80,
  rows: [
    { country: "Australia", currency: "dollar", amount: 1, code: "AUD", rate: 14.909 },
    { country: "Japan", currency: "yen", amount: 100, code: "JPY", rate: 20 },
  ],
};

function renderConverter(onTargetCurrencyChange?: (currencyCode: string) => void) {
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
        <CurrencyConverter onTargetCurrencyChange={onTargetCurrencyChange} />
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

describe("CurrencyConverter", () => {
  it("defaults to EUR, recalculates on input and target change, and emits target updates", async () => {
    fetchMock.mockResolvedValue(
      new Response(JSON.stringify(ratesWithEur), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }),
    );

    const handleTargetCurrencyChange = vi.fn();

    renderConverter(handleTargetCurrencyChange);

    expect(screen.getByText("Loading converter...")).toBeTruthy();

    await screen.findByText("Converter");

    const amountInput = screen.getByLabelText("Amount") as HTMLInputElement;
    const convertedAmountInput = screen.getByLabelText("Converted amount") as HTMLInputElement;
    const targetCurrencySelect = document.getElementById("To-currency") as HTMLSelectElement | null;

    expect(targetCurrencySelect?.value).toBe("EUR");
    await waitFor(() => expect(handleTargetCurrencyChange).toHaveBeenLastCalledWith("EUR"));

    fireEvent.change(amountInput, { target: { value: "250" } });
    expect(convertedAmountInput.value).toBe("10.000");

    fireEvent.change(targetCurrencySelect as HTMLSelectElement, { target: { value: "JPY" } });
    expect(convertedAmountInput.value).toBe("1250.000");
    await waitFor(() => expect(handleTargetCurrencyChange).toHaveBeenLastCalledWith("JPY"));
  });

  it("falls back to the first available currency when EUR is unavailable", async () => {
    fetchMock.mockResolvedValue(
      new Response(JSON.stringify(ratesWithoutEur), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }),
    );

    renderConverter();

    await screen.findByText("Converter");

    const targetCurrencySelect = document.getElementById("To-currency") as HTMLSelectElement | null;
    expect(targetCurrencySelect?.value).toBe("AUD");
  });

  it("ignores invalid amount input and keeps the previous valid value", async () => {
    fetchMock.mockResolvedValue(
      new Response(JSON.stringify(ratesWithEur), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }),
    );

    renderConverter();

    await screen.findByText("Converter");

    const amountInput = screen.getByLabelText("Amount") as HTMLInputElement;
    const convertedAmountInput = screen.getByLabelText("Converted amount") as HTMLInputElement;

    fireEvent.change(amountInput, { target: { value: "12.5" } });
    expect(amountInput.value).toBe("12.5");
    expect(convertedAmountInput.value).toBe("0.500");

    fireEvent.change(amountInput, { target: { value: "12.5x" } });
    expect(amountInput.value).toBe("12.5");
    expect(convertedAmountInput.value).toBe("0.500");
  });
});
