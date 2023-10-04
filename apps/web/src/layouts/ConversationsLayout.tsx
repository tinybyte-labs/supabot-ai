import { ReactNode, useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Filter, Loader2, MessagesSquare, RefreshCw } from "lucide-react";
import SideBarNav from "@/components/SideBarNav";
import { formatDistanceToNow } from "date-fns";
import ChatbotLayout from "./ChatbotLayout";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { trpc } from "@/utils/trpc";
import { useOrganization } from "@/hooks/useOrganization";
import { useChatbot } from "@/hooks/useChatbot";

const ConversationsLayout = ({ children }: { children: ReactNode }) => {
  const router = useRouter();
  const { data: chatbot, isSuccess: isChatbotLoaded } = useChatbot();
  const { conversationId } = router.query as { conversationId: string };
  const [statusFilter, setStatusFilter] = useState("ALL");
  const conversationsQuery = trpc.conversation.list.useQuery(
    {
      chatbotId: chatbot?.id || "",
      status:
        statusFilter === "OPEN"
          ? "OPEN"
          : statusFilter === "CLOSED"
          ? "CLOSED"
          : undefined,
    },
    { enabled: isChatbotLoaded },
  );

  useEffect(() => {
    if (
      !conversationId &&
      conversationsQuery.isSuccess &&
      conversationsQuery.data.length > 0
    ) {
      router.replace(
        `/${router.query.orgSlug}/chatbots/${router.query.chatbotId}/conversations/${conversationsQuery.data[0].id}`,
      );
    }
  }, [
    conversationId,
    conversationsQuery.data,
    conversationsQuery.isSuccess,
    router,
  ]);

  return (
    <ChatbotLayout noBottomPadding>
      <div className="flex h-[calc(100vh-57px)] flex-col overflow-hidden">
        <div className="flex flex-1 overflow-hidden">
          <div className="flex w-80 flex-col gap-1 overflow-y-auto border-r">
            <div className="bg-card sticky top-0 z-10 flex h-14 flex-shrink-0 items-center border-b px-4">
              <h1 className="flex-1 truncate text-xl font-bold tracking-tight">
                Conversations
              </h1>
              <Tooltip>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <TooltipTrigger asChild>
                      <Button size="icon" variant="ghost">
                        <Filter size={20} />
                      </Button>
                    </TooltipTrigger>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuLabel>Status</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuRadioGroup
                      value={statusFilter}
                      onValueChange={setStatusFilter}
                    >
                      <DropdownMenuRadioItem value="ALL">
                        ALL
                      </DropdownMenuRadioItem>
                      <DropdownMenuRadioItem value="OPEN">
                        OPEN
                      </DropdownMenuRadioItem>
                      <DropdownMenuRadioItem value="CLOSED">
                        CLOSED
                      </DropdownMenuRadioItem>
                    </DropdownMenuRadioGroup>
                  </DropdownMenuContent>
                </DropdownMenu>
                <TooltipContent side="bottom">Filter</TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    disabled={conversationsQuery.isRefetching}
                    onClick={() => conversationsQuery.refetch()}
                  >
                    <p className="sr-only">Refresh</p>
                    {conversationsQuery.isRefetching ? (
                      <Loader2 size={20} className="animate-spin" />
                    ) : (
                      <RefreshCw size={20} />
                    )}
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="bottom">Refresh</TooltipContent>
              </Tooltip>
            </div>
            <div className="p-2">
              {conversationsQuery.isLoading ? (
                <div className="flex flex-col gap-1">
                  <Skeleton className="h-[54px]" />
                  <Skeleton className="h-[54px]" />
                  <Skeleton className="h-[54px]" />
                  <Skeleton className="h-[54px]" />
                  <Skeleton className="h-[54px]" />
                </div>
              ) : conversationsQuery.isError ? (
                <p>{conversationsQuery.error.message}</p>
              ) : conversationsQuery.data.length === 0 ? (
                <div className="flex flex-1 flex-col items-center justify-center gap-4">
                  <p className="text-muted-foreground text-center text-sm">
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
                      items: conversationsQuery.data.map((conversation) => {
                        let lastMessage = conversation.messages[0];
                        return {
                          href: `/${router.query.orgSlug}/chatbots/${router.query.chatbotId}/conversations/${conversation.id}`,
                          label:
                            conversation.title ||
                            (lastMessage
                              ? `${lastMessage.role}: ${lastMessage.body}`
                              : undefined) ||
                            conversation.id,
                          subtitle: `${
                            conversation.status
                          } • ${formatDistanceToNow(
                            new Date(conversation.messages[0].updatedAt),
                            {
                              addSuffix: true,
                            },
                          )}`,
                          icon: <MessagesSquare size={22} />,
                        };
                      }),
                    },
                  ]}
                />
              )}
            </div>
          </div>
          <div className="flex flex-1 flex-col overflow-hidden">{children}</div>
        </div>
      </div>
    </ChatbotLayout>
  );
};

export default ConversationsLayout;
