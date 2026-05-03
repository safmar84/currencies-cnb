# currencies-cnb

React + TypeScript + Vite application for displaying CNB exchange rates and converting CZK amounts.

The project currently includes:

- React app bootstrapped with Vite
- TypeScript configured in a single `tsconfig.json`
- `styled-components` for component styling
- React Query for data fetching
- Netlify function proxy for the CNB TXT endpoint
- Zod schemas for runtime payload validation
- automatic and manual light/dark theme switching (`auto` / `light` / `dark`)
- semantic UI tokens for colors, spacing, radius, layout, typography, and shadow
- current UI that loads, converts, and renders exchange rates
- unit, component, and integration tests for parser, schema, frontend API client, Netlify proxy, theme behavior, rates-list/page wiring, and conversion logic

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
   - contains the exchange-rate domain contract, parser, API client, React Query hook, and a server-safe parser entrypoint for the Netlify function
5. **Shared layer (`src/shared`)**
   - stores shared testing fixtures and theme configuration
   - exposes semantic UI tokens used by the styled-components theme
6. **Features layer (`src/features`)**
   - contains user-facing behavior such as the theme mode toggle and currency converter
7. **Proxy/backend layer (`netlify/functions/rates.ts`)**
   - runs as a Netlify Function
   - fetches the CNB TXT endpoint on the server side
   - caches parsed rates until the next expected CNB update window
   - avoids browser-side CORS and keeps TXT parsing out of the UI layer

The current `features/` slice contains the theme mode toggle and the currency converter feature.

### Architectural decisions

- **Layered architecture + FSD direction**
  - the code is organized into `app / pages / widgets / features / entities / shared`
  - UI composition, user-facing behavior, domain logic, and shared infrastructure stay clearly separated
- **Proxy / BFF-lite**
  - the frontend does not call the CNB TXT endpoint directly
  - Netlify Functions expose a stable `/api/rates` interface tailored to the UI and avoid browser-side CORS concerns
- **Adapter + Zod validation**
  - `parseRates()` isolates the application from the raw CNB TXT format and converts it into an internal typed contract
  - `RatesSchema` adds runtime safety for external data at both the backend and frontend boundaries
- **Daily-aware caching**
  - both frontend and backend use the same refresh window derived from the CNB schedule
  - this avoids repeatedly calling the CNB endpoint even though rates change only once per working day
- **Semantic theme tokens + theme mode**
  - visual decisions live in shared semantic theme tokens instead of scattered component-level values
  - the app supports `auto`, `light`, and `dark` modes with OS preference detection and persisted manual override
- **Shared fixtures and layered tests**
  - shared fixtures keep parser, schema, API client, and proxy tests aligned around the same payload contract
  - the current test suite mixes unit, component, and integration tests to match the architecture without adding a heavier browser-test stack yet

### Project structure

```text
.
├── index.html
├── netlify/
│   └── functions/
│       └── rates.ts
├── netlify.toml
├── package.json
├── tsconfig.json
├── vite.config.ts
└── src
    ├── App.tsx
    ├── main.tsx
    ├── app/
    │   └── providers/
    │       ├── query-client/
    │       └── theme/
    ├── entities/
    │   └── exchange-rate/
    │       ├── index.ts
    │       ├── api/
    │       ├── model/
    │       ├── server.ts
    ├── features/
    │   ├── currency-converter/
    │   │   ├── model/
    │   │   └── ui/
    │   └── theme-mode-toggle/
    │       └── ui/
    ├── pages/
    │   └── rates-page/
    │       └── ui/
    ├── shared/
    │   ├── config/
    │   │   └── theme/
    │   └── lib/
    │       ├── rate-flag/
    │       ├── rates-cache/
    │       └── testing/
    └── widgets/
        └── exchange-rates-list/
            └── ui/
```

## Scripts

```bash
pnpm dev
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

## UI theme and tokens

The app uses `styled-components` theme support with semantic tokens, OS theme detection, and a persisted theme mode toggle.

- theme provider wiring lives in `src/app/providers/theme/`
- the theme mode control lives in `src/features/theme-mode-toggle/`
- shared semantic theme tokens live in `src/shared/config/theme/`
- the active theme follows `prefers-color-scheme` in `auto` mode
- the user can manually switch between `auto`, `light`, and `dark`
- the selected mode is persisted in `localStorage`

The current token groups are:

- `colors`
- `spacing`
- `radius`
- `layout`
- `typography`
- `shadow`

The goal is to keep styled components free of ad-hoc visual values as much as possible and centralize UI decisions in the shared theme.

## Currency converter

The converter is implemented as a dedicated `features/currency-converter/` slice.

- it uses one reusable amount/currency card UI for both sides
- the **FROM** side is an editable CZK amount with a locked currency select
- the **TO** side is a read-only converted amount with a selectable target currency
- the output recalculates immediately when the source amount or target currency changes

## Rates caching

The rates flow is now cached in three layers:

- the Netlify function keeps parsed rates in memory until the next expected CNB update window
- the function also returns `Cache-Control` headers so shared HTTP caches do not hit the CNB endpoint on every request
- React Query keeps the fetched rates fresh on the client until the same next expected refresh window

The refresh window is based on the CNB documentation: rates are updated once per working day at around **2:30 p.m. Prague time**.

If the app fetches rates after the expected publish time but the CNB still returns an older `publishedAt` value, those rates are treated as temporarily stale and cached only for **5 minutes**. This avoids freezing yesterday's rates until the next working day while still preventing excessive retry traffic.

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
   - covers successful upstream fetch, in-memory cache reuse, cache expiry, 5-minute stale-data caching after the expected publish time, non-OK upstream response, thrown fetch errors, and invalid upstream payloads
5. `src/shared/lib/rates-cache/rates-cache.test.ts`
   - unit tests for computing cache expiry and the expected CNB publication date
   - covers same-day refreshes, next-working-day refreshes, weekend handling, and short-cache behavior for stale `publishedAt` values
6. `src/features/currency-converter/model/convert-czk-to-currency.test.ts`
   - unit tests for the CZK-to-foreign-currency conversion formula
   - covers rates quoted per one unit and per multiple units
7. `src/features/currency-converter/ui/CurrencyAmountCard.test.tsx`
   - component tests for converter card interaction details
   - covers autofocus, keyboard tab-order exclusion for the read-only result field, and disabled select chevron visibility
8. `src/features/currency-converter/ui/CurrencyConverter.test.tsx`
   - component tests for converter behavior
   - covers default target selection, fallback target selection, reactive recalculation, input filtering, and target-currency change notifications
9. `src/widgets/exchange-rates-list/ui/ExchangeRatesList.test.tsx`
   - component tests for the rates list widget
   - covers loading, error rendering, published metadata, and highlighted-currency ordering
10. `src/pages/rates-page/ui/RatesPage.test.tsx`
   - thin page-level integration test
   - verifies that converter target selection is propagated into the exchange-rates highlight ordering
11. `src/app/providers/theme/AppThemeProvider.test.tsx`
   - integration tests for theme mode behavior
   - covers restore from `localStorage`, persistence after change, `auto` mode, and reactions to `prefers-color-scheme` updates
12. `src/shared/lib/rate-flag/rate-flag.test.ts`
   - unit tests for country-to-emoji mapping
   - covers normal countries, CNB special entries such as `EMU` and `IMF`, and the unknown-country fallback

Shared happy-path fixtures live in:

```text
src/shared/lib/testing/fixtures/rates.ts
```

These fixtures are reused across parser, schema, and proxy tests to keep the payload contract consistent.

If the project grows to include more complex browser-specific interactions, richer responsive behavior, or longer user journeys, it would be reasonable to add a small set of browser-level component tests and/or Playwright end-to-end tests for the most critical flows.

TypeScript runs in `strict` mode for both the frontend (`src`) and the Netlify function layer (`netlify/functions`).

## Assignment (from Momence)

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
