import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button, ButtonLoader } from "@/components/ui/button";
import Link from "next/link";
import { useSetAtom } from "jotai";
import { useEffect } from "react";
import { createChatbotValidator } from "@acme/core";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/router";
import { chatbotNameAtom } from "@/atoms/chatbotNameAtom";
import { trpc } from "@/utils/trpc";

export default function CreateChatbotForm() {
  const setName = useSetAtom(chatbotNameAtom);
  const form = useForm<z.infer<typeof createChatbotValidator>>({
    resolver: zodResolver(createChatbotValidator),
    defaultValues: {
      name: "",
    },
  });
  const { toast } = useToast();
  const router = useRouter();
  const createChatbot = trpc.chatbot.create.useMutation({
    onSuccess: (data) => {
      toast({ title: "Chatbot created" });
      router.push(`/chatbots/${data.id}`);
    },
    onError: (error) => {
      toast({
        title: "Failed",
        description: error.message,
      });
    },
  });

  const onSubmit = async (body: z.infer<typeof createChatbotValidator>) =>
    createChatbot.mutate(body);

  const name = form.watch("name");

  useEffect(() => {
    setName(name);
  }, [name, setName]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="My bot" autoFocus {...field} />
              </FormControl>
              <FormDescription>Max 32 characters.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-between">
          <Button asChild variant="secondary">
            <Link href="/chatbots">Cancel</Link>
          </Button>
          <Button type="submit" disabled={createChatbot.isLoading}>
            {createChatbot.isLoading ? <ButtonLoader /> : null}
            Create Chatbot
          </Button>
        </div>
      </form>
    </Form>
  );
}
