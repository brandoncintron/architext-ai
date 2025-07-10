"use client";

import * as React from "react";
import { useEffect } from "react";

import { ThemeProvider as NextThemesProvider, useTheme } from "next-themes";

const ThemeSync = () => {
  const { theme } = useTheme();

  useEffect(() => {
    if (theme) {
      document.documentElement.dataset.colorMode = theme;
    }
  }, [theme]);

  return null;
};

export function ThemeProvider({
  children,
  ...props
}: React.ComponentProps<typeof NextThemesProvider>) {
  return (
    <NextThemesProvider {...props}>
      <ThemeSync />
      {children}
    </NextThemesProvider>
  );
}
