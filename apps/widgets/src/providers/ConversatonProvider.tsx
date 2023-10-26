"use client";

import { api } from "@/utils/trpc/client";
import { Conversation, Message } from "@acme/db";
import { useCompletion } from "ai/react";
import {
  MutableRefObject,
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

export type ConversationContextType = {
  conversation: Conversation;
  messages?: Message[];
  isLoaded: boolean;
  isSending: boolean;
  sendMessage: (data: { message: string }) => Promise<void>;
  completion?: string;
  scrollRef: MutableRefObject<HTMLDivElement | null>;
  autoScroll: boolean;
  scrollToBottom: () => void;
};

export const ConversationContext =
  createContext<ConversationContextType | null>(null);

export default function ConversatonProvider({
  children,
  conversation,
}: {
  children: ReactNode;
  conversation: Conversation;
}) {
  const [isSending, setIsSending] = useState(false);
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const [autoScroll, setAutoScroll] = useState(true);

  const messagesQuery = api.conversation.getAllMessages.useQuery({
    conversationId: conversation.id,
  });
  const utils = api.useContext();

  const { completion, complete } = useCompletion({
    api: `/api/chat`,
    body: { conversationId: conversation.id },
  });

  const sendMessage: ConversationContextType["sendMessage"] = useCallback(
    async (data) => {
      if (!messagesQuery.isSuccess) return;
      if (isSending) return;
      setIsSending(true);
      utils.conversation.getAllMessages.setData(
        { conversationId: conversation.id },
        (messages) => [
          {
            id: "user-msg",
            role: "USER",
            body: data.message,
            conversationId: conversation.id,
            userId: conversation.userId,
            createdAt: new Date(),
            updatedAt: new Date(),
            metadata: null,
            reaction: null,
          },
          ...(messages || []),
        ],
      );
      const aiMessage = await complete(data.message);
      utils.conversation.getAllMessages.setData(
        { conversationId: conversation.id },
        (messages) => [
          {
            id: "bot-msg",
            role: "BOT",
            body: aiMessage ?? "",
            conversationId: conversation.id,
            userId: conversation.userId,
            createdAt: new Date(),
            updatedAt: new Date(),
            metadata: null,
            reaction: null,
          },
          ...(messages || []),
        ],
      );
      setIsSending(false);
      utils.conversation.getAllMessages.invalidate({
        conversationId: conversation.id,
      });
    },
    [
      complete,
      conversation.id,
      conversation.userId,
      isSending,
      messagesQuery.isSuccess,
      utils.conversation.getAllMessages,
    ],
  );

  const scrollToBottom = useCallback(() => {
    console.log("CALLING");
    if (scrollRef.current) {
      setAutoScroll(true);
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scrollRef.current]);

  useEffect(() => {
    if (!scrollRef.current) return;
    const el = scrollRef.current;
    const handleWheel = () => {
      if (el.scrollTop === el.scrollHeight - el.clientHeight && !autoScroll) {
        setAutoScroll(true);
      }
      if (el.scrollTop !== el.scrollHeight - el.clientHeight && autoScroll) {
        setAutoScroll(false);
      }
    };
    el.addEventListener("wheel", handleWheel);
    return () => {
      el.removeEventListener("wheel", handleWheel);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoScroll, scrollRef.current]);

  useEffect(() => {
    if (!autoScroll) return;
    scrollToBottom();
  }, [autoScroll, completion, messagesQuery.data?.length, scrollToBottom]);

  return (
    <ConversationContext.Provider
      value={{
        conversation,
        messages: messagesQuery.data,
        isLoaded: !messagesQuery.isLoading,
        sendMessage,
        isSending,
        completion,
        scrollRef,
        autoScroll,
        scrollToBottom,
      }}
    >
      {children}
    </ConversationContext.Provider>
  );
}

export const useConversation = () => {
  const context = useContext(ConversationContext);
  if (!context) {
    throw new Error("useConversation must use inside ConversationProvider");
  }
  return context;
};
