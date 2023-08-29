import { Button, ButtonLoader } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import ChatbotBoxLayout, { useChatbox } from "@/layouts/ChatboxLayout";
import { NextPageWithLayout } from "@/types/next";
import { trpc } from "@/utils/trpc";
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
    <div>
      <Button
        onClick={handleStartConversation}
        disabled={startConversation.isLoading}
      >
        {startConversation.isLoading && <ButtonLoader />}
        Start a Conversation
      </Button>
    </div>
  );
};

ChatBoxHome.getLayout = (page) => <ChatbotBoxLayout>{page}</ChatbotBoxLayout>;

export default ChatBoxHome;
