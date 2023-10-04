import { AlertTriangle } from "lucide-react";
import React, { ReactNode } from "react";
import { Button, ButtonLoader } from "./ui/button";
import { cn } from "@/lib/utils";

export type ErrorBoxProps = {
  title?: string;
  description: string;
  onRetry?: () => void;
  isRefetching?: boolean;
  className?: string;
  children?: ReactNode;
};
const ErrorBox = ({
  title = "Error",
  description = "Something went wrong!",
  onRetry,
  isRefetching,
  className,
  children,
}: ErrorBoxProps) => (
  <div
    className={cn(
      "flex flex-1 flex-col items-center justify-center",
      className,
    )}
  >
    <AlertTriangle size={48} />
    <p className="mt-6 text-lg font-semibold">{title}</p>
    <p className="text-muted-foreground mt-1 text-sm">{description}</p>
    <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
      {children}
    </div>
  </div>
);

export default ErrorBox;
