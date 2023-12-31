import ErrorBox from "@/components/ErrorBox";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useToast } from "@/components/ui/use-toast";
import { COUNTRIES } from "@/data/countries";
import { useChatbot } from "@/hooks/useChatbot";
import ConversationsLayout from "@/layouts/ConversationsLayout";
import { cn } from "@/lib/utils";
import { NextPageWithLayout } from "@/types/next";
import { trpc } from "@/utils/trpc";
import { getChatbotStyle } from "@acme/core/utils/get-chatbot-style";
import { IpInfo } from "@acme/core/utils/ipinfo";
import { ChatbotSettings } from "@acme/core/validators";
import { Conversation } from "@acme/db";
import {
  Bot,
  Loader2,
  MoreVertical,
  PanelRightOpen,
  RefreshCw,
  User,
  X,
} from "lucide-react";
import { useTheme } from "next-themes";
import { useRouter } from "next/router";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const ConversationPage: NextPageWithLayout = () => {
  const [showDetails, setShowDetails] = useState(true);
  const scrollElRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const { resolvedTheme } = useTheme();
  const conversationId = router.query.conversationId as string;
  const { data: chatbot } = useChatbot();
  const { toast } = useToast();

  const chatbotSettings: ChatbotSettings = useMemo(
    () => ({ ...(chatbot?.settings as any) }),
    [chatbot?.settings],
  );
  const conversationQuery = trpc.conversation.getConversationById.useQuery(
    { conversationId },
    { enabled: router.isReady },
  );
  const messagesQuery = trpc.message.list.useQuery(
    { conversationId },
    { enabled: router.isReady },
  );
  const utils = trpc.useContext();
  const updateConversationMutation =
    trpc.conversation.updateConversation.useMutation({
      onSuccess: (data, vars) => {
        toast({
          title: "Success",
          description: "Conversation status changed to closed",
        });
        utils.conversation.getConversationsForChatbot.invalidate({
          chatbotId: data.chatbotId,
        });
        utils.conversation.getConversationById.invalidate({
          conversationId: vars.conversationId,
        });
      },
      onError: (error) => {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
      },
    });

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
    <div className="chatbox flex flex-1 overflow-hidden">
      <div className="flex flex-1 flex-col overflow-hidden">
        <header className="bg-card text-card-foreground sticky top-0 z-20 flex h-14 items-center border-b px-4">
          <div className="flex flex-1 justify-end gap-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  disabled={
                    messagesQuery.isRefetching || conversationQuery.isRefetching
                  }
                  onClick={() => {
                    conversationQuery.refetch();
                    messagesQuery.refetch();
                  }}
                >
                  {messagesQuery.isRefetching ||
                  conversationQuery.isRefetching ? (
                    <Loader2 size={20} className="animate-spin" />
                  ) : (
                    <RefreshCw size={20} />
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom" align="end">
                Refresh Conversation
              </TooltipContent>
            </Tooltip>
            <Tooltip>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreVertical size={20} />
                    </Button>
                  </TooltipTrigger>
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
              <TooltipContent side="bottom" align="end">
                Menu
              </TooltipContent>
            </Tooltip>

            {!showDetails && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setShowDetails(!showDetails)}
                  >
                    <PanelRightOpen size={20} />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="bottom" align="end">
                  Open Details Panel
                </TooltipContent>
              </Tooltip>
            )}
          </div>
        </header>

        <style>{getChatbotStyle("chatbox", chatbotSettings)}</style>
        <div ref={scrollElRef} className="flex-1 overflow-y-auto">
          {messagesQuery.isLoading ? (
            <p>Loading...</p>
          ) : messagesQuery.isError ? (
            <p>{messagesQuery.error.message}</p>
          ) : (
            <div className="flex-1 pb-32">
              {messagesQuery.data.map((message) => (
                <div
                  key={message.id}
                  className={cn("hover:bg-foreground/5 border-b")}
                >
                  <div className="container flex max-w-screen-md gap-4 py-6">
                    <div className="bg-foreground/5 flex h-10 w-10 items-center justify-center rounded-md">
                      {message.role === "BOT" ? <Bot /> : <User />}
                    </div>
                    <div className="flex-1 overflow-hidden">
                      <p className="mb-2 text-sm">
                        <b>{message.role}</b>
                        <time
                          dateTime={message.createdAt.toISOString()}
                          className="text-muted-foreground"
                        >
                          {" • "}
                          {message.createdAt.toLocaleString()}
                        </time>
                        {message.reaction && (
                          <span className="text-muted-foreground">
                            {" • "} User{" "}
                            <b>
                              {message.reaction === "LIKE"
                                ? "liked"
                                : "disliked"}
                            </b>{" "}
                            this message
                          </span>
                        )}
                      </p>
                      <ReactMarkdown
                        className={cn(
                          "prose dark:prose-invert text-foreground max-w-full flex-1 overflow-auto",
                        )}
                        remarkPlugins={[remarkGfm]}
                        linkTarget="_blank"
                      >
                        {message.body}
                      </ReactMarkdown>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      {showDetails && (
        <DetailsPanel
          conversation={conversationQuery.data}
          onClose={() => setShowDetails(false)}
        />
      )}
    </div>
  );
};

ConversationPage.getLayout = (page) => (
  <ConversationsLayout>{page}</ConversationsLayout>
);

export default ConversationPage;

const DetailsPanel = ({
  conversation,
  onClose,
}: {
  conversation: Conversation;
  onClose: () => void;
}) => {
  const ipInfo = conversation.ipInfo as IpInfo | null;
  const chatbotUser = trpc.chatbotUser.getUserById.useQuery(
    { userId: conversation.userId ?? "" },
    { enabled: !!conversation.userId },
  );
  const { toast } = useToast();

  return (
    <div className="flex w-80 flex-col border-l">
      <header className="flex h-14 items-center border-b px-4">
        <p className="flex-1 truncate">Conversation Details</p>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X size={20} />
              <p className="sr-only">Close Panel</p>
            </Button>
          </TooltipTrigger>
          <TooltipContent side="bottom" align="end">
            Close Panel
          </TooltipContent>
        </Tooltip>
      </header>
      <div className="flex-1 overflow-y-auto pb-32">
        {[
          {
            label: "Id",
            value: conversation.id,
          },
          {
            label: "Path",
            value: conversation.url
              ? new URL(conversation.url).pathname
              : "Unknown",
          },
          {
            label: "Status",
            value: conversation.status ?? "Unknown",
          },
          {
            label: "Started At",
            value: conversation.createdAt.toLocaleString(),
          },
          ...(conversation.closedAt
            ? [
                {
                  label: "Closed At",
                  value: conversation.closedAt.toLocaleString(),
                },
              ]
            : []),
          {
            label: "User Id",
            value: chatbotUser.data?.id || "Unknown",
          },
          {
            label: "User Email",
            value: chatbotUser.data?.email || "Unknown",
          },
          {
            label: "User Name",
            value: chatbotUser.data?.name || "Unknown",
          },
          {
            label: "IP Address",
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
            value:
              COUNTRIES.find((country) => country.code === ipInfo?.country)
                ?.name ?? "Unknown",
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
        ].map((item) => (
          <Tooltip key={item.label}>
            <TooltipTrigger asChild>
              <button
                className="flex w-full gap-4 border-b p-4 text-sm"
                onClick={() => {
                  navigator.clipboard.writeText(item.value);
                  toast({ title: `${item.label} copied to your clipboard.` });
                }}
              >
                <p className="text-muted-foreground whitespace-nowrap text-left">
                  {item.label}
                </p>
                <p className="flex-1 text-end">{item.value}</p>
              </button>
            </TooltipTrigger>
            <TooltipContent align="center" side="left">
              Copy {item.label}
            </TooltipContent>
          </Tooltip>
        ))}
      </div>
    </div>
  );
};
