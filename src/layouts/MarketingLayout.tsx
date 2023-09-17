import Background from "@/components/Background";
import DevWarningBar from "@/components/DevWarningBar";
import MarketingFooter from "@/components/MarketingFooter";
import MarketingHeader from "@/components/MarketingHeader";
import { BASE_DOMAIN } from "@/utils/constants";
import { ThemeProvider } from "next-themes";
import Script from "next/script";
import { ReactNode } from "react";

const MarketingLayout = ({ children }: { children: ReactNode }) => {
  return (
    <ThemeProvider forcedTheme="dark" attribute="class">
      <div className="flex min-h-screen flex-col">
        <DevWarningBar />
        <Background />
        <MarketingHeader />
        <main className="flex-1">{children}</main>
        <MarketingFooter />
        <Script
          strategy="lazyOnload"
          src={`${BASE_DOMAIN}/api/widget/js?id=${process.env.NEXT_PUBLIC_DEMO_CHATBOT_ID}`}
        ></Script>
      </div>
    </ThemeProvider>
  );
};

export default MarketingLayout;
