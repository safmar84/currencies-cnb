# currencies-cnb

React + TypeScript + Vite application for displaying CNB exchange rates and preparing a CZK currency converter.

The project currently includes:

- React app bootstrapped with Vite
- TypeScript configured in a single `tsconfig.json`
- `styled-components` for component styling
- React Query for data fetching
- Netlify function proxy for the CNB TXT endpoint
- Zod schemas for runtime payload validation
- current UI that loads and renders exchange rates
- unit tests for parser, schema, frontend API client, and Netlify proxy

## Assignment

Create a simple React app (don’t use NextJS please), which:

1. When it starts, retrieve the latest currency exchange rates from the Czech National Bank.

API URL: https://www.cnb.cz/en/financial-markets/foreign-exchange-market/central-bank-exchange-rate-fixing/central-bank-exchange-rate-fixing/daily.txt

Documentation: https://www.cnb.cz/en/faq/Format-of-the-foreign-exchange-market-rates/

2. Parses the downloaded data and clearly displays a list to the user in the UI.

3. Add a simple form, into which the customer can enter an amount in CZK and select a currency, and after submitting (clicking a button or in real-time) sees the amount entered in CZK converted into the selected currency.

4. Commit your code throughout your work and upload the resulting codebase into a Github repo.

5. Deploy the app so it can be viewed online (it doesn’t matter where - e.q. Vercel, Netflify, etc.).
6. Add automated tests which might be appropriate to ensure that your solution is working correctly.

7. Tech stack: React (+ Hooks), TypeScript, Styled Components, React Query.

Overall: Keep the code simple and the UI nice and easy to use for the user.

## Architecture

The application is intentionally split into a few small layers:

1. **Frontend UI (`src/App.tsx`)**
   - renders loading, error, and success states
   - displays the current exchange rates list
2. **Frontend data layer (`src/features/rates/api.ts`, `useRatesQuery.ts`, `src/lib/queryClient.ts`)**
   - uses React Query for fetching and caching
   - keeps the browser-side API access limited to `/api/rates`
3. **Proxy/backend layer (`netlify/functions/rates.ts`)**
   - runs as a Netlify Function
   - fetches the CNB TXT endpoint on the server side
   - avoids browser-side CORS and keeps TXT parsing out of the UI layer
4. **Parsing and validation layer (`src/features/rates/parser.ts`, `types.ts`)**
   - `parseRates()` converts raw CNB TXT into a normalized JavaScript object
   - Zod validates the parsed object and the frontend JSON response shape at runtime
   - this keeps the contract explicit between the Netlify function and the frontend

### Why these choices

- **Vite** keeps the frontend setup simple and lightweight
- **React Query** handles async state, caching, and retry behavior cleanly
- **Netlify Functions** provide a minimal proxy/backend layer without introducing a full backend framework
- **Zod** adds runtime safety for external data coming from the CNB endpoint
- **Shared test fixtures** keep parser, schema, API client, and proxy tests aligned around the same payload contract

### Project structure

```text
.
├── index.html
├── netlify/
│   └── functions/
│       ├── rates.test.ts
│       └── rates.ts
├── netlify.toml
├── package.json
├── tsconfig.json
├── vite.config.ts
└── src
    ├── App.tsx
    ├── features/
    │   └── rates/
    │       ├── api.test.ts
    │       ├── api.ts
    │       ├── parser.test.ts
    │       ├── parser.ts
    │       ├── types.test.ts
    │       ├── types.ts
    │       └── useRatesQuery.ts
    ├── index.css
    ├── lib/
    │   └── queryClient.ts
    ├── main.tsx
    ├── test/
    │   └── fixtures/
    │       └── rates.ts
    └── vite-env.d.ts
```

## Scripts

```bash
pnpm dev
pnpm dev:vite
pnpm build
pnpm test
pnpm preview
```

## Setup

```bash
pnpm install
```

## Development

Use Netlify dev as the default local entry point so the frontend and `/api/rates` proxy run together:

```bash
pnpm dev
```

If you only need the Vite frontend without the Netlify function layer:

```bash
pnpm dev:vite
```

## Test structure

The test strategy is layered to match the current architecture:

1. `src/features/rates/parser.test.ts`
   - unit tests for `parseRates()`
   - covers valid CNB TXT payloads, historical format handling, and invalid row/header/date cases
2. `src/features/rates/types.test.ts`
   - schema tests for `RatesSchema`
   - covers valid vs invalid JSON payloads
3. `src/features/rates/api.test.ts`
   - frontend API client tests for `fetchRates()`
   - verifies `/api/rates` is called and the JSON response is validated
4. `netlify/functions/rates.test.ts`
   - proxy tests for the Netlify handler
   - covers successful upstream fetch, non-OK upstream response, thrown fetch errors, and invalid upstream payloads

Shared happy-path fixtures live in:

```text
src/test/fixtures/rates.ts
```

These fixtures are reused across parser, schema, and proxy tests to keep the payload contract consistent.

## Planned next steps

1. Refine the exchange rates UI
2. Build the CZK conversion form
3. Add UI-level tests after the main UI is in place
4. Prepare deployment and final polish
