import CloseChatboxButton from "@/components/CloseChatboxButton";
import StartConversationForm from "./StartConversationForm";
import { db } from "@acme/db";
import BodyContainer from "@/components/BodyContainer";

export default async function Page({
  params: { chatbotId },
}: {
  params: { chatbotId: string };
}) {
  const chatbot = await db.chatbot.findUniqueOrThrow({
    where: { id: chatbotId },
    select: { name: true },
  });

  return (
    <>
      <div className="flex items-center p-6 text-[var(--primary-fg)]">
        <div className="flex-1"></div>
        <CloseChatboxButton />
      </div>
      <div className="p-6 text-[var(--primary-fg)]">
        <p className="text-3xl font-bold">{chatbot.name}</p>
        <p className="mt-2 text-lg">Hi there 👋, How can we help?</p>
      </div>
      <BodyContainer>
        <div className="p-6">
          <StartConversationForm />
        </div>
      </BodyContainer>
    </>
  );
}
