 import { z } from "zod";
 
 const RateRowSchema = z.object({
   country: z.string().min(1),
   currency: z.string().min(1),
   amount: z.number().int().positive(),
   code: z.string().length(3).regex(/^[A-Z]{3}$/),
   rate: z.number().positive(),
 });
 
 export const RatesSchema = z.object({
   // This is how it is documented: "02.Jun.2024 #80", but in reality it is "02 Jun 2024 #80". 
   // publishedAt: z.string().regex(/^\d{2}\.[A-Za-z]{3}\.\d{4}$/),
   publishedAt: z.string().regex(/^\d{2} [A-Za-z]{3} \d{4}$/),
   sequence: z.number().int().positive(),
   rows: z.array(RateRowSchema).min(1),
 });
 
 export type RateRow = z.infer<typeof RateRowSchema>;
 export type Rates = z.infer<typeof RatesSchema>;