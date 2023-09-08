import BotMessageBubble from "@/components/BotMessageBubble";
import ChatboxStyle from "@/components/ChatboxStyle";
import UserMessageBubble from "@/components/UserMessageBubble";
import { Button } from "@/components/ui/button";
import ConversationsLayout from "@/layouts/ConversationsLayout";
import { NextPageWithLayout } from "@/types/next";
import { trpc } from "@/utils/trpc";
import { Loader2, MoreVertical, RefreshCw } from "lucide-react";
import { useRouter } from "next/router";
import { Fragment, useCallback, useEffect, useRef } from "react";

const ConversationPage: NextPageWithLayout = () => {
  const scrollElRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const chatbotId = router.query.chatbotId as string;
  const conversationId = router.query.conversationId as string;
  const chatbot = trpc.chatbot.findById.useQuery(chatbotId, {
    enabled: router.isReady,
  });
  const conversation = trpc.conversation.getById.useQuery(
    { id: conversationId, chatbotId },
    { enabled: chatbot.isSuccess },
  );
  const messages = trpc.message.list.useQuery(
    { conversationId },
    { enabled: conversation.isSuccess },
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

  useEffect(() => {
    handleScrollToBottom("instant");
  }, [handleScrollToBottom]);

  useEffect(() => {
    if (!messages.data) {
      return;
    }
    let timeout: NodeJS.Timeout | null = null;
    if (messages.data?.length > 0) {
      timeout = setTimeout(() => handleScrollToBottom(), 100);
    }
    return () => {
      if (timeout) clearTimeout(timeout);
    };
  }, [handleScrollToBottom, messages.data]);

  if (!chatbot.isSuccess) {
    return <p>Loading...</p>;
  }

  if (conversation.isLoading) {
    return <p>Loading...</p>;
  }

  if (conversation.isError) {
    return <p>{conversation.error.message}</p>;
  }

  return (
    <>
      <ChatboxStyle {...((chatbot.data.settings as any) || {})} />
      <div className="chatbox flex flex-1 flex-col overflow-hidden">
        <div className="sticky top-0 z-20 flex h-14 items-center border-b bg-card px-4 text-card-foreground">
          <p className="flex-1 font-semibold">
            {conversation.data?.title || conversation.data?.id}
          </p>
          <div className="flex justify-end gap-2">
            <Button
              variant="ghost"
              size="icon"
              disabled={messages.isRefetching}
              onClick={() => messages.refetch()}
            >
              {messages.isRefetching ? (
                <Loader2 size={20} className="animate-spin" />
              ) : (
                <RefreshCw size={20} />
              )}
            </Button>
            <Button variant="ghost" size="icon">
              <MoreVertical size={20} />
            </Button>
          </div>
        </div>
        <div ref={scrollElRef} className="flex-1 overflow-y-auto">
          {messages.isLoading ? (
            <p>Loading...</p>
          ) : messages.isError ? (
            <p>{messages.error.message}</p>
          ) : (
            <div className="flex-1 space-y-6 p-4">
              {(chatbot.data.settings as any)?.welcomeMessage && (
                <BotMessageBubble
                  name="BOT"
                  message={(chatbot.data.settings as any)?.welcomeMessage}
                  date={conversation.data.createdAt}
                />
              )}

              {messages.data.map((message) => (
                <Fragment key={message.id}>
                  {message.role === "BOT" ? (
                    <BotMessageBubble
                      name="BOT"
                      message={message.body}
                      onReact={() => {}}
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
            </div>
          )}
        </div>
      </div>
    </>
  );
};

ConversationPage.getLayout = (page) => (
  <ConversationsLayout>{page}</ConversationsLayout>
);

export default ConversationPage;
