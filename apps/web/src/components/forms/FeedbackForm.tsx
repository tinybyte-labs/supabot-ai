import { Textarea } from "../ui/textarea";
import { Button, ButtonLoader } from "../ui/button";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "../ui/form";

import { useToast } from "../ui/use-toast";
import { trpc } from "@/utils/trpc";

const schema = z.object({
  message: z.string().min(1).max(500),
});

const FeedbackForm = ({ onSuccess }: { onSuccess?: () => void }) => {
  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      message: "",
    },
  });
  const { toast } = useToast();
  const sendMutation = trpc.feedback.send.useMutation({
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Thank you so much for your valuable feedback.",
      });
      onSuccess?.();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: z.infer<typeof schema>) =>
    sendMutation.mutate({ message: data.message, url: window.location.href });

  return (
    <Form {...form}>
      <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="message"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Textarea
                  placeholder="Ideas to improve this page..."
                  rows={4}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-end">
          <Button type="submit" disabled={sendMutation.isLoading}>
            {sendMutation.isLoading && <ButtonLoader />}
            Send
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default FeedbackForm;
