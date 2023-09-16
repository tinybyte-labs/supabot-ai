import BotMessageBubble from "@/components/BotMessageBubble";
import ChatboxInputBar from "@/components/ChatboxInputBar";
import ThemeTogglerIconButton from "@/components/ThemeTogglerIconButton";
import UserMessageBubble from "@/components/UserMessageBubble";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import ChatbotWidgetLayout, {
  useChatbotWidget,
} from "@/layouts/ChatbotWidgetLayout";
import { NextPageWithLayout } from "@/types/next";
import { trpc } from "@/utils/trpc";
import { ChatbotSettings } from "@/utils/validators";
import { Message } from "@prisma/client";
import { TRPCError } from "@trpc/server";
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
  const { user, chatbot } = useChatbotWidget();
  const [message, setMessage] = useState("");
  const { toast } = useToast();
  const utils = trpc.useContext();
  const scrollElRef = useRef<HTMLDivElement | null>(null);
  const chatbotSettings: ChatbotSettings = useMemo(
    () => (chatbot.settings ?? {}) as ChatbotSettings,
    [chatbot.settings],
  );
  const conversation = trpc.conversation.getById.useQuery(
    {
      id: (router.query.conversationId as string) || "",
      chatbotId: chatbot.id,
      userId: user?.id,
    },
    { enabled: router.isReady },
  );
  const messages = trpc.message.list.useQuery(
    {
      conversationId: conversation.data?.id || "",
    },
    {
      enabled: conversation.isSuccess,
    },
  );
  const quickPrompts = trpc.quickPrompt.list.useQuery(
    { chatbotId: chatbot.id },
    { enabled: messages.isSuccess },
  );
  const updateMessage = trpc.message.react.useMutation();

  const handleMessageReact = async (
    message: Message,
    reaction: Message["reaction"],
  ) => {
    if (!conversation.isSuccess) return;
    if (message.reaction === reaction) {
      reaction = null;
    }

    utils.message.list.setData(
      { conversationId: conversation.data.id },
      (data) =>
        data?.map((msg) =>
          msg.id === message.id ? { ...msg, reaction } : msg,
        ),
    );
    try {
      await updateMessage.mutateAsync({ id: message.id, reaction });
    } catch (error) {
      if (error instanceof TRPCError) {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
      }
      utils.message.list.setData(
        { conversationId: conversation.data.id },
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
      if (!conversation.isSuccess) {
        return;
      }
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
        conversationId: conversation.data.id,
        reaction: null,
        metadata: null,
      };
      utils.message.list.setData(
        { conversationId: conversation.data.id },
        (data) => [...(data || []), m],
      );

      sendMessage.mutateAsync({
        conversationId: conversation.data.id,
        message,
        userId: user?.id,
      });
      setMessage("");
      setTimeout(() => handleScrollToBottom(), 100);
    },
    [
      conversation.data?.id,
      conversation.isSuccess,
      handleScrollToBottom,
      sendMessage,
      toast,
      user?.id,
      utils.message.list,
    ],
  );

  useEffect(() => {
    handleScrollToBottom("instant");
  }, [handleScrollToBottom]);

  if (conversation.isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 size={24} />
      </div>
    );
  }
  if (conversation.error) {
    return <div>{conversation.error.message}</div>;
  }

  return (
    <div className="flex h-full w-full flex-1 flex-col overflow-hidden">
      <header className="flex items-center gap-3 border-b p-2">
        <Button size="icon" variant="ghost" asChild>
          <Link href={`/widgets/c/${chatbot.id}`}>
            <p className="sr-only">go to home</p>
            <ArrowLeft size={20} />
          </Link>
        </Button>

        <h1 className="text-lg font-semibold">
          {conversation.data.title || chatbot.name}
        </h1>

        <div className="flex flex-1 items-center justify-end gap-2">
          <Button
            size="icon"
            variant="ghost"
            onClick={() => {
              conversation.refetch();
              messages.refetch();
            }}
            disabled={conversation.isRefetching || messages.isRefetching}
          >
            <p className="sr-only">Refresh Conversation</p>
            {conversation.isRefetching || messages.isRefetching ? (
              <Loader2 size={20} className="animate-spin" />
            ) : (
              <RefreshCw size={20} />
            )}
          </Button>

          <ThemeTogglerIconButton />
        </div>
      </header>

      <div className="relative flex-1 overflow-y-auto" ref={scrollElRef}>
        <div className="space-y-6 p-4">
          {messages.isLoading ? (
            <p>Loading messages...</p>
          ) : messages.isError ? (
            <p>Messages Error: {messages.error.message}</p>
          ) : (
            <>
              {chatbotSettings.welcomeMessage && (
                <BotMessageBubble
                  name="BOT"
                  message={chatbotSettings.welcomeMessage}
                  date={conversation.data.createdAt}
                />
              )}
              {messages.data.map((message) => (
                <Fragment key={message.id}>
                  {message.role === "BOT" ? (
                    <BotMessageBubble
                      name="BOT"
                      message={message.body}
                      onReact={(value) => handleMessageReact(message, value)}
                      reaction={message.reaction}
                      sources={(message.metadata as any)?.sources as string[]}
                      date={message.createdAt}
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

        {!sendMessage.isLoading && quickPrompts.isSuccess && (
          <div className="flex flex-wrap justify-end gap-4 p-4">
            {quickPrompts.data
              .filter(
                (p) => p.isFollowUpPrompt !== (messages.data?.length === 0),
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

      <ChatboxInputBar
        value={message}
        onChange={setMessage}
        onSubmit={handleSubmit}
        isLoading={sendMessage.isLoading}
        placeholderText={chatbotSettings.placeholderText}
        autoFocus
      />
    </div>
  );
};

ConversationPage.getLayout = (page) => (
  <ChatbotWidgetLayout hideTabBar>{page}</ChatbotWidgetLayout>
);

export default ConversationPage;
