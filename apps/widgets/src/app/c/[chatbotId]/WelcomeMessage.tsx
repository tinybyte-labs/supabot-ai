"use client";

import { useChatbot } from "@/providers/ChatbotProvider";

export default function WelcomeMessage() {
  const { settings, chatbot } = useChatbot();
  return (
    <div className="p-6 text-[var(--primary-fg)]">
      <p className="text-3xl font-bold">{chatbot.name}</p>
      {!!settings.welcomeMessage && (
        <p className="mt-2 text-lg">{settings.welcomeMessage}</p>
      )}
    </div>
  );
}
