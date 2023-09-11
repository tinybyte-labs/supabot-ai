import ChatboxPreviewer from "@/components/ChatboxPreviewer";
import DashboardPageHeader from "@/components/DashboardPageHeader";
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
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import ChatbotLayout from "@/layouts/ChatbotLayout";
import { useChatbot } from "@/providers/ChatbotProvider";
import { ChatbotSettings } from "@/types/chatbot-settings";
import { NextPageWithLayout } from "@/types/next";
import { trpc } from "@/utils/trpc";
import { updateChatbotValidator } from "@/utils/validators";
import { zodResolver } from "@hookform/resolvers/zod";
import { Chatbot } from "@prisma/client";
import { ExternalLink } from "lucide-react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { SketchPicker } from "react-color";
import {
  Popover,
  PopoverContent,
  PopoverPortal,
  PopoverTrigger,
} from "@radix-ui/react-popover";
import ColorPicker from "@/components/ColorPicker";
import Image from "next/image";

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
      <DashboardPageHeader title="Customization">
        <div className="flex items-center gap-4">
          <Button variant="outline" asChild>
            <Link href={`/demo/c/${chatbot?.id}`} target="_blank">
              Demo
              <ExternalLink size={18} className="-mr-1 ml-2" />
            </Link>
          </Button>
        </div>
      </DashboardPageHeader>
      <Editor chatbot={chatbot} />
    </>
  );
};

ChatbotCustomizationPage.getLayout = (page) => (
  <ChatbotLayout>{page}</ChatbotLayout>
);

export default ChatbotCustomizationPage;

const Editor = ({ chatbot }: { chatbot: Chatbot }) => {
  const defaultSettings = chatbot.settings as ChatbotSettings;
  const form = useForm<z.infer<typeof updateChatbotValidator>>({
    resolver: zodResolver(updateChatbotValidator),
    defaultValues: {
      id: chatbot.id,
      settings: {
        placeholderText: (chatbot.settings as any)?.placeholderText || "",
        welcomeMessage: (chatbot.settings as any)?.welcomeMessage || "",
        primaryBgColor: (chatbot.settings as any)?.primaryBgColor || "",
        primaryFgColor: (chatbot.settings as any)?.primaryFgColor || "",
        position: defaultSettings.position || "right",
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
    <div className="container mb-32 mt-8 md:mt-16">
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
                        placeholder="Hello! How can I assist you today?"
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
                    <FormLabel>Primary Color</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input placeholder="#2563EB" {...field} />
                        <Popover>
                          <PopoverTrigger className="absolute right-2 top-1/2 -translate-y-1/2">
                            <div
                              className="h-6 w-10 rounded-sm border"
                              style={{ backgroundColor: field.value }}
                            ></div>
                          </PopoverTrigger>
                          <PopoverPortal>
                            <PopoverContent sideOffset={8}>
                              <ColorPicker
                                value={field.value}
                                onChange={field.onChange}
                              />
                            </PopoverContent>
                          </PopoverPortal>
                        </Popover>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="settings.primaryFgColor"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Primary Text Color</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input placeholder="#FFFFFF" {...field} />
                        <Popover>
                          <PopoverTrigger className="absolute right-2 top-1/2 -translate-y-1/2">
                            <div
                              className="h-6 w-10 rounded-sm border"
                              style={{ backgroundColor: field.value }}
                            ></div>
                          </PopoverTrigger>
                          <PopoverPortal>
                            <PopoverContent sideOffset={8}>
                              <ColorPicker
                                value={field.value}
                                onChange={field.onChange}
                              />
                            </PopoverContent>
                          </PopoverPortal>
                        </Popover>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="settings.position"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Widget Position</FormLabel>
                    <FormControl>
                      <Tabs
                        value={field.value}
                        onValueChange={(value) => field.onChange(value)}
                      >
                        <TabsList>
                          <TabsTrigger value="left">Left</TabsTrigger>
                          <TabsTrigger value="right">Right</TabsTrigger>
                        </TabsList>
                      </Tabs>
                    </FormControl>
                    <FormDescription>
                      Change widget position on the screen.
                    </FormDescription>
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

        <div
          className="flex flex-col rounded-2xl bg-secondary p-10 max-xl:hidden xl:flex-1"
          style={{
            alignItems:
              form.watch().settings.position === "left"
                ? "flex-start"
                : "flex-end",
          }}
        >
          <ChatboxPreviewer
            title={chatbot.name}
            settings={form.watch().settings}
          />
          <div
            className="mt-4 flex h-16 w-16 items-center justify-center rounded-full"
            style={{
              backgroundColor: form.watch().settings.primaryBgColor,
              color: form.watch().settings.primaryFgColor,
            }}
          >
            <Image
              src="/x-icon.svg"
              alt="Chatbot Icon"
              width={32}
              height={32}
              className="h-8 w-8 object-contain"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
