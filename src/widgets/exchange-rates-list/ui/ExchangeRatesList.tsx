import styled from "styled-components";
import { useRatesQuery } from "../../../entities/exchange-rate";
import { getRateFlag } from "../../../shared/lib/rate-flag";

function formatRate(rate: number) {
  return rate.toFixed(3);
}

export function ExchangeRatesList() {
  const { data, isPending, isError, error } = useRatesQuery();

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
      <Meta>
        Published at: <strong>{data.publishedAt}</strong> #{data.sequence}
      </Meta>

      <RatesList>
        {data.rows.map((row) => (
          <RateItem key={row.code}>
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

const Meta = styled.p`
  margin: 0 0 ${({ theme }) => theme.spacing.metaMarginBottom};
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

const RateItem = styled.li`
  display: grid;
  gap: ${({ theme }) => theme.spacing.itemGap};
  padding: ${({ theme }) => theme.spacing.itemPadding};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.listItem};
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
`;
