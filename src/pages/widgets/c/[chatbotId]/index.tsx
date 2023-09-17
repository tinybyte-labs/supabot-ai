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
    <div className="relative flex h-full w-full flex-1 flex-col space-y-4 overflow-auto p-4">
      <div className="p-4">
        <div className="flex items-center gap-2">
          <Avatar className="-ml-1 mr-2 h-12 w-12 rounded-lg">
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
          <p className="text-xl font-semibold">{chatbot.name}</p>
          <div className="flex-1"></div>
          {user ? (
            <Link href={`/widgets/c/${chatbot.id}/account`}>
              <Avatar>
                <AvatarFallback>
                  <User size={20} />
                </AvatarFallback>
              </Avatar>
            </Link>
          ) : (
            <Button variant="outline" asChild>
              <Link href={`/widgets/c/${chatbot.id}/account`}>Log In</Link>
            </Button>
          )}
        </div>
        <div className="mt-16">
          <h1 className="text-3xl font-semibold leading-tight tracking-tight">
            Hi {user?.name || "there"} 👋
            <br />
            How can we help?
          </h1>
        </div>
      </div>
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
  );
};

ChatBoxHome.getLayout = (page) => (
  <ChatbotWidgetLayout>{page}</ChatbotWidgetLayout>
);

export default ChatBoxHome;
