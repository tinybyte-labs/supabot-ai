import ChatboxStyle from "@/components/ChatboxStyle";
import ChatboxWatermark from "@/components/ChatboxWatermark";
import { trpc } from "@/utils/trpc";
import { Chatbot, ChatbotUser } from "@prisma/client";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/router";
import { ReactNode, createContext, useContext, useState } from "react";

export type ChatboxContext = {
  chatbot: Chatbot;
  user: ChatbotUser | null;
};

const Context = createContext<ChatboxContext | null>(null);

const ChatbotBoxLayout = ({ children }: { children: ReactNode }) => {
  const router = useRouter();
  const [user, setUser] = useState<ChatbotUser | null>(null);
  const chatbot = trpc.chatbot.findById.useQuery(
    (router.query.chatbotId as string) || "",
    { enabled: router.isReady },
  );

  if (chatbot.isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 size={24} />
      </div>
    );
  }

  if (chatbot.error) {
    return <div>{chatbot.error.message}</div>;
  }

  return (
    <Context.Provider value={{ user, chatbot: chatbot.data }}>
      <ChatboxStyle {...((chatbot.data.settings as any) || {})} />
      <div className="chatbox flex h-screen w-screen flex-col overflow-hidden">
        <div className="flex-1">{children}</div>
        <ChatboxWatermark />
      </div>
    </Context.Provider>
  );
};

export default ChatbotBoxLayout;

export const useChatbox = () => {
  const context = useContext(Context);
  if (!context) {
    throw new Error("useChatbox must use inside ChatboxProvider");
  }
  return context;
};
