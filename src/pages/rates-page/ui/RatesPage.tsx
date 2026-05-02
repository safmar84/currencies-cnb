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
  padding: ${({ theme }) => theme.spacing.pagePadding};
`;

const Card = styled.section`
  width: min(100%, ${({ theme }) => theme.layout.cardMaxWidth});
  padding: ${({ theme }) => theme.spacing.cardPadding};
  border-radius: ${({ theme }) => theme.radius.card};
  background: ${({ theme }) => theme.colors.surface};
  box-shadow: ${({ theme }) => theme.shadow.card};
`;

const Eyebrow = styled.p`
  margin: 0 0 ${({ theme }) => theme.spacing.eyebrowMarginBottom};
  color: ${({ theme }) => theme.colors.mutedText};
  font-size: ${({ theme }) => theme.typography.eyebrowSize};
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
`;

const Title = styled.h1`
  margin: 0 0 ${({ theme }) => theme.spacing.titleMarginBottom};
  font-size: ${({ theme }) => theme.typography.titleSize};
  color: ${({ theme }) => theme.colors.text};
`;
