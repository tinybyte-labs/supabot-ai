import { trpc } from "@/utils/trpc";
import { ReactNode, useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Filter, MessagesSquare } from "lucide-react";
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

const ConversationsLayout = ({ children }: { children: ReactNode }) => {
  const router = useRouter();
  const chatbotId = router.query.chatbotId as string;
  const conversationId = router.query.conversationId as string;
  const [statusFilter, setStatusFilter] = useState("ALL");
  const conversationsQuery = trpc.conversation.list.useQuery(
    {
      chatbotId: chatbotId,
      status:
        statusFilter === "OPEN"
          ? "OPEN"
          : statusFilter === "CLOSED"
          ? "CLOSED"
          : undefined,
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
    <ChatbotLayout noBottomPadding>
      <div className="flex h-[calc(100vh-57px)] flex-col overflow-hidden">
        <div className="flex flex-1 overflow-hidden">
          <div className="flex w-80 flex-col gap-1 overflow-y-auto border-r">
            <div className="sticky flex h-14 items-center border-b px-4">
              <h1 className="flex-1 text-xl font-bold tracking-tight">
                Conversations
              </h1>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button size="icon" variant="ghost">
                    <Filter size={20} />
                  </Button>
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
            </div>
            <div className="p-2">
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
                      items: conversationsQuery.data.map((conversation) => {
                        let lastMessage = conversation.messages[0];
                        return {
                          href: `/chatbots/${chatbotId}/conversations/${conversation.id}`,
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
