import ChatbotSettingsLayout from "@/layouts/ChatbotSettingsLayout";
import { NextPageWithLayout } from "@/types/next";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button, ButtonLoader } from "@/components/ui/button";
import { APP_NAME } from "@/utils/constants";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { DialogFooter } from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/router";
import { trpc } from "@/utils/trpc";
import { useChatbot } from "@/hooks/useChatbot";
import { useOrganization } from "@/hooks/useOrganization";

const ChatbotAdvancedSettingsPage: NextPageWithLayout = () => {
  return (
    <div className="space-y-6">
      <DeleteChatbotCard />
    </div>
  );
};

ChatbotAdvancedSettingsPage.getLayout = (page) => (
  <ChatbotSettingsLayout>{page}</ChatbotSettingsLayout>
);

export default ChatbotAdvancedSettingsPage;

const DeleteChatbotCard = () => {
  const { data: chatbot } = useChatbot();
  const { data: org } = useOrganization();
  const { toast } = useToast();
  const router = useRouter();

  const deleteChatbot = trpc.chatbot.delete.useMutation({
    onSuccess: () => {
      toast({ title: "Chatbot deleted" });
      router.push(`/${org?.slug}`);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  if (!chatbot) {
    return null;
  }

  return (
    <Card className="border-destructive">
      <CardHeader>
        <CardTitle>Delete Chatbot</CardTitle>
        <CardDescription>
          Permanently delete your chatbot on {APP_NAME}, and their stats. This
          action cannot be undone - please proceed with caution.
        </CardDescription>
      </CardHeader>
      <CardFooter>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive">Delete Chatbot</Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Chatbot</AlertDialogTitle>
              <AlertDialogDescription>
                Warning: This will permanently delete your chatbot and their
                respective stats.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <DialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                variant="destructive"
                disabled={deleteChatbot.isLoading}
                onClick={() => deleteChatbot.mutate({ chatbotId: chatbot.id })}
              >
                {deleteChatbot.isLoading && <ButtonLoader />}
                Delete Chatbot
              </AlertDialogAction>
            </DialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardFooter>
    </Card>
  );
};
