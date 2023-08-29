import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import ChatbotBoxLayout, { useChatbox } from "@/layouts/ChatboxLayout";
import { NextPageWithLayout } from "@/types/next";
import { trpc } from "@/utils/trpc";
import { Message } from "@prisma/client";
import { ArrowLeft, Loader2, SendIcon } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/router";
import { Fragment, useCallback, useState } from "react";
import ReactMarkdown from "react-markdown";

const ConversationPage: NextPageWithLayout = () => {
  const router = useRouter();
  const { user, chatbot } = useChatbox();
  const [message, setMessage] = useState("");
  const { toast } = useToast();
  const utils = trpc.useContext();
  const conversation = trpc.conversation.getById.useQuery(
    {
      id: (router.query.conversationId as string) || "",
      chatbotId: chatbot.id,
      userId: user?.id,
    },
    { enabled: router.isReady },
  );
  const messages = trpc.message.list.useQuery(
    {
      conversationId: conversation.data?.id || "",
    },
    {
      enabled: conversation.isSuccess,
    },
  );
  const quickPrompts = trpc.quickPrompt.list.useQuery(
    { chatbotId: chatbot.id },
    {
      enabled: messages.isSuccess && messages.data.length === 0,
    },
  );

  const sendMessage = trpc.message.send.useMutation({
    onSuccess: ({ botMessage, userMessage }) => {
      utils.message.list.setData(
        { conversationId: userMessage.conversationId },
        (data) => [
          ...(data || []).map((msg) =>
            msg.id === "optimestic-id" ? userMessage : msg,
          ),
          botMessage,
        ],
      );
    },
    onError: (error) =>
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      }),
  });

  const handleSubmit = useCallback(
    async (message: string) => {
      if (!conversation.isSuccess) {
        return;
      }
      if (!message) {
        toast({ title: "Please enter your message", variant: "destructive" });
        return;
      }
      const m: Message = {
        id: "optimestic-id",
        createdAt: new Date(),
        updatedAt: new Date(),
        role: "USER",
        body: message,
        userId: user?.id || null,
        conversationId: conversation.data.id,
        agentId: null,
        reaction: null,
        metadata: null,
      };
      utils.message.list.setData(
        { conversationId: conversation.data.id },
        (data) => [...(data || []), m],
      );

      sendMessage.mutateAsync({
        chatbotId: chatbot.id,
        conversationId: conversation.data.id,
        message,
        userId: user?.id,
      });
      setMessage("");
    },
    [
      chatbot.id,
      conversation.data?.id,
      conversation.isSuccess,
      sendMessage,
      toast,
      user?.id,
      utils.message.list,
    ],
  );

  if (conversation.isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 size={24} />
      </div>
    );
  }
  if (conversation.error) {
    return <div>{conversation.error.message}</div>;
  }
  return (
    <div className="flex h-screen w-screen flex-col overflow-hidden">
      <div className="flex items-center gap-3 border-b p-3">
        <Button size="icon" variant="ghost" asChild>
          <Link href={`/widgets/c/${chatbot.id}`}>
            <ArrowLeft size={20} />
          </Link>
        </Button>
        <p className="text-lg font-semibold">
          {conversation.data.title || chatbot.name}
        </p>
      </div>
      <div className="relative flex-1 overflow-y-auto">
        <div className="space-y-4 p-4">
          {messages.isLoading ? (
            <p>Loading messages..</p>
          ) : messages.isError ? (
            <p>Messages Error: {messages.error.message}</p>
          ) : (
            messages.data.map((message) => (
              <Fragment key={message.id}>
                {message.role === "BOT" ? (
                  <div className="flex justify-start pr-12 sm:pr-24">
                    <div className="flex flex-col items-start">
                      <p className="mb-2 text-sm font-medium uppercase text-muted-foreground">
                        BOT
                      </p>
                      <div className="rounded-lg bg-secondary p-4 text-secondary-foreground">
                        <ReactMarkdown className="prose max-w-none dark:prose-invert ">
                          {message.body}
                        </ReactMarkdown>
                      </div>
                      {(message.metadata as any)?.sources?.length > 0 &&
                        ((message.metadata as any).sources as string[]).map(
                          (source, i) => (
                            <Button key={i} size="sm" variant="secondary">
                              {source}
                            </Button>
                          ),
                        )}
                    </div>
                  </div>
                ) : message.role === "USER" ? (
                  <div className="flex justify-end pl-12 sm:pl-24">
                    <div className="flex flex-col items-end">
                      <p className="mb-2 text-sm font-medium uppercase text-muted-foreground">
                        YOU
                      </p>
                      <div className="rounded-lg bg-primary p-4 font-medium text-primary-foreground">
                        {message.body}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div>{message.body}</div>
                )}
              </Fragment>
            ))
          )}
        </div>

        {messages.data?.length === 0 && quickPrompts.isSuccess && (
          <div className="absolute bottom-4 left-4 right-4 flex flex-wrap justify-end gap-4">
            {quickPrompts.data.map((prompt) => (
              <Button
                key={prompt.id}
                variant="outline"
                size="sm"
                onClick={() => handleSubmit(prompt.prompt)}
              >
                {prompt.title}
              </Button>
            ))}
          </div>
        )}
      </div>
      <div className="border-t p-3">
        <form
          className="flex items-center gap-3"
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit(message);
          }}
        >
          <Input
            placeholder="How can we help you?..."
            autoFocus
            className="flex-1"
            value={message}
            onChange={(e) => setMessage(e.currentTarget.value)}
          />
          <Button type="submit" size="icon" disabled={sendMessage.isLoading}>
            {sendMessage.isLoading ? (
              <Loader2 size={20} className="animate-spin" />
            ) : (
              <SendIcon size={20} />
            )}
          </Button>
        </form>
      </div>
    </div>
  );
};

ConversationPage.getLayout = (page) => (
  <ChatbotBoxLayout>{page}</ChatbotBoxLayout>
);

export default ConversationPage;
