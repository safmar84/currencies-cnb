// @vitest-environment jsdom

import type { ComponentProps } from "react";
import { render, screen } from "@testing-library/react";
import { ThemeProvider } from "styled-components";
import { describe, expect, it } from "vitest";
import { lightTheme } from "../../../shared/config/theme";
import { CurrencyAmountCard } from "./CurrencyAmountCard";

const baseCurrencyOptions = [{ value: "EUR", label: "🇪🇺 EUR - Euro" }];

function renderCard(overrides?: Partial<ComponentProps<typeof CurrencyAmountCard>>) {
  return render(
    <ThemeProvider theme={lightTheme}>
      <CurrencyAmountCard
        title="To"
        amountLabel="Converted amount"
        currencyLabel="Currency"
        amountValue=""
        currencyValue="EUR"
        currencyOptions={baseCurrencyOptions}
        {...overrides}
      />
    </ThemeProvider>,
  );
}

describe("CurrencyAmountCard", () => {
  it("focuses the editable amount input when autofocus is enabled", () => {
    renderCard({
      title: "From",
      amountLabel: "Amount",
      amountValue: "100",
      currencyValue: "CZK",
      currencyOptions: [{ value: "CZK", label: "🇨🇿 CZK - Czech koruna" }],
      isAmountAutoFocused: true,
    });

    expect(document.activeElement).toBe(screen.getByLabelText("Amount"));
  });

  it("removes the read-only amount input from tab order", () => {
    renderCard({
      isAmountReadOnly: true,
    });

    expect(screen.getByLabelText("Converted amount").getAttribute("tabindex")).toBe("-1");
  });

  it("hides the chevron when the currency select is disabled", () => {
    const { container } = renderCard({
      title: "From",
      currencyValue: "CZK",
      currencyOptions: [{ value: "CZK", label: "🇨🇿 CZK - Czech koruna" }],
      isCurrencyLocked: true,
    });

    expect((screen.getByLabelText("Currency") as HTMLSelectElement).disabled).toBe(true);
    expect(container.textContent).not.toContain("▾");
  });
});
