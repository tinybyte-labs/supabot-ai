import { ReactNode } from "react";
import DevWarningBar from "@/components/DevWarningBar";
import MarketingHeader from "@/components/MarketingHeader";
import MarketingFooter from "@/components/MarketingFooter";
import ChatbotWidgetScript from "@/components/ChatbotWidgetScript";
import MarketingProviders from "./providers";

export default function MarketingLayout({ children }: { children: ReactNode }) {
  return (
    <MarketingProviders>
      <div
        className="flex min-h-screen flex-col"
        style={{
          backgroundImage:
            "radial-gradient(circle at center -20%, #0C1220 0%, #0A0A0C 1500px)",
          backgroundSize: "100% 1500px",
          backgroundRepeat: "no-repeat",
        }}
      >
        <DevWarningBar />
        <MarketingHeader />
        <main className="flex-1">{children}</main>
        <MarketingFooter />
        <ChatbotWidgetScript />
      </div>
    </MarketingProviders>
  );
}
