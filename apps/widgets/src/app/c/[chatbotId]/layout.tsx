import { db } from "@acme/db";
import { notFound } from "next/navigation";
import { ReactNode } from "react";
import { chatbotSettingsSchema } from "@acme/core/validators";
import Link from "next/link";
import { ChatbotProvider } from "@/providers/ChatbotProvider";
import NavigationEvents from "./NavigationEvents";

export default async function ChatbotLayout({
  children,
  params: { chatbotId },
}: {
  children: ReactNode;
  params: { chatbotId: string };
}) {
  const chatbot = await db.chatbot.findUnique({ where: { id: chatbotId } });

  if (!chatbot) {
    notFound();
  }

  const settings = chatbotSettingsSchema.parse(chatbot.settings);

  return (
    <ChatbotProvider chatbot={chatbot}>
      <NavigationEvents />
      <style>
        {`
      :root {
        --primary-bg: ${settings.primaryColor};
        --primary-fg: ${settings.primaryForegroundColor};
      }
      `}
      </style>
      <div className="flex flex-1 flex-col overflow-hidden bg-[var(--primary-bg)]">
        {children}
      </div>
      <div className="flex h-8 flex-shrink-0 items-center justify-center border-t border-slate-200 bg-white">
        <p className="text-center text-sm text-slate-400">
          Powered by{" "}
          <Link
            href="https://supabotai.com"
            className="font-medium text-[var(--primary-bg)] underline-offset-4 hover:underline"
          >
            SupaBot AI
          </Link>
        </p>
      </div>
    </ChatbotProvider>
  );
}
