"use client";

import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { ReactNode } from "react";

export default function RootProviders({
  children,
  sesssion,
}: {
  children: ReactNode;
  sesssion?: Session | null;
}) {
  return (
    <SessionProvider session={sesssion}>
      <TooltipProvider>
        {children}
        <Toaster />
      </TooltipProvider>
    </SessionProvider>
  );
}
