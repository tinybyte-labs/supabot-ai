import { ReactNode } from "react";

export default function BodyContainer({ children }: { children?: ReactNode }) {
  return (
    <div className="flex flex-1 flex-col overflow-hidden rounded-t-2xl bg-white">
      {children}
    </div>
  );
}
