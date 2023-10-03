import BotMessageBubble from "@/components/BotMessageBubble";
import ChatboxHeader from "@/components/ChatboxHeader";
import ChatboxInputBar from "@/components/ChatboxInputBar";
import UserMessageBubble from "@/components/UserMessageBubble";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useToast } from "@/components/ui/use-toast";
import ChatbotWidgetLayout, {
  useChatbotWidget,
} from "@/layouts/ChatbotWidgetLayout";
import { NextPageWithLayout } from "@/types/next";
import { trpc } from "@/utils/trpc";
import type { ChatbotSettings } from "@acme/core";
import { Message } from "@acme/db";
import { ArrowLeft, Loader2, RefreshCw } from "lucide-react";
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
    { conversationId },
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
  const sendMessageMutation = trpc.message.send.useMutation({
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
  const handleMessageReact = useCallback(
    async (message: Message, reaction: Message["reaction"]) => {
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
      } catch (error: any) {
        toast({
          title: "Error",
          description: error.message || "Something went wrong!",
          variant: "destructive",
        });
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
    },
    [
      conversationQuery.data?.id,
      conversationQuery.data?.status,
      conversationQuery.isSuccess,
      reactOnMessageMutation,
      toast,
      utils.message.list,
    ],
  );
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

      sendMessageMutation.mutateAsync({
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
      sendMessageMutation,
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
        <Loader2 size={22} className="animate-spin" />
      </div>
    );
  }
  if (conversationQuery.error) {
    return <div>{conversationQuery.error.message}</div>;
  }

  return (
    <div className="flex h-full w-full flex-1 flex-col overflow-hidden">
      <ChatboxHeader
        title={conversationQuery.data.title || chatbot.name}
        leading={
          <Tooltip>
            <TooltipTrigger asChild>
              <Button size="icon" variant="ghost" asChild>
                <Link href={`/widgets/c/${chatbot.id}`}>
                  <p className="sr-only">go to home</p>
                  <ArrowLeft size={22} />
                </Link>
              </Button>
            </TooltipTrigger>
            <TooltipContent>Go to home</TooltipContent>
          </Tooltip>
        }
        trailing={
          <>
            <Tooltip>
              <TooltipTrigger asChild>
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
                  {conversationQuery.isRefetching ||
                  messagesQuery.isRefetching ? (
                    <Loader2 size={22} className="animate-spin" />
                  ) : (
                    <RefreshCw size={22} />
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent>Refresh Conversation</TooltipContent>
            </Tooltip>
          </>
        }
      />

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
              {sendMessageMutation.isLoading && (
                <div className="flex items-start">
                  <div className="bg-secondary text-secondary-foreground flex items-center gap-1 rounded-xl rounded-tl-sm p-4">
                    <Skeleton className="bg-foreground/20 h-2 w-2 rounded-full"></Skeleton>
                    <Skeleton className="bg-foreground/20 h-2 w-2 rounded-full delay-300"></Skeleton>
                    <Skeleton className="bg-foreground/20 h-2 w-2 rounded-full delay-700"></Skeleton>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {!sendMessageMutation.isLoading && quickPromptsQuery.isSuccess && (
          <div className="flex flex-wrap justify-end gap-2 p-4">
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
          isLoading={sendMessageMutation.isLoading}
          placeholderText={chatbotSettings.placeholderText}
          autoFocus
        />
      ) : (
        <div className="flex h-14 items-center border-t px-4">
          <p className="text-muted-foreground flex-1 text-center">
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
