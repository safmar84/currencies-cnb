import styled from "styled-components";

export default function App() {
  return (
    <Page>
      <Card>
        <Eyebrow>CNB Currency Converter</Eyebrow>
        <Title>Project scaffold is ready</Title>
        <Description>
          Next we can replace this placeholder with exchange rates, conversion
          form, and tests.
        </Description>
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
  width: min(100%, 40rem);
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
  font-size: clamp(2rem, 3vw, 2.5rem);
`;

const Description = styled.p`
  margin: 0;
  color: #334155;
  line-height: 1.6;
`;
