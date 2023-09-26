import { ReactNode } from "react";
import CloseChatboxButton from "./CloseChatboxButton";

const ChatboxHeader = ({
  leading,
  trailing,
  title,
}: {
  leading?: ReactNode;
  trailing?: ReactNode;
  title: string;
}) => {
  return (
    <header className="flex h-16 items-center border-b p-2">
      {leading}
      <h1 className="truncate px-2 text-lg font-semibold">{title}</h1>
      <div className="flex flex-1 items-center justify-end gap-1">
        {trailing}
        <CloseChatboxButton />
      </div>
    </header>
  );
};

export default ChatboxHeader;
