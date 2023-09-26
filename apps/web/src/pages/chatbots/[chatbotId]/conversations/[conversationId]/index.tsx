import BotMessageBubble from "@/components/BotMessageBubble";
import ErrorBox from "@/components/ErrorBox";
import UserMessageBubble from "@/components/UserMessageBubble";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/components/ui/use-toast";
import { COUNTRIES } from "@/data/countries";
import ConversationsLayout from "@/layouts/ConversationsLayout";
import { useChatbot } from "@/providers/ChatbotProvider";
import { IpInfo } from "@/server/ipinfo";
import { NextPageWithLayout } from "@/types/next";
import { getChatbotStyle } from "@/utils";
import { trpc } from "@/utils/trpc";
import { ChatbotSettings } from "@/utils/validators";
import { formatDistanceToNow } from "date-fns";
import { Loader2, MoreVertical, RefreshCw } from "lucide-react";
import { useTheme } from "next-themes";
import { useRouter } from "next/router";
import { Fragment, useCallback, useEffect, useMemo, useRef } from "react";

const ConversationPage: NextPageWithLayout = () => {
  const scrollElRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const { resolvedTheme } = useTheme();
  const conversationId = router.query.conversationId as string;
  const chatbotId = router.query.chatbotId as string;
  const { chatbot } = useChatbot();
  const { toast } = useToast();
  const chatbotSettings: ChatbotSettings = useMemo(
    () => ({ ...(chatbot?.settings as any) }),
    [chatbot?.settings],
  );
  const conversationQuery = trpc.conversation.getById.useQuery(
    { conversationId, chatbotId },
    { enabled: router.isReady },
  );
  const messagesQuery = trpc.message.list.useQuery(
    { conversationId },
    { enabled: router.isReady },
  );
  const utils = trpc.useContext();
  const updateConversationMutation = trpc.conversation.update.useMutation({
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Conversation status changed to closed",
      });
      utils.conversation.list.invalidate({ chatbotId });
      utils.conversation.getById.invalidate({ chatbotId, conversationId });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const ipInfo = conversationQuery.data?.ipInfo as IpInfo | null;

  const closeConversation = () =>
    updateConversationMutation.mutate({
      conversationId,
      data: { status: "CLOSED" },
    });

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
    if (!messagesQuery.data) {
      return;
    }
    let timeout: NodeJS.Timeout | null = null;
    if (messagesQuery.data?.length > 0) {
      timeout = setTimeout(() => handleScrollToBottom(), 100);
    }
    return () => {
      if (timeout) clearTimeout(timeout);
    };
  }, [handleScrollToBottom, messagesQuery.data]);

  if (conversationQuery.isLoading) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <Loader2 size={24} className="animate-spin" />
      </div>
    );
  }

  if (conversationQuery.isError) {
    return (
      <ErrorBox
        title="Failed to load conversation"
        description={conversationQuery.error.message}
        onRetry={() => conversationQuery.refetch()}
        isRefetching={conversationQuery.isRefetching}
      />
    );
  }

  return (
    <>
      <style>{getChatbotStyle("chatbox", chatbotSettings)}</style>
      <div className="chatbox flex flex-1 overflow-hidden">
        <div className="flex flex-1 flex-col overflow-hidden">
          <div className="sticky top-0 z-20 flex h-14 items-center border-b bg-card pl-4 pr-2 text-card-foreground">
            <h2 className="flex-1 text-xl font-bold tracking-tight">
              {conversationQuery.data?.title || conversationQuery.data?.id}
            </h2>
            <div className="flex justify-end gap-2">
              <Button
                variant="ghost"
                size="icon"
                disabled={messagesQuery.isRefetching}
                onClick={() => messagesQuery.refetch()}
              >
                {messagesQuery.isRefetching ? (
                  <Loader2 size={20} className="animate-spin" />
                ) : (
                  <RefreshCw size={20} />
                )}
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <MoreVertical size={20} />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem
                    disabled={
                      conversationQuery.data.status === "CLOSED" ||
                      updateConversationMutation.isLoading
                    }
                    onClick={closeConversation}
                  >
                    Close Conversation
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
          <div ref={scrollElRef} className="flex-1 overflow-y-auto">
            {messagesQuery.isLoading ? (
              <p>Loading...</p>
            ) : messagesQuery.isError ? (
              <p>{messagesQuery.error.message}</p>
            ) : (
              <div className="flex-1 space-y-6 p-4">
                {chatbotSettings.welcomeMessage && (
                  <BotMessageBubble
                    name="BOT"
                    message={chatbotSettings.welcomeMessage}
                    date={conversationQuery.data.createdAt}
                    theme={resolvedTheme === "dark" ? "dark" : "light"}
                    preview
                  />
                )}

                {messagesQuery.data.map((message) => (
                  <Fragment key={message.id}>
                    {message.role === "BOT" ? (
                      <BotMessageBubble
                        name="BOT"
                        message={message.body}
                        reaction={message.reaction}
                        sources={(message.metadata as any)?.sources as string[]}
                        date={message.createdAt}
                        theme={resolvedTheme === "dark" ? "dark" : "light"}
                        preview
                      />
                    ) : message.role === "USER" ? (
                      <BotMessageBubble
                        name="CUSTOMER"
                        message={message.body}
                        date={message.createdAt}
                        theme={resolvedTheme === "dark" ? "dark" : "light"}
                        preview
                      />
                    ) : null}
                  </Fragment>
                ))}
              </div>
            )}
          </div>
        </div>
        <div className="w-80 space-y-4 overflow-y-auto border-l p-4">
          <section>
            <p className="mb-2 font-semibold">Conversation</p>
            <div className="space-y-1">
              {[
                {
                  label: "Id",
                  value: conversationQuery.data.id,
                },
                {
                  label: "Path",
                  value: conversationQuery.data.url
                    ? new URL(conversationQuery.data.url).pathname
                    : "Unknown",
                },
                {
                  label: "Status",
                  value: conversationQuery.data.status ?? "Unknown",
                },
                {
                  label: "Started",
                  value: formatDistanceToNow(
                    new Date(conversationQuery.data.createdAt),
                    {
                      addSuffix: true,
                    },
                  ),
                },
                ...(conversationQuery.data.closedAt
                  ? [
                      {
                        label: "Closed",
                        value: formatDistanceToNow(
                          new Date(conversationQuery.data.closedAt),
                          {
                            addSuffix: true,
                          },
                        ),
                      },
                    ]
                  : []),
              ].map((item, i) => (
                <div key={i} className="flex text-sm">
                  <div className="w-1/3 flex-shrink-0 font-medium">
                    {item.label}:
                  </div>
                  <div className="flex-1 break-all text-muted-foreground">
                    {item.value}
                  </div>
                </div>
              ))}
            </div>
          </section>
          <section>
            <p className="mb-2 font-semibold">User</p>
            <div className="space-y-1">
              {[
                {
                  label: "Id",
                  value: conversationQuery.data.user?.id || "Unknown",
                },
                {
                  label: "Email",
                  value: conversationQuery.data.user?.email || "Unknown",
                },
                {
                  label: "Name",
                  value: conversationQuery.data.user?.name || "Unknown",
                },
              ].map((item, i) => (
                <div key={i} className="flex text-sm">
                  <div className="w-1/3 flex-shrink-0 font-medium">
                    {item.label}:
                  </div>
                  <div className="flex-1 break-all text-muted-foreground">
                    {item.value}
                  </div>
                </div>
              ))}
            </div>
          </section>
          <section>
            <p className="mb-2 font-semibold">Address</p>
            <div className="space-y-1">
              {[
                {
                  label: "IP",
                  value: ipInfo?.ip ?? "Unknown",
                },
                {
                  label: "City",
                  value: ipInfo?.city ?? "Unknown",
                },
                {
                  label: "Region",
                  value: ipInfo?.region ?? "Unknown",
                },
                {
                  label: "Country",
                  value: ipInfo?.country
                    ? COUNTRIES.find(
                        (country) => country.code === ipInfo.country,
                      )?.name
                    : "Unknown",
                },
                {
                  label: "Postal",
                  value: ipInfo?.postal ?? "Unknown",
                },
                {
                  label: "Timezone",
                  value: ipInfo?.timezone ?? "Unknown",
                },
                {
                  label: "Location",
                  value: ipInfo?.loc ?? "Unknown",
                },
              ].map((item, i) => (
                <div key={i} className="flex text-sm">
                  <div className="w-1/3 flex-shrink-0 font-medium">
                    {item.label}:
                  </div>
                  <div className="flex-1 break-all text-muted-foreground">
                    {item.value}
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </>
  );
};

ConversationPage.getLayout = (page) => (
  <ConversationsLayout>{page}</ConversationsLayout>
);

export default ConversationPage;
