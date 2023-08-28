import { ReactNode } from "react";
import ToggleSidebarButton from "./ToggleSidebarButton";

export interface PageHeaderProps {
  title: string;
  subtitle?: string;
  children?: ReactNode;
}

const PageHeader = ({ title, subtitle, children }: PageHeaderProps) => {
  return (
    <header className="border-b">
      <div className="container flex min-h-[88px] gap-4 py-6 max-md:flex-col md:items-center">
        <div className="flex flex-1 items-center gap-6">
          <ToggleSidebarButton />
          <div className="flex-1 space-y-0.5">
            <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
            {!!subtitle && <p className="text-muted-foreground">{subtitle}</p>}
          </div>
        </div>
        {children}
      </div>
    </header>
  );
};

export default PageHeader;
