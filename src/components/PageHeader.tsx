import { cn } from "@/lib/utils";
import { ReactNode } from "react";

export type PageHeaderProps = {
  title: string;
  subtitle?: string;
  children?: ReactNode;
  containerClassName?: string;
  className?: string;
};

const PageHeader = ({
  title,
  subtitle,
  children,
  containerClassName,
  className,
}: PageHeaderProps) => {
  return (
    <header className={cn("border-b", className)}>
      <div
        className={cn(
          "container flex min-h-[88px] gap-4 py-6 max-md:flex-col md:items-center",
          containerClassName,
        )}
      >
        <div className="flex-1 space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
          {!!subtitle && (
            <p className="text-lg text-muted-foreground">{subtitle}</p>
          )}
        </div>
        {children}
      </div>
    </header>
  );
};

export default PageHeader;
