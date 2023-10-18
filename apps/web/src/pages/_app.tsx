import { Toaster } from "@/components/ui/toaster";
import "@/styles/globals.css";
import { AppPropsWithLayout } from "@/types/next";
import { Inter } from "next/font/google";
import { cn } from "@/lib/utils";
import { useEffect } from "react";
import { useRouter } from "next/router";
import { useAtom } from "jotai";
import { sidebarOpenAtom } from "@/atoms/sidebarOpen";
import Head from "next/head";
import { APP_NAME } from "@/utils/constants";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Elements } from "@stripe/react-stripe-js";
import { stripePromise } from "@/lib/stripe";
import { trpc } from "@/utils/trpc";
import { SessionProvider } from "next-auth/react";
import PlausibleProvider from "next-plausible";

const inter = Inter({ subsets: ["latin"] });

function App({
  Component,
  pageProps: { session, ...pageProps },
}: AppPropsWithLayout) {
  const getLayout = Component.getLayout ?? ((page) => page);
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useAtom(sidebarOpenAtom);

  useEffect(() => {
    if (!sidebarOpen) return;

    const closeSidebar = () => {
      setSidebarOpen(false);
    };

    router.events.on("routeChangeStart", closeSidebar);
    window.addEventListener("resize", closeSidebar);

    return () => {
      router.events.off("routeChangeStart", closeSidebar);
      window.removeEventListener("resize", closeSidebar);
    };
  }, [router.events, setSidebarOpen, sidebarOpen]);

  return (
    <PlausibleProvider domain="supabotai.com">
      <Elements stripe={stripePromise}>
        <SessionProvider session={session}>
          <TooltipProvider>
            <div className={cn(inter.className, "antialiased")}>
              <Head>
                <title>{APP_NAME}</title>
              </Head>
              {getLayout(<Component {...pageProps} />)}
            </div>
          </TooltipProvider>
          <Toaster />
        </SessionProvider>
      </Elements>
    </PlausibleProvider>
  );
}

export default trpc.withTRPC(App);
