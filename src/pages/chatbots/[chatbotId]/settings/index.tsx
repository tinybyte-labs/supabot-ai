import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/components/ui/use-toast";
import ChatbotSettingsLayout from "@/layouts/ChatbotSettingsLayout";
import { useChatbot } from "@/providers/ChatbotProvider";
import { NextPageWithLayout } from "@/types/next";
import { trpc } from "@/utils/trpc";
import { updateChatbotValidator } from "@/utils/validators";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { APP_NAME, DOMAIN } from "@/utils/constants";

const ChatbotSettingsPage: NextPageWithLayout = () => {
  return (
    <div className="space-y-6">
      <ChatbotIdCard />
      <UpdateNameFrom />
    </div>
  );
};

ChatbotSettingsPage.getLayout = (page) => (
  <ChatbotSettingsLayout>{page}</ChatbotSettingsLayout>
);

export default ChatbotSettingsPage;

const ChatbotIdCard = () => {
  const { isLoaded, chatbot } = useChatbot();

  if (!isLoaded) {
    return <Skeleton className="h-64" />;
  }

  if (!chatbot) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Chatbot Id</CardTitle>
        <CardDescription>
          This is the id of your chatbot on {APP_NAME}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Input placeholder="Id" defaultValue={chatbot.id} readOnly />
      </CardContent>
    </Card>
  );
};

const UpdateNameFrom = () => {
  const { isLoaded, chatbot } = useChatbot();

  const form = useForm<z.infer<typeof updateChatbotValidator>>({
    resolver: zodResolver(updateChatbotValidator),
    defaultValues: {
      name: chatbot?.name || "",
      id: chatbot?.id || "",
    },
  });

  const utils = trpc.useContext();
  const { toast } = useToast();
  const updateChatbot = trpc.chatbot.update.useMutation({
    onSuccess: (data) => {
      toast({ title: "Name updated" });
      utils.chatbot.findById.invalidate(data.id);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });
  const handleSubmit = (data: z.infer<typeof updateChatbotValidator>) =>
    updateChatbot.mutate(data);

  useEffect(() => {
    if (chatbot?.name) {
      form.setValue("name", chatbot.name);
      form.setValue("id", chatbot.id);
    }
  }, [chatbot, form]);

  if (!isLoaded) {
    return <Skeleton className="h-64" />;
  }

  if (!chatbot) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Chatbot Name</CardTitle>
        <CardDescription>
          This is the name of your chatbot on {APP_NAME}
        </CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)}>
          <CardContent>
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormControl>
                    <Input placeholder="My Bot" {...field} />
                  </FormControl>
                  <FormDescription>Max 32 characters.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter>
            <Button
              type="submit"
              disabled={
                updateChatbot.isLoading ||
                !form.formState.isValid ||
                !form.formState.isDirty
              }
            >
              {updateChatbot.isLoading && (
                <Loader2
                  size={18}
                  className="-ml-1 mr-2 h-4 w-4 animate-spin"
                />
              )}
              Update Name
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
};
