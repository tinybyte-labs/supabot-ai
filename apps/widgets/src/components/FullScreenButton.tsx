"use client";

import { useState } from "react";
import HeaderButton from "./HeaderButton";
import { Maximize2Icon, Minimize2Icon } from "lucide-react";
import { useAtom } from "jotai";
import { isFullScreenAtom } from "@/app/atoms/fullscreen";

export default function FullScreenButton() {
  const [isFullScreened, setIsFullScreened] = useAtom(isFullScreenAtom);

  return (
    <HeaderButton
      onClick={() => {
        window.parent.postMessage(
          isFullScreened
            ? "EXIT_FULLSCREEN_CHATBOX"
            : "ENTER_FULLSCREEN_CHATBOX",
          "*",
        );
        setIsFullScreened(!isFullScreened);
      }}
    >
      <div className="sr-only">Full Screen</div>
      {isFullScreened ? (
        <Minimize2Icon size={24} />
      ) : (
        <Maximize2Icon size={24} />
      )}
    </HeaderButton>
  );
}
