import { db } from "@acme/db";
import { notFound } from "next/navigation";
import { ReactNode } from "react";
import ConversatonProvider from "@/providers/ConversatonProvider";

export default async function ConversationLayout({
  children,
  params: { conversationId },
}: {
  children: ReactNode;
  params: { conversationId: string };
}) {
  const conversation = await db.conversation.findUnique({
    where: { id: conversationId },
  });
  if (!conversation) {
    notFound();
  }
  return (
    <ConversatonProvider conversation={conversation}>
      {children}
    </ConversatonProvider>
  );
}
