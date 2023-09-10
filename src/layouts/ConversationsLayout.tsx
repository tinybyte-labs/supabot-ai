import DashboardPageHeader from "@/components/DashboardPageHeader";
import { trpc } from "@/utils/trpc";
import { ReactNode, useEffect } from "react";
import { useRouter } from "next/router";
import { MessagesSquare } from "lucide-react";
import SideBarNav from "@/components/SideBarNav";
import { formatDistanceToNow } from "date-fns";
import ChatbotLayout from "./ChatbotLayout";
import { Button } from "@/components/ui/button";

const ConversationsLayout = ({ children }: { children: ReactNode }) => {
  const router = useRouter();
  const chatbotId = router.query.chatbotId as string;
  const conversationId = router.query.conversationId as string;

  const conversationsQuery = trpc.conversation.list.useQuery(
    {
      chatbotId: chatbotId,
    },
    { enabled: router.isReady },
  );

  useEffect(() => {
    if (
      conversationsQuery.isSuccess &&
      conversationsQuery.data.length > 0 &&
      router.isReady &&
      !conversationId
    ) {
      router.replace(
        `/chatbots/${chatbotId}/conversations/${conversationsQuery.data[0].id}`,
      );
    }
  }, [
    chatbotId,
    conversationId,
    conversationsQuery.data,
    conversationsQuery.isSuccess,
    router,
  ]);

  return (
    <ChatbotLayout>
      <DashboardPageHeader
        title="Conversations"
        containerClassName="max-w-full"
      />
      <div className="flex flex-1 overflow-hidden">
        <div className="flex w-80 flex-col gap-1 overflow-y-auto border-r p-2">
          {conversationsQuery.isLoading ? (
            <p>Loading...</p>
          ) : conversationsQuery.isError ? (
            <p>{conversationsQuery.error.message}</p>
          ) : conversationsQuery.data.length === 0 ? (
            <div className="flex flex-1 flex-col items-center justify-center gap-4">
              <p className="text-center text-sm text-muted-foreground">
                No results.
              </p>
              <Button
                variant="outline"
                onClick={() => conversationsQuery.refetch()}
                disabled={conversationsQuery.isRefetching}
              >
                Refresh
              </Button>
            </div>
          ) : (
            <SideBarNav
              list={[
                {
                  items: conversationsQuery.data.map((conversation) => ({
                    href: `/chatbots/${chatbotId}/conversations/${conversation.id}`,
                    label: conversation.title || conversation.id,
                    subtitle: formatDistanceToNow(
                      new Date(conversation.updatedAt),
                      {
                        addSuffix: true,
                      },
                    ),
                    icon: <MessagesSquare size={22} />,
                  })),
                },
              ]}
            />
          )}
        </div>
        <div className="flex flex-1 flex-col overflow-hidden">{children}</div>
      </div>
    </ChatbotLayout>
  );
};

export default ConversationsLayout;
