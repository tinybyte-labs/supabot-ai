import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import ChatbotWidgetLayout, {
  useChatbotWidget,
} from "@/layouts/ChatbotWidgetLayout";
import { NextPageWithLayout } from "@/types/next";
import { trpc } from "@/utils/trpc";
import { formatDistanceToNow } from "date-fns";
import Link from "next/link";

const ConversationsPage: NextPageWithLayout = () => {
  const { chatbot, user } = useChatbotWidget();
  const conversationsQuery = trpc.conversation.publicList.useQuery(
    {
      chatbotId: chatbot.id || "",
      userId: user?.id || "",
    },
    {
      enabled: !!user?.id,
    },
  );

  return (
    <>
      <header className="flex h-14 items-center gap-3 border-b px-4">
        <h1 className="text-lg font-semibold">Conversations</h1>
      </header>
      {user ? (
        <div className="flex-1 overflow-auto">
          {conversationsQuery.isLoading ? (
            <p>Loading...</p>
          ) : conversationsQuery.isError ? (
            <p>{conversationsQuery.error.message}</p>
          ) : (
            conversationsQuery.data.map((conversation) => (
              <Link
                href={`/widgets/c/${chatbot.id}/conversations/${conversation.id}`}
                key={conversation.id}
                className="flex flex-col border-b p-4 hover:bg-secondary"
              >
                <p className="font-medium">
                  {conversation.title || conversation.id}
                </p>
                {conversation.messages.length > 0 && (
                  <p className="my-1 line-clamp-1  text-sm text-muted-foreground">
                    <span className="font-medium">
                      {conversation.messages[0].role}:
                    </span>{" "}
                    {conversation.messages[0].body}
                  </p>
                )}
                <div className="mt-1 flex flex-wrap items-center gap-2">
                  <p className="text-sm text-muted-foreground">
                    {formatDistanceToNow(new Date(conversation.updatedAt), {
                      addSuffix: true,
                    })}
                  </p>
                  <Badge variant="secondary">{conversation.status}</Badge>
                </div>
              </Link>
            ))
          )}
        </div>
      ) : (
        <div className="flex flex-1 flex-col items-center justify-center">
          <Button asChild>
            <Link href={`/widgets/c/${chatbot.id}/account`}>Log In</Link>
          </Button>
        </div>
      )}
    </>
  );
};

ConversationsPage.getLayout = (page) => (
  <ChatbotWidgetLayout>{page}</ChatbotWidgetLayout>
);

export default ConversationsPage;
