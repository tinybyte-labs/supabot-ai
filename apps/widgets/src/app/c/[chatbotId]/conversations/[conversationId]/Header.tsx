"use client";

import BackButton from "@/components/BackButton";
import { useChatbot } from "@/providers/ChatbotProvider";
import BaseHeader from "@/components/BaseHeader";

export default function Header() {
  const { chatbot } = useChatbot();

  return (
    <BaseHeader>
      <BackButton />
      <p className="flex-1 truncate text-xl font-semibold">{chatbot.name}</p>
    </BaseHeader>
  );
}
