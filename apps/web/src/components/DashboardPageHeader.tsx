import { ReactNode } from "react";
import { cn } from "@/lib/utils";
import Head from "next/head";
import { APP_NAME } from "@/utils/constants";

export interface DashboardPageHeaderProps {
  title: string;
  subtitle?: string;
  children?: ReactNode;
  className?: string;
}

const DashboardPageHeader = ({
  title,
  subtitle,
  children,
  className,
}: DashboardPageHeaderProps) => {
  return (
    <header
      className={cn(
        "container flex flex-wrap items-center gap-4 pb-8 pt-8 md:py-16",
        className,
      )}
    >
      <Head>
        <title>{`${title} - ${APP_NAME}`}</title>
      </Head>
      <div className="flex-1 space-y-0.5">
        <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
        {!!subtitle && <p className="text-muted-foreground">{subtitle}</p>}
      </div>
      <div className="flex flex-wrap items-center gap-2">{children}</div>
    </header>
  );
};

export default DashboardPageHeader;
