import { AlertTriangle } from "lucide-react";
import React from "react";
import { Button, ButtonLoader } from "./ui/button";
import { cn } from "@/lib/utils";

export type ErrorBoxProps = {
  title?: string;
  description: string;
  onRetry?: () => void;
  isRefetching?: boolean;
  className?: string;
};
const ErrorBox = ({
  title = "Error",
  description = "Something went wrong!",
  onRetry,
  isRefetching,
  className,
}: ErrorBoxProps) => (
  <div
    className={cn(
      "flex flex-1 flex-col items-center justify-center",
      className,
    )}
  >
    <AlertTriangle size={48} />
    <p className="mt-6 text-lg font-semibold">{title}</p>
    <p className="mt-1 text-sm text-muted-foreground">{description}</p>
    {!!onRetry && (
      <Button
        variant="outline"
        disabled={isRefetching}
        onClick={onRetry}
        className="mt-6"
      >
        {isRefetching && <ButtonLoader />}
        Retry
      </Button>
    )}
  </div>
);

export default ErrorBox;
