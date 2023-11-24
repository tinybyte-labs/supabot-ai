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
import { useToast } from "@/components/ui/use-toast";
import ChatbotSettingsLayout from "@/layouts/ChatbotSettingsLayout";
import { NextPageWithLayout } from "@/types/next";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2Icon } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { APP_NAME } from "@/utils/constants";
import { trpc } from "@/utils/trpc";
import { useChatbot } from "@/hooks/useChatbot";
import { Skeleton } from "@/components/ui/skeleton";
import {
  UpdateChatbotDto,
  updateChatbotValidator,
} from "@acme/core/validators";

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
  const { data: chatbot, isSuccess: isChatbotLoaded } = useChatbot();

  if (!isChatbotLoaded) {
    return <Skeleton className="h-64" />;
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
  const { data: chatbot, isSuccess: isChatbotLoaded } = useChatbot();

  const form = useForm<UpdateChatbotDto>({
    resolver: zodResolver(updateChatbotValidator),
    values: {
      name: "",
      id: "",
    },
  });

  const utils = trpc.useContext();
  const { toast } = useToast();
  const updateChatbot = trpc.chatbot.updateChatbot.useMutation({
    onSuccess: (data) => {
      toast({ title: "Name updated" });
      utils.chatbot.getChatbotById.invalidate({ chatbotId: data.id });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (data: UpdateChatbotDto) => updateChatbot.mutate(data);

  useEffect(() => {
    if (chatbot) {
      form.setValue("name", chatbot.name);
      form.setValue("id", chatbot.id);
    }
  }, [chatbot, form]);

  if (!isChatbotLoaded) {
    return <Skeleton className="h-64" />;
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
            <Button type="submit" disabled={updateChatbot.isLoading}>
              {updateChatbot.isLoading && (
                <Loader2Icon
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
