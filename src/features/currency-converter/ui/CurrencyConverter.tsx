import { useEffect, useMemo, useState } from "react";
import styled from "styled-components";
import { useRatesQuery } from "../../../entities/exchange-rate";
import { getRateFlag } from "../../../shared/lib/rate-flag";
import { CurrencyAmountCard, type CurrencyOption } from "./CurrencyAmountCard";
import { convertCzkToCurrency } from "../model";

function getDefaultTargetCurrency(options: CurrencyOption[]) {
  return options.find((option) => option.value === "EUR")?.value ?? options[0]?.value ?? "";
}

function parseSourceAmount(value: string) {
  if (value.trim() === "") {
    return null;
  }

  const amount = Number(value);

  return Number.isFinite(amount) && amount >= 0 ? amount : null;
}

function isAllowedAmountInput(value: string) {
  return /^\d*\.?\d*$/.test(value);
}

function formatConvertedAmount(value: number | null) {
  if (value === null) {
    return "";
  }

  return value.toFixed(3);
}

type CurrencyConverterProps = {
  onTargetCurrencyChange?: (currencyCode: string) => void;
};

export function CurrencyConverter({
  onTargetCurrencyChange,
}: CurrencyConverterProps) {
  const { data, isPending, isError, error } = useRatesQuery();
  const [sourceAmount, setSourceAmount] = useState("");
  const [targetCurrency, setTargetCurrency] = useState("");

  function handleSourceAmountChange(nextValue: string) {
    if (isAllowedAmountInput(nextValue)) {
      setSourceAmount(nextValue);
    }
  }

  const currencyOptions = useMemo<CurrencyOption[]>(
    () =>
      data?.rows.map((row) => ({
        value: row.code,
        label: `${getRateFlag(row.country)} ${row.code} - ${row.country}`,
      })) ?? [],
    [data],
  );

  useEffect(() => {
    if (currencyOptions.length === 0) {
      setTargetCurrency("");
      return;
    }

    setTargetCurrency((currentTargetCurrency) => {
      if (
        currentTargetCurrency &&
        currencyOptions.some((option) => option.value === currentTargetCurrency)
      ) {
        return currentTargetCurrency;
      }

      return getDefaultTargetCurrency(currencyOptions);
    });
  }, [currencyOptions]);

  useEffect(() => {
    onTargetCurrencyChange?.(targetCurrency);
  }, [onTargetCurrencyChange, targetCurrency]);

  if (isPending) {
    return <Message>Loading converter...</Message>;
  }

  if (isError) {
    return (
      <ErrorMessage>
        Failed to load converter: {error instanceof Error ? error.message : "Unknown error"}
      </ErrorMessage>
    );
  }

  const targetRate = data.rows.find((row) => row.code === targetCurrency) ?? null;
  const parsedSourceAmount = parseSourceAmount(sourceAmount);
  const convertedAmount =
    parsedSourceAmount !== null && targetRate
      ? convertCzkToCurrency(parsedSourceAmount, targetRate)
      : null;

  return (
    <Section>
      <SectionTitle>Converter</SectionTitle>
      <Cards>
        <CurrencyAmountCard
          title="From"
          amountLabel="Amount"
          currencyLabel="Currency"
          amountValue={sourceAmount}
          amountPlaceholder="Enter amount..."
          currencyValue="CZK"
          currencyOptions={[{ value: "CZK", label: "🇨🇿 CZK - Czech koruna" }]}
          onAmountChange={handleSourceAmountChange}
          isAmountAutoFocused
          isCurrencyLocked
        />

        <DirectionArrow aria-hidden="true">
          <ArrowGlyph>→</ArrowGlyph>
        </DirectionArrow>

        <CurrencyAmountCard
          title="To"
          amountLabel="Converted amount"
          currencyLabel="Currency"
          amountValue={formatConvertedAmount(convertedAmount)}
          currencyValue={targetCurrency}
          currencyOptions={currencyOptions}
          onCurrencyChange={setTargetCurrency}
          isAmountReadOnly
          isAmountEmphasized
        />
      </Cards>
    </Section>
  );
}

const Section = styled.section`
  margin: 0 0 ${({ theme }) => theme.spacing.cardPadding};
`;

const SectionTitle = styled.h2`
  margin: 0 0 ${({ theme }) => theme.spacing.metaMarginBottom};
  color: ${({ theme }) => theme.colors.text};
  font-size: 1.25rem;
`;

const Cards = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto minmax(0, 1fr);
  align-items: center;
  gap: ${({ theme }) => theme.spacing.listGap};

  @media (max-width: 720px) {
    grid-template-columns: 1fr;
  }
`;

const DirectionArrow = styled.div`
  display: grid;
  place-items: center;
  inline-size: 3rem;
  block-size: 3rem;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 999px;
  background: ${({ theme }) => theme.colors.subtleSurface};
  color: ${({ theme }) => theme.colors.mutedText};

  @media (max-width: 720px) {
    justify-self: center;
  }
`;

const ArrowGlyph = styled.span`
  font-size: 1.5rem;
  line-height: 1;

  @media (max-width: 720px) {
    transform: rotate(90deg);
  }
`;

const Message = styled.p`
  margin: 0 0 ${({ theme }) => theme.spacing.cardPadding};
  color: ${({ theme }) => theme.colors.text};
`;

const ErrorMessage = styled.p`
  margin: 0 0 ${({ theme }) => theme.spacing.cardPadding};
  color: ${({ theme }) => theme.colors.error};
`;
