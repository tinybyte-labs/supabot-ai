import { trpc } from "@/utils/trpc";
import { Chatbot } from "@prisma/client";
import { useRouter } from "next/router";
import { ReactNode, createContext, useContext } from "react";

export type ChatbotContext = {
  isLoaded: boolean;
  chatbot?: Chatbot | null;
};

const Context = createContext<ChatbotContext | null>(null);

export const ChatbotProvider = ({ children }: { children: ReactNode }) => {
  const {
    isReady,
    query: { chatbotSlug },
  } = useRouter();
  if (isReady && !chatbotSlug) {
    throw new Error(
      "ChatbotProvider must is inside /dashboard/chatbots/:chatbotSlug route",
    );
  }
  const chatbot = trpc.chatbot.findBySlug.useQuery(chatbotSlug as string, {
    enabled: isReady,
  });

  return (
    <Context.Provider
      value={{
        isLoaded: chatbot.isSuccess,
        chatbot: chatbot.data,
      }}
    >
      {children}
    </Context.Provider>
  );
};

export const useChatbot = () => {
  const context = useContext(Context);
  if (!context) {
    throw new Error("useChatbot must use inside ChatbotProvider");
  }
  return context;
};
