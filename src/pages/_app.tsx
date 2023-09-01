import { Toaster } from "@/components/ui/toaster";
import "@/styles/globals.css";
import { AppPropsWithLayout } from "@/types/next";
import { trpc } from "@/utils/trpc";
import { ClerkProvider } from "@clerk/nextjs";
import { ThemeProvider } from "next-themes";
import NextNProgress from "nextjs-progressbar";
import { Inter } from "next/font/google";
import { cn } from "@/lib/utils";
import { useCallback, useEffect } from "react";
import { useRouter } from "next/router";
import { useAtom } from "jotai";
import { sidebarOpenAtom } from "@/atoms/sidebarOpen";
import Head from "next/head";
import { APP_NAME } from "@/utils/constants";

const inter = Inter({ subsets: ["latin"] });

function App({ Component, pageProps }: AppPropsWithLayout) {
  const getLayout = Component.getLayout ?? ((page) => page);
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useAtom(sidebarOpenAtom);

  const closeSidebar = useCallback(() => {
    setSidebarOpen(false);
  }, [setSidebarOpen]);

  useEffect(() => {
    if (!sidebarOpen) return;
    router.events.on("routeChangeStart", closeSidebar);
    window.addEventListener("resize", closeSidebar);
    return () => {
      router.events.off("routeChangeStart", closeSidebar);
      window.removeEventListener("resize", closeSidebar);
    };
  }, [closeSidebar, router.events, sidebarOpen]);

  return (
    <ThemeProvider attribute="class" enableSystem>
      <ClerkProvider {...pageProps}>
        <NextNProgress
          color="#2563EB"
          height={2}
          options={{ showSpinner: false }}
        />
        <div className={cn(inter.className, "antialiased")}>
          <Head>
            <title>{APP_NAME}</title>
          </Head>
          {getLayout(<Component {...pageProps} />)}
        </div>
        <Toaster />
      </ClerkProvider>
    </ThemeProvider>
  );
}

export default trpc.withTRPC(App);
