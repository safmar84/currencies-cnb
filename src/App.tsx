 import styled from "styled-components";
 import { useRatesQuery } from "./features/rates/useRatesQuery";
 
 export default function App() {
   const { data, isPending, isError, error } = useRatesQuery();
 
   return (
     <Page>
       <Card>
         <Eyebrow>CNB Currency Converter</Eyebrow>
         <Title>Exchange rates</Title>
 
         {isPending && <Message>Loading rates...</Message>}
 
         {isError && (
           <ErrorMessage>
             Failed to load rates:{" "}
             {error instanceof Error ? error.message : "Unknown error"}
           </ErrorMessage>
         )}
 
         {data && (
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
         )}
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