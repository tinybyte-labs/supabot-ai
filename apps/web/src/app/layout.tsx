import "@/styles/globals.css";

import { APP_NAME } from "@/utils/constants";
import { APP_DESC } from "@/utils/constants/strings";
import RootProviders from "./providers";
import { getServerSession } from "next-auth";
import { ReactNode } from "react";
import { TRPCReactProvider } from "@/trpc/client";
import { headers } from "next/headers";
import { Inter } from "next/font/google";
import { cn } from "@/lib/utils";
import { authOptions } from "@acme/auth";

export const metadata = {
  title: APP_NAME,
  description: APP_DESC,
};

const inter = Inter({ subsets: ["latin"] });

export default async function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  const session = await getServerSession(authOptions);

  return (
    <html lang="en">
      <body className={cn(inter.className)}>
        <TRPCReactProvider headers={headers()}>
          <RootProviders sesssion={session}>{children}</RootProviders>
        </TRPCReactProvider>
      </body>
    </html>
  );
}
