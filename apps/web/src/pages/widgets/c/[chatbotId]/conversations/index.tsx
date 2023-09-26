import ChatboxHeader from "@/components/ChatboxHeader";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import ChatbotWidgetLayout, {
  useChatbotWidget,
} from "@/layouts/ChatbotWidgetLayout";
import { NextPageWithLayout } from "@/types/next";
import { trpc } from "@/utils/trpc";
import { formatDistanceToNow } from "date-fns";
import { ArrowRight, Loader2, Plus, RefreshCw } from "lucide-react";
import Link from "next/link";

const ConversationsPage: NextPageWithLayout = () => {
  const { chatbot, user, startConversation, startConversationLoading } =
    useChatbotWidget();
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
      <ChatboxHeader
        title={`Conversations (${conversationsQuery.data?.length || 0})`}
        trailing={
          <>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={startConversation}
                  disabled={startConversationLoading}
                >
                  <div className="sr-only">New Conversation</div>
                  {startConversationLoading ? (
                    <Loader2 size={22} className="animate-spin" />
                  ) : (
                    <Plus size={22} />
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent>New Conversation</TooltipContent>
            </Tooltip>
          </>
        }
      />
      {user ? (
        conversationsQuery.isLoading ? (
          <div className="flex-1 overflow-auto">
            {new Array(5).fill(1).map((_, i) => (
              <div className="flex flex-col border-b p-4" key={i}>
                <Skeleton className="h-6 w-2/3" />
                <div className="mt-1 flex flex-wrap items-center gap-2">
                  <Skeleton className="h-5 w-16" />
                  <Skeleton className="h-5 w-24" />
                </div>
              </div>
            ))}
          </div>
        ) : conversationsQuery.isError ? (
          <div className="mx-auto flex max-w-screen-sm flex-1 flex-col items-center justify-center p-6 text-center">
            <p className="mt-6 text-lg font-semibold">Error</p>
            <p className="mt-1 text-sm text-muted-foreground">
              {conversationsQuery.error.message}
            </p>
            <Button
              onClick={() => conversationsQuery.refetch()}
              disabled={conversationsQuery.isRefetching}
              variant="outline"
              className="mt-6"
            >
              {conversationsQuery.isRefetching ? (
                <Loader2 size={20} className="-ml-1 mr-2 animate-spin" />
              ) : (
                <RefreshCw size={20} className="-ml-1 mr-2" />
              )}
              Retry
            </Button>
          </div>
        ) : conversationsQuery.data.length === 0 ? (
          <div className="mx-auto flex max-w-screen-sm flex-1 flex-col items-center justify-center p-6 text-center">
            <p className="mt-6 text-lg font-semibold">
              Your Conversations List is Empty
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              Oops! It looks like there are no conversations here at the moment.
            </p>
            <Button
              onClick={startConversation}
              disabled={startConversationLoading}
              className="mt-6"
            >
              Start a New Conversation
              {startConversationLoading ? (
                <Loader2 size={20} className="-mr-1 ml-2 animate-spin" />
              ) : (
                <ArrowRight size={20} className="-mr-1 ml-2" />
              )}
            </Button>
          </div>
        ) : (
          <div className="flex-1 overflow-auto">
            {conversationsQuery.data.map((conversation) => {
              const lastMessage = conversation.messages[0];
              return (
                <Link
                  href={`/widgets/c/${chatbot.id}/conversations/${conversation.id}`}
                  key={conversation.id}
                  className="flex flex-col border-b p-4 hover:bg-secondary"
                >
                  <p className="truncate font-medium">
                    {conversation.title ||
                      (lastMessage
                        ? `${lastMessage.role}: ${lastMessage.body}`
                        : undefined) ||
                      conversation.id}
                  </p>
                  <div className="mt-1 flex flex-wrap items-center gap-2">
                    <Badge variant="secondary">{conversation.status}</Badge>
                    <p className="text-sm text-muted-foreground">
                      {formatDistanceToNow(
                        new Date(conversation.messages[0].updatedAt),
                        {
                          addSuffix: true,
                        },
                      )}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        )
      ) : (
        <div className="mx-auto flex max-w-screen-sm flex-1 flex-col items-center justify-center p-6 text-center">
          <p className="mt-6 text-lg font-semibold">Log In</p>
          <p className="mt-1 text-sm text-muted-foreground">
            To access and view your conversations, please log in or create an
            account to preserve your chat history.
          </p>
          <Button asChild className="mt-6">
            <Link href={`/widgets/c/${chatbot.id}/account`}>
              Let&apos;s Log In
              <ArrowRight size={20} className="-mr-1 ml-2" />
            </Link>
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
