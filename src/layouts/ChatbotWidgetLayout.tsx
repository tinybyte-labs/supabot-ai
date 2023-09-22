import ChatboxWatermark from "@/components/ChatboxWatermark";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";
import { getTwHSL } from "@/utils/getTwHSL";
import { trpc } from "@/utils/trpc";
import { ChatbotSettings } from "@/utils/validators";
import { Chatbot, ChatbotUser } from "@prisma/client";
import { Home, Loader2, MessagesSquare, User } from "lucide-react";
import { ThemeProvider } from "next-themes";
import Link from "next/link";
import { useRouter } from "next/router";
import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

export type ChatboxContext = {
  chatbot: Chatbot;
  user?: ChatbotUser | null;
  signOut: () => void;
  signIn: (email: string, name?: string) => void;
  startConversation: () => void;
  startConversationLoading: boolean;
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
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const chatbotId = router.query.chatbotId as string;
  const storageKey = useMemo(() => `${chatbotId}_user`, [chatbotId]);
  const [userId, setUserId] = useState<string | null>(null);

  const chatbotQuery = trpc.chatbot.findById.useQuery(chatbotId, {
    enabled: router.isReady,
  });

  const userQuery = trpc.chatbotUser.getUser.useQuery(userId || "", {
    enabled: !!userId,
  });

  const logIn = trpc.chatbotUser.logIn.useMutation({
    onSettled: () => {
      setIsLoading(true);
    },
    onSuccess: (user) => {
      localStorage.setItem(storageKey, user.id);
      router.reload();
    },
    onError: (error) => {
      setIsLoading(false);
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const signIn = (email: string, name?: string) =>
    logIn.mutate({ email, name, chatbotId });

  const signOut = () => {
    setIsLoading(true);
    localStorage.removeItem(storageKey);
    router.reload();
  };

  const startConversationMutation = trpc.conversation.create.useMutation({
    onSuccess: (data) => {
      router.push(`/widgets/c/${chatbotId}/conversations/${data.id}`);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const startConversation = () =>
    startConversationMutation.mutate({
      chatbotId: chatbotId,
      userId: userQuery.data?.id,
    });

  useEffect(() => {
    const userId = localStorage.getItem(storageKey);
    setUserId(userId);
  }, [storageKey]);

  return (
    <ThemeProvider
      forcedTheme={
        ((chatbotQuery.data?.settings ?? {}) as ChatbotSettings)?.theme ||
        "light"
      }
      attribute="class"
    >
      {chatbotQuery.isLoading ||
      (userId && userQuery.isLoading) ||
      isLoading ? (
        <div className="flex min-h-screen items-center justify-center">
          <Loader2 size={24} className="animate-spin" />
        </div>
      ) : userQuery.data?.blocked ? (
        <div className="flex min-h-screen flex-col items-center justify-center text-center">
          <p className="mb-8 text-muted-foreground">You have been blocked</p>
          <Button onClick={signOut} disabled={isLoading} variant="outline">
            Log Out
          </Button>
        </div>
      ) : chatbotQuery.isError ? (
        <div>{chatbotQuery.error.message}</div>
      ) : (
        <Context.Provider
          value={{
            user: userQuery.data,
            chatbot: chatbotQuery.data,
            signOut,
            signIn,
            startConversation,
            startConversationLoading: startConversationMutation.isLoading,
          }}
        >
          <style>
            {`.chatbox {
            --primary: ${getTwHSL(
              (chatbotQuery.data?.settings as ChatbotSettings)?.primaryColor ||
                "",
            )};
            --primary-foreground: ${getTwHSL(
              (chatbotQuery.data?.settings as ChatbotSettings)
                ?.primaryForegroundColor || "",
            )};
          }`}
          </style>
          <div className="chatbox flex h-screen w-screen flex-col overflow-hidden">
            <div className="flex flex-1 flex-col overflow-hidden">
              {children}
            </div>
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
                ].map((item) => {
                  const isActive = item.exact
                    ? router.asPath === item.href
                    : router.asPath.startsWith(item.href);
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={cn(
                        "flex flex-1 flex-col items-center justify-center",
                        {
                          "text-foreground": isActive,
                          "text-muted-foreground": !isActive,
                        },
                      )}
                    >
                      {item.icon}
                      <p className="mt-0.5 text-sm">{item.label}</p>
                    </Link>
                  );
                })}
              </div>
            )}
            <ChatboxWatermark />
          </div>
        </Context.Provider>
      )}
    </ThemeProvider>
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
