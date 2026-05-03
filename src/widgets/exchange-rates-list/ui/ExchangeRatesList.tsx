import { useMemo } from "react";
import styled from "styled-components";
import { useRatesQuery } from "../../../entities/exchange-rate";
import { getRateFlag } from "../../../shared/lib/rate-flag";

function formatRate(rate: number) {
  return rate.toFixed(3);
}

type ExchangeRatesListProps = {
  highlightedCurrencyCode?: string;
};

export function ExchangeRatesList({
  highlightedCurrencyCode = "",
}: ExchangeRatesListProps) {
  const { data, isPending, isError, error } = useRatesQuery();
  const rows = useMemo(() => {
    const sourceRows = data?.rows ?? [];

    if (!highlightedCurrencyCode) {
      return sourceRows;
    }

    return [...sourceRows].sort((left, right) => {
      if (left.code === highlightedCurrencyCode) {
        return -1;
      }

      if (right.code === highlightedCurrencyCode) {
        return 1;
      }

      return 0;
    });
  }, [data, highlightedCurrencyCode]);

  if (isPending) {
    return <Message>Loading rates...</Message>;
  }

  if (isError) {
    return (
      <ErrorMessage>
        Failed to load rates: {error instanceof Error ? error.message : "Unknown error"}
      </ErrorMessage>
      );
  }

  return (
    <>
      <SectionHeader>
        <SectionTitle>Exchange rates</SectionTitle>
        <Meta>
          Published at: <strong>{data.publishedAt}</strong> #{data.sequence}
        </Meta>
      </SectionHeader>

      <RatesList>
        {rows.map((row) => (
          <RateItem
            key={row.code}
            $highlighted={row.code === highlightedCurrencyCode}
          >
            <Label>
              <Flag aria-hidden="true">{getRateFlag(row.country)}</Flag>
              {row.country} - {row.currency}
            </Label>
            <Rate>
              {row.amount} {row.code} = {formatRate(row.rate)} CZK
            </Rate>
          </RateItem>
        ))}
      </RatesList>
    </>
  );
}

const SectionHeader = styled.header`
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.listGap};
  margin: 0 0 ${({ theme }) => theme.spacing.metaMarginBottom};

  @media (max-width: ${({ theme }) => theme.layout.compactBreakpoint}) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

const SectionTitle = styled.h2`
  margin: 0;
  color: ${({ theme }) => theme.colors.text};
  font-size: ${({ theme }) => theme.typography.sectionTitleSize};
`;

const Meta = styled.p`
  margin: 0;
  color: ${({ theme }) => theme.colors.mutedText};
`;

const Message = styled.p`
  margin: 0;
  color: ${({ theme }) => theme.colors.text};
`;

const ErrorMessage = styled.p`
  margin: 0;
  color: ${({ theme }) => theme.colors.error};
`;

const RatesList = styled.ul`
  display: grid;
  gap: ${({ theme }) => theme.spacing.listGap};
  padding: 0;
  margin: 0;
  list-style: none;
`;

const RateItem = styled.li<{ $highlighted: boolean }>`
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.itemGap};
  padding: ${({ theme }) => theme.spacing.itemPadding};
  border: 1px solid
    ${({ theme, $highlighted }) =>
      $highlighted ? theme.colors.accent : theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.listItem};
  box-shadow: ${({ theme, $highlighted }) =>
    $highlighted ? `0 0 0 1px ${theme.colors.accent} inset` : "none"};

  @media (max-width: ${({ theme }) => theme.layout.compactBreakpoint}) {
    grid-template-columns: 1fr;
    align-items: start;
  }
`;

const Label = styled.span`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.itemGap};
`;

const Flag = styled.span`
  font-size: 1.25em;
  line-height: 1;
`;

const Rate = styled.span`
  color: ${({ theme }) => theme.colors.text};
  font-weight: 600;
  text-align: right;

  @media (max-width: ${({ theme }) => theme.layout.compactBreakpoint}) {
    text-align: left;
  }
`;
