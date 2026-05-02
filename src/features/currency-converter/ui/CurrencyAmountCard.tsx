import { useEffect, useRef } from "react";
import styled, { css } from "styled-components";

export type CurrencyOption = {
  value: string;
  label: string;
};

type CurrencyAmountCardProps = {
  title: string;
  amountLabel: string;
  currencyLabel: string;
  amountValue: string;
  amountPlaceholder?: string;
  currencyValue: string;
  currencyOptions: CurrencyOption[];
  onAmountChange?: (value: string) => void;
  onCurrencyChange?: (value: string) => void;
  isAmountReadOnly?: boolean;
  isCurrencyLocked?: boolean;
  isAmountEmphasized?: boolean;
  isAmountAutoFocused?: boolean;
};

export function CurrencyAmountCard({
  title,
  amountLabel,
  currencyLabel,
  amountValue,
  amountPlaceholder,
  currencyValue,
  currencyOptions,
  onAmountChange,
  onCurrencyChange,
  isAmountReadOnly = false,
  isCurrencyLocked = false,
  isAmountEmphasized = false,
  isAmountAutoFocused = false,
}: CurrencyAmountCardProps) {
  const amountInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (!isAmountAutoFocused || isAmountReadOnly) {
      return;
    }

    amountInputRef.current?.focus();
  }, [isAmountAutoFocused, isAmountReadOnly]);

  return (
    <Card>
      <Title>{title}</Title>

      <Field>
        <FieldLabel>{amountLabel}</FieldLabel>
        <AmountInput
          id={`${title}-amount`}
          type="text"
          inputMode="decimal"
          value={amountValue}
          placeholder={amountPlaceholder}
          ref={amountInputRef}
          readOnly={isAmountReadOnly}
          tabIndex={isAmountReadOnly ? -1 : undefined}
          aria-readonly={isAmountReadOnly}
          $emphasized={isAmountEmphasized}
          onChange={(event) => onAmountChange?.(event.target.value)}
        />
      </Field>

      <Field>
        <FieldLabel>{currencyLabel}</FieldLabel>
        <SelectWrapper>
          <CurrencySelect
            id={`${title}-currency`}
            value={currencyValue}
            disabled={isCurrencyLocked}
            aria-disabled={isCurrencyLocked}
            onChange={(event) => onCurrencyChange?.(event.target.value)}
          >
            {currencyOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </CurrencySelect>
          {!isCurrencyLocked ? <SelectChevron aria-hidden="true">▾</SelectChevron> : null}
        </SelectWrapper>
      </Field>
    </Card>
  );
}

const Card = styled.section`
  position: relative;
  display: grid;
  gap: ${({ theme }) => theme.spacing.listGap};
  padding: ${({ theme }) =>
    `calc(${theme.spacing.itemPadding} + 0.5rem) ${theme.spacing.itemPadding} ${theme.spacing.itemPadding}`};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.listItem};
  background: ${({ theme }) => theme.colors.surface};
`;

const Title = styled.h2`
  position: absolute;
  top: 0;
  left: ${({ theme }) => theme.spacing.itemPadding};
  margin: 0;
  padding: 0 ${({ theme }) => theme.spacing.itemGap};
  transform: translateY(-50%);
  background: ${({ theme }) => theme.colors.surface};
  color: ${({ theme }) => theme.colors.mutedText};
  font-size: ${({ theme }) => theme.typography.eyebrowSize};
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
`;

const Field = styled.label`
  display: grid;
  gap: ${({ theme }) => theme.spacing.itemGap};
`;

const FieldLabel = styled.span`
  color: ${({ theme }) => theme.colors.mutedText};
  font-size: ${({ theme }) => theme.typography.eyebrowSize};
`;

const sharedControlStyles = css`
  width: 100%;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.listItem};
  background: ${({ theme }) => theme.colors.background};
  color: ${({ theme }) => theme.colors.text};
  font: inherit;
  padding: ${({ theme }) => theme.spacing.itemPadding};
`;

const AmountInput = styled.input<{ $emphasized: boolean }>`
  ${sharedControlStyles}
  font-weight: ${({ $emphasized }) => ($emphasized ? 700 : 400)};

  &[readonly] {
    background: ${({ theme }) => theme.colors.subtleSurface};
    color: ${({ theme, $emphasized }) =>
      $emphasized ? theme.colors.text : theme.colors.mutedText};
    cursor: default;
  }
`;

const SelectWrapper = styled.div`
  position: relative;
`;

const CurrencySelect = styled.select`
  ${sharedControlStyles}
  appearance: none;
  padding-right: calc(${({ theme }) => theme.spacing.itemPadding} * 2 + 1rem);

  &:disabled {
    background: ${({ theme }) => theme.colors.subtleSurface};
    color: ${({ theme }) => theme.colors.mutedText};
    cursor: default;
    opacity: 1;
  }
`;

const SelectChevron = styled.span`
  position: absolute;
  inset-block: 0;
  right: ${({ theme }) => theme.spacing.itemPadding};
  display: grid;
  place-items: center;
  color: ${({ theme }) => theme.colors.mutedText};
  pointer-events: none;
  line-height: 1;
`;
