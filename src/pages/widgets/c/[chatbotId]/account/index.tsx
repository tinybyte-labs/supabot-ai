import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import ChatbotWidgetLayout, {
  useChatbotWidget,
} from "@/layouts/ChatbotWidgetLayout";
import { NextPageWithLayout } from "@/types/next";
import { zodResolver } from "@hookform/resolvers/zod";
import { User } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const AccountPage: NextPageWithLayout = () => {
  const { user } = useChatbotWidget();

  return (
    <>
      <header className="flex h-14 items-center gap-3 border-b px-4">
        <h1 className="text-lg font-semibold">Account</h1>
      </header>
      <div className="flex-1 overflow-auto">
        {user ? <Profile /> : <LogInForm />}
      </div>
    </>
  );
};

AccountPage.getLayout = (page) => (
  <ChatbotWidgetLayout>{page}</ChatbotWidgetLayout>
);

export default AccountPage;

const profileSchema = z.object({
  name: z.string().optional(),
  email: z.string().optional(),
});

const Profile = () => {
  const { user, signOut } = useChatbotWidget();
  const form = useForm<z.infer<typeof profileSchema>>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user?.name || "",
      email: user?.email || "",
    },
  });
  if (!user) return null;

  return (
    <div className="p-4">
      <div className="mb-8 flex items-center justify-between">
        <Avatar className="h-20 w-20">
          <AvatarFallback>
            <User size={32} />
          </AvatarFallback>
        </Avatar>
        <Button variant="destructive" onClick={signOut}>
          Log Out
        </Button>
      </div>
      <Form {...form}>
        <form className="grid gap-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="John" {...field} />
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
                  <Input placeholder="john@example.com" readOnly {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit">Update</Button>
        </form>
      </Form>
    </div>
  );
};

const schema = z.object({
  name: z.string().min(1).max(100),
  email: z.string().min(1).email(),
});
const LogInForm = () => {
  const { signIn } = useChatbotWidget();
  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      email: "",
    },
  });
  const onSubmit = (data: z.infer<typeof schema>) =>
    signIn(data.email, data.name);

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-semibold leading-tight tracking-tight">
          Log In
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
          <Button type="submit">Log In</Button>
        </form>
      </Form>
    </div>
  );
};
