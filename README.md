# currencies-cnb

React + TypeScript + Vite application for displaying CNB exchange rates and preparing a CZK currency converter.

The project currently includes:

- React app bootstrapped with Vite
- TypeScript configured in a single `tsconfig.json`
- `styled-components` for component styling
- React Query for data fetching
- Netlify function proxy for the CNB TXT endpoint
- Zod schemas for runtime payload validation
- automatic light/dark theme based on the operating system preference
- semantic UI tokens for colors, spacing, radius, layout, typography, and shadow
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

The project now follows a **layered architecture** with a lightweight **Feature-Sliced Design (FSD)** direction, plus a small **Netlify proxy/BFF layer** in front of the external CNB endpoint.

The application is split into these responsibilities:

1. **App layer (`src/app`)**
   - provides application-level setup such as the shared React Query client and theme provider wiring
2. **Pages layer (`src/pages`)**
   - composes the full screen currently rendered by the app (`rates-page`)
3. **Widgets layer (`src/widgets`)**
   - contains larger UI blocks such as the exchange rates list
4. **Entities layer (`src/entities/exchange-rate`)**
   - contains the exchange-rate domain contract, parser, API client, and React Query hook
5. **Shared layer (`src/shared`)**
   - stores shared testing fixtures and theme configuration
   - exposes semantic UI tokens used by the styled-components theme
6. **Proxy/backend layer (`netlify/functions/rates.ts`)**
   - runs as a Netlify Function
   - fetches the CNB TXT endpoint on the server side
   - avoids browser-side CORS and keeps TXT parsing out of the UI layer

At the moment there is no implemented `features/` slice yet. The future CZK conversion behavior is intended to live there as a real user-facing feature.

### Architectural patterns in use

- **Layered architecture**
  - UI, data fetching, proxy/backend, and parsing/validation have clearly separated responsibilities
- **Feature-Sliced Design direction**
  - the code is organized into `app / pages / widgets / entities / shared`
  - the current domain logic lives in `entities/exchange-rate`, while future user actions such as the converter belong in `features`
- **Proxy / BFF-lite**
  - the frontend does not call the CNB TXT endpoint directly
  - Netlify Functions expose a stable `/api/rates` interface tailored to the UI
- **Adapter / anti-corruption layer**
  - `parseRates()` isolates the application from the raw external TXT format and converts it into an internal typed contract
- **Theme tokens + system theme detection**
  - semantic UI tokens are defined once and consumed across the UI
  - the app automatically follows the OS light/dark preference through `prefers-color-scheme`

### Why these choices

- **Vite** keeps the frontend setup simple and lightweight
- **React Query** handles async state, caching, and retry behavior cleanly
- **Netlify Functions** provide a minimal proxy/backend layer without introducing a full backend framework
- **Zod** adds runtime safety for external data coming from the CNB endpoint
- **Semantic theme tokens** keep spacing, typography, radius, layout, and colors centralized
- **System light/dark detection** improves UX without introducing manual theme state yet
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
    ├── app/
    │   └── providers/
    │       ├── query-client/
    │       └── theme/
    ├── entities/
    │   └── exchange-rate/
    │       ├── api/
    │       │   ├── fetch-rates.test.ts
    │       │   ├── index.ts
    │       │   └── fetch-rates.ts
    │       ├── index.ts
    │       └── model/
    │           ├── index.ts
    │           ├── parser.test.ts
    │           ├── parser.ts
    │           ├── types.test.ts
    │           ├── types.ts
    │           └── use-rates-query.ts
    ├── index.css
    ├── main.tsx
    ├── pages/
    │   └── rates-page/
    │       ├── index.ts
    │       └── ui/
    │           └── RatesPage.tsx
    ├── shared/
    │   ├── config/
    │   │   └── theme/
    │   │       ├── index.ts
    │   │       ├── styled.d.ts
    │   │       └── theme.ts
    │   └── lib/
    │       └── testing/
    │           └── fixtures/
    │               ├── index.ts
    │               └── rates.ts
    ├── vite-env.d.ts
    └── widgets/
        └── exchange-rates-list/
            ├── index.ts
            └── ui/
                └── ExchangeRatesList.tsx
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

## UI theme and tokens

The app uses `styled-components` theme support with semantic tokens and automatic OS theme detection.

- theme provider wiring lives in `src/app/providers/theme/`
- shared semantic theme tokens live in `src/shared/config/theme/`
- the active theme follows `prefers-color-scheme`

The current token groups are:

- `colors`
- `spacing`
- `radius`
- `layout`
- `typography`
- `shadow`

The goal is to keep styled components free of ad-hoc visual values as much as possible and centralize UI decisions in the shared theme.

## Test structure

The test strategy is layered to match the current architecture:

1. `src/entities/exchange-rate/model/parser.test.ts`
   - unit tests for `parseRates()`
   - covers valid CNB TXT payloads, historical format handling, and invalid row/header/date cases
2. `src/entities/exchange-rate/model/types.test.ts`
   - schema tests for `RatesSchema`
   - covers valid vs invalid JSON payloads
3. `src/entities/exchange-rate/api/fetch-rates.test.ts`
   - frontend API client tests for `fetchRates()`
   - verifies `/api/rates` is called and the JSON response is validated
4. `netlify/functions/rates.test.ts`
   - proxy tests for the Netlify handler
   - covers successful upstream fetch, non-OK upstream response, thrown fetch errors, and invalid upstream payloads

Shared happy-path fixtures live in:

```text
src/shared/lib/testing/fixtures/rates.ts
```

These fixtures are reused across parser, schema, and proxy tests to keep the payload contract consistent.

## Planned next steps

1. Refine the exchange rates UI
2. Build the CZK conversion form
3. Add UI-level tests after the main UI is in place
4. Prepare deployment and final polish
