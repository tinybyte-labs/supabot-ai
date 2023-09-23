import BotMessageBubble from "@/components/BotMessageBubble";
import ChatboxInputBar from "@/components/ChatboxInputBar";
import CloseChatboxButton from "@/components/CloseChatboxButton";
import UserMessageBubble from "@/components/UserMessageBubble";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/components/ui/use-toast";
import ChatbotWidgetLayout, {
  useChatbotWidget,
} from "@/layouts/ChatbotWidgetLayout";
import { NextPageWithLayout } from "@/types/next";
import { trpc } from "@/utils/trpc";
import { ChatbotSettings } from "@/utils/validators";
import { Message } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { ArrowLeft, Loader2, MoreVertical, RefreshCw } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/router";
import {
  Fragment,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

const ConversationPage: NextPageWithLayout = () => {
  const router = useRouter();
  const conversationId = router.query.conversationId as string;
  const chatbotId = router.query.chatbotId as string;
  const { user, chatbot } = useChatbotWidget();
  const [message, setMessage] = useState("");
  const { toast } = useToast();
  const utils = trpc.useContext();
  const scrollElRef = useRef<HTMLDivElement | null>(null);
  const chatbotSettings: ChatbotSettings = useMemo(
    () => (chatbot.settings ?? {}) as ChatbotSettings,
    [chatbot.settings],
  );
  const conversationQuery = trpc.conversation.publicGetById.useQuery(
    {
      conversationId,
      chatbotId,
      userId: user?.id,
    },
    { enabled: router.isReady },
  );
  const messagesQuery = trpc.message.list.useQuery(
    {
      conversationId: conversationQuery.data?.id || "",
    },
    {
      enabled: conversationQuery.isSuccess,
    },
  );
  const quickPromptsQuery = trpc.quickPrompt.list.useQuery(
    { chatbotId: chatbot.id },
    { enabled: messagesQuery.isSuccess },
  );
  const reactOnMessageMutation = trpc.message.react.useMutation({
    onSuccess: () => {
      toast({ title: "Thank you for the feedback" });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });
  const updateConversationMutation = trpc.conversation.publicUpdate.useMutation(
    {
      onSuccess: () => {
        conversationQuery.refetch();
        toast({
          title: "Success",
          description: "This conversation has been successfully closed",
        });
        router.push(`/widgets/c/${chatbotId}/conversations`);
      },
      onError: (error) => {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
      },
    },
  );
  const handleMessageReact = async (
    message: Message,
    reaction: Message["reaction"],
  ) => {
    if (!conversationQuery.isSuccess) return;
    if (conversationQuery.data.status === "CLOSED") return;
    if (message.reaction === reaction) {
      reaction = null;
    }

    utils.message.list.setData(
      { conversationId: conversationQuery.data.id },
      (data) =>
        data?.map((msg) =>
          msg.id === message.id ? { ...msg, reaction } : msg,
        ),
    );
    try {
      await reactOnMessageMutation.mutateAsync({ id: message.id, reaction });
    } catch (error) {
      if (error instanceof TRPCError) {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
      }
      utils.message.list.setData(
        { conversationId: conversationQuery.data.id },
        (data) =>
          data?.map((msg) =>
            msg.id === message.id
              ? { ...msg, reaction: message.reaction }
              : msg,
          ),
      );
    }
  };

  const handleScrollToBottom = useCallback(
    (behavior: ScrollBehavior = "smooth") => {
      scrollElRef.current?.scrollTo({
        top: scrollElRef.current.scrollHeight,
        behavior,
      });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [scrollElRef.current],
  );

  const sendMessage = trpc.message.send.useMutation({
    onSuccess: ({ botMessage, userMessage }) => {
      utils.message.list.setData(
        { conversationId: userMessage.conversationId },
        (data) => [
          ...(data || []).map((msg) =>
            msg.id === "optimestic-id" ? userMessage : msg,
          ),
          botMessage,
        ],
      );
      setTimeout(() => handleScrollToBottom(), 100);
    },
    onError: (error) =>
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      }),
  });

  const handleSubmit = useCallback(
    async (message: string) => {
      if (!conversationQuery.isSuccess) {
        return;
      }
      if (conversationQuery.data.status === "CLOSED") return;
      if (!message) {
        toast({ title: "Please enter your message", variant: "destructive" });
        return;
      }
      const m: Message = {
        id: "optimestic-id",
        createdAt: new Date(),
        updatedAt: new Date(),
        role: "USER",
        body: message,
        userId: user?.id || null,
        conversationId: conversationQuery.data.id,
        reaction: null,
        metadata: null,
      };
      utils.message.list.setData(
        { conversationId: conversationQuery.data.id },
        (data) => [...(data || []), m],
      );

      sendMessage.mutateAsync({
        conversationId: conversationQuery.data.id,
        message,
        userId: user?.id,
      });
      setMessage("");
      setTimeout(() => handleScrollToBottom(), 100);
    },
    [
      conversationQuery.data?.id,
      conversationQuery.data?.status,
      conversationQuery.isSuccess,
      handleScrollToBottom,
      sendMessage,
      toast,
      user?.id,
      utils.message.list,
    ],
  );

  const handleCloseConversation = () => {
    if (conversationQuery.data?.status === "CLOSED") return;
    updateConversationMutation.mutate({
      chatbotId,
      conversationId,
      userId: user?.id,
      data: {
        status: "CLOSED",
      },
    });
  };

  useEffect(() => {
    handleScrollToBottom("instant");
  }, [handleScrollToBottom]);

  if (conversationQuery.isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 size={24} className="animate-spin" />
      </div>
    );
  }
  if (conversationQuery.error) {
    return <div>{conversationQuery.error.message}</div>;
  }

  return (
    <div className="flex h-full w-full flex-1 flex-col overflow-hidden">
      <header className="flex h-16 items-center gap-1 border-b p-2">
        <Button size="icon" variant="ghost" asChild>
          <Link href={`/widgets/c/${chatbot.id}`}>
            <p className="sr-only">go to home</p>
            <ArrowLeft size={20} />
          </Link>
        </Button>

        <h1 className="flex-1 text-lg font-semibold">
          {conversationQuery.data.title || chatbot.name}
        </h1>

        <Button
          size="icon"
          variant="ghost"
          onClick={() => {
            conversationQuery.refetch();
            messagesQuery.refetch();
          }}
          disabled={
            conversationQuery.isRefetching || messagesQuery.isRefetching
          }
        >
          <p className="sr-only">Refresh Conversation</p>
          {conversationQuery.isRefetching || messagesQuery.isRefetching ? (
            <Loader2 size={20} className="animate-spin" />
          ) : (
            <RefreshCw size={20} />
          )}
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button size="icon" variant="ghost">
              <p className="sr-only">Menu</p>
              <MoreVertical size={20} />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              disabled={conversationQuery.data.status === "CLOSED"}
              onClick={handleCloseConversation}
            >
              Close Conversation
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <CloseChatboxButton />
      </header>

      <div className="relative flex-1 overflow-y-auto" ref={scrollElRef}>
        <div className="space-y-6 p-4">
          {messagesQuery.isLoading ? (
            <p>Loading messages...</p>
          ) : messagesQuery.isError ? (
            <p>Messages Error: {messagesQuery.error.message}</p>
          ) : (
            <>
              {chatbotSettings.welcomeMessage && (
                <BotMessageBubble
                  name="BOT"
                  message={chatbotSettings.welcomeMessage}
                  date={conversationQuery.data.createdAt}
                  theme={chatbotSettings.theme}
                />
              )}
              {messagesQuery.data.map((message) => (
                <Fragment key={message.id}>
                  {message.role === "BOT" ? (
                    <BotMessageBubble
                      name="BOT"
                      message={message.body}
                      onReact={(value) => handleMessageReact(message, value)}
                      reaction={message.reaction}
                      sources={(message.metadata as any)?.sources as string[]}
                      date={message.createdAt}
                      theme={chatbotSettings.theme}
                    />
                  ) : message.role === "USER" ? (
                    <UserMessageBubble
                      name="YOU"
                      message={message.body}
                      date={message.createdAt}
                    />
                  ) : null}
                </Fragment>
              ))}
            </>
          )}
        </div>

        {!sendMessage.isLoading && quickPromptsQuery.isSuccess && (
          <div className="flex flex-wrap justify-end gap-4 p-4">
            {quickPromptsQuery.data
              .filter(
                (p) =>
                  p.isFollowUpPrompt !== (messagesQuery.data?.length === 0),
              )
              .map((prompt) => (
                <Button
                  key={prompt.id}
                  variant="outline"
                  size="sm"
                  onClick={() => handleSubmit(prompt.prompt)}
                >
                  {prompt.title}
                </Button>
              ))}
          </div>
        )}
      </div>

      {conversationQuery.data.status === "OPEN" ? (
        <ChatboxInputBar
          value={message}
          onChange={setMessage}
          onSubmit={handleSubmit}
          isLoading={sendMessage.isLoading}
          placeholderText={chatbotSettings.placeholderText}
          autoFocus
        />
      ) : (
        <div className="flex h-14 items-center border-t px-4">
          <p className="flex-1 text-center text-muted-foreground">
            This conversation has been closed
          </p>
        </div>
      )}
    </div>
  );
};

ConversationPage.getLayout = (page) => (
  <ChatbotWidgetLayout hideTabBar>{page}</ChatbotWidgetLayout>
);

export default ConversationPage;
