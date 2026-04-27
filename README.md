# currencies-cnb

Minimal React + TypeScript + Vite scaffold for a CNB currency converter.

The project is currently prepared as a clean starting point for the assignment:

- React app bootstrapped with Vite
- TypeScript configured in a single `tsconfig.json`
- `styled-components` added for component styling
- simple placeholder UI in `src/App.tsx`

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

## Current structure

```text
.
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
└── src
    ├── App.tsx
    ├── index.css
    ├── main.tsx
    └── vite-env.d.ts
```

## Scripts

```bash
pnpm dev
pnpm build
pnpm preview
```

## Install

```bash
pnpm install
```

## Next planned steps

1. Add React Query
2. Create CNB rates fetch + parser flow
3. Build exchange rates list UI
4. Build CZK conversion form
5. Add automated tests
