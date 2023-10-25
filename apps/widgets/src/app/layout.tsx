import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/cn";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "SupaBot AI",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={cn(inter.className, "flex min-h-screen flex-col")}>
        {children}
      </body>
    </html>
  );
}
