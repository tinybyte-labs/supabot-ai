"use client";

import BackButton from "@/components/BackButton";
import { useChatbot } from "@/providers/ChatbotProvider";
import CloseChatboxButton from "@/components/CloseChatboxButton";

export default function Header() {
  const { chatbot } = useChatbot();

  return (
    <div className="flex items-center gap-4 bg-[var(--primary-bg)] p-6 text-[var(--primary-fg)]">
      <BackButton />
      <p className="flex-1 truncate text-xl font-semibold">{chatbot.name}</p>
      <CloseChatboxButton />
    </div>
  );
}
