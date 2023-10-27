import { ReactNode } from "react";

export default function HeaderButton({
  children,
  onClick,
}: {
  children: ReactNode;
  onClick?: () => void;
}) {
  return (
    <button
      className="flex h-10 w-10 items-center justify-center rounded-md hover:opacity-80"
      onClick={onClick}
    >
      {children}
    </button>
  );
}
