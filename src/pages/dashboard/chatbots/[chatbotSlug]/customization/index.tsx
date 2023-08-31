import ChatboxPreviewer from "@/components/ChatboxPreviewer";
import PageHeader from "@/components/PageHeader";
import { Button, ButtonLoader } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import ChatbotLayout from "@/layouts/ChatbotLayout";
import { useChatbot } from "@/providers/ChatbotProvider";
import { NextPageWithLayout } from "@/types/next";
import { trpc } from "@/utils/trpc";
import { updateChatbotValidator } from "@/utils/validators";
import { zodResolver } from "@hookform/resolvers/zod";
import { Chatbot } from "@prisma/client";
import { ExternalLink } from "lucide-react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { z } from "zod";

const ChatbotCustomizationPage: NextPageWithLayout = () => {
  const { chatbot, isLoaded } = useChatbot();
  if (!isLoaded) {
    return <div>Loading...</div>;
  }
  if (!chatbot) {
    return null;
  }
  return (
    <>
      <PageHeader title="Customization">
        <Button variant="outline" asChild>
          <Link href={`/demo/c/${chatbot?.id}`} target="_blank">
            Demo
            <ExternalLink size={18} className="-mr-1 ml-2" />
          </Link>
        </Button>
      </PageHeader>
      <Editor chatbot={chatbot} />
    </>
  );
};

ChatbotCustomizationPage.getLayout = (page) => (
  <ChatbotLayout>{page}</ChatbotLayout>
);

export default ChatbotCustomizationPage;

const Editor = ({ chatbot }: { chatbot: Chatbot }) => {
  const form = useForm<z.infer<typeof updateChatbotValidator>>({
    resolver: zodResolver(updateChatbotValidator),
    defaultValues: {
      id: chatbot.id,
      settings: {
        placeholderText: (chatbot.settings as any)?.placeholderText || "",
        welcomeMessage: (chatbot.settings as any)?.welcomeMessage || "",
        primaryBgColor: (chatbot.settings as any)?.primaryBgColor || "",
        primaryFgColor: (chatbot.settings as any)?.primaryFgColor || "",
      },
    },
  });
  const { toast } = useToast();

  const updateChatbot = trpc.chatbot.update.useMutation({
    onSuccess: () => toast({ title: "Update success" }),
    onError: (error) =>
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      }),
  });
  const handleSubmit = (data: z.infer<typeof updateChatbotValidator>) =>
    updateChatbot.mutate(data);

  return (
    <div className="container py-12">
      <div className="flex gap-8 lg:gap-12">
        <div className="flex-1">
          <Form {...form}>
            <form
              className="space-y-6"
              onSubmit={form.handleSubmit(handleSubmit)}
            >
              <FormField
                control={form.control}
                name="settings.welcomeMessage"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Welcome Message</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="How can we help you?..."
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>Max 300 characters.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="settings.placeholderText"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Placeholder Text</FormLabel>
                    <FormControl>
                      <Input placeholder="Ask me anything..." {...field} />
                    </FormControl>
                    <FormDescription>Max 80 characters.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="settings.primaryBgColor"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Primary Background Color</FormLabel>
                    <FormControl>
                      <Input placeholder="#2563EB" {...field} />
                    </FormControl>
                    <FormDescription>Max 32 characters.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="settings.primaryFgColor"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Primary Foreground Color</FormLabel>
                    <FormControl>
                      <Input placeholder="#FFFFFF" {...field} />
                    </FormControl>
                    <FormDescription>Max 32 characters.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" disabled={updateChatbot.isLoading}>
                {updateChatbot.isLoading && <ButtonLoader />}
                Update
              </Button>
            </form>
          </Form>
        </div>

        <div className="flex items-center justify-center rounded-2xl bg-gradient-to-bl from-[#15B8FB] to-[#2563EB] p-10 xl:flex-1">
          <ChatboxPreviewer
            title={chatbot.name}
            settings={form.watch().settings}
          />
        </div>
      </div>
    </div>
  );
};
