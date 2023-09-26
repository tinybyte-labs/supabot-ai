import ChatboxHeader from "@/components/ChatboxHeader";
import CloseChatboxButton from "@/components/CloseChatboxButton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import ChatbotWidgetLayout, {
  useChatbotWidget,
} from "@/layouts/ChatbotWidgetLayout";
import { NextPageWithLayout } from "@/types/next";
import { Loader2, SendHorizonal, User } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const ChatBoxHome: NextPageWithLayout = () => {
  const { chatbot, startConversation, startConversationLoading, user } =
    useChatbotWidget();

  return (
    <>
      <ChatboxHeader title="Home" />
      <div className="p-6">
        <div className="flex items-center gap-4">
          <Avatar className="h-12 w-12 rounded-lg">
            {chatbot?.image && <AvatarImage src={chatbot.image} />}
            <AvatarFallback>
              <Image
                src={`/api/avatar.svg?seed=${chatbot.id}&initials=${chatbot.name}&size=128`}
                width={128}
                height={128}
                alt=""
                className="h-full w-full object-cover"
              />
            </AvatarFallback>
          </Avatar>
          <p className="flex-1 text-xl font-semibold">{chatbot.name}</p>
        </div>
        <h1 className="mt-12 text-3xl font-semibold leading-tight tracking-tight">
          Hi {user?.name || "there"} 👋
          <br />
          How can we help?
        </h1>
      </div>
      <div className="flex flex-1 flex-col p-4">
        <Button
          onClick={startConversation}
          disabled={startConversationLoading}
          className="h-fit rounded-lg border border-foreground/10 bg-background py-3 hover:bg-secondary"
          variant="secondary"
        >
          <div className="flex flex-1 flex-col items-start text-left">
            <p className="text-base text-accent-foreground">
              Start a conversation
            </p>
            <p className="text-sm text-muted-foreground">
              Our AI will reply instently
            </p>
          </div>

          {startConversationLoading ? (
            <Loader2 size={20} className="animate-spin" />
          ) : (
            <SendHorizonal size={20} />
          )}
        </Button>
      </div>
    </>
  );
};

ChatBoxHome.getLayout = (page) => (
  <ChatbotWidgetLayout>{page}</ChatbotWidgetLayout>
);

export default ChatBoxHome;
