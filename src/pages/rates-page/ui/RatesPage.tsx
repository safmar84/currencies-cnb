import styled from "styled-components";
import { ExchangeRatesList } from "../../../widgets/exchange-rates-list";

export function RatesPage() {
  return (
    <Page>
      <Card>
        <Eyebrow>CNB Currency Converter</Eyebrow>
        <Title>Exchange rates</Title>
        <ExchangeRatesList />
      </Card>
    </Page>
  );
}

const Page = styled.main`
  min-height: 100vh;
  display: grid;
  place-items: center;
  padding: 2rem;
`;

const Card = styled.section`
  width: min(100%, 48rem);
  padding: 2rem;
  border-radius: 1rem;
  background: #ffffff;
  box-shadow: 0 20px 45px rgba(15, 23, 42, 0.08);
`;

const Eyebrow = styled.p`
  margin: 0 0 0.75rem;
  color: #475569;
  font-size: 0.875rem;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
`;

const Title = styled.h1`
  margin: 0 0 1rem;
  font-size: 2rem;
`;
