import type { Handler } from "@netlify/functions";
 import { parseRates } from "../../src/features/rates/parser";
 
 const CNB_DAILY_URL =
   "https://www.cnb.cz/en/financial-markets/foreign-exchange-market/central-bank-exchange-rate-fixing/central-bank-exchange-rate-fixing/daily.txt";
 
 export const handler: Handler = async () => {
   try {
     const upstreamResponse = await fetch(CNB_DAILY_URL, {
       headers: {
         Accept: "text/plain",
       },
     });
 
     if (!upstreamResponse.ok) {
       return {
         statusCode: 502,
         headers: {
           "Content-Type": "application/json",
           "Cache-Control": "public, max-age=0",
         },
         body: JSON.stringify({
           message: `Failed to fetch CNB rates: ${upstreamResponse.status}`,
         }),
       };
     }
 
     const text = await upstreamResponse.text();
     const rates = parseRates(text);
 
     return {
       statusCode: 200,
       headers: {
         "Content-Type": "application/json",
         "Cache-Control": "public, max-age=1800",
       },
       body: JSON.stringify(rates),
     };
   } catch (error) {
     return {
       statusCode: 500,
       headers: {
         "Content-Type": "application/json",
         "Cache-Control": "public, max-age=0",
       },
       body: JSON.stringify({
         message:
           error instanceof Error ? error.message : "Unexpected server error",
       }),
     };
   }
 };
