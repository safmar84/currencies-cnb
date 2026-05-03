import {
  type PropsWithChildren,
  useEffect,
  useMemo,
  useState,
} from "react";
import { ThemeProvider } from "styled-components";
import { darkTheme, lightTheme } from "../../../shared/config/theme";
import { GlobalStyle } from "./GlobalStyle";
import { ThemeModeProvider, isThemeMode, type ThemeMode } from "./theme-mode";

const DARK_MODE_MEDIA_QUERY = "(prefers-color-scheme: dark)";
const THEME_MODE_STORAGE_KEY = "currencies-cnb-theme-mode";

function getSystemPrefersDarkMode() {
  if (typeof window === "undefined") {
    return false;
  }

  return window.matchMedia(DARK_MODE_MEDIA_QUERY).matches;
}

function getStoredThemeMode(): ThemeMode {
  if (typeof window === "undefined") {
    return "auto";
  }

  const storedMode = window.localStorage.getItem(THEME_MODE_STORAGE_KEY);

  return isThemeMode(storedMode) ? storedMode : "auto";
}

export function AppThemeProvider({ children }: PropsWithChildren) {
  const [mode, setMode] = useState<ThemeMode>(getStoredThemeMode);
  const [systemPrefersDarkMode, setSystemPrefersDarkMode] = useState(
    getSystemPrefersDarkMode,
  );

  useEffect(() => {
    const mediaQueryList = window.matchMedia(DARK_MODE_MEDIA_QUERY);

    const handleChange = (event: MediaQueryListEvent) => {
      setSystemPrefersDarkMode(event.matches);
    };

    mediaQueryList.addEventListener("change", handleChange);

    return () => {
      mediaQueryList.removeEventListener("change", handleChange);
    };
  }, []);

  useEffect(() => {
    window.localStorage.setItem(THEME_MODE_STORAGE_KEY, mode);
  }, [mode]);

  const resolvedMode =
    mode === "auto" ? (systemPrefersDarkMode ? "dark" : "light") : mode;

  const theme = resolvedMode === "dark" ? darkTheme : lightTheme;

  const themeModeValue = useMemo(
    () => ({
      mode,
      resolvedMode,
      setMode,
    }),
    [mode, resolvedMode],
  );

  return (
    <ThemeModeProvider value={themeModeValue}>
      <ThemeProvider theme={theme}>
        <GlobalStyle />
        {children}
      </ThemeProvider>
    </ThemeModeProvider>
  );
}
