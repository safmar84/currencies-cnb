import type { DefaultTheme } from "styled-components";

export const lightTheme: DefaultTheme = {
  name: "light",
  colors: {
    background: "#f8fafc",
    surface: "#ffffff",
    border: "#e2e8f0",
    text: "#0f172a",
    mutedText: "#475569",
    error: "#b91c1c",
  },
  spacing: {
    pagePadding: "2rem",
    cardPadding: "2rem",
    eyebrowMarginBottom: "0.75rem",
    titleMarginBottom: "1rem",
    metaMarginBottom: "1rem",
    listGap: "0.75rem",
    itemGap: "0.25rem",
    itemPadding: "1rem",
  },
  radius: {
    card: "1rem",
    listItem: "0.75rem",
  },
  layout: {
    cardMaxWidth: "48rem",
  },
  typography: {
    eyebrowSize: "0.875rem",
    titleSize: "2rem",
    codeSize: "1rem",
  },
  shadow: {
    card: "0 20px 45px rgba(15, 23, 42, 0.08)",
  },
};

export const darkTheme: DefaultTheme = {
  name: "dark",
  colors: {
    background: "#020617",
    surface: "#0f172a",
    border: "#334155",
    text: "#e2e8f0",
    mutedText: "#94a3b8",
    error: "#fca5a5",
  },
  spacing: {
    pagePadding: "2rem",
    cardPadding: "2rem",
    eyebrowMarginBottom: "0.75rem",
    titleMarginBottom: "1rem",
    metaMarginBottom: "1rem",
    listGap: "0.75rem",
    itemGap: "0.25rem",
    itemPadding: "1rem",
  },
  radius: {
    card: "1rem",
    listItem: "0.75rem",
  },
  layout: {
    cardMaxWidth: "48rem",
  },
  typography: {
    eyebrowSize: "0.875rem",
    titleSize: "2rem",
    codeSize: "1rem",
  },
  shadow: {
    card: "0 20px 45px rgba(2, 6, 23, 0.45)",
  },
};
