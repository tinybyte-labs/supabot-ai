import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button, ButtonLoader } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import ChatbotBoxLayout, { useChatbox } from "@/layouts/ChatboxLayout";
import { NextPageWithLayout } from "@/types/next";
import { trpc } from "@/utils/trpc";
import { Loader2, SendHorizonal } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/router";

const ChatBoxHome: NextPageWithLayout = () => {
  const { chatbot, user } = useChatbox();
  const router = useRouter();
  const { toast } = useToast();
  const startConversation = trpc.conversation.create.useMutation({
    onSuccess: (data) => {
      router.push(`/widgets/c/${chatbot.id}/conversations/${data.id}`);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleStartConversation = () => {
    startConversation.mutate({ chatbotId: chatbot.id, userId: user?.id });
  };

  return (
    <div className="relative flex h-full w-full flex-col space-y-4 p-4">
      <div className="p-4">
        <div className="flex items-center gap-2">
          <Avatar className="-ml-1 mr-2 h-12 w-12 rounded-lg">
            {chatbot?.image && <AvatarImage src={chatbot.image} />}
            <AvatarFallback>
              <Image
                src={`/api/avatar.svg?seed=${chatbot.id}&initials=${chatbot.slug}&size=128`}
                width={128}
                height={128}
                alt=""
                className="h-full w-full object-cover"
              />
            </AvatarFallback>
          </Avatar>
          <p className="text-xl font-semibold">{chatbot.name}</p>
        </div>
        <div className="mt-16">
          <h1 className="text-3xl font-semibold leading-tight tracking-tight">
            Hi there 👋
            <br />
            How can we help?
          </h1>
        </div>
      </div>
      <Button
        onClick={handleStartConversation}
        disabled={startConversation.isLoading}
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

        {startConversation.isLoading ? (
          <Loader2 size={20} className="animate-spin" />
        ) : (
          <SendHorizonal size={20} />
        )}
      </Button>
    </div>
  );
};

ChatBoxHome.getLayout = (page) => <ChatbotBoxLayout>{page}</ChatbotBoxLayout>;

export default ChatBoxHome;
