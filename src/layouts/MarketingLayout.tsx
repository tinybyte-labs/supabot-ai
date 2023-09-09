import DevWarningBar from "@/components/DevWarningBar";
import MarketingFooter from "@/components/MarketingFooter";
import MarketingHeader from "@/components/MarketingHeader";
import { ReactNode } from "react";

const MarketingLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="flex min-h-screen flex-col">
      <DevWarningBar />
      <MarketingHeader />
      <div className="flex-1">{children}</div>
      <MarketingFooter />
    </div>
  );
};

export default MarketingLayout;
