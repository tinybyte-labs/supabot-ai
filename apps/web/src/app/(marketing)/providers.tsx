"use client";

import { Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { ThemeProvider } from "next-themes";
import { ReactNode } from "react";

export default function MarketingProviders({
  children,
  session,
}: {
  children: ReactNode;
  session?: Session | null;
}) {
  return (
    <ThemeProvider forcedTheme="dark" attribute="class">
      <SessionProvider session={session}>{children}</SessionProvider>
    </ThemeProvider>
  );
}
