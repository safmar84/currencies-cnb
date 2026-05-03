import type { DefaultTheme } from "styled-components";

export const lightTheme: DefaultTheme = {
  name: "light",
  colors: {
    background: "#f8fafc",
    surface: "#ffffff",
    subtleSurface: "#eef2f7",
    border: "#e2e8f0",
    text: "#0f172a",
    mutedText: "#475569",
    error: "#b91c1c",
    accent: "#0f172a",
    onAccent: "#f8fafc",
  },
  spacing: {
    pagePadding: "2rem",
    cardPadding: "2rem",
    eyebrowMarginBottom: "0.75rem",
    metaMarginBottom: "1rem",
    listGap: "0.75rem",
    itemGap: "0.25rem",
    itemPadding: "1rem",
    controlGap: "0.125rem",
    cardTitleOffset: "0.5rem",
    selectChevronSpace: "1rem",
    togglePaddingX: "0.5rem",
    togglePaddingY: "0.35rem",
  },
  radius: {
    card: "1rem",
    listItem: "0.75rem",
    control: "999px",
  },
  layout: {
    cardMaxWidth: "48rem",
    minViewportWidth: "320px",
    compactBreakpoint: "720px",
    directionIndicatorSize: "3rem",
  },
  typography: {
    eyebrowSize: "0.875rem",
    controlSize: "0.875rem",
    sectionTitleSize: "1.25rem",
    indicatorSize: "1.5rem",
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
    subtleSurface: "#172036",
    border: "#334155",
    text: "#e2e8f0",
    mutedText: "#94a3b8",
    error: "#fca5a5",
    accent: "#e2e8f0",
    onAccent: "#020617",
  },
  spacing: {
    pagePadding: "2rem",
    cardPadding: "2rem",
    eyebrowMarginBottom: "0.75rem",
    metaMarginBottom: "1rem",
    listGap: "0.75rem",
    itemGap: "0.25rem",
    itemPadding: "1rem",
    controlGap: "0.125rem",
    cardTitleOffset: "0.5rem",
    selectChevronSpace: "1rem",
    togglePaddingX: "0.5rem",
    togglePaddingY: "0.35rem",
  },
  radius: {
    card: "1rem",
    listItem: "0.75rem",
    control: "999px",
  },
  layout: {
    cardMaxWidth: "48rem",
    minViewportWidth: "320px",
    compactBreakpoint: "720px",
    directionIndicatorSize: "3rem",
  },
  typography: {
    eyebrowSize: "0.875rem",
    controlSize: "0.875rem",
    sectionTitleSize: "1.25rem",
    indicatorSize: "1.5rem",
  },
  shadow: {
    card: "0 20px 45px rgba(2, 6, 23, 0.45)",
  },
};
