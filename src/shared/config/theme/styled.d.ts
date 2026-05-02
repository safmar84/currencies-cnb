import "styled-components";

declare module "styled-components" {
  export interface DefaultTheme {
    name: "light" | "dark";
    colors: {
      background: string;
      surface: string;
      subtleSurface: string;
      border: string;
      text: string;
      mutedText: string;
      error: string;
      accent: string;
      onAccent: string;
    };
    spacing: {
      pagePadding: string;
      cardPadding: string;
      eyebrowMarginBottom: string;
      titleMarginBottom: string;
      metaMarginBottom: string;
      listGap: string;
      itemGap: string;
      itemPadding: string;
      controlGap: string;
      togglePaddingX: string;
      togglePaddingY: string;
    };
    radius: {
      card: string;
      listItem: string;
      control: string;
    };
    layout: {
      cardMaxWidth: string;
    };
    typography: {
      eyebrowSize: string;
      titleSize: string;
      codeSize: string;
      controlSize: string;
    };
    shadow: {
      card: string;
    };
  }
}
