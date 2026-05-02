// @vitest-environment jsdom

import { act } from "react";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { useTheme } from "styled-components";
import { AppThemeProvider, useThemeMode } from ".";
import { ThemeModeToggle } from "../../../features/theme-mode-toggle";

const THEME_MODE_STORAGE_KEY = "currencies-cnb-theme-mode";
const DARK_MODE_MEDIA_QUERY = "(prefers-color-scheme: dark)";

type RegisteredMediaQueryListener =
  | EventListenerOrEventListenerObject
  | ((this: MediaQueryList, event: MediaQueryListEvent) => unknown);

(
  globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT?: boolean }
).IS_REACT_ACT_ENVIRONMENT = true;

function callListener(
  listener: RegisteredMediaQueryListener,
  event: MediaQueryListEvent,
  mediaQueryList: MediaQueryList,
) {
  if (typeof listener === "function") {
    listener.call(mediaQueryList, event);
    return;
  }

  listener.handleEvent(event);
}

function mockMatchMedia(initialMatches: boolean) {
  let matches = initialMatches;
  const listeners = new Set<RegisteredMediaQueryListener>();
  const mediaQueryList = {
    get matches() {
      return matches;
    },
    media: DARK_MODE_MEDIA_QUERY,
    onchange: null,
    addEventListener: (
      eventName: string,
      listener: EventListenerOrEventListenerObject | null,
    ) => {
      if (eventName === "change" && listener) {
        listeners.add(listener);
      }
    },
    removeEventListener: (
      eventName: string,
      listener: EventListenerOrEventListenerObject | null,
    ) => {
      if (eventName === "change" && listener) {
        listeners.delete(listener);
      }
    },
    addListener: (
      listener:
        | ((this: MediaQueryList, event: MediaQueryListEvent) => unknown)
        | null,
    ) => {
      if (listener) {
        listeners.add(listener);
      }
    },
    removeListener: (
      listener:
        | ((this: MediaQueryList, event: MediaQueryListEvent) => unknown)
        | null,
    ) => {
      if (listener) {
        listeners.delete(listener);
      }
    },
    dispatchEvent: () => true,
  } satisfies MediaQueryList;

  Object.defineProperty(window, "matchMedia", {
    configurable: true,
    writable: true,
    value: vi.fn((query: string): MediaQueryList => ({
      ...mediaQueryList,
      media: query,
    })),
  });

  return {
    setMatches(nextMatches: boolean) {
      matches = nextMatches;

      const event = {
        matches: nextMatches,
        media: DARK_MODE_MEDIA_QUERY,
      } as MediaQueryListEvent;

      listeners.forEach((listener) => callListener(listener, event, mediaQueryList));
    },
  };
}

function ThemeStateProbe() {
  const { mode, resolvedMode } = useThemeMode();
  const theme = useTheme();

  return (
    <>
      <output data-testid="mode">{mode}</output>
      <output data-testid="resolved-mode">{resolvedMode}</output>
      <output data-testid="theme-name">{theme.name}</output>
    </>
  );
}

function renderThemeUi() {
  return render(
    <AppThemeProvider>
      <ThemeModeToggle />
      <ThemeStateProbe />
    </AppThemeProvider>,
  );
}

afterEach(() => {
  cleanup();
  window.localStorage.clear();
  vi.restoreAllMocks();
});

describe("AppThemeProvider", () => {
  it("restores stored mode and persists user changes", () => {
    window.localStorage.setItem(THEME_MODE_STORAGE_KEY, "dark");
    mockMatchMedia(false);

    renderThemeUi();

    expect(screen.getByTestId("mode").textContent).toBe("dark");
    expect(screen.getByTestId("resolved-mode").textContent).toBe("dark");
    expect(screen.getByTestId("theme-name").textContent).toBe("dark");

    fireEvent.click(screen.getByRole("button", { name: "Light" }));

    expect(screen.getByTestId("mode").textContent).toBe("light");
    expect(screen.getByTestId("resolved-mode").textContent).toBe("light");
    expect(screen.getByTestId("theme-name").textContent).toBe("light");
    expect(window.localStorage.getItem(THEME_MODE_STORAGE_KEY)).toBe("light");
  });

  it("uses system preference when mode is auto", () => {
    mockMatchMedia(true);

    renderThemeUi();

    expect(screen.getByTestId("mode").textContent).toBe("auto");
    expect(screen.getByTestId("resolved-mode").textContent).toBe("dark");
    expect(screen.getByTestId("theme-name").textContent).toBe("dark");
    expect(window.localStorage.getItem(THEME_MODE_STORAGE_KEY)).toBe("auto");
  });

  it("reacts to system theme changes in auto mode", () => {
    const mediaQuery = mockMatchMedia(false);

    renderThemeUi();

    expect(screen.getByTestId("resolved-mode").textContent).toBe("light");

    act(() => {
      mediaQuery.setMatches(true);
    });

    expect(screen.getByTestId("resolved-mode").textContent).toBe("dark");
    expect(screen.getByTestId("theme-name").textContent).toBe("dark");
  });

  it("ignores system theme changes after a manual override", () => {
    const mediaQuery = mockMatchMedia(true);

    renderThemeUi();
    fireEvent.click(screen.getByRole("button", { name: "Light" }));

    act(() => {
      mediaQuery.setMatches(false);
    });

    expect(screen.getByTestId("mode").textContent).toBe("light");
    expect(screen.getByTestId("resolved-mode").textContent).toBe("light");
    expect(screen.getByTestId("theme-name").textContent).toBe("light");
  });
});
