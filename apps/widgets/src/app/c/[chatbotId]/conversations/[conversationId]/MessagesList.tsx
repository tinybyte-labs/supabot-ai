"use client";

import { Fragment, useState } from "react";
import { useChatbot } from "@/providers/ChatbotProvider";
import { useConversation } from "@/providers/ConversatonProvider";
import BotMessage from "./BotMessage";
import UserMessage from "./UserMessage";
import { cn } from "@/lib/cn";

export default function MessagesList() {
  const { settings, chatbot } = useChatbot();
  const {
    completion,
    messages,
    isLoaded,
    isSending,
    scrollRef,
    scrollToBottom,
  } = useConversation();
  const [scrollY, setScrollY] = useState(0);

  return (
    <div className="relative flex-1 overflow-hidden">
      <div
        className="h-full w-full overflow-y-auto"
        ref={scrollRef}
        onScroll={(e) =>
          setScrollY(
            e.currentTarget.scrollHeight -
              e.currentTarget.clientHeight -
              e.currentTarget.scrollTop,
          )
        }
      >
        <div className="flex flex-col-reverse gap-6 py-6">
          {!isLoaded ? (
            <div className="p-4">
              <p className="text-slate-400">Loading messages...</p>
            </div>
          ) : (
            <>
              {isSending && (
                <BotMessage name={chatbot.name}>
                  {completion || (
                    <div className="flex h-6 items-center gap-1 px-2">
                      <div className="h-2 w-2 animate-pulse rounded-full bg-slate-400"></div>
                      <div className="h-2 w-2 animate-pulse rounded-full bg-slate-400"></div>
                      <div className="h-2 w-2 animate-pulse rounded-full bg-slate-400"></div>
                    </div>
                  )}
                </BotMessage>
              )}
              {messages?.map((message) => (
                <Fragment key={message.id}>
                  {message.role === "BOT" ? (
                    <BotMessage
                      messageId={message.id}
                      date={message.createdAt}
                      name={chatbot.name}
                      sources={(message.metadata as any)?.sources}
                    >
                      {message.body}
                    </BotMessage>
                  ) : (
                    <UserMessage message={message} />
                  )}
                </Fragment>
              ))}
              {!!settings.welcomeMessage && (
                <BotMessage name={chatbot.name}>
                  {settings.welcomeMessage}
                </BotMessage>
              )}
            </>
          )}
        </div>
      </div>
      <button
        className={cn(
          "pointer-events-none absolute bottom-6 right-6 flex h-12 w-12 translate-y-4 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 opacity-0 shadow-xl transition-all hover:text-slate-900",
          {
            "pointer-events-auto -translate-y-0 opacity-100": scrollY > 100,
          },
        )}
        onClick={scrollToBottom}
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M7 13L12 18L17 13M7 6L12 11L17 6"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
    </div>
  );
}
