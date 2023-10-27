"use client";
import { XIcon } from "lucide-react";
import HeaderButton from "./HeaderButton";

export default function CloseChatboxButton() {
  return (
    <HeaderButton
      onClick={() => {
        window.parent.postMessage("CLOSE_CHATBOX", "*");
      }}
    >
      <div className="sr-only">Close Chatbox</div>
      <XIcon size={24} />
    </HeaderButton>
  );
}
