import MarketingHeader from "@/components/MarketingHeader";
import ThemeTogglerIconButton from "@/components/ThemeTogglerIconButton";
import { ReactNode } from "react";

const MarketingLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="flex min-h-screen flex-col">
      <MarketingHeader />
      <div className="flex-1">{children}</div>
      <footer className="h-48 border-t">
        <ThemeTogglerIconButton />
      </footer>
    </div>
  );
};

export default MarketingLayout;
