import ChatboxStyle from "@/components/ChatboxStyle";
import ChatboxWatermark from "@/components/ChatboxWatermark";
import { trpc } from "@/utils/trpc";
import { ChatbotSettings } from "@/utils/validators";
import { Chatbot, ChatbotUser } from "@prisma/client";
import { Home, Loader2, MessagesSquare, User } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/router";
import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

export type ChatboxContext = {
  chatbot: Chatbot;
  user?: ChatbotUser | null;
};

const Context = createContext<ChatboxContext | null>(null);

const ChatbotWidgetLayout = ({
  children,
  hideTabBar,
}: {
  children: ReactNode;
  hideTabBar?: boolean;
}) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [userId, setUserId] = useState("");
  const chatbot = trpc.chatbot.findById.useQuery(
    (router.query.chatbotId as string) || "",
    { enabled: router.isReady },
  );
  const userQuery = trpc.chatbotUser.getUser.useQuery(userId, {
    enabled: !!userId,
  });

  useEffect(() => {
    if (chatbot.data) {
      const userId = localStorage.getItem(`${chatbot.data.id}_user`);
      if (userId) {
        setUserId(userId);
      }
      setIsLoading(false);
    }
  }, [chatbot.data]);

  if (chatbot.isLoading || isLoading || (userId && userQuery.isLoading)) {
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
    <Context.Provider value={{ user: userQuery.data, chatbot: chatbot.data }}>
      <ChatboxStyle {...((chatbot.data.settings ?? {}) as ChatbotSettings)} />
      <div className="chatbox flex h-screen w-screen flex-col overflow-hidden">
        <div className="flex-1 overflow-hidden">{children}</div>
        {!hideTabBar && (
          <div className="flex h-16 border-t">
            {[
              {
                label: "Home",
                icon: <Home size={20} />,
                href: `/widgets/c/${router.query.chatbotId}`,
                exact: true,
              },
              {
                label: "Conversations",
                icon: <MessagesSquare size={20} />,
                href: `/widgets/c/${router.query.chatbotId}/conversations`,
              },
              {
                label: "Account",
                href: `/widgets/c/${router.query.chatbotId}/account`,
                icon: <User size={20} />,
              },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex flex-1 flex-col items-center justify-center"
              >
                {item.icon}
                <p className="text-sm">{item.label}</p>
              </Link>
            ))}
          </div>
        )}
        <ChatboxWatermark />
      </div>
    </Context.Provider>
  );
};

export default ChatbotWidgetLayout;

export const useChatbotWidget = () => {
  const context = useContext(Context);
  if (!context) {
    throw new Error("useChatbox must use inside ChatboxProvider");
  }
  return context;
};
