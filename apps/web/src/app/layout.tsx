import "@/styles/globals.css";

import { APP_NAME } from "@/utils/constants";
import { APP_DESC } from "@/utils/constants/strings";
import RootProviders from "./providers";
import { getServerSession } from "next-auth";
import { ReactNode } from "react";
import { TRPCReactProvider } from "@/trpc/client";
import { headers } from "next/headers";
import { Inter } from "next/font/google";

export const metadata = {
  title: APP_NAME,
  description: APP_DESC,
};

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export default async function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  const session = await getServerSession();
  return (
    <html lang="en">
      <body className={`font-sans ${inter.variable}`}>
        <TRPCReactProvider headers={headers()}>
          <RootProviders sesssion={session}>{children}</RootProviders>
        </TRPCReactProvider>
      </body>
    </html>
  );
}
