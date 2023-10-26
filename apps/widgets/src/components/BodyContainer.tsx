import { cn } from "@/lib/cn";
import { ReactNode } from "react";

export default function BodyContainer({
  children,
  className,
}: {
  children?: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-1 flex-col overflow-hidden rounded-t-2xl bg-white",
        className,
      )}
    >
      {children}
    </div>
  );
}
