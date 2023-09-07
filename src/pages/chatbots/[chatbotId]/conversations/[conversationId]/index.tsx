import BotMessageBubble from "@/components/BotMessageBubble";
import UserMessageBubble from "@/components/UserMessageBubble";
import ConversationsLayout from "@/layouts/ConversationsLayout";
import { NextPageWithLayout } from "@/types/next";
import { trpc } from "@/utils/trpc";
import { useRouter } from "next/router";
import { Fragment } from "react";

const ConversationPage: NextPageWithLayout = () => {
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
    <div className="flex-1 overflow-y-auto">
      <div className="sticky top-0 flex h-14 items-center border-b px-4">
        <p className="font-semibold">
          {conversation.data?.title || conversation.data?.id}
        </p>
      </div>
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
  );
};

ConversationPage.getLayout = (page) => (
  <ConversationsLayout>{page}</ConversationsLayout>
);

export default ConversationPage;
