import ChatbotLayout from "@/layouts/ChatbotLayout";
import ConversationsLayout from "@/layouts/ConversationsLayout";
import { useChatbot } from "@/providers/ChatbotProvider";
import { NextPageWithLayout } from "@/types/next";
import { trpc } from "@/utils/trpc";
import { useRouter } from "next/router";

const ConversationPage: NextPageWithLayout = () => {
  const router = useRouter();
  const chatbotId = router.query.chatbotId as string;
  const conversationId = router.query.conversationId as string;
  const conversation = trpc.conversation.getById.useQuery(
    { id: conversationId, chatbotId },
    { enabled: router.isReady },
  );
  return (
    <div>
      <pre>{JSON.stringify(conversation, null, 2)}</pre>
    </div>
  );
};

ConversationPage.getLayout = (page) => (
  <ChatbotLayout>
    <ConversationsLayout>{page}</ConversationsLayout>
  </ChatbotLayout>
);

export default ConversationPage;
