import { Button, ButtonLoader } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import ChatbotWidgetLayout, {
  useChatbotWidget,
} from "@/layouts/ChatbotWidgetLayout";
import { NextPageWithLayout } from "@/types/next";
import { trpc } from "@/utils/trpc";
import { chatbotUserLogInValidator } from "@/utils/validators";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import { z } from "zod";

const AccountPage: NextPageWithLayout = () => {
  const { user } = useChatbotWidget();

  return (
    <>
      <header className="flex h-14 items-center gap-3 border-b px-4">
        <h1 className="text-lg font-semibold">Account</h1>
      </header>

      {user ? <div>{user.name}</div> : <LogInForm />}
    </>
  );
};

AccountPage.getLayout = (page) => (
  <ChatbotWidgetLayout>{page}</ChatbotWidgetLayout>
);

export default AccountPage;

const LogInForm = () => {
  const { chatbot } = useChatbotWidget();
  const form = useForm<z.infer<typeof chatbotUserLogInValidator>>({
    resolver: zodResolver(chatbotUserLogInValidator),
    defaultValues: {
      chatbotId: chatbot.id,
      name: "",
      email: "",
    },
  });
  const { toast } = useToast();
  const router = useRouter();
  const logIn = trpc.chatbotUser.logIn.useMutation({
    onSuccess: (data) => {
      localStorage.setItem(`${data.chatbotId}_user`, data.id);
      router.reload();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });
  const onSubmit = (data: z.infer<typeof chatbotUserLogInValidator>) =>
    logIn.mutate(data);
  return (
    <div className="px-4">
      <div className="mb-8 mt-16">
        <h1 className="text-3xl font-semibold leading-tight tracking-tight">
          Create an Account
        </h1>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="John" autoFocus {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="john@example.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" disabled={logIn.isLoading}>
            {logIn.isLoading ? <ButtonLoader /> : null}
            Log In
          </Button>
        </form>
      </Form>
    </div>
  );
};
