import PageHeader from "@/components/PageHeader";
import { useChatbot } from "@/providers/ChatbotProvider";
import { trpc } from "@/utils/trpc";
import { ReactNode, useEffect } from "react";
import { useRouter } from "next/router";
import { MessagesSquare } from "lucide-react";
import SideBarNav from "@/components/SideBarNav";
import { formatDistanceToNow } from "date-fns";

const ConversationsLayout = ({ children }: { children: ReactNode }) => {
  const { isLoaded, chatbot } = useChatbot();
  const router = useRouter();
  const {
    query: { conversationId },
  } = router;
  const conversationsQuery = trpc.conversation.list.useQuery(
    {
      chatbotId: chatbot?.id || "",
    },
    { enabled: isLoaded },
  );

  useEffect(() => {
    if (
      conversationsQuery.isSuccess &&
      conversationsQuery.data.length > 0 &&
      router.isReady &&
      !conversationId
    ) {
      router.replace(
        `/chatbots/${chatbot?.slug}/conversations/${conversationsQuery.data[0].id}`,
      );
    }
  }, [
    chatbot?.slug,
    conversationId,
    conversationsQuery.data,
    conversationsQuery.isSuccess,
    router,
  ]);

  return (
    <>
      <PageHeader title="Conversations" containerClassName="max-w-full" />
      <div className="flex flex-1 overflow-hidden">
        <div className="flex w-72 flex-col gap-1 border-r p-2">
          {conversationsQuery.isLoading ? (
            <p>Loading...</p>
          ) : conversationsQuery.isError ? (
            <p>{conversationsQuery.error.message}</p>
          ) : (
            <SideBarNav
              list={[
                {
                  items: conversationsQuery.data.map((item) => ({
                    href: `/chatbots/${chatbot?.slug}/conversations/${item.id}`,
                    label: item.title || item.id,
                    subtitle: formatDistanceToNow(new Date(item.updatedAt), {
                      addSuffix: true,
                    }),
                    icon: <MessagesSquare size={22} />,
                  })),
                },
              ]}
            />
          )}
        </div>
        <div className="flex flex-1 flex-col overflow-hidden">{children}</div>
      </div>
    </>
  );
};

export default ConversationsLayout;
