import {
  createContext,
  type Dispatch,
  type PropsWithChildren,
  type SetStateAction,
  useContext,
} from "react";

export type ThemeMode = "auto" | "light" | "dark";

export function isThemeMode(value: string | null): value is ThemeMode {
  return value === "auto" || value === "light" || value === "dark";
}

type ThemeModeContextValue = {
  mode: ThemeMode;
  resolvedMode: Exclude<ThemeMode, "auto">;
  setMode: Dispatch<SetStateAction<ThemeMode>>;
};

const ThemeModeContext = createContext<ThemeModeContextValue | null>(null);

export function ThemeModeProvider({
  children,
  value,
}: PropsWithChildren<{ value: ThemeModeContextValue }>) {
  return (
    <ThemeModeContext.Provider value={value}>
      {children}
    </ThemeModeContext.Provider>
  );
}

export function useThemeMode() {
  const context = useContext(ThemeModeContext);

  if (!context) {
    throw new Error("useThemeMode must be used within AppThemeProvider");
  }

  return context;
}
