import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./app/providers/query-client";
import { AppThemeProvider } from "./app/providers/theme";

import App from "./App";
import "./index.css";

const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error('Missing root element with id "root"');
}

createRoot(rootElement).render(
  <StrictMode>
    <AppThemeProvider>
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    </AppThemeProvider>
  </StrictMode>,
);
