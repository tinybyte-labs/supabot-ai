import "@/styles/globals.css";
import { trpc } from "@/utils/trpc";
import { ThemeProvider } from "next-themes";
import type { AppProps } from "next/app";

function App({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider attribute="class" enableSystem>
      <Component {...pageProps} />
    </ThemeProvider>
  );
}

export default trpc.withTRPC(App);
