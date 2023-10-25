import { api } from "@/utils/trpc/server";

export default async function Page({
  params: { chatbotId },
}: {
  params: { chatbotId: string };
}) {
  const chatbot = await api.chatbot.getById.query({ chatbotId });
  return <div>ChatBot ID: {JSON.stringify(chatbot, null, 2)}</div>;
}
