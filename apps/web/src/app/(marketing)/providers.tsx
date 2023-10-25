"use client";

import { ThemeProvider } from "next-themes";
import { ReactNode } from "react";

export default function MarketingProviders({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <ThemeProvider forcedTheme="dark" attribute="class">
      {children}
    </ThemeProvider>
  );
}
