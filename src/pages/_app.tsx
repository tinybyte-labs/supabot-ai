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
import Script from "next/script";
import * as gtag from "@/utils/gtag";

const inter = Inter({ subsets: ["latin"] });

function App({ Component, pageProps }: AppPropsWithLayout) {
  const getLayout = Component.getLayout ?? ((page) => page);
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useAtom(sidebarOpenAtom);

  const closeSidebar = useCallback(() => {
    setSidebarOpen(false);
  }, [setSidebarOpen]);

  const onRouteChangeComplete = (e: any) => {
    gtag.pageView(e);
  };

  useEffect(() => {
    router.events.on("routeChangeComplete", onRouteChangeComplete);
    return () => {
      router.events.off("routeChangeComplete", onRouteChangeComplete);
    };
  }, [router.events]);

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
          {process.env.NODE_ENV === "production" && (
            <Script
              strategy="lazyOnload"
              src={`https://www.googletagmanager.com/gtag/js?id=${gtag.MEASUREMENT_ID}`}
            />
          )}

          <Script id="google-analytics" strategy="lazyOnload">
            {`
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments);}
                  gtag('js', new Date());
                  gtag('config', '${gtag.MEASUREMENT_ID}', {
                  page_path: window.location.pathname,
                  });
                  console.log("GA SENT");
                `}
          </Script>

          {getLayout(<Component {...pageProps} />)}
        </div>
        <Toaster />
      </ClerkProvider>
    </ThemeProvider>
  );
}

export default trpc.withTRPC(App);
