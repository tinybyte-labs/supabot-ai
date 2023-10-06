import ChatbotWidgetScript from "@/components/ChatbotWidgetScript";
import DevWarningBar from "@/components/DevWarningBar";
import MarketingFooter from "@/components/MarketingFooter";
import MarketingHeader from "@/components/MarketingHeader";
import { ThemeProvider } from "next-themes";
import { ReactNode } from "react";

const MarketingLayout = ({ children }: { children: ReactNode }) => {
  return (
    <ThemeProvider forcedTheme="dark" attribute="class">
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
    </ThemeProvider>
  );
};

export default MarketingLayout;
