import { ReactNode } from "react";
import ToggleSidebarButton from "./ToggleSidebarButton";
import { cn } from "@/lib/utils";

export interface DashboardPageHeaderProps {
  title: string;
  subtitle?: string;
  children?: ReactNode;
  containerClassName?: string;
  className?: string;
}

const DashboardPageHeader = ({
  title,
  subtitle,
  children,
  containerClassName,
  className,
}: DashboardPageHeaderProps) => {
  return (
    <header className={cn("border-b", className)}>
      <div
        className={cn(
          "container flex min-h-[88px] gap-4 py-6 max-md:flex-col md:items-center",
          containerClassName,
        )}
      >
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

export default DashboardPageHeader;
