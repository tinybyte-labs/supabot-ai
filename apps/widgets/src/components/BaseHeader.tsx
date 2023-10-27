import { ReactNode } from "react";
import CloseChatboxButton from "./CloseChatboxButton";
import FullScreenButton from "./FullScreenButton";

export default function BaseHeader({ children }: { children?: ReactNode }) {
  return (
    <div className="flex items-center justify-end gap-2 bg-[var(--primary-bg)] p-4 text-[var(--primary-fg)]">
      {children}

      <FullScreenButton />
      <CloseChatboxButton />
    </div>
  );
}
