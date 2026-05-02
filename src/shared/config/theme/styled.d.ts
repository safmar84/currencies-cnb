import "styled-components";

declare module "styled-components" {
  export interface DefaultTheme {
    name: "light" | "dark";
    colors: {
      background: string;
      surface: string;
      border: string;
      text: string;
      mutedText: string;
      error: string;
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
    };
    radius: {
      card: string;
      listItem: string;
    };
    layout: {
      cardMaxWidth: string;
    };
    typography: {
      eyebrowSize: string;
      titleSize: string;
      codeSize: string;
    };
    shadow: {
      card: string;
    };
  }
}
