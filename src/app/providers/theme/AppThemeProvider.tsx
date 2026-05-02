import { type PropsWithChildren, useEffect, useState } from "react";
import { ThemeProvider } from "styled-components";
import { darkTheme, lightTheme } from "../../../shared/config/theme";
import { GlobalStyle } from "./GlobalStyle";

const DARK_MODE_MEDIA_QUERY = "(prefers-color-scheme: dark)";

function getPreferredTheme() {
  if (typeof window === "undefined") {
    return lightTheme;
  }

  return window.matchMedia(DARK_MODE_MEDIA_QUERY).matches
    ? darkTheme
    : lightTheme;
}

export function AppThemeProvider({ children }: PropsWithChildren) {
  const [theme, setTheme] = useState(getPreferredTheme);

  useEffect(() => {
    const mediaQueryList = window.matchMedia(DARK_MODE_MEDIA_QUERY);

    const updateTheme = (isDarkMode: boolean) => {
      setTheme(isDarkMode ? darkTheme : lightTheme);
    };

    updateTheme(mediaQueryList.matches);

    const handleChange = (event: MediaQueryListEvent) => {
      updateTheme(event.matches);
    };

    mediaQueryList.addEventListener("change", handleChange);

    return () => {
      mediaQueryList.removeEventListener("change", handleChange);
    };
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      {children}
    </ThemeProvider>
  );
}
