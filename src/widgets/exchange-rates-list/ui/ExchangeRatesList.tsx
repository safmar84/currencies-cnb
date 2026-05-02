import styled from "styled-components";
import { useRatesQuery } from "../../../entities/exchange-rate";

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
            <Code>{row.code}</Code>
            <span>
              {row.country} - {row.currency}
            </span>
            <Rate>
              {row.amount} {row.code} = {row.rate} CZK
            </Rate>
          </RateItem>
        ))}
      </RatesList>
    </>
  );
}

const Meta = styled.p`
  margin: 0 0 1rem;
  color: #475569;
`;

const Message = styled.p`
  margin: 0;
  color: #334155;
`;

const ErrorMessage = styled.p`
  margin: 0;
  color: #b91c1c;
`;

const RatesList = styled.ul`
  display: grid;
  gap: 0.75rem;
  padding: 0;
  margin: 0;
  list-style: none;
`;

const RateItem = styled.li`
  display: grid;
  gap: 0.25rem;
  padding: 1rem;
  border: 1px solid #e2e8f0;
  border-radius: 0.75rem;
`;

const Code = styled.strong`
  font-size: 1rem;
`;

const Rate = styled.span`
  color: #0f172a;
  font-weight: 600;
`;
