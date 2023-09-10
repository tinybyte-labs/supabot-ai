import Background from "@/components/Background";
import DevWarningBar from "@/components/DevWarningBar";
import MarketingFooter from "@/components/MarketingFooter";
import MarketingHeader from "@/components/MarketingHeader";
import Script from "next/script";
import { ReactNode } from "react";

const MarketingLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="flex min-h-screen flex-col">
      <Background />
      <DevWarningBar />
      <MarketingHeader />
      <div className="flex-1">{children}</div>
      <MarketingFooter />
      <Script
        strategy="lazyOnload"
        src={`http://localhost:3000/api/widget/js?id=${process.env.NEXT_PUBLIC_DEMO_CHATBOT_ID}`}
      ></Script>
    </div>
  );
};

export default MarketingLayout;
