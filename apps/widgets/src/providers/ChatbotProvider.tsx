"use client";

import { ChatbotSettings } from "@acme/core/validators";
import { Chatbot } from "@acme/db";
import { ReactNode, createContext, useContext } from "react";

export type ChatbotContextType = {
  chatbot: Chatbot;
  settings: ChatbotSettings;
};

export const ChatbotContext = createContext<ChatbotContextType | null>(null);

export const ChatbotProvider = ({
  children,
  chatbot,
}: {
  children: ReactNode;
  chatbot: Chatbot;
}) => {
  const settings = (chatbot.settings ?? {}) as ChatbotSettings;
  return (
    <ChatbotContext.Provider value={{ chatbot, settings }}>
      {children}
    </ChatbotContext.Provider>
  );
};

export const useChatbot = () => {
  const context = useContext(ChatbotContext);
  if (!context) {
    throw new Error("useChatbot must use inside ChatbotProvider");
  }
  return context;
};
