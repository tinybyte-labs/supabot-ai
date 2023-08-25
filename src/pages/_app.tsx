import { Toaster } from "@/components/ui/toaster";
import "@/styles/globals.css";
import { AppPropsWithLayout } from "@/types/next";
import { trpc } from "@/utils/trpc";
import { ClerkProvider } from "@clerk/nextjs";
import { ThemeProvider } from "next-themes";

function App({ Component, pageProps }: AppPropsWithLayout) {
  const getLayout = Component.getLayout ?? ((page) => page);

  return (
    <ThemeProvider attribute="class" enableSystem>
      <ClerkProvider {...pageProps}>
        {getLayout(<Component {...pageProps} />)}
        <Toaster />
      </ClerkProvider>
    </ThemeProvider>
  );
}

export default trpc.withTRPC(App);
